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

describe.only('/api/roles', () => {
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
    it('should get all roles', (done) => {
      request(app)
        .get('/api/roles')
        .expect(200)
        .expect((res) => {
          expect(res.body.roles.length).toBe(2);
        })
        .end(done);
    });

    it('should create a role for a user', (done) => {
      const body = {
        title: 'Some new role',
        description: 'Some new description',
        durationInWeeks: 2,
      };

      Employee.findOne()
        .then((employee) => {
          request(app)
            .post('/api/roles')
            .send({
              ...body,
              employeeId: employee.id,
            })
            .expect(201)
            .expect((res) => {
              expect(res.body.role.title).toBe(body.title);
            })
            .end((err) => {
              if (err) {
                return done(err);
              }

              return Role
                .findAll({
                  where: {
                    title: body.title,
                  },
                })
                .then((roles) => {
                  expect(roles.length).toBe(1);
                  expect(roles[0].description).toBe(body.description);
                  done();
                })
                .catch(e => done(e));
            });
        });
    });
  });
});
