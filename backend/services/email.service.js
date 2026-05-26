const { google } = require("googleapis");

/* ===== GOOGLE OAUTH CLIENT ===== */

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

/* ===== CREATE RAW EMAIL ===== */

function createRawEmail({ from, to, subject, html }) {
  const message = [
    `From: SmartBank <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/* ===== SEND VERIFY EMAIL ===== */

async function sendVerificationEmail(email, verificationLink) {
  console.log("Sending verification email with Gmail API to:", email);

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const html = `
<div
style="
background:#07111f;
padding:40px;
font-family:Arial;
color:white;
text-align:center;
"
>

<h1
style="
color:gold;
margin-bottom:30px;
"
>
SmartBank
</h1>

<h2>
Welcome 👋
</h2>

<p
style="
color:#cbd5e1;
font-size:18px;
"
>
Your account was created successfully.

Please verify your email to continue.
</p>

<a
href="${verificationLink}"

style="
display:inline-block;
margin-top:30px;
padding:16px 28px;
background:#ffd700;
color:black;
font-weight:bold;
border-radius:12px;
text-decoration:none;
"
>

Verify Account

</a>

<p
style="
margin-top:40px;
font-size:14px;
color:#94a3b8;
"
>

If you did not create this account,
ignore this email.

</p>

</div>
`;

  const raw = createRawEmail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your SmartBank Account",
    html,
  });

  const result = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
    },
  });

  console.log("Verification email sent with Gmail API:", result.data.id);
}

module.exports = {
  sendVerificationEmail,
};
