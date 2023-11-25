const nodemailer = require("nodemailer");
const { env } = require("process");
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

exports.handler = async (event) => {
    // Attempt to parse json body
    let body
    try {
        body = JSON.parse(event.body)
    } catch (parseError) {
        console.error('Invalid JSON format: ', parseError)
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'JSON Error.', parseError }),
        }
    }

    const { userId, email, username } = body

    // Generate random extension
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    const length = 16;
    let extension = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        extension += characters.charAt(randomIndex);
    }

    // Send email
    await transporter.sendMail({
        from: '"Achievo Mailer" <email-services@achievo-timemanager.com>',
        to: email,
        subject: `Achievo email changed for ${username}!`,
        text: `Your email was changed! if this was not done on purpose follow the link to revert ${env.SITE_URL}verify/revert/${extension}`,
        html: `<h1>Email changed!</h1>
        <p>Your email was changed! if this was not done on purpose follow the link to revert</p>
        <a href="${env.SITE_URL}verify/revert/${extension}">here</a>`,
    })

    // Add extension to database
    await prisma.achievoEmailExtension.create({
        data: {
            extension: extension,
            user_id: userId,
            isRevert: true,
        }
    })

    // Create JWT for the user session
    const session_token = jwt.sign(
        {
            username: username,
            email: email,
            id: userId,
        },
        jwtSecret,
        { expiresIn: '14d' }
    )

    // Create token in database
    await prisma.achievoToken.update({
        where: {
            associated_user_id: userId,
        },
        data: {
            jwt_token: session_token,
        },
    })

    // Create cookie
    const user_session_cookie = `user_session_token=${session_token}; HttpOnly; Secure; SameSite=Strict; Path=/;`;

    // Return response
    return {
        statusCode: 200,
        headers: {
            'Set-Cookie': user_session_cookie,
        },
        body: JSON.stringify({ message: 'Email changed.'}),
    }
}