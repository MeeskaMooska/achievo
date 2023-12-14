const { PrismaClient } = require('@prisma/client');
const { hashObject } = require('./hashHandler');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET
const nodemailer = require("nodemailer");
const { env } = require("process");
const { emailCodeCreator } = require('./authCreater');


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
    const code = emailCodeCreator()

    // Check if user has code
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

    // Generate code (doesn't need to be unique)
    try {
        // Hash code before storing
        hashedCode = await hashObject(code)

        // Store code
        await prisma.achievoResetCode.create({
            data: {
                code: hashedCode,
                associatedUserId: userId,
            },
        })
    } catch (error) {
        console.error(error)
        return error
    }

    // Send email
    await transporter.sendMail({
        from: '"Achievo Mailer" <email-services@achievo-timemanager.com>',
        to: email,
        subject: `Achievo password reset for ${username}`,
        text: `Your password reset code: ${code}`,
        html: `<h3>Your password reset code: ${code}</h3>`,
    })

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
