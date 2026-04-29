module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: [:me, :logout]

      def register
        user = User.new(register_params)
        if user.save
          render_success(
            build_token_response(user),
            status: :created
          )
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email]&.downcase)
        if user&.authenticate(params[:password])
          render_success(build_token_response(user))
        else
          render_error('Invalid email or password', status: :unauthorized)
        end
      end

      # POST /api/v1/auth/refresh
      # Body: { refresh_token: "..." }
      def refresh
        raw = params[:refresh_token]
        return render_error('Missing refresh_token', status: :unauthorized) unless raw

        payload = JwtService.decode_refresh(raw)
        user_id = payload['user_id']
        refresh_jti = payload['jti']

        refresh_key = "auth:refresh_jti:#{refresh_jti}"
        stored_user_id = RedisService.get(refresh_key)
        return render_error('Invalid refresh token', status: :unauthorized) unless stored_user_id&.to_s == user_id.to_s

        user = User.find(user_id)

        RedisService.del(refresh_key)
        render_success(build_token_response(user))
      rescue JWT::ExpiredSignature
        render_error('Refresh token expired, please login again', status: :unauthorized)
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render_error('Invalid refresh token', status: :unauthorized)
      end

      # POST /api/v1/auth/logout
      def logout
        revoke_access_token!

        raw = params[:refresh_token]
        if raw.present?
          payload = JwtService.decode_refresh(raw)
          RedisService.del("auth:refresh_jti:#{payload['jti']}") if payload['jti'].present?
        end

        head :no_content
      rescue JWT::DecodeError
        render_error('Invalid refresh token', status: :unauthorized)
      end

      def me
        render_success(UserSerializer.new(current_user).serializable_hash[:data][:attributes])
      end

      private

      def register_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def build_token_response(user)
        access_jti  = SecureRandom.uuid
        refresh_jti = SecureRandom.uuid

        access_token  = JwtService.encode_access(user.id, jti: access_jti)
        refresh_token = JwtService.encode_refresh(user.id, jti: refresh_jti)

        RedisService.setex("auth:refresh_jti:#{refresh_jti}", JwtService::REFRESH_EXPIRY, user.id.to_s)

        {
          access_token:  access_token,
          refresh_token: refresh_token,
          expires_in:    JwtService::ACCESS_EXPIRY,
          user:          UserSerializer.new(user).serializable_hash[:data][:attributes]
        }
      end

      def revoke_access_token!
        token = extract_token
        payload = JwtService.decode_access(token)
        jti = payload['jti']
        exp = payload['exp'].to_i
        return if jti.blank? || exp <= 0

        ttl = exp - Time.now.to_i
        return if ttl <= 0

        RedisService.setex("auth:access_deny:#{jti}", ttl, '1')
      end
    end
  end
end
