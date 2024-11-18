// TODO: Add error handling for when email is already in use
// TODO: Add error handling for when password is incorrect
// TODO: Add functionality to remove previous email revert extension from database after six months
// BUG: Emails both get sent to new email lol.

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

    const { userId, email, password } = body

    // Get stored password
    let user = {}
    try {
        user = await prisma.achievoUser.findUnique({
            where: {
                id: userId,
            }
        })

        // Check if password matches
        if (!await compareHashed(password, user.password)) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Incorrect password.' }),
            }
        }
    } catch (error) {
        console.error('Error retrieving user: ', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error retrieving user.', error }),
        }
    }

    // Update email
    try {
        await prisma.achievoUser.update({
            where: {
                id: userId,
            },
            data: {
                email: email,
            }
        })
    } catch (error) {
        console.error('Error updating email: ', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error updating email.', error }),
        }
    }

    // Return response
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email changed successfully.' }),
        }
    } catch (error) {
        console.error('Error sending email to prior email address: ', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending email to prior email address.', error }),
        }
    }
}