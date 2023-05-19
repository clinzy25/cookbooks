# Development
Create local database, seed, and run application dev servers

Prerequisites:
- node / npm
- postgres
- AWS account

From project root:

1. `npm install`
2. Log into your localhost postgres and `CREATE DATABASE cookbooks;`
3. Create a `.env` file using `.env.sample` as a template, add your psql and AWS credentials
4. In `/client`, create a `.env.local` file using `.env.local.sample` as a template, obtain Auth0 credentials and add them
5. `npm run dev` -- start client and server
6. `npm run db:create` -- create tables
7. `npm run db:seed` -- seed the database

* Tables can be destroyed with `npm run db:destroy`. You can quickly edit schemas the the `db:*` commands.

# Staging
Build app for production and connect to production database.

1. Obtain prod DB credentials and cookbooks-bastion.pem, add pem to project root
2. In an new terminal, connect to RDS bastion server `ssh -i cookbooks-bastion.pem -NL 3002:10.0.11.34:5432 ec2-user@44.229.246.97 -v`
3. `npm run build`
4. `npm run stage` 