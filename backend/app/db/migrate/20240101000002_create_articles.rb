class CreateArticles < ActiveRecord::Migration[8.0]
  def change
    create_table :articles do |t|
      t.references :user,      null: false, foreign_key: true
      t.string     :title,     null: false
      t.text       :body,      null: false
      t.boolean    :published, null: false, default: false
      t.timestamps
    end
    add_index :articles, :published
    add_index :articles, :created_at
  end
end
