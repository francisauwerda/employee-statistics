// Route Handler.
const { Employee } = require('../models');

const create = async (req, res) => {
  const {
    firstName,
    lastName,
    department,
    nationality,
  } = req.body;

  if (!firstName) {
    return res.sendStatus(403);
  }

  try {
    const employee = await Employee.create({
      firstName,
      lastName,
      department,
      nationality,
    });

    return res.status(201).send(employee);
  } catch (err) {
    return res.status(400);
  }
};

const list = async (req, res) => {
  try {
    const employees = await Employee.findAll({});
    res.status(200).send(employees);
  } catch (err) {
    res.status(400);
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(404);
  }

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.sendStatus(404);
    }

    return res.send({ employee });
  } catch (err) {
    return res.sendStatus(400);
  }
};

module.exports = {
  create,
  list,
  getEmployeeById,
};
