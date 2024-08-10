```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
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
## Работа с миграциями

### Генерация новой миграции

Чтобы сгенерировать новую миграцию, выполните:

```bash
npm run migration:generate <ИмяМиграции>

npm run migration:run

npm run migration:revert

npm run migration:show