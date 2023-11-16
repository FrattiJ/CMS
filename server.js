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
  if(err) {
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

// Functions for each inquirer selection
function viewAllDepartments() {
  db.query('SELECT * FROM department', (err, result) => {
    if (err) {
        console.log(err);
      }
      console.log(result);
    startApp();
  });
};

function viewAllRoles() {
    db.query('SELECT * FROM role', (err, result) => {
        if (err) {
            console.log(err);
          }
          console.log(result);
      startApp();
    });
  };

  function viewAllEmployees() {
    db.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.log(err);
          }
          console.log(result);
      startApp();
    });
  };