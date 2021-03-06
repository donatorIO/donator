# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :donator, Donator.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "hoUdu+wsLGZ0cwUINlLqWMWQiz/U9+rVuvzDjPb82EEZynxFoubPYqw9IwwR0Irp",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: Donator.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false

config :donator, Donator.Repo,
  adapter: Mongo.Ecto,
  database: "donator_dev",
  hostname: (System.get_env("MONGO_PORT_27017_TCP_ADDR") || "localhost"),
  pool_size: 10

config :donator, :jwt,
  alg: "HS256",
  key: "gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr9C"

config :donator, :foursquare,
  endpoint: "https://api.foursquare.com/v2/venues/search?v=20151010"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
