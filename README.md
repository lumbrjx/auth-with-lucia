# auth-with-fastify

A full auth system made with Fastify and Lucia-auth, typescript, and redis for session storage.

## getting started

first clone the repo and run

```bash
>> cd Auth-sys
pnpm install
```

make sure to define the your secret keys in a .env file in the root dir before starting the .env file should look like this:

```ts
MYSQL_ROOT_PASSWORD = "QSDFgij874fgfsqdçfDDDqsdfhhk";
MYSQL_DATABASE_URL =
  "mysql://root:QSDFgij874fgfsqdçfDDDqsdfhhk@127.0.0.1:3306/mysql-image-database1k";

REDIS_PASSWORD = "QSDfgiuehggfdgsdfgsdSQSDFQ94849k";
REDIS_PORT = "6379";
REDIS_HOST = "localhost";
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

## API endpoints

### `/`

The home route.

### `/register`

_credentials method_ to register a new user in the databse, it requires: **username, email, password** for the JSON body.

### `/login`

_credentials method_ to login a new user, it require: **email, password** for the JSON body. If a user is found, it returns a **200 response with a session**. If not, it returns a **403 response**.

### `/logout`

Destroys the session in the client and redis.

<!-- ### `/login/google`

_OAuth method_ to register/login a user using Google provider. it saves a new user in the db if it doesn't exists and returns a session to the client, save it in redis. -->

<!-- ### `/api/auth/callback/google`

The callback uri for Google OAuth. -->

### `/dashboard`

A protected route that can be accessible only if the user is logged in, if not a **403 response** is thrown

### `/getAllRecords` _dev route_

returns all the sessions in redis, if no sessions are found it will return an error.
ITS A DEV ROUTE DON4T USE IT FOR PROD.

## Note

**this repo is for education purposes only, don't use it for prod projects as your auth soultion.**
