const moment = require('moment');
const { Report, User, Department, Occupation } = require('../models');

module.exports = {
  async post (req, res) {
    try {
      const user = await User.findOne({ where: { email: req.body.userEmail } });
      if(user) {
        const reportReq = {
          userId: req.user.id,
          address: req.body.address,
          phone: req.body.phone,
          locationManager: req.body.locationManager,
          equipmentType: req.body.equipmentType,
          equipmentDetails: req.body.equipmentDetails,
          problemsFound: req.body.problemsFound,
          observations: req.body.observations,
          status: req.body.status
        };
        const report = await Report.create(reportReq);
        const reportJson = report.toJSON();
        res.send({
          report: reportJson
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

      const getReportDetails = async (array) => {
        await asyncForEach( array, async function(element) {
          const user = await User.findOne({ where: { id: element.dataValues.userId } });
          if (user) {
            element.dataValues.userName = user.dataValues.firstname + " " + user.dataValues.lastname;
            element.dataValues.email = user.dataValues.email;
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
              error: 'An error has occured trying to fetch the reports'
            })
          }
        });
        res.send(array);
      }

      let reports = null;
      reports = await Report.findAll({});

      if(reports) getReportDetails(reports);
      else {
        res.status(500).send({
          error: 'An error has occured trying to fetch the reports'
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: 'An error has occured trying to fetch the reports'
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

      const updateReports = async (reports) => {
        await asyncForEach( reports, async function(element) {
          const newReport = {
            status: element.status,
          };
          await Report.update(newReport, {
            where: {
              id: element.id
            }
          });
        });
        res.send({ status: "success" });
      }
      
      const reports = req.body;
      updateReports(reports);

    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'There was a problem updating the report list. Please try again.'
      })
    }
  }
}