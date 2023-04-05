# Running application locally

Prerequisites:
- node / npm
- postgres

From project root:

1. `npm install`
2. `CREATE DATABASE cookbooks;`
3. Create a `.env` file using `.env.sample` as a template, add your psql credentials
5. `npm run db:create` -- create tables
6. `npm run db:seed` -- seed the database
7. `npm run dev` -- start client and server

* tables can be destroyed with `npm run db:destroy`