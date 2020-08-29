const { Department } = require('../models');

module.exports = {
  async post (req, res) {
    try {
      const department = await Department.create(req.body.name);
      const departmentJson = department.toJSON();
      res.send({
        department: departmentJson
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
      let departments = null;
      departments = await Department.findAll({});
      res.send(departments);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the departments'
      })
    }
  },
}