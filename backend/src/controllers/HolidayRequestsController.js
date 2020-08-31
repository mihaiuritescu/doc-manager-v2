const moment = require('moment');
const { HolidayRequest, User, Department, Occupation } = require('../models');

module.exports = {
  async post (req, res) {
    try {
      const user = await User.findOne({ where: { email: req.body.userEmail } });
      if(user) {
        const formReq = {
          userId: req.user.id,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          contact: req.body.contact,
          status: req.body.status
        };
        const form = await HolidayRequest.create(formReq);
        const formJson = form.toJSON();
        res.send({
          form: formJson
        })
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem while saving. Please try again.'
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

      const getHolidayRequestDetails = async (array) => {
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
              error: 'An error has occured trying to fetch the holiday requests'
            })
          }
        });
        res.send(array);
      }

      let holidayRequests = null;
      holidayRequests = await HolidayRequest.findAll({});

      if(holidayRequests) getHolidayRequestDetails(holidayRequests);
      else {
        res.status(500).send({
          error: 'An error has occured trying to fetch holiday requests'
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the holiday requests'
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

      const updateHolidayRequest = async (holidayRequests) => {
        await asyncForEach( holidayRequests, async function(element) {
          const newRequest = {
            status: element.status,
          };
          await HolidayRequest.update(newRequest, {
            where: {
              id: element.id
            }
          });
        });
        res.send({ status: "success" });
      }
      
      const holidayRequests = req.body;
      updateHolidayRequest(holidayRequests);

    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem updating the holiday request list. Please try again.'
      })
    }
  },
}