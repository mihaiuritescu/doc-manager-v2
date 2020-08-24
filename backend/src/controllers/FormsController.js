const { HolidayRequest, Report, User } = require('../models');

module.exports = {
  async holidayRequest (req, res) {
    try {
      const user = await User.findOne({ where: { email: req.body.userEmail } });
      if(user) {
        const formReq = {
          userId: user.dataValues.id,
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
      res.status(400).send({
        error: 'There was a problem while saving. Please try again.'
      })
    }
  },
  async report (req, res) {
    try {
      const user = await User.findOne({ where: { email: req.body.userEmail } });
      if(user) {
        const reportReq = {
          userId: user.dataValues.id,
          address: req.body.address,
          phone: req.body.phone,
          locationManager: req.body.locationManager,
          equipmentType: req.body.equipmentType,
          equipmentDetails: req.body.equipmentDetails,
          problemsFound: req.body.problemsFound,
          observations: req.body.observations
        };
        const report = await Report.create(reportReq);
        const reportJson = report.toJSON();
        res.send({
          report: reportJson
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'There was a problem while saving. Please try again.'
      })
    }
  }
}