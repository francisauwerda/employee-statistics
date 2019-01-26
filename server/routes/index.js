const { employees: employeesContoller } = require('../controllers');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Employees API!',
  }));

  app.post('/api/employees', employeesContoller.create);

  app.get('/api/employees', employeesContoller.list);

  app.get('/api/employees/:id', employeesContoller.getEmployeeById);
};
