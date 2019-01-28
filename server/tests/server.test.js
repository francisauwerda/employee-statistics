const expect = require('expect');
const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');

const app = require('./../../app');
const { Employee } = require('./../models');

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
        expect(res.body.firstName).toBe(body.firstName);
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
