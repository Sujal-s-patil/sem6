CREATE DATABASE project;
use project;
CREATE TABLE public (
    id INT AUTO_INCREMENT PRIMARY KEY,
    photo varchar(255),
    aadharcardno BIGINT,
    password varchar(255),
    email varchar(255) default NULL,
    phoneno BIGINT,
    fullName VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50)
)

