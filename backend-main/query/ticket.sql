CREATE TABLE ticket (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    complainant_name VARCHAR(100) NOT NULL,
    public_id int,
    FOREIGN KEY (public_id) REFERENCES public(id) ,
    crime_type VARCHAR(50) NOT NULL,
    crime_description TEXT NOT NULL,
    crime_location VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    crime_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    date_filed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
