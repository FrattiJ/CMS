INSERT INTO department (id, name)
VALUES 
    (1, 'Sales'),
    (2, 'Team Services');

INSERT INTO role (id, title, salary, department_id)
VALUES 
    (1, 'Sales Consultant', 50,000, 1),
    (2, 'Team Services Manager', 80,000, 2);

INSERT INTO TABLE employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Jacob', 'Fratti', 1, 2),
    (1, 'Gabi', 'Confessore', 2, NULL);