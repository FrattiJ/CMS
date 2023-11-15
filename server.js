// Required modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`
});

// Connect to the database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  startApp();
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
          connection.end();
          break;

        default:
          console.log('Invalid choice. Please select again.');
          startApp();
          break;
      }
    });
}

// Functions for each inquirer selection
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
};

function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  };

  function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  };

// Call function to start app
startApp();
