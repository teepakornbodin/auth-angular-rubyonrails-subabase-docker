module Api
  module V1
    class ArticlesController < ApplicationController
      before_action :authenticate_user!, except: [:index, :show]
      before_action :set_article,        only: [:show, :update, :destroy]
      before_action :authorize_owner!,   only: [:update, :destroy]

      def index
        articles = Article.includes(:user).recent
        articles = articles.search(params[:search]) if params[:search].present?
        pagy, articles = pagy(articles, items: params.fetch(:per_page, 10))
        render_success(
          ArticleSerializer.new(articles).serializable_hash[:data].map { |a| a[:attributes] },
          meta: pagy_metadata(pagy)
        )
      end

      def show
        render_success(ArticleSerializer.new(@article).serializable_hash[:data][:attributes])
      end

      def create
        article = current_user.articles.build(article_params)
        article.save!
        render_success(
          ArticleSerializer.new(article).serializable_hash[:data][:attributes],
          status: :created
        )
      end

      def update
        @article.update!(article_params)
        render_success(ArticleSerializer.new(@article).serializable_hash[:data][:attributes])
      end

      def destroy
        @article.destroy!
        head :no_content
      end

      private

      def set_article
        @article = Article.find(params[:id])
      end

      def article_params
        params.require(:article).permit(:title, :body, :published)
      end

      def authorize_owner!
        render_error('Forbidden', status: :forbidden) unless @article.user_id == current_user.id
      end
    end
  end
end
