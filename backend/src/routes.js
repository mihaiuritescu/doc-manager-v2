const AuthController = require('./controllers/AuthController');
const FormsController = require('./controllers/FormsController');
const AuthControllerPolicy = require('./policies/AuthControllerPolicy');

module.exports = (app) => {
  app.post('/register',
    AuthControllerPolicy.register,
    AuthController.register);

  app.post('/login',
  AuthController.login);

  app.post('/holiday-request',
  FormsController.holidayRequest);

  app.post('/report',
  FormsController.report);
}
