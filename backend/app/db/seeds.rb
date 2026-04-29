puts "Seeding..."
user = User.find_or_create_by!(email: 'admin@example.com') do |u|
  u.name     = 'Admin'
  u.password = 'password123'
end
puts "  ✓ User: #{user.email}"

5.times do |i|
  article = user.articles.find_or_create_by!(title: "Article #{i + 1}") do |a|
    a.body      = "Body of article #{i + 1}."
    a.published = i.even?
  end
  puts "  ✓ Article: #{article.title}"
end
puts "Done! 🎉"
