const nodemailer = require("nodemailer");
const { env } = require("process");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create transporter
const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
        user: env.EMAIL_ACCOUNT,
        pass: env.EMAIL_PASSWORD,
    },
})

const emailAuthCreator = async (username, email) => {
    // Generate random extension
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    const length = 32;
    let extension = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        extension += characters.charAt(randomIndex);
    }

    // Send email
    await transporter.sendMail({
        from: '"Achievo Mailer" <email-services@achievo-timemanager.com>',
        to: email,
        subject: `Achievo email verification for ${username}`,
        text: `Click the link to verify your email: ${env.SITE_URL}verify/${extension}`,
        html: `<h1>Verify email: <a href="${env.SITE_URL}verify/${extension}">here</a></h1>`,
    });

    return extension;
}

const emailCodeCreator = () => {
    // Generate random password reset code
    const characters = '0123456789';
    const length = 6;
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code
}

module.exports = { emailAuthCreator, emailCodeCreator };