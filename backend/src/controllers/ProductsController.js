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

  async put (req, res) {
    try {
      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      const updateProducts = async (productsList) => {
        await asyncForEach( productsList, async function(element) {
          const newProduct = {
            name: element.name,
            description: element.description,
            price: element.price,
            supplierId: element.supplierId,
          };
          await Product.update(newProduct, {
            where: {
              id: element.id
            }
          });
        });
        res.send({ status: "success" });
      }

      const deleteProducts = async (productsList) => {
        await asyncForEach( productsList, async function(element) {
          await Product.destroy({
            where: {
              id: element.id
            }
          });
        });
        res.send({ status: "success" });
      }
      
      const action = req.body.action;
      const productsList = req.body.array;
      
      if(action) {
        switch (action) {
          case "update":
            updateProducts(productsList);
            break;
          case "delete":
            deleteProducts(productsList);
              break;
          default:
            break;
        }
      }

    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem updating the product list. Please try again.'
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