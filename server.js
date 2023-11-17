// Required modules
require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected to MySQL database');
    startApp();
  }
});

function startApp() {
  // Inquirer prompts
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          db.end();
          break;

        default:
          console.log('Invalid choice. Please select again.');
          startApp();
          break;
      }
    });
}

// Functions for view inquirer prompts
function viewAllDepartments() {
  db.query('SELECT * FROM departments', (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    startApp();
  });
};

function viewAllRoles() {
  db.query('SELECT * FROM roles', (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    startApp();
  });
};

function viewAllEmployees() {
  db.query('SELECT * FROM employees', (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    startApp();
  });
};

// functions to add from inquirer prompts
function addDepartment() {
  inquirer.prompt({
    name: 'departmentName',
    type: 'input',
    message: 'Enter the name of the department:'
  }).then(answer => {
    const departmentName = answer.departmentName;

    db.query('INSERT INTO departments (name) VALUES (?)', [departmentName], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Department '${departmentName}' added successfully.`);
      }
      startApp();
    });
  })
};

function addRole() {
  db.query('SELECT id, name FROM departments', (err, results) => {
    if (err) {
      console.log(err);
      startApp();
    } else {
      const departments = results.map(department => department.name);

      inquirer.prompt([
        {
          name: 'roleName',
          type: 'input',
          message: 'Enter the name of the role:'
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter the salary for the role:'
        },
        {
          name: 'department',
          type: 'list',
          message: 'Select the department for the role:',
          choices: departments
        }
      ]).then(answers => {
        const { roleName, salary, department } = answers;
        const departmentId = results.find(dep => dep.name === department).id;

        db.query(
          'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
          [roleName, salary, departmentId],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Role '${roleName}' added successfully.`);
            }
            startApp();
          }
        );
      });
    }
  });
}

function addEmployee() {
  db.query('SELECT id, title FROM roles', (err, roleResults) => {
    if (err) {
      console.log(err);
      startApp();
    } else {
      const roles = roleResults.map(role => role.title);

      db.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employees', (err, employeeResults) => {
        if (err) {
          console.log(err);
          startApp();
        } else {
          const managers = employeeResults.map(employee => employee.manager);

          inquirer.prompt([
            {
              name: 'firstName',
              type: 'input',
              message: 'Enter the first name of the employee:'
            },
            {
              name: 'lastName',
              type: 'input',
              message: 'Enter the last name of the employee:'
            },
            {
              name: 'role',
              type: 'list',
              message: 'Select the role for the employee:',
              choices: roles
            },
            {
              name: 'manager',
              type: 'list',
              message: 'Select the manager for the employee:',
              choices: ['None'].concat(managers)
            }
          ]).then(answers => {
            const { firstName, lastName, role, manager } = answers;

            let roleId = roleResults.find(r => r.title === role).id;
            let managerId = null;

            if (manager !== 'None') {
              managerId = employeeResults.find(emp => emp.manager === manager).id;
            }

            db.query(
              'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
              [firstName, lastName, roleId, managerId],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`Employee '${firstName} ${lastName}' added successfully.`);
                }
                startApp();
              }
            );
          });
        }
      });
    }
  });
}

function updateEmployeeRole() {
  db.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee FROM employees', (err, employeeResults) => {
    if (err) {
      console.log(err);
      startApp();
    } else {
      const employees = employeeResults.map(employee => employee.employee);

      db.query('SELECT id, title FROM roles', (err, roleResults) => {
        if (err) {
          console.log(err);
          startApp();
        } else {
          const roles = roleResults.map(role => role.title);

          inquirer.prompt([
            {
              name: 'employee',
              type: 'list',
              message: 'Select the employee you want to update:',
              choices: employees
            },
            {
              name: 'newRole',
              type: 'list',
              message: 'Select the new role for the employee:',
              choices: roles
            }
          ]).then(answers => {
            const { employee, newRole } = answers;
            const employeeId = employeeResults.find(emp => emp.employee === employee).id;
            const roleId = roleResults.find(role => role.title === newRole).id;

            db.query(
              'UPDATE employees SET role_id = ? WHERE id = ?',
              [roleId, employeeId],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`Employee '${employee}' role updated to '${newRole}' successfully.`);
                }
                startApp();
              }
            );
          });
        }
      });
    }
  });
}
