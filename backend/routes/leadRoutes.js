const express = require("express");
const router = express.Router();

const db = require("../db");


// GET ALL LEADS

router.get("/", (req, res) => {

  const sql = "SELECT * FROM leads";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});


// ADD LEAD

router.post("/", (req, res) => {

const {
name,
email,
source,
followup_date
} = req.body;

const sql =
`
INSERT INTO leads
(name,email,source,followup_date)
VALUES(?,?,?,?)
`;

db.query(
sql,
[
name,
email,
source,
followup_date
],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json({
message:
"Lead Added Successfully"
});

});

});


// UPDATE LEAD

router.put("/:id", (req,res)=>{

const {
status,
notes,
followup_date
}=req.body;

const sql=
`
UPDATE leads
SET
status=?,
notes=?,
followup_date=?
WHERE id=?
`;

db.query(
sql,
[
status,
notes,
followup_date,
req.params.id
],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json({
message:
"Lead Updated Successfully"
});

});

});


// DELETE LEAD

router.delete("/:id", (req, res) => {

  const sql =
    "DELETE FROM leads WHERE id=?";

  db.query(
    sql,
    [req.params.id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Lead Deleted Successfully"
      });

    }
  );

});

module.exports = router;