class ApplicationController < ActionController::API
  include Pagy::Backend

  rescue_from ActiveRecord::RecordNotFound,       with: :not_found
  rescue_from ActiveRecord::RecordInvalid,        with: :unprocessable
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def authenticate_user!
    token = extract_token
    payload = JwtService.decode_access(token)
    ensure_access_token_not_revoked!(payload)
    @current_user = User.find(payload['user_id'])
  rescue JWT::ExpiredSignature
    render json: { error: 'Unauthorized', code: 'TOKEN_EXPIRED' }, status: :unauthorized
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def current_user
    @current_user
  end

  def extract_token
    header = request.headers['Authorization']
    raise JWT::DecodeError, 'Missing token' unless header&.start_with?('Bearer ')
    header.split(' ', 2).last
  end

  def ensure_access_token_not_revoked!(payload)
    jti = payload['jti']
    return if jti.nil?

    revoked = RedisService.get("auth:access_deny:#{jti}")
    raise JWT::DecodeError, 'Token revoked' if revoked
  end

  def not_found(e)
    render json: { error: e.message }, status: :not_found
  end

  def unprocessable(e)
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def bad_request(e)
    render json: { error: e.message }, status: :bad_request
  end

  def render_success(data, status: :ok, meta: nil)
    body = { data: data }
    body[:meta] = meta if meta
    render json: body, status: status
  end

  def render_error(message, status: :unprocessable_entity)
    render json: { error: message }, status: status
  end
end
