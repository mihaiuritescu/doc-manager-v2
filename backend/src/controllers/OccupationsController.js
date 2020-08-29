const { Occupation } = require('../models');

module.exports = {
  async post (req, res) {
    try {
      const occupation = await Occupation.create(req.body.name);
      const occupationJson = occupation.toJSON();
      res.send({
        occupation: occupationJson
      })
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem registring the department. Please try again.'
      })
    }
  },
  async getAll (req, res) {
    try {
      let occupations = null;
      occupations = await Occupation.findAll({});
      res.send(occupations);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the occupations'
      })
    }
  },
}