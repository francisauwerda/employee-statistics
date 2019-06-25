const { employees: employeesController } = require('../controllers');
const { roles: rolesController } = require('../controllers');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Employees API!',
  }));

  // Employee Routes
  app.post('/api/employees', employeesController.create);
  app.get('/api/employees', employeesController.list);
  app.get('/api/employees/:id', employeesController.getEmployeeById);
  app.delete('/api/employees/:id', employeesController.deleteEmployeeById);
  app.put('/api/employees/:id', employeesController.editEmployeeById);

  // Role Routes
  app.post('/api/roles', rolesController.create);
  app.get('/api/roles', rolesController.list);
  app.get('/api/roles/:id', rolesController.getRoleById);
  app.delete('/api/roles/:id', rolesController.deleteRoleById);
  app.patch('/api/roles/:id', rolesController.editRoleById);
  app.post('/api/roles/:id/rotate', rolesController.rotateRoleById);
};
