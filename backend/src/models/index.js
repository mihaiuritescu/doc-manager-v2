const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const config = require('../config/config');
const db = {};

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);

// sequelize
//   .authenticate()
//   .then(async () => {
//     console.log('Connection has been established successfully!');
//     // const users = await sequelize.query("SELECT * FROM testTable", { type: QueryTypes.SELECT });
//     // console.log(users);

//     fs
//       .readdirSync(__dirname)
//       .filter((file) =>
//         file !== 'index.js'
//       )
//       .forEach((file) => {
//         console.log(file);
//         // const model = sequelize.import(path.join(__dirname, file));
//         const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//         db[model.name] = model;
//       })

//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    // const model = sequelize.import(path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  })

// Object.keys(db).forEach(function (modelName) {
//   if ('associate' in db[modelName]) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;