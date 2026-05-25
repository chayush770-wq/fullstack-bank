const nodemailer = require("nodemailer");

/* ===== MAIL TRANSPORT ===== */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

/* ===== SEND VERIFY EMAIL ===== */

async function sendVerificationEmail(email, verificationLink) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Verify Your SmartBank Account",

    html: `

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

`,
  });
}

module.exports = {
  sendVerificationEmail,
};
