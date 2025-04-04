
CREATE TABLE police (
    police_id VARCHAR(50) primary key,
    photo VARCHAR(255) DEFAULT NULL,
    aadhar_card BIGINT,
    password varchar(255),
    full_name VARCHAR(255),
    phone_no bigint DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    city varchar(255),
    state VARCHAR(255),
    blood_group varchar(10) DEFAULT NULL,
    post VARCHAR(255),
    speciality VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL
)

