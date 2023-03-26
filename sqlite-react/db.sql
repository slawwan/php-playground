DROP TABLE IF EXISTS branch_office;
DROP TABLE IF EXISTS heating_substation;
DROP TABLE IF EXISTS loss;

CREATE TABLE IF NOT EXISTS branch_office
(
    id   integer PRIMARY KEY AUTOINCREMENT,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS heating_substation
(
    id               integer PRIMARY KEY AUTOINCREMENT,
    branch_office_id integer NOT NULL,
    name             text    NOT NULL,
    FOREIGN KEY (branch_office_id)
        REFERENCES branch_office (id)
);

CREATE TABLE IF NOT EXISTS loss
(
    id                    integer PRIMARY KEY AUTOINCREMENT,
    heating_substation_id integer NOT NULL,
    amount                real    NOT NULL,
    datetime              text    NOT NULL,
    FOREIGN KEY (heating_substation_id)
        REFERENCES heating_substation (id)
);

INSERT INTO branch_office (name)
VALUES ('Филиал 1');
INSERT INTO branch_office (name)
VALUES ('Филиал 2');
INSERT INTO branch_office (name)
VALUES ('Филиал 3');

INSERT INTO heating_substation (branch_office_id, name)
VALUES (1, 'Тепловой узел 1 А');
INSERT INTO heating_substation (branch_office_id, name)
VALUES (1, 'Тепловой узел 1 Б');
INSERT INTO heating_substation (branch_office_id, name)
VALUES (2, 'Тепловой узел 2 К');
INSERT INTO heating_substation (branch_office_id, name)
VALUES (2, 'Тепловой узел 2 Л');
INSERT INTO heating_substation (branch_office_id, name)
VALUES (2, 'Тепловой узел 2 М');
INSERT INTO heating_substation (branch_office_id, name)
VALUES (3, 'Тепловой узел 3 Ч');

INSERT INTO loss (heating_substation_id, amount, datetime)
VALUES (1, 123.45, '2023-03-23T14:34:55+00:00');
INSERT INTO loss (heating_substation_id, amount, datetime)
VALUES (3, 444221, '2023-03-22T14:12:16+00:00');
INSERT INTO loss (heating_substation_id, amount, datetime)
VALUES (6, 9900012.0001, '2023-03-21T14:11:11+00:00');
