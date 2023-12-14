const connection = require('./config/connection');
const inquirer = require('inquirer');
const mysql = require('mysql2');


connection.connect((error) => {
  if (error) throw error;
  promptUser();
});

const promptUser = () => {
inquirer.prompt({
    name: 'choices',
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
  .then((answers) => {
    switch (answers.choices) {
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
}
  
// Function to view all employees
const viewAllEmployees = () => {
  let sql = `SELECT employees.id, 
            employees.first_name, 
            employees.last_name, 
            roles.title, 
            departments.department_name AS 'department', 
            roles.salary
            FROM employees
            JOIN roles ON roles.id = employees.role_id
            JOIN departments ON departments.id = roles.department_id
            ORDER BY employees.id ASC`;
    connection.promise().query(sql)
    .then(([rows]) => {
      console.table(rows);
    })
    .catch((error) => {
      console.error(error);
    });
  promptUser();
}

// Function to view all departments
const viewAllDepartments = () => {
  const sql =   `SELECT departments.id AS id, departments.department_name AS departments FROM departments`; 
  connection.promise().query(sql)
    .then(([rows]) => {
      console.table(rows);
    })
    .catch((error) => {
      console.error(error);
    });
    promptUser();
  }


// Function to view all roles
const viewAllRoles = () => {
  const sql =     `SELECT roles.role_id, roles.title, departments.department_name AS departments
  FROM roles
  INNER JOIN departments ON roles.department_id = departments.department_id`;
  connection.promise().query(sql)
    .then(([rows]) => {
      console.table(rows);
    })
    .catch((error) => {
      console.error(error);
    });
    promptUser();
}


const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
      }
    ])
    .then((answer) => {
      let sql = `INSERT INTO departments (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        viewAllDepartments();
      });
    });
  promptUser();
}


const addRole = () => {
  inquirer
    .prompt({
      name: 'roleTitle',
      type: 'input',
      message: 'Enter the name of the role:',
    })
    .then((answer) => {
      connection.query('INSERT INTO roles SET ?', { title: answer.roleTitle }, (err, res) => {
        if (err) throw err;
        console.log('Role added successfully!');
      });
    });
    promptUser();
  }

const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const crit = [answer.fistName, answer.lastName]
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.promise().query(roleSql, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              crit.push(role);
              const managerSql =  `SELECT * FROM employee`;
              connection.promise().query(managerSql, (error, data) => {
                if (error) throw error;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    crit.push(manager);
                    const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                    connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
  promptUser();
}

const updateEmployeeRole = async () => {
  try {
    let sql = `
      SELECT employees.id, employees.first_name, employees.last_name, roles.id AS "role_id"
      FROM employees, roles, departments
      WHERE departments.id = roles.department_id AND roles.id = employees.role_id
    `;
    const [employeesResponse] = await connection.promise().query(sql);
    let employeeNamesArray = employeesResponse.map(employees => `${employees.first_name} ${employees.last_name}`);
    sql = `SELECT roles.id AS "role_id", roles.title AS "role_title" FROM roles`;
    const [rolesResponse] = await connection.promise().query(sql);
    let rolesArray = rolesResponse.map(role => role.role_title);
    const answer = await inquirer.prompt([
      {
        name: 'chosenEmployee',
        type: 'list',
        message: 'Which employee has a new role?',
        choices: employeeNamesArray
      },
      {
        name: 'chosenRole',
        type: 'list',
        message: 'What is their new role?',
        choices: rolesArray
      }
    ]);
    const newTitleId = rolesResponse.find(roles => roles.role_title === answer.chosenRole).role_id;
    const employeeId = employeesResponse.find(employees => answer.chosenEmployee === `${employees.first_name} ${employees.last_name}`).id;
    sql = `UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`;
    await connection.promise().query(sql, [newTitleId, employeeId]);
    console.log('Employee role updated successfully!');
  } catch (error) {
    console.error(error);
  }
  promptUser();
};

