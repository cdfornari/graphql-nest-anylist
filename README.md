<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ npm install
```

## Dev Environment

Copy .env.example to .env
Server will run on localhost:3000/graphql

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Fill the database with dummy data

Run the app and run the mutation below in the playground

```graphql
  executeSeed
```