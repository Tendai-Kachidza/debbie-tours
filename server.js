// ================== server.js ==================
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import nodemailer from "nodemailer";

const app = express();
const PORT = 5000;

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== Configure your email credentials =====
// ⚠️ Replace with your own email + app password (from Gmail, Outlook, etc.)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "info@debbietours.com", // your email
    pass: "DebrahTours@2025" // use App Password, not your real password
  }
});

// ===== Route: Handle Inquiries =====
app.post("/api/inquiry", async (req, res) => {
  const { destination, pax, startDate, endDate } = req.body;

  // Validate input
  if (!destination || !pax || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Save locally
  const inquiry = {
    destination,
    pax,
    startDate,
    endDate,
    submittedAt: new Date().toISOString()
  };

  const filePath = "./inquiries.json";
  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  data.push(inquiry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  // ===== Email content =====
  const mailOptions = {
    from: `"Debbie Tours Inquiry" <youremail@gmail.com>`,
    to: "info@debbietours.com", // where inquiries should go
    subject: `New Tour Inquiry - ${destination}`,
    html: `
      <h2>New Tour Inquiry</h2>
      <p><strong>Destination:</strong> ${destination}</p>
      <p><strong>Pax Number:</strong> ${pax}</p>
      <p><strong>Preferred Start Date:</strong> ${startDate}</p>
      <p><strong>Preferred End Date:</strong> ${endDate}</p>
      <hr/>
      <p style="font-size:12px;color:#888;">Sent from Debbie Tours booking page</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Inquiry received and email sent successfully!" });
  } catch (error) {
    console.error("❌ Email failed:", error);
    res.status(500).json({ message: "Inquiry saved but email failed to send." });
  }
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
