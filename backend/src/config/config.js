// const path = require('path')

module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'testDB2',
    user: process.env.DB_USER || 'docmanager',
    password: process.env.DB_PASS || 'docmanager',
    options: {
      host: process.env.HOST || 'MIKE-PC',
      dialect: process.env.DIALECT || 'mssql',
      dialectOptions: {
        instanceName: 'SQLEXPRESS'
      },
      // storage: path.resolve(__dirname, '../../tabtracker.sqlite')
      storage: '../../tabtracker.sqlite',
      logging: false
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}