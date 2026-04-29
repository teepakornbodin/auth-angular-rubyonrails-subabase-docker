Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post '/auth/register', to: 'auth#register'
      post '/auth/login',    to: 'auth#login'
      post '/auth/refresh',  to: 'auth#refresh'
      post '/auth/logout',   to: 'auth#logout'
      get  '/auth/me',       to: 'auth#me'

      resources :users,    only: [:index, :show, :update, :destroy]
      resources :articles, only: [:index, :show, :create, :update, :destroy]
    end
  end

  get '/health', to: proc { [200, {}, [{ status: 'ok' }.to_json]] }
end
