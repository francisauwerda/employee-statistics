// Employees Route Handler.
const { Employee, Role } = require('../models');

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

    return res.status(201).send({ employee });
  } catch (err) {
    return res.sendStatus(400);
  }
};

const list = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{
        model: Role,
        as: 'roles',
      }],
    });
    res.status(200).send({ employees });
  } catch (err) {
    res.sendStatus(400);
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(404);
  }

  try {
    const employee = await Employee.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
      }],
    });

    if (!employee) {
      return res.sendStatus(404);
    }

    return res.send({ employee });
  } catch (err) {
    return res.sendStatus(400);
  }
};

const deleteEmployeeById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(403);
  }

  try {
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.sendStatus(404);
    }

    await employee.destroy();

    return res.send({ employee });
  } catch (err) {
    return res.sendStatus(400);
  }
};

const editEmployeeById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(404);
  }

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.sendStatus(404);
    }

    await employee.update(req.body, { fields: Object.keys(req.body) });

    return res.send({ employee });
  } catch (err) {
    return res.sendStatus(400);
  }
};

module.exports = {
  create,
  list,
  getEmployeeById,
  deleteEmployeeById,
  editEmployeeById,
};
