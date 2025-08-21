import  nodemailer  from "nodemailer";

export async function  sendEmail({to,subject,text,html}={to: "",subject:"Saraha App",text:"",html:""}) {
    const transporter = nodemailer.createTransport({
service:"gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from: `"Saraha " ${process.env.GMAIL_EMAIL}`,
    to,
    subject,
    text, // plain‑text body
    html, // HTML body
  });
  console.log(info.messageId);
  


})();
}