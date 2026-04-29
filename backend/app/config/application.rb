require_relative 'boot'
require 'rails/all'
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    config.time_zone = 'Bangkok'
    config.autoload_paths += %W[
      #{root}/app/services
      #{root}/app/serializers
    ]
  end
end
