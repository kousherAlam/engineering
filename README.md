## How to run the project

- copy the example.env to .env file in the root of the project
- run `docker-compose up -d` command to run all services
- user-api swagger `localhost:9000/swagger`
- see the container logs for the `worker`

## Library used in nodejs user-api project

- `nestjs` - as web framework
- `@nestjs/config` - to load configuration
- `winston` - logger
- `mongoose` - mongodb driver
- `@nestjs/cache-manager` && `cache-manager-redis-store` - redis cache
- `zod` - schema validation

## Library used in go project

- `mongo-driver` as monodb driver
- `viper` to load and read config file
