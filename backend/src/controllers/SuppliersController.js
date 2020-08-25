const { Supplier } = require('../models');

module.exports = {
  async post (req, res) {
    try {
      const supplier = await Supplier.create(req.body);
      const supplierJson = supplier.toJSON();
      res.send({
        supplier: supplierJson
      })
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem registring the supplier. Please try again.'
      })
    }
  },
  async getAll (req, res) {
    try {
      let suppliers = null;
      suppliers = await Supplier.findAll({});
      res.send(suppliers);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the suppliers'
      })
    }
  },
}