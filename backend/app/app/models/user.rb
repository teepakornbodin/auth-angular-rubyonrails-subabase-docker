class User < ApplicationRecord
  has_secure_password
  has_many :articles, dependent: :destroy

  validates :name,  presence: true, length: { minimum: 2, maximum: 50 }
  validates :email, presence: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || password.present? }

  before_save :downcase_email
  scope :recent, -> { order(created_at: :desc) }

  private

  def downcase_email
    self.email = email.downcase
  end
end
