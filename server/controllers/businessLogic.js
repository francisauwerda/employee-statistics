const { Employee } = require('../models');

// TODO: Write unit test for this.
const getNextEmployeeId = async (employeeId) => {
  const employees = await Employee.findAll({});
  const sortedEmployees = employees.sort((a, b) => {
    const nameA = a.lastName.toUpperCase();
    const nameB = b.lastName.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameB < nameA) {
      return 1;
    }

    return 0;
  });

  const mappedIds = sortedEmployees.map(employee => employee.id);
  const indexOfOldEmployee = mappedIds.indexOf(employeeId);
  let indexOfNextEmployee = indexOfOldEmployee + 1;
  if (indexOfNextEmployee >= mappedIds.length) {
    indexOfNextEmployee = 0;
  }

  return mappedIds[indexOfNextEmployee];
};

module.exports = {
  getNextEmployeeId,
};
