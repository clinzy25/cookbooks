# Running application locally

Prerequisites:
- node / npm
- postgres

From project root:

1. `npm install`
2. `CREATE DATABASE cookbooks;`
3. Create a `.env` file using `.env.sample` as a template, add your psql credentials
4. `npm run migrate` -- create tables
