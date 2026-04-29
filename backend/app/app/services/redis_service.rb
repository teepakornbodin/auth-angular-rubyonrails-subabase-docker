class RedisService
  class << self
    def client
      @client ||= Redis.new(url: redis_url)
    end

    def redis_url
      ENV.fetch('REDIS_URL', 'redis://redis:6379/0')
    end

    def get(key)
      client.get(key)
    end

    def setex(key, ttl_seconds, value)
      client.setex(key, ttl_seconds, value)
    end

    def del(key)
      client.del(key)
    end
  end
end

