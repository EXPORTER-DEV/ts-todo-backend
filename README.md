# ts-todo-backend
> Nest + TypeORM + Mysql Todo Application Backend

## Development tasks:

- [x] Add Swagger support
- [ ] Make unit tests.
- [x] Create Initial Migration
- [x] Add docker support.


# Running the environment inside Docker

> For running the application and its database inside Docker containers.

1. Copy `.env.example` file to `.env.production`
2. Run shell script:
```bash
$ sh ./start.sh
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
