const db = require("./sql.js");
const bcrypt = require('bcrypt');

const publicRegister = async (req, res) => {
    const data = req.body;
    const password = data.password;
    data.password=bcrypt.hashSync(password, 10);

    const keys = Object.keys(data);
    const values = Object.values(data);
    // Check if the user already exists based on the aadharcardno
    db.query(`SELECT * FROM public WHERE aadharcardno = ?`, [data.aadharcardno], (error, results) => {
        if (error) {
            console.error(error);
            return res.json({ error: "Error occurred while checking user existence" });
        }

        if (results.length === 0) {
            // User does not exist, proceed with the insertion
            const placeholders = keys.map(() => '?').join(',');
            const query = `INSERT INTO public (${keys.join(',')}) VALUES (${placeholders})`;

            db.query(query, values, (error, Results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Error occurred while inserting user" });
                } else { res.json({ message: "success" }); }
            });
        } else {
            // User already exists
            res.json({ message: "user already exists" });
        }
    });
};


const publicLogin = async (req, res) => {
    const data = req.body;
    db.query(`select * from public where aadharcardno = ?`, [data.aadharcardno], (error, results) => {
        if (results.length === 0) {
            res.json({message:"username does not exist"});
        } else {
            const password = results[0].password;
            if (bcrypt.compareSync(data.password, password)) {
                results={...results,"message":"Login successful"};
                res.json(results);
            } else {
                res.json({message:"incorrect password"});
            }
        }
    })
}


module.exports = {
    publicRegister,
    publicLogin
}

