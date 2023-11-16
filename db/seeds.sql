INSERT INTO department (id, name)
VALUES 
    (1, 'Sales'),
    (2, 'Team Services');

INSERT INTO role (id, title, salary, department_id)
VALUES 
    (1, 'Sales Consultant', 50000, 1),
    (2, 'Team Services Manager', 80000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Jacob', 'Fratti', 1, 2),
    (2, 'Gabi', 'Confessore', 2, NULL);