const { Product, Supplier } = require('../models');

module.exports = {
  async post (req, res) {
    try {
      const supplier = await Supplier.findOne({ where: { name: req.body.supplier } });
      if(supplier) {
        const newProduct = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          supplierId: supplier.dataValues.id,
        };
        const product = await Product.create(newProduct);
        const productJson = product.toJSON();
        res.send({
          product: productJson
        })
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem registring the product. Please try again.'
      })
    }
  },
  async getAll (req, res) {
    try {
      let products = null;
      products = await Product.findAll({});
      res.send(products);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the products'
      })
    }
  },
}