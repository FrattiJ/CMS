DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL, --Primary key
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL, --Primary key
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL --hold reference to department role belongs to
);

CREATE TABLE employee (
    id INT NOT NULL, --Primary key
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL, --hold reference to employee role
    manager_id INT --hold reference to another employee that is the manager of the current employee
);