const { Report, User } = require('../models');

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
}