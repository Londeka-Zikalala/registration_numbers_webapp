CREATE TABLE towns (
    id SERIAL PRIMARY KEY,
    town_name VARCHAR(255) NOT NULL
);

CREATE TABLE reg_numbers (
    id SERIAL PRIMARY KEY,
    reg_number VARCHAR(255) UNIQUE NOT NULL,
    town_id INT NOT NULL,
    FOREIGN KEY (town_id) REFERENCES towns(id)
);
