## Description

This project is a starter 
This project is part of the mentorship program I am conducting. This project is quite simple, but comprehensive enough to let you guys learn how to create and deploy a production ready application.

For this project, we will build and deploy a NestJS application that will be used to serve the API needed to build a charity apps (which I will show how to build it using Flutter in another project).

- How to setup your project using NestJS
- How to deploy your API Server
- API server management / load balancing / scaling etc

## Learn

- Youtube playlist - [Youtube](https://www.youtube.com/playlist?list=PLaFDiDlPtmkULIzkyiLD0t71Uz6AtCazi)
  
## Installation

```bash
$ yarn install
```

## Environment Setup

Create a .env file. You can refer to the .env.example, but populate it with your own values

## Prisma Setup

Run prisma migrate. It will replay the migration history
```
yarn prisma migrate dev
```

If you plan to use this code for your own project, it is best practice to include the migrations history in your repository to mantain a single source of truth. 

Read more: [Prisma Migration](https://www.prisma.io/docs/concepts/components/prisma-migrate)
## Running the app

```bash
# watch mode
$ yarn start

# development mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Stay in touch

- Author - [Farhan Syah](https://github.com/farhan-syah)
- Discord - [Discord](https://discord.gg/r7TaetxQNW)

## License

This project is licensed under the [Apache License 2.0](LICENSE).


## Thanks To

- NestJS Framework - [NestJS](https://github.com/nestjs/nest).
