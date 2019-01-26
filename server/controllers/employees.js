// Route Handler.
const { Employee } = require('../models');

const create = async (req, res) => {
  const {
    firstName,
    lastName,
    department,
    nationality,
  } = req.body;

  try {
    const employee = await Employee.create({
      firstName,
      lastName,
      department,
      nationality,
    });

    res.status(201).send(employee);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  create,
};
