class Article < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { minimum: 3, maximum: 200 }
  validates :body,  presence: true

  scope :published, -> { where(published: true) }
  scope :recent,    -> { order(created_at: :desc) }
  scope :search,    ->(q) { where('title ILIKE ? OR body ILIKE ?', "%#{q}%", "%#{q}%") }
end
