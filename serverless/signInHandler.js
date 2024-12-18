const jwt = require('jsonwebtoken');
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

    try {
        // Find user in database
        response = await axios.post(`${HOSTNAME}/achievo_api/verify_login`, { account_identifier, password });

        // check for existing token
        const existingToken = await prisma.achievoToken.findFirst({
            where: {
                associated_user_id: user.id,
            },
        });

        // Create JWT for the user session
        const session_token = jwt.sign(
            {
                username: user.username,
                email: user.email,
                id: user.id,
            },
            jwtSecret,
            { expiresIn: '14d' }
        );

        // If token exists, update it, otherwise create it
        if (existingToken) {
            await prisma.achievoToken.update({
                where: {
                    id: existingToken.id,
                },
                data: {
                    jwt_token: session_token,
                },
            });
        } else {
            // Create token in database
            await prisma.achievoToken.create({
                data: {
                    associated_user_id: user.id,
                    jwt_token: session_token,
                },
            });
        }

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