const { OrderProduct, Order } = require('../models');

module.exports = {
  async post (req, res) {
    try {

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      const registerOrder = async (productsList, orderId) => {
        await asyncForEach( productsList, async function(element) {
          const newProductOrder = {
            orderId: orderId,
            productId: element.productId,
            quantity: element.quantity,
          }
          await OrderProduct.create(newProductOrder);
        });
        res.send({ orderNumber: orderId });
      }

      console.log(req.body);
      const NewOrder = {
        userId: req.body.userId,
        status: req.body.status,
        totalValue: req.body.totalPrice
      }
      console.log(NewOrder);
      const order = await Order.create(NewOrder);

      if(order) {
        const productsList = req.body.products;
        registerOrder(productsList, order.dataValues.id);
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem registring the product. Please try again.'
      })
    }
  },
  async getAll (req, res) {
    // try {

    //   async function asyncForEach(array, callback) {
    //     for (let index = 0; index < array.length; index++) {
    //       await callback(array[index], index, array);
    //     }
    //   }

    //   const getSupplierName = async (array) => {
    //     await asyncForEach( array, async function(element) {
    //       const supplier = await Supplier.findOne({ where: { id: element.dataValues.supplierId } });
    //       if (supplier) element.dataValues.supplier = supplier.dataValues.name;
    //       else element.dataValues.supplier = "undefined";
    //     });
    //     res.send(array);
    //   }

    //   let products = null;
    //   products = await Product.findAll({});

    //   if(products) getSupplierName(products);
    //   else {
    //     res.status(500).send({
    //       error: 'An error has occured trying to fetch the products'
    //     })
    //   }

    // } catch (err) {
    //   console.log(err);
    //   res.status(500).send({
    //     error: 'An error has occured trying to fetch the products'
    //   })
    // }
  },
}