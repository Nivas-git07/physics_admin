const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const cron = require("node-cron");
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // allow cookies / auth
  })
);

app.use(cors());
app.use(express.json());

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
const JWT_SECRET = "supersecret";

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const checkingemail = await pool.query("SELECT * FROM login WHERE email=$1", [
    email,
  ]);

  if (checkingemail.rows.length > 0) {
    res.status(400).json({ message: "email already exists" });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const formatted = now.toISOString();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingOtp = await pool.query(
      "SELECT * FROM userotp WHERE email=$1",
      [email]
    );

    await pool.query("INSERT INTO login (email, password) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    if (existingOtp.rows.length > 0) {
      await pool.query(
        "UPDATE userotp SET otp=$1, created_at=$2 WHERE email=$3",
        [otp, now, email]
      );
      console.log("OTP updated successfully");
    } else {
      await pool.query(
        "INSERT INTO userotp (email, otp, created_at) VALUES ($1, $2, $3)",
        [email, otp, now]
      );
      console.log("OTP inserted successfully");
    }
    try {
      await axios.post(
        "https://obito231.app.n8n.cloud/webhook/dfc8b298-9d96-4926-af10-6211d0c0ece0",
        {
          email: email,
          otp: otp,
        }
      );
      res.json({ message: "OTP sent to n8n successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send OTP to n8n" });
    }
  } catch (err) {
    console.error("Error inserting OTP:", err.message);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  app.post("/verify", async (req, res) => {
    const { email, checkotp } = req.body;

    try {
      const result = await pool.query(
        "SELECT otp, created_at FROM userotp WHERE email=$1",
        [email]
      );

      if (result.rows.length === 0) {
        return res
          .status(400)
          .json({ message: "OTP not found or already expired" });
      }

      const userOtp = result.rows[0];

      const now = new Date();
      const createdAt = new Date(userOtp.created_at);
      const timeDiff = now - createdAt;

      if (timeDiff > 300000) {
        await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
        return res.status(400).json({ message: "OTP expired" });
      }
      if (userOtp.otp != checkotp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      const userStatus = await pool.query(
        "SELECT status FROM login WHERE email=$1",
        [email]
      );
      if (userStatus.rows[0].status === "ACTIVE") {
        await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
        return res
          .status(201)
          .json({ message: "otp verfied for forget password" });
      } else {
        const registerUser = await pool.query(
          "UPDATE login SET status='ACTIVE' WHERE email=$1",
          [email]
        );
        await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
        return res.status(200).json({ message: "Registration successful" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  console.log("Received email for password reset:", email);

  // Check email exists
  const checkingemail = await pool.query("SELECT * FROM login WHERE email=$1", [
    email,
  ]);

  if (checkingemail.rows[0].status !== "ACTIVE") {
    return res.status(403).json({
      message: "Please register your account first by verifying OTP",
    });
  }

  if (checkingemail.rows.length === 0) {
    return res.status(400).json({ message: "Email does not exist" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const now = new Date();

  try {
    await axios.post(
      "https://obito231.app.n8n.cloud/webhook/dfc8b298-9d96-4926-af10-6211d0c0ece0",
      {
        email: email,
        otp: otp,
      }
    );
    console.log(otp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP to n8n" });
  }

  try {
    const existingOtp = await pool.query(
      "SELECT * FROM userotp WHERE email=$1",
      [email]
    );

    if (existingOtp.rows.length > 0) {
      await pool.query(
        "UPDATE userotp SET otp=$1, created_at=$2 WHERE email=$3",
        [otp, now, email]
      );
    } else {
      await pool.query(
        "INSERT INTO userotp (email, otp, created_at) VALUES ($1, $2, $3)",
        [email, otp, now]
      );
    }

    return res.status(200).json({
      message: "OTP generated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error inserting OTP:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

// app.post("/reset-password", async (req, res) => {
//   const { email, resetotp } = req.body;
//   try {
//     const result = await pool.query(
//       "SELECT otp, created_at FROM userotp WHERE email=$1",
//       [email]
//     );
//     console.log(result.rows[0].otp);
//     console.log(resetotp);

//     const userotp = result.rows[0];
//     const now = new Date();
//     const createdAt = new Date(userotp.created_at);
//     const timeDiff = now - createdAt;

//     if (timeDiff > 300000) {
//       await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
//       return res.status(400).json({ message: "OTP expired" });
//     }
//     if (resetotp != result.rows[0].otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }
//     res.json({ message: "OTP verified successfully" });
//     await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
//   } catch (error) {
//     console.error("Error verifying OTP:", error.message);
//     res.status(500).json({ message: "reset otp error" });
//   }
// });

app.post("/confrom-password", async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email, newPassword);
  const newhashedpassword = await bcrypt.hash(newPassword, 10);
  try {
    await pool.query("UPDATE login SET password=$1 WHERE email=$2", [
      newhashedpassword,
      email,
    ]);

    return res.status(200).json({ message: "Password reset successfully" });
    console.log("Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ message: "password error" });
  }
});

app.post("/api/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Google user payload:", payload);
    const email = payload.email;
    const picture = payload.picture;
    const name = payload.name;
    const id = payload.sub;
    await pool.query(
      "INSERT INTO google_login (email,name,picture,id) VALUES ($1,$2,$3,$4)",
      [email, name, picture, id]
    );
    console.log("Google user saved to database");
  } catch (error) {
    console.error("Error during Google login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//login///
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM login WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const user = result.rows[0];
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated JWT Token:", token);

    if (result.rows[0].status !== "ACTIVE") {
      return res.status(403).json({
        message: "Please register your account first by verifying OTP",
      });
    }

    res.status(200).json({ message: "successful", token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// akash github auth code da pathukoo env file send pandren

const GIT_CLIENT_ID = process.env.GIT_CLIENT_ID;
const GIT_SECRETCLIENT_ID = process.env.GIT_SECRETCLIENT_ID;
const TOKEN_URL = "https://github.com/login/oauth/access_token";
console.log(GIT_CLIENT_ID);
console.log(GIT_SECRETCLIENT_ID);
async function exchangecode(authcode) {
  try {
    const params = {
      client_id: GIT_CLIENT_ID,
      client_secret: GIT_SECRETCLIENT_ID,
      code: authcode,
    };
    const headers = { Accept: "application/json" };
    const authresponse = await axios.post(TOKEN_URL, params, { headers });
    console.log("TOKEN RESPONSE=", authresponse.data);
    const accesstoken = authresponse.data.access_token;
    if (!accesstoken) {
      throw new Error("cannot retrieve git hub account ");
    }
    const userheader = {
      Authorization: `Bearer ${accesstoken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const emailresponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: userheader,
      }
    );
    const userresponse = await axios.get("https://api.github.com/user", {
      headers: userheader,
    });

    const email = emailresponse.data;
    const user = userresponse.data;

    const primaryemail = email.find((e) => e.primary)?.email;
    if (!primaryemail) {
      throw new Error("Cannot retrieve GitHub access token");
    }
    return {
      guid: user.id,
      email: primaryemail,
      name: user.name || user.login,
    };
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

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

app.get("/event", auth, async (req, res) => {
  try {
    const tokenEmail = req.user.email;
    const emails = [tokenEmail];

    console.log(emails);

    const result = await pool.query(
      `SELECT 
         class_name,
         meeting_link,
         start_time,  -- original timestamp for duration
         end_time,    -- original timestamp for duration
         TO_CHAR(start_time, 'HH12:MI PM') AS email_start,  -- display time
         TO_CHAR(end_time, 'HH12:MI PM') AS email_end,      -- display time
         TO_CHAR(start_time, 'DD Mon YYYY') AS email_date   -- display date
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

cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await pool.query(`DELETE FROM gmeet WHERE end_time < NOW()`);
    console.log(
      `Deleted ${
        result.rowCount
      } expired events at ${new Date().toLocaleString()}`
    );
  } catch (err) {
    console.error("Error deleting expired events:", err);
  }
});

app.post("/auth/github", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ detail: "code not recieved from github" });
  }
  try {
    const { guid, email, name } = await exchangecode(code);

    await pool.query(
      `INSERT INTO git_auth (id,name,email) VALUES ($1 , $2 , $3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email`,
      [guid, name, email]
    );

    return res.status(201).json({
      message: "GitHub login successful",
    });
  } catch (err) {
    console.log("failed login");
    return res.status(500).json({
      detail: "Internal server error during GitHub authentication",
      error: err.message,
    });
  }
});

// dei google login da akash

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_SECRETCLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/auth/callback";
const oAuthclient = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
async function exchangegooglecode(authcode) {
  if (!authcode) throw new Error("no code retrieved");

  try {
    const { tokens } = await oAuthclient.getToken({
      code: authcode,
      redirect_uri: REDIRECT_URI,
    });

    if (!tokens) {
      throw new Error("missing id token");
    }
    oAuthclient.setCredentials(tokens);
    const id_token = tokens.id_token;
    const refresh_token = tokens.refresh_token || null;

    const ticket = await oAuthclient.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const user = ticket.getPayload();
    return {
      user_id: user.sub,
      name: user.name,
      email: user.email,
      refresh_token,
    };
  } catch (err) {
    console.log("Google Auth Error:", err.message);
    throw new Error("Google Authentication failed");
  }
}

app.post("/glogin", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "No Google auth code received" });
  }
  try {
    const data = await exchangegooglecode(code);
    const { user_id, name, email, refresh_token } = data;

    await pool.query(
      `INSERT INTO gauth (id, name, email_id, refresh_token)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET refresh_token = EXCLUDED.refresh_token`,
      [user_id, name, email, refresh_token]
    );
    res.status(201).json({
      message: "google login is successfully",
    });
  } catch (error) {
    console.log("Login Error:", error.message);
  }
});

app.get("/home", auth, async (req, res) => {
  const email = req.user.email;
  console.log(email);
  try {
    await pool.query("SELECT email FROM login WHERE email=$1", [email]);
    return res
      .status(200)
      .json({ message: "welcome to the home page", email: email });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
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
app.get("/api/admin/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT login.email, form.name
      FROM login
      LEFT JOIN form ON login.email = form.email
    `);
    res.json({ 
      success: true, 
      users: result.rows 
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to load users" 
    });
  }
});

// 2. DELETE USER BY ID
app.delete("/api/admin/delete-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM login WHERE id = $1 RETURNING email, status",
      [id]
    );

    if (result.rowCount === 0) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "User deleted successfully",
      deletedUser: result.rows[0]
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Database error" 
    });
  }
});

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


app.get("/schedule", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT login.email, form.name
      FROM login
      LEFT JOIN form ON login.email = form.email
    `);

    return res.status(200).json({ users: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});
app.get("/api/forms", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM form ORDER BY created_at DESC");
    res.json({ success: true, forms: result.rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
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

// DELETE form
app.delete("/api/forms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM form WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

cron.schedule("*/2 * * * *", async () => {
  try {
    const result = await pool.query(`DELETE FROM gmeet WHERE end_time < NOW()`);
    console.log(`Deleted ${result.rowCount} expired events at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error("Error deleting expired events:", err);
  }
});



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} `);
});
