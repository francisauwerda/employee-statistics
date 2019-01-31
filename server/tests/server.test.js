const expect = require('expect');
const {
  describe,
  it,
  beforeEach,
  after,
} = require('mocha');
const request = require('supertest');

const app = require('./../../app');
const { Employee, Role } = require('./../models');

const initialTestEmployees = [{
  firstName: 'testFirst',
  lastName: 'testLast',
  department: 'testDepartment',
  nationality: 'testNationality',
}, {
  firstName: 'testFirst2',
  lastName: 'testLast2',
  department: 'testDepartment2',
  nationality: 'testNationality2',
}];

const initialTestRoles = [{
  title: 'Organise Retro',
  description: 'Organises Retro',
  durationInWeeks: 2,
}, {
  title: 'Release Manager',
  description: 'Manages releases',
  durationInWeeks: 1,
}];

const generateRandomId = () => Math.floor((Math.random() * 10000) + 1);

const findNonExistantModelId = async (model) => {
  const id = generateRandomId();
  const employee = await model.findAll({ where: { id } });

  if (employee.length) {
    return findNonExistantModelId(model);
  }

  return id;
};

describe('/api/employees', () => {
  beforeEach((done) => {
    Employee
      .destroy({ where: {} })
      .then(() => Employee.bulkCreate(initialTestEmployees))
      .then(() => done());
  });

  after((done) => {
    Employee
      .destroy({ where: {} })
      .then(() => done());
  });


  describe('GET /api/employees', () => {
    it('should get all employees', (done) => {
      request(app)
        .get('/api/employees')
        .expect(200)
        .expect((res) => {
          expect(res.body.employees.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('POST /api/employees', () => {
    it('should create an employee', (done) => {
      const body = {
        firstName: 'Michael',
        lastName: 'Jackson',
        department: 'Music',
        nationality: 'American',
      };

      request(app)
        .post('/api/employees')
        .send(body)
        .expect(201)
        .expect((res) => {
          expect(res.body.employee.firstName).toBe(body.firstName);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          return Employee
            .findAll({
              where: {
                firstName: body.firstName,
              },
            })
            .then((employees) => {
              expect(employees.length).toBe(1);
              expect(employees[0].lastName).toBe(body.lastName);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should return 404 if employee not found', async () => {
      const nonExistantRoleId = await findNonExistantModelId(Employee);
      const res = await request(app).put(`/api/employees/${nonExistantRoleId}`);

      expect(res.statusCode).toBe(404);
    });

    it('should edit one employee', async () => {
      const employee = await Employee.findOne();
      const body = {
        firstName: `${employee.firstName} edited firstName`,
      };

      const res = await request(app)
        .put(`/api/employees/${employee.id}`)
        .send(body);

      expect(res.body.employee.firstName).toBe(body.firstName);
    });
  });
});

describe('/api/roles', () => {
  beforeEach((done) => {
    Role
      .destroy({ where: {} })
      .then(() => Employee.bulkCreate(initialTestEmployees, {
        returning: true,
      }))
      .then((generatedEmployees) => {
        generatedEmployees.forEach((employee, i) => {
          Role.create({
            ...initialTestRoles[i],
            employeeId: employee.id,
          });
        });
      })
      .then(() => done());
  });

  after((done) => {
    Role
      .destroy({ where: {} })
      .then(() => done());
  });

  describe('GET /api/roles', () => {
    it('should get all roles', async () => {
      const res = await request(app).get('/api/roles');
      expect(res.statusCode).toBe(200);
      expect(res.body.roles.length).toBe(2);
    });
  });

  describe('GET /api/roles/:id', () => {
    it('should return a role by given ID', async () => {
      const role = await Role.findOne();
      const res = await request(app).get(`/api/roles/${role.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.role).toBeDefined();
    });

    it('should return 404 if role not found', async () => {
      const nonExistantRoleId = await findNonExistantModelId(Role);
      const res = await request(app).get(`/api/roles/${nonExistantRoleId}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 if id invalid', async () => {
      const invalidRoleId = 'abc123';
      const res = await request(app).get(`/api/roles/${invalidRoleId}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/roles', () => {
    it('should create a role for a user', async () => {
      const body = {
        title: 'Some new role',
        description: 'Some new description',
        durationInWeeks: 2,
      };
      const employee = await Employee.findOne();
      const res = await request(app)
        .post('/api/roles')
        .send({
          ...body,
          employeeId: employee.id,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.role.title).toBe(body.title);

      const roles = await Role.findAll({
        where: {
          title: body.title,
        },
      });

      expect(roles.length).toBe(1);
      expect(roles[0].description).toBe(body.description);
    });

    it('should throw an error if no associated user can be found', async () => {
      const nonExistantEmployeeId = await findNonExistantModelId(Employee);

      const body = {
        title: 'Invalid Role',
        description: 'Non existant employeeId was associated',
        durationInWeeks: 2,
        employeeId: nonExistantEmployeeId,
      };

      const res = await request(app)
        .post('/api/roles')
        .send(body);

      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.error.text).message).toBe('No associated employee found');
    });
  });

  describe('DELETE /api/roles/:id', () => {
    it('should return 404 if role not found', async () => {
      const nonExistantRoleId = await findNonExistantModelId(Role);
      const res = await request(app).delete(`/api/roles/${nonExistantRoleId}`);

      expect(res.statusCode).toBe(404);
    });

    it('should delete a role', async () => {
      const randomRole = await Role.findOne();

      const res = await request(app).delete(`/api/roles/${randomRole.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.role.id).toBe(randomRole.id);

      const noRoles = await Role.findAll({
        where: {
          id: randomRole.id,
        },
      });

      expect(noRoles.length).toBe(0);
    });
  });

  describe('PATCH /api/roles/:id', () => {
    it('should return 404 if role not found', async () => {
      const nonExistantRoleId = await findNonExistantModelId(Role);
      const res = await request(app).patch(`/api/roles/${nonExistantRoleId}`);

      expect(res.statusCode).toBe(404);
    });

    it('should edit one role', async () => {
      const role = await Role.findOne();
      const body = {
        title: `${role.title} edited title`,
      };

      const res = await request(app)
        .patch(`/api/roles/${role.id}`)
        .send(body);

      expect(res.body.role.title).toBe(body.title);
    });
  });
});
