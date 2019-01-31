// Roles Route Handler
const { Role, Employee } = require('../models');

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

  const associatedEmployee = await Employee.findOne({
    where: {
      id: employeeId,
    },
  });

  if (!associatedEmployee) {
    return res.status(403).send({
      message: 'No associated employee found',
    });
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
    return res.sendStatus(400);
  }
};

const list = async (req, res) => {
  try {
    const roles = await Role.findAll({});
    res.status(200).send({ roles });
  } catch (err) {
    res.sendStatus(400);
  }
};

const getRoleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(403);
  }

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      return res.sendStatus(404);
    }

    return res.status(200).send({ role });
  } catch (err) {
    return res.sendStatus(400);
  }
};

const deleteRoleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(403);
  }

  try {
    const role = await Role.findById(id);

    if (!role) {
      return res.sendStatus(404);
    }

    await role.destroy();

    return res.send({ role });
  } catch (err) {
    return res.sendStatus(400);
  }
};

const editRoleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(403);
  }

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      return res.sendStatus(404);
    }

    Object.keys(req.body).forEach((field) => { role[field] = req.body[field]; });

    await role.save();

    return res.status(200).send({ role });
  } catch (err) {
    return res.sendStatus(400);
  }
};

module.exports = {
  create,
  list,
  getRoleById,
  deleteRoleById,
  editRoleById,
};