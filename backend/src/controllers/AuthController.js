const { User, Department, Occupation } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    try {
      const occupation = await Occupation.findOne({ where: { name: req.body.occupation } });
      const department = await Department.findOne({ where: { name: req.body.department } });

      if(occupation && department) {
        const newUser = {
          email: req.body.email,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          address: req.body.address,
          postalcode: req.body.postalcode,
          city: req.body.city,
          country: req.body.country,
          phone: req.body.phone,
          occupation: occupation.dataValues.id,
          department: department.dataValues.id,
          admin: false
        };
        const createdUser = await User.create(newUser);
        const user = req.body;
        res.send({
          user: user,
          token: jwtSignUser(createdUser.dataValues)
        })
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },
  async login (req, res) {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({
        where: {
          email: email
        }
      });

      if (!user) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }

      const occupation = await Occupation.findOne({ where: { id: user.occupation } });
      const department = await Department.findOne({ where: { id: user.department } });

      if(occupation && department) {
        user.occupation = occupation.dataValues.name;
        user.department = department.dataValues.name;
      }
      
      const isPasswordValid = await user.comparePassword(password);
      // const isPasswordValid = password === user.password;
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }

      const userJson = user.toJSON();
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}