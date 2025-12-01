const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cron = require("node-cron");
const cors = require("cors");
const { Pool } = require("pg");
const axios = require("axios");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const JWT_SECRET = "supersecret";
const jwt = require("jsonwebtoken");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });

function mergeDateAndTime(dateStr, timeStr) {
  const [day, month, year] = dateStr.split("/");
  let [time, modifier] = timeStr.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (modifier.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (modifier.toUpperCase() === "AM" && hour === 12) hour = 0;

  return new Date(year, month - 1, day, hour, minute);
}

function formatTime(dateObj) {
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatDate(dateObj) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return dateObj.toLocaleDateString("en-GB", options); // 28 Nov 2025
}

app.post("/form", async (req, res) => {
  const {
    name,
    birthdate,
    gender,
    currentaddress,
    phoneno,
    email,
    parentname,
    relationship,
    parentphoneno,
    parentemail,
    CurrentSchool,
    currentgrade,
    course,
    classtime,
    classmode,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO form (name,birthdate,gender,currentaddress,phoneno,email,parentname,relationship,parentphoneno,parentemail,CurrentSchool,currentgrade,course,classtime,classmode) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)",
      [
        name,
        birthdate,
        gender,
        currentaddress,
        phoneno,
        email,
        parentname,
        relationship,
        parentphoneno,
        parentemail,
        CurrentSchool,
        currentgrade,
        course,
        classtime,
        classmode,
      ]
    );
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (err) {
    console.error("Error inserting form data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/gmeet", async (req, res) => {
  try {
    const { email, class_name, date, start, end } = req.body;
    const startDateObj = mergeDateAndTime(req.body.date, req.body.start);
    const endDateObj = mergeDateAndTime(req.body.date, req.body.end);
    const emailStart = formatTime(startDateObj);
    const emailEnd = formatTime(endDateObj);
    const emailDate = formatDate(startDateObj);
    console.log("Node Server Time:", new Date().toString());


    // 1️⃣ Validate input
    if (!email || !class_name || !start || !end) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!Array.isArray(email)) {
      return res.status(400).json({ message: "Email must be an array" });
    }

    // 2️⃣ Send request to N8N webhook
    const n8nResponse = await axios.post(
      "https://obito231.app.n8n.cloud/webhook/ae9ad352-7baa-4b8b-a65b-f6d15f2b7f69",
      {
        email,
        class_name,
        start: startDateObj.toISOString(),
        end: endDateObj.toISOString(),
        emailStart,
        emailEnd,
        emailDate,
      }
    );
    console.log(emailStart, emailEnd, emailDate);

    // 3️⃣ Extract meeting link and other info from N8N response

    const responseData = n8nResponse.data;
    console.log("Emails:", email);
    console.log("N8N Full Response:", n8nResponse);
    console.log("N8N Response Data:", responseData);
    const emailArray = email;

    await pool.query(
      "INSERT INTO gmeet (emails, class_name, start_time, end_time, meeting_link,email_start,email_end,email_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        emailArray,
        class_name,
        startDateObj,
        endDateObj,
        responseData.meetingLink,
        emailStart,
        emailEnd,
        emailDate,
      ]
    );
    console.log("Event details saved to database");

    return res.status(200).json({
      message: "Event sent to N8N successfully",
      meetingLink: responseData.meetingLink || null, // Google Meet link   // Calendar event link
      n8nResponse: responseData, // Full N8N response if needed
    });
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Error sending request",
      error: error.response?.data || error.message,
    });
  }
});

cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await pool.query(`DELETE FROM gmeet WHERE end_time < NOW()`);
    console.log(`Deleted ${result.rowCount} expired events at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error("Error deleting expired events:", err);
  }
});



function auth(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/event",auth, async (req, res) => {
  try {
    const { emails } = req.user.email;

    console.log(emails); // emails array
    if (!emails || emails.length === 0)
      return res.status(400).json({ message: "Email is required" });

    const result = await pool.query(
      `SELECT class_name, meeting_link, email_start, email_end, email_date
       FROM gmeet
       WHERE emails && $1::text[]
       ORDER BY start_time`,
      [emails]
    );

    return res.json({ events: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
