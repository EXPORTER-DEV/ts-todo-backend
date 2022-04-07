# ts-todo-backend
> Nest + TypeORM + Mysql Todo Application Backend

## Development tasks:

- [ ] Make unit tests.
- [x] Add Swagger support
- [x] Create Initial Migration
- [x] Add docker support.


# Running the environment inside Docker

> For running the application and its database inside Docker containers.

1. Copy `.env.example` file to `.env.production`
2. Run shell script:
```bash
$ sh ./start.sh
```
3. It will be running on PORT (from `.env.production` config), if whole config is like in `.env.example`: [just check Swagger](http://localhost:4000/swagger)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
