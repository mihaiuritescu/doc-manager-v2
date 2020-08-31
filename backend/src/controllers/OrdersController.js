const moment = require('moment');
const { OrderProduct, Order, User, Department, Occupation } = require('../models');

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

      const NewOrder = {
        userId: req.user.id,
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
    try {

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      const getOrderDetails = async (array) => {
        await asyncForEach( array, async function(element) {
          const user = await User.findOne({ where: { id: element.dataValues.userId } });
          if (user) {
            element.dataValues.userName = user.dataValues.firstname + " " + user.dataValues.lastname;
            element.dataValues.createdAt = moment(element.dataValues.createdAt).format("YYYY-MM-DD");

            const deptId = user.dataValues.department;
            const occId = user.dataValues.occupation;

            const deptName = await Department.findOne({ where: { id: deptId } });
            const occName = await Occupation.findOne({ where: { id: occId } });

            if (deptName && occName) {
              element.dataValues.userDept = deptName.dataValues.name;
              element.dataValues.userOcc = occName.dataValues.name;
            } else {
              element.dataValues.userDept = "undefined";
              element.dataValues.userOcc = "undefined";
            }

          } else {
            res.status(500).send({
              error: 'An error has occured trying to fetch the orders'
            })
          }
        });
        res.send(array);
      }

      let orders = null;
      orders = await Order.findAll({});

      if(orders) getOrderDetails(orders);
      else {
        res.status(500).send({
          error: 'An error has occured trying to fetch the orders'
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the orders'
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

      const updateOrders = async (orders) => {
        await asyncForEach( orders, async function(element) {
          const newOrder = {
            status: element.status,
          };
          await Order.update(newOrder, {
            where: {
              id: element.id
            }
          });
        });
        res.send({ status: "success" });
      }
      
      const orders = req.body;
      updateOrders(orders);

    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem updating the order list. Please try again.'
      })
    }
  }
}