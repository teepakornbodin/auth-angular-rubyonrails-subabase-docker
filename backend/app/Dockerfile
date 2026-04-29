FROM ruby:3.2-alpine

RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    tzdata \
    nodejs \
    gcompat \
    yaml-dev

WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle lock --add-platform x86_64-linux-musl && bundle install
COPY . .

COPY entrypoint.sh /usr/local/bin/entrypoint
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 3000
ENTRYPOINT ["entrypoint"]
CMD ["bundle", "exec", "rails", "s", "-b", "0.0.0.0"]
