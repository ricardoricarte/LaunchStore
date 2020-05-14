const { Pool } = require("pg")//Pool é um modo de conectar somente uma vez no bd

module.exports = new Pool({
  user: 'postgres',
  password: 'senha',
  host: 'localhost',
  port: 5432,
  database: 'launchstoredb'
})

