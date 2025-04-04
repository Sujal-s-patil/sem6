CREATE TABLE criminal_records (
    criminal_id INT PRIMARY KEY AUTO_INCREMENT,
    photo varchar(255) DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    aadhar_card BIGINT DEFAULT null ,
    address TEXT DEFAULT NULL,
    city VARCHAR(50),
    state VARCHAR(50),
    date_of_birth DATE,
    jail_address TEXT DEFAULT NULL,
    jail_city varchar(50),
    jail_state VARCHAR(50),
    phone_no bigint DEFAULT NULL,
    crime VARCHAR(255) NOT NULL,
    date_of_arrest DATE NOT NULL,
    sentence_duration INT, -- in months
    status VARCHAR(50), -- e.g., 'Incarcerated', 'Released', 'Probation'
    description TEXT DEFAULT NULL
);

