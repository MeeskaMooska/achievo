const { PrismaClient } = require('@prisma/client');
const { hashObject } = require('./hashHandler');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET
const nodemailer = require("nodemailer");
const { env } = require("process");


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

// Send email
const resetCodeSender = async (username, email, userId) => {
    let code
    let generationSuccess = false

    // Prevent infinite loop
    let attempts = 0
    const maxAttempts = 8

    // Check if user already has a code
    // if code is older than 1 minute, delete it and generate a new one
    try {
        const userCodeExists = await prisma.achievoResetCode.findFirst({
            where: {
                associatedUserId: userId,
            },
        })

        if (userCodeExists) {
            const codeAge = Date.now() - userCodeExists.timeStamp

            if (codeAge > 60000) {
                await prisma.achievoResetCode.delete({
                    where: {
                        id: userCodeExists.id,
                    },
                })
            } else {
                return null
            }
        }
    } catch (error) {
        console.error(error)
        return error
    }

    // Generate and store unique code
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
                hashedCode = await hashObject(code)

                // Store code
                await prisma.achievoResetCode.create({
                    data: {
                        code: hashedCode,
                        associatedUserId: userId,
                    },
                })

                generationSuccess = true

                break
            }
        } catch (error) {
            console.error(error)
        }

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

// Create code
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

exports.handler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (parseError) {
        console.error('Invalid JSON format: ', parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'JSON Error.', parseError }),
        };
    }

    const { email } = body

    try {
        const user = await prisma.achievoUser.findUnique({
            where: {
                email: email,
            },
        })

        if (user) {
            await resetCodeSender(user.username, user.email, user.id)

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Email found.', user: user }),
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email not found.' }),
            };
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error.', error }),
        };
    }
}
