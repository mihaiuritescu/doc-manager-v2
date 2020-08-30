const { HolidayRequest, User } = require('../models');

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
  }
}