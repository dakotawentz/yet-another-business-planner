-- create departments
INSERT INTO departments (department_name) VALUES
    ('Sales'),
    ('Marketing'),
    ('Finance'),
    ('IT'),
    ('Human Resources');

-- create roles
INSERT INTO roles (title, salary, department_id) VALUES
    ('Sales Associate', 50000, 1),
    ('Marketing Specialist', 55000, 2),
    ('Financial Analyst', 60000, 3),
    ('Software Developer', 70000, 4),
    ('HR Manager', 65000, 5);


INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Michael', 'Johnson', 4, 1),
    ('Emily', 'Williams', 3, 2),
    ('David', 'Brown', 5, NULL);