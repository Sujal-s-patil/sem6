const db = require("./sql");

const criminalRegister = async (req, res) => {
    const data = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    db.query(`select * from criminal_records WHERE name='${data.name}' and aadhar_card=${data.aadhar_card}`, (error, results) => {
        if (error) {
            console.error(error);
            return res.json({ error: "Error occurred while checking user existence" });
        }
        if (results == 0) {
            const placeholders = keys.map(() => '?').join(',');
            const query = `INSERT INTO criminal_records (${keys.join(',')}) VALUES (${placeholders})`;
            db.query(query, values, (error, Results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Error occurred while inserting user" });
                } else { res.json({ message: "success" }); }
            });
        } else {
            res.json({ message: 'already registered' });
        }
    })
}

const criminalRecords = async (req, res) => {
    db.query(`SELECT * FROM criminal_records`, (error, results) => {
        if (error) {
            res.json({ error: error })
        } else {
            res.json(results);
        }
    })
}


const criminal_list = async (req, res) => {
    const data = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((key) => `${key} = ?`).join(' AND ');
    const query = `SELECT * FROM criminal_records WHERE ${placeholders} ;`;
    db.query(query, values, (error, results) => {
        if (error) {
            res.json({ error: error })
        } else {
            res.json(results);
        }
    })
}

module.exports = {
    criminalRegister,
    criminalRecords,
    criminal_list
}
