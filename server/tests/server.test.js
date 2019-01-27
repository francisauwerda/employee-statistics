const expect = require('expect');
const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');

const app = require('./../../app');
const { Employee } = require('./../models');

const employees = [{
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
    .then(() => Employee.bulkCreate(employees))
    .then(() => done());
});

describe('GET /employees', () => {
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
