const { User, Department, Occupation } = require('../models');

module.exports = {
  async getAll (req, res) {
    try {

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      const getUserDetails = async (array) => {
        await asyncForEach( array, async function(element) {
          const occupation = await Occupation.findOne({ where: { id: element.dataValues.occupation } });
          const department = await Department.findOne({ where: { id: element.dataValues.department } });
          if (occupation) element.dataValues.occupationName = occupation.dataValues.name;
          else element.dataValues.occupationName = "undefined";
          if (department) element.dataValues.departmentName = department.dataValues.name;
          else element.dataValues.departmentName = "undefined";
        });
        res.send(array);
      }

      let users = null;
      users = await User.findAll({});

      if(users) getUserDetails(users);
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

  async put (req, res) {
    try {
      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      const updateUser = async (usersList) => {
        await asyncForEach( usersList, async function(element) {
          const updatedUser = {
            firstname: element.firstname,
            lastname: element.lastname,
            address: element.address,
            postalcode: element.postalcode,
            city: element.city,
            phone: element.phone,
          };
          await User.update(updatedUser, {
            where: {
              id: element.id
            }
          });
        });
        res.send({ status: "success" });
      }
      
      const deleteUser = async (usersList) => {
        await asyncForEach( usersList, async function(element) {
          await User.destroy({
            where: {
              id: element.id
            }
          });
        });
        res.send({ status: "success" });
      }

      const action = req.body.action;
      const usersList = req.body.array;

      if(action) {
        switch (action) {
          case "update":
            updateUser(usersList);
            break;
          case "delete":
            deleteUser(usersList);
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
}