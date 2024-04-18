# Northcoders Mior News API

## Link to the hosted version

https://be-nc-news-mior.onrender.com/

## Summary of project

The project is to build an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Instruction

### Cloning the repository

Repository can be clone from this URL:
https://github.com/miors/be-nc-news-mior

Depending on your settings, to clone, either type -> `git clone https://github.com/miors/be-nc-news-mior.git`
or
type -> `git clone git@github.com:miors/be-nc-news-mior.git`

### Install dependencies

Type-> `npm install`

### Seed database

Before seeing database, these files need to be created to connect to databases:
.env.test -> to connect to test database  
.env.development -> to connect to development database

In each of the above file, this line needs to be created:
PGDATABASE=\<name of database\>

Then setup the database by running this command:
`npm run setup-dbs`

After that, to seed the database, run these:
For development: Type -> `npm run seed`
For test: Test script will automatically run seed, therefore just run the test by following the 'Run tests' section

### Run tests

To run tests: Type -> `npm run test`

## Minimum version of Node.js and Postgres to run the project

Node.js: v18.0.0
Postgres: v2.7.2
