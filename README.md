# My IMDB API

    imdb app where users can add list of movies and rating for the movies.
    The functionality of are signup and login using authorization token

## Initialization

- create a database and connect with dbeaver
- using `npm init -y` create a package.json file
- Then install the required dependencies
  `npm i express dotenv morgan body-parser pg sequelize joi`
- then authenticatin dependencies
  `npm i bcryptjs jsonwebtoken`
- dev dependencies
  `npm i -D nodemon`

## Error

- (s.replace)[https://stackoverflow.com/questions/48869975/typeerror-s-replace-is-not-a-function]

## Transaction

`sequalize.transaction`

- Sequelize will start a transaction
- Then, Sequelize will execute the callback you provided
- If your callback throws, Sequelize will automatically rollback the transaction
- If your callback finishes successfully, Sequelize will automatically commit the transaction

(transaction)[https://sequelize.org/docs/v7/querying/transactions/]
