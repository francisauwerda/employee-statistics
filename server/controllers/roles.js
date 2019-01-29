// Roles Route Handler
const { Role } = require('../models');

const create = async (req, res) => {
  const {
    title,
    description,
    durationInWeeks,
    employeeId,
  } = req.body;

  if (!title || !employeeId) {
    return res.sendStatus(403);
  }

  try {
    const role = await Role.create({
      title,
      description,
      durationInWeeks,
      employeeId,
    });

    return res.status(201).send({ role });
  } catch (err) {
    return res.status(400);
  }
};

const list = async (req, res) => {
  try {
    const roles = await Role.findAll({});
    res.status(200).send({ roles });
  } catch (err) {
    res.status(400);
  }
};

module.exports = {
  create,
  list,
};
