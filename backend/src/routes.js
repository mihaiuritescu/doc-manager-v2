const AuthController = require('./controllers/AuthController');
const AuthControllerPolicy = require('./policies/AuthControllerPolicy');
const HolidayRequestsController = require('./controllers/HolidayRequestsController');
const SuppliersController = require('./controllers/SuppliersController');
const ReportsController = require('./controllers/ReportsController');
const ProductsController = require('./controllers/ProductsController');
const DepartmentsController = require('./controllers/DepartmentsController');
const OccupationsController = require('./controllers/OccupationsController');
const OrdersController = require('./controllers/OrdersController');

const isAuthenticated = require('./policies/isAuthenticated');

module.exports = (app) => {
  app.post('/register', AuthControllerPolicy.register, AuthController.register);

  app.post('/login', AuthController.login);

  app.post('/holiday-request', isAuthenticated, HolidayRequestsController.post);

  app.post('/report', isAuthenticated, ReportsController.post);

  app.post('/supplier', isAuthenticated, SuppliersController.post);
  app.get('/supplier', isAuthenticated, SuppliersController.getAll);

  app.post('/product', isAuthenticated, ProductsController.post);
  app.get('/product', isAuthenticated, ProductsController.getAll);

  app.post('/department', DepartmentsController.post);
  app.get('/department', DepartmentsController.getAll);

  app.post('/occupation', OccupationsController.post);
  app.get('/occupation', OccupationsController.getAll);

  app.post('/order', isAuthenticated, OrdersController.post);
  app.get('/order', isAuthenticated, OrdersController.getAll);
}
