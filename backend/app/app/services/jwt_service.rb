class JwtService
  ACCESS_SECRET  = ENV.fetch('JWT_SECRET', 'fallback_access_secret_change_in_production')
  REFRESH_SECRET = ENV.fetch('JWT_REFRESH_SECRET', 'fallback_refresh_secret_change_in_production')

  ACCESS_EXPIRY  = (ENV['JWT_ACCESS_EXPIRY'] || (5 * 60)).to_i
  REFRESH_EXPIRY = (ENV['JWT_REFRESH_EXPIRY'] || (7 * 24 * 60 * 60)).to_i

  #  Access Token 
  def self.encode_access(user_id, jti:)
    payload = { user_id: user_id, jti: jti, exp: Time.now.to_i + ACCESS_EXPIRY, type: 'access' }
    JWT.encode(payload, ACCESS_SECRET, 'HS256')
  end

  def self.decode_access(token)
    payload = JWT.decode(token, ACCESS_SECRET, true, algorithm: 'HS256').first
    raise JWT::DecodeError, 'Not an access token' unless payload['type'] == 'access'
    payload
  end

  #  Refresh Token 
  def self.encode_refresh(user_id, jti:)
    payload = { user_id: user_id, jti: jti, exp: Time.now.to_i + REFRESH_EXPIRY, type: 'refresh' }
    JWT.encode(payload, REFRESH_SECRET, 'HS256')
  end

  def self.decode_refresh(token)
    payload = JWT.decode(token, REFRESH_SECRET, true, algorithm: 'HS256').first
    raise JWT::DecodeError, 'Not a refresh token' unless payload['type'] == 'refresh'
    payload
  end

  # Backwards compatibility
  def self.encode(payload)
    encode_access(payload.fetch(:user_id), jti: payload.fetch(:jti))
  end

  def self.decode(token)
    decode_access(token)
  end
end
