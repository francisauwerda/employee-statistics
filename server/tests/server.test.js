const expect = require('expect');
const { describe, it, beforeEach } = require('mocha');
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

const findNonExistantEmployeeId = async () => {
  const id = generateRandomId();
  const employee = await Employee.findAll({ where: { id } });

  if (employee.length) {
    return findNonExistantEmployeeId();
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

  describe('GET /api/roles', () => {
    it('should get all roles', async () => {
      const res = await request(app).get('/api/roles');
      expect(res.statusCode).toBe(200);
      expect(res.body.roles.length).toBe(2);
    });
  });

  describe.only('POST /api/roles', () => {
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
      const employeeId = await findNonExistantEmployeeId();

      const body = {
        title: 'Invalid Role',
        description: 'Non existant employeeId was associated',
        durationInWeeks: 2,
        employeeId,
      };

      const res = await request(app)
        .post('/api/roles')
        .send(body);

      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.error.text).message).toBe('No associated employee found');
    });
  });

  describe('DELETE /api/roles/:id', () => {
    it('should throw an error if the role doesn\'t exist', async () => {
      const randomRole = Role.findOne();

      try {
        await request(app).delete(`/api/roles/${randomRole.id}`);
        await request(app).delete(`/api/roles/${randomRole.id}`);
      } catch (err) {
        console.log('AHHHHHH', err);
      }
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
});
