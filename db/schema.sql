-- make a database for company
DROP DATABASE IF EXISTS carlton_db;
CREATE database IF NOT EXISTS carlton_db;

USE carlton_db;

-- make department table (includes: department names and department ids)
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL
);

-- make roles table (job title, role id, department role belongs to, salary for roll)
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- make employees table (employee ids, first name, last name, job titles, departments, salaries, managers employees report to)
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;