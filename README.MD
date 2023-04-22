# Running application locally

Prerequisites:
- node / npm
- postgres
- AWS account

From project root:

1. `npm install`
2. `CREATE DATABASE cookbooks;`
3. Create an Auth0 app
4. Create a public S3 bucket
5. Create a `.env` file using `.env.sample` as a template, add your psql and AWS credentials / bucket config
6. In `/client`, create a `.env.local` file using `.env.local.sample` as a template, add your Auth0 credentials
7. `npm run db:create` -- create tables
8. `npm run db:seed` -- seed the database
9. `npm run dev` -- start client and server

* Tables can be destroyed with `npm run db:destroy`. You can quickly edit schemas the the `db:*` commands.