class ArticleSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :body, :published, :created_at, :updated_at

  attribute :author do |article|
    { id: article.user.id, name: article.user.name, email: article.user.email }
  end
end
