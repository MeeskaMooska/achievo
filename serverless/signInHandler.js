const { PrismaClient } = require('@prisma/client');
const { comparePassword } = require('./passwordHasher');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

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

    const { account_identifier, password } = body;

    const sign_in_method = account_identifier.includes('@') ? 'email' : 'username';

    try {
        const user = await prisma.achievoUser.findUnique({
            where: {
                [sign_in_method]: account_identifier,
            },
        });
    
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Username or email not found.' }),
            };
        }

        // Check if password matches
        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Incorrect password.' }),
            };
        }

        // check for existing token
        const existingToken = await prisma.achievoToken.findFirst({
            where: {
              associated_user_id: user.id,
            },
        });
          
        // delete existing token
        if (existingToken) {
            await prisma.achievoToken.delete({
              where: {
                id: existingToken.id,
              },
            });
        }

        // Create JWT for the user session
        const session_token = jwt.sign(
            {
                username: user.username,
                email: user.email,
            },
            jwtSecret,
            { expiresIn: '14d' }
        );

        // Create cookie
        const user_session_cookie = `user_session_token=${session_token}; HttpOnly; Secure; SameSite=Strict; Path=/;`;

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': user_session_cookie,
            },
            body: JSON.stringify({ message: "Sign in successfull." }),
        };
    } catch (signInError) {
        console.error('There was an error signing in.', signInError);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'There was an error signing in.', signInError }),
        };
    }
}