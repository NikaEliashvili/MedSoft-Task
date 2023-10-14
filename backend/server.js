const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "patientsDB",
  database: "patientsdb",
  password: "patientsDB",
});

app.get("/", (req, res) => {
  return res.json("From Backend Side");
});

app.get("/patients", (req, res) => {
  const sql = "SELECT * FROM patients";
  connection.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/patients", (req, res) => {
  console.log("Sending...", req.body);
  const { FullName, Dob, GenderID, Phone, Address, PersonalNumber, Email } =
    req.body;
  const sql =
    "INSERT INTO patients (FullName, Dob, GenderID, Phone, Address, PersonalNumber, Email) VALUES (?,?,?,?,?,?,?)";

  connection.query(
    sql,
    [FullName, Dob, GenderID, Phone, Address, PersonalNumber, Email],
    (err, result) => {
      if (err) {
        console.error("Error adding patientd:", err);
        res.status(500).json({ error: "Error adding patientd" });
      } else {
        res.status(201).json({
          message: "Patient added successfully",
          patientId: result.insertId,
        });
      }
    }
  );
});

app.delete("/patients/:id", (req, res) => {
  const patientId = req.params.id;

  const sql = "DELETE FROM patients WHERE ID = ?";
  connection.query(sql, [patientId], (error, result) => {
    if (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ error: "Error deleting patient" });
    } else {
      console.log(`Deleted patient with ID ${patientId}`);
      res
        .status(200)
        .json({ message: `Patient with ID ${patientId} deleted successfully` });
    }
  });
});
app.put("/patients", async (req, res) => {
  const updatedPatients = req.body;
  const successMessages = [];

  for (const patient of updatedPatients) {
    const {
      ID,
      FullName,
      Dob,
      GenderID,
      Phone,
      Address,
      PersonalNumber,
      Email,
    } = patient;

    const sql =
      "UPDATE patients SET FullName=?, Dob=?, GenderID=?, Phone=?, Address=?, PersonalNumber=?, Email=? WHERE ID=?";

    try {
      await new Promise((resolve, reject) => {
        connection.query(
          sql,
          [FullName, Dob, GenderID, Phone, Address, PersonalNumber, Email, ID],
          (err, result) => {
            if (err) {
              console.error("Error updating patient:", err);
              reject(err);
            } else {
              successMessages.push(
                `Patient with ID ${ID} updated successfully`
              );
              resolve(result);
            }
          }
        );
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating patients" });
      return;
    }
  }

  res.status(200).json({ messages: successMessages });
});

app.listen(8080, () => {
  console.log("Listening");
});
