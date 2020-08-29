const AuthController = require('./controllers/AuthController');
const HolidayRequestsController = require('./controllers/HolidayRequestsController');
const SuppliersController = require('./controllers/SuppliersController');
const ReportsController = require('./controllers/ReportsController');
const ProductsController = require('./controllers/ProductsController');
const DepartmentsController = require('./controllers/DepartmentsController');
const OccupationsController = require('./controllers/OccupationsController');
const OrdersController = require('./controllers/OrdersController');
const AuthControllerPolicy = require('./policies/AuthControllerPolicy');

module.exports = (app) => {
  app.post('/register', AuthControllerPolicy.register, AuthController.register);

  app.post('/login', AuthController.login);

  app.post('/holiday-request', HolidayRequestsController.post);

  app.post('/report', ReportsController.post);

  app.post('/supplier', SuppliersController.post);
  app.get('/supplier', SuppliersController.getAll);

  app.post('/product', ProductsController.post);
  app.get('/product', ProductsController.getAll);

  app.post('/department', DepartmentsController.post);
  app.get('/department', DepartmentsController.getAll);

  app.post('/occupation', OccupationsController.post);
  app.get('/occupation', OccupationsController.getAll);

  app.post('/order', OrdersController.post);
  app.get('/order', OrdersController.getAll);
}
