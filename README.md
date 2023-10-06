# auth-with-fastify

A full auth system made with Fastify and Lucia-auth, typescript, and redis for session storage.

## getting started

first clone the repo and run

```bash
>> cd auth-wit-lucia
pnpm install
```

make sure to define the your secret keys in a .env file in the root dir before starting the .env file should look like this:

```ts
MYSQL_ROOT_PASSWORD = "QSDFgij874fgfsqdçfDDDqsdfhhk";
MYSQL_DATABASE_URL =
  "mysql://root:QSDFgij874fgfsqdçfDDDqsdfhhk@127.0.0.1:3306/mysql-image-database1k";

REDIS_PORT = "6379";
REDIS_HOST = "localhost";

GOOGLE_CLIENT_ID = "Add your own google id";
GOOGLE_CLIENT_SECRET = "Add your own google secret";
```

after setting .env file setup the docker compose containers with this command:

_make sure you have docker already installed on your machine_

```bash
docker compose up -d
```

then you you'll be able to run the server without any issues with this command:

```bash
pnpm dev
```

## Note

**this repo is for education purposes only, don't use it for prod projects as your auth soultion.**
