const { employees: employeesContoller } = require('../controllers');
const { roles: rolesController } = require('../controllers');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Employees API!',
  }));

  // Employee Routes
  app.post('/api/employees', employeesContoller.create);
  app.get('/api/employees', employeesContoller.list);
  app.get('/api/employees/:id', employeesContoller.getEmployeeById);
  app.delete('/api/employees/:id', employeesContoller.deleteEmployeeById);
  app.put('/api/employees/:id', employeesContoller.editEmployeeById);

  // Role Routes
  app.post('/api/roles', rolesController.create);
  app.get('/api/roles', rolesController.list);
  app.delete('/api/roles/:id', rolesController.deleteRoleById);
};
