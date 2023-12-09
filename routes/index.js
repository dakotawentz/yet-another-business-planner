const router = require('express').Router();
const inquirer = require('inquirer');

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
      'Exit',
    ],
  })
  .then((answer) => {
    switch (answer.action) {
// view all departments
      case 'View all departments':
        viewAllDepartments();
        break;
// view all roles
      case 'View all roles':
        viewAllRoles();
        break;
// view all employees
      case 'View all employees':
        viewAllEmployees();
        break;
// add department
      case 'Add a department':
        addDepartment();
        break;
// add role
      case 'Add a role':
        addRole();
        break;
// add employee
      case 'Add an employee':
        addEmployee();
        break;
// update employee roll
      case 'Update an employee role':
        updateEmployeeRole();
        break;

      case 'Exit':
        connection.end();
        break;
    }
  });
  
  
// Function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM departments', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApplication();
  });
}

// Function to view all roles
function viewAllRoles() {
  connection.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApplication();
  });
}

// Function to view all employees
function viewAllEmployees() {
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApplication();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      connection.query('INSERT INTO departments SET ?', { department_name: answer.departmentName }, (err, res) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApplication();
      });
    });
}

function addRole() {
  inquirer
    .prompt({
      name: 'roleTitle',
      type: 'input',
      message: 'Enter the name of the role:',
    })
    .then((answer) => {
      connection.query('INSERT INTO roles SET ?', { role_title: answer.roleTitle }, (err, res) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApplication();
      });
    });
}

// function updateEmployeeRole() {
//   connection.query('SELECT * FROM employees', (err.employees) => {
//     if (err) throw err;
  
//   })
// }



