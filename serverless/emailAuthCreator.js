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

const passwordResetCodeSenderEmail = async (username, email, userId) => {
    let code
    let generationSuccess = false
    // Prevent infinite loop
    let attempts = 0
    const maxAttempts = 8


    while (attempts <= maxAttempts) {
        // Get new code
        code = emailCodeCreator()

        // Check if code is already stored
        try {
            const existingCode = await prisma.achievoResetCode.findFirst({
                where: {
                    code: code,
                },
            })

            // Start process over if code exists
            if (!existingCode) {
                // Hash code before storing
                

                await prisma.achievoResetCode.create({
                    data: {
                        code: code,
                        associatedUserId: userId,
                    },
                })

                generationSuccess = true

                break
            }
        } catch (error) {
            console.error(error)
        }
        console.log('Attempt number: ' + attempts)
        attempts++
    }

    if (generationSuccess) {
        // Send email
        await transporter.sendMail({
            from: '"Achievo Mailer" <email-services@achievo-timemanager.com>',
            to: email,
            subject: `Achievo password reset for ${username}`,
            text: `Your password reset code: ${code}`,
            html: `<h3>Your password reset code: ${code}</h3>`,
        })

        return code
    } else {
        // Send email alerting use of failure
        await transporter.sendMail({
            from: '"Achievo Mailer" <email-services@achievo-timemanager.com>',
            to: email,
            subject: `Achievo password reset for ${username} failed.`,
            text: `Password Reset Error: We apologize, but we were unable to generate a unique code for your password reset request. Please try again later, 
            or contact our support team for further assistance.`,
            html: `<h3>Password Reset Error: We apologize, but we were unable to generate a unique code for your password reset request. 
            Please try again later, or contact our support team for further assistance.</h3>`,
        })
        return null
    }
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

module.exports = { emailAuthCreator, passwordResetCodeSenderEmail };