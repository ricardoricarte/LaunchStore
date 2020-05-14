const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')


module.exports = session({
  store: new pgSession({
    pool:db // exporta a conexão com o BD
  }),
    secret: 'chavesecreta',
    resave: false, // Não salva a sessao
    saveUninitialized: false, // Não salva sem ter dados
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, //Quando tempo a sessão ficará ativa no BD (30dias)
    }
})