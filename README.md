# Welcome to the Backend of My Book Database 

This project was made with Express framework in typescript

## This server is live
[click here](https://my-book-database-backend.onrender.com) to access the server

## Prerequiste
This project was made in:
- OS: Windows
- Node: v18.18.2
- NPM: 10.5.0
- for access to `config.json` file, refer to the google drive link that was sent

## How To Run This Project Locally
0. run `npm i` to install all packages
1. copy `config.example.json` file into `config.json` and fill with the appropriate backend config
2. for running this app in debug mode, run `npm run devstart` (Note: Needs `nodemon` to be installed globally, run `npm i -g nodemon`)
3. for running this app in production mode, run `npm start`

## List of Features
- RESTful API infrastructure
- Supabase remote database connection
- CRUD on books database
- JWT-based authentication
- typescript type-checking
- debugging logs via `debug` package

## API Path list
- GET `/books`: gets all book by page with limit of `PAGINATION_NUMBER`, have optional `?keyword` parameter to search by title
- GET `/books/:book_id`: gets a single book by their `book_id`
- POST `/books/add`: (requires jwt) adds a single book, needs multipart header active
- POST `/books/edit/:book_id`: (requires jwt) edits a single book by their `book_id`
- GET `/books/delete/:book_id`: (requires jwt) deletes a single book by their `book_id`

- GET `/users/me`: (requires jwt) gets current jwt user data (only `user_id` and `email`)
- POST `/users/login`: authenticate with email and password, returns jwt string
- POST `/users/signup`: creates new user and returns the jwt string

## Postman documentation
[click here](https://www.postman.com/chrezalvin/workspace/my-book-collection) to view postman API documentation