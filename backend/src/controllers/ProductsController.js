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

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      const getSupplierName = async (array) => {
        await asyncForEach( array, async function(element) {
          const supplier = await Supplier.findOne({ where: { id: element.dataValues.supplierId } });
          if (supplier) element.dataValues.supplier = supplier.dataValues.name;
          else element.dataValues.supplier = "undefined";
        });
        res.send(array);
      }

      let products = null;
      products = await Product.findAll({});

      if(products) getSupplierName(products);
      else {
        res.status(500).send({
          error: 'An error has occured trying to fetch the products'
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the products'
      })
    }
  },
}