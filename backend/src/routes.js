const AuthController = require('./controllers/AuthController');
const AuthControllerPolicy = require('./policies/AuthControllerPolicy');
const HolidayRequestsController = require('./controllers/HolidayRequestsController');
const SuppliersController = require('./controllers/SuppliersController');
const ReportsController = require('./controllers/ReportsController');
const ProductsController = require('./controllers/ProductsController');
const DepartmentsController = require('./controllers/DepartmentsController');
const OccupationsController = require('./controllers/OccupationsController');
const OrdersController = require('./controllers/OrdersController');
const EmployeesController = require('./controllers/EmployeesController');

const isAuthenticated = require('./policies/isAuthenticated');

module.exports = (app) => {
  app.post('/register', AuthControllerPolicy.register, AuthController.register);

  app.post('/login', AuthController.login);

  app.post('/holiday-request', isAuthenticated, HolidayRequestsController.post);
  app.put('/holiday-request', isAuthenticated, HolidayRequestsController.put);
  app.get('/holiday-request', isAuthenticated, HolidayRequestsController.getAll);

  app.post('/report', isAuthenticated, ReportsController.post);
  app.put('/report', isAuthenticated, ReportsController.put);
  app.get('/report', isAuthenticated, ReportsController.getAll);

  app.post('/supplier', isAuthenticated, SuppliersController.post);
  app.get('/supplier', isAuthenticated, SuppliersController.getAll);

  app.post('/product', isAuthenticated, ProductsController.post);
  app.put('/product', isAuthenticated, ProductsController.put);
  app.get('/product', isAuthenticated, ProductsController.getAll);

  app.post('/department', DepartmentsController.post);
  app.get('/department', DepartmentsController.getAll);

  app.post('/occupation', OccupationsController.post);
  app.get('/occupation', OccupationsController.getAll);

  app.post('/order', isAuthenticated, OrdersController.post);
  app.put('/order', isAuthenticated, OrdersController.put);
  app.get('/order', isAuthenticated, OrdersController.getAll);

  app.put('/employee', isAuthenticated, EmployeesController.put);
  app.get('/employee', isAuthenticated, EmployeesController.getAll);
}
