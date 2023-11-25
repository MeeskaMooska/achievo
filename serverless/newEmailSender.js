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

// Send email to new email address
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

    const { email, username } = body

    // Send email
    await transporter.sendMail({
        from: '"Achievo Mailer" <email-services@achievo-timemanager.com>',
        to: email,
        subject: `Congratulations! email changed for ${username}!`,
        text: `Congratulations! Your email was changed!`,
        html: `<h1>Congratulations!</h1>
        <p>Your email was changed!</p>`,
    })

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email sent.' }),
    }
}
