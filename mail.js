import nodemailer from "nodemailer";

// Create transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "efenteng1@gmail.com",
    pass: "hrzc cuih sssd ttja",
  },
});

// Define mail
let mailOptions = {
  from: '"Test Mailer" <efenteng1@gmail.com>',
  to: "justicefenteng33@gmail.com",
  subject: "Hello from Node.js",
  text: "This is a test email sent from Nodemailer!",
};

// Send
transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    return console.log("Error:", err);
  }
  console.log("Email sent:", info.response);
});

// Request reset
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user)
    return res.json({ message: "If the email exists, a code has been sent" });

  const rawCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  const codeHash = sha256hex(rawCode);
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await db.query(
    "UPDATE users SET reset_code_hash=?, reset_expires=? WHERE id=?",
    [codeHash, expires, user.id]
  );

  await sendEmail(user.email, `Your reset code is: ${rawCode}`);

  res.json({ message: "If the email exists, a code has been sent" });
});

// Verify + set new password
app.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await findUserByEmail(email);
  if (!user || !user.reset_code_hash)
    return res.status(400).json({ error: "Invalid" });

  if (new Date() > user.reset_expires)
    return res.status(400).json({ error: "Code expired" });

  if (sha256hex(code) !== user.reset_code_hash)
    return res.status(400).json({ error: "Invalid code" });

  const hash = await bcrypt.hash(newPassword, 12);
  await db.query(
    "UPDATE users SET password_hash=?, reset_code_hash=NULL, reset_expires=NULL WHERE id=?",
    [hash, user.id]
  );

  res.json({ message: "Password updated" });
});
