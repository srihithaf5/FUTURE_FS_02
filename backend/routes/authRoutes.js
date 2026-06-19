const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
    "SELECT * FROM admins WHERE email=? AND password=?";

    db.query(
        sql,
        [email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length > 0) {

                return res.json({
                    success: true,
                    message: "Login Successful"
                });

            }

            res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });

        }
    );

});

module.exports = router;