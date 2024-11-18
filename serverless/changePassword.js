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

    const { user, password, code } = body

    // Ensure password is strong enough
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-_])[A-Za-z\d!@#$%^&*-_]{8,32}$/;
    if (!passwordRegex.test(password)) {
        return {
            statusCode: 422,
            body: JSON.stringify({ error: 'Password not strong enough.' }),
        };
    }

    // Check if code is valid and matches user id
    try {
        const existingCode = await prisma.achievoResetCode.findFirst({
            where: {
                associatedUserId: user.id,
            },
        })

        if (compareHashed(code, existingCode.code)) {
            // Update password
            const hashedPassword = await hashObject(password);
            await prisma.achievoUser.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashedPassword,
                },
            })

            // Delete code
            await prisma.achievoResetCode.delete({
                where: {
                    id: existingCode.id,
                },
            })

            // Collect existing token
            const existingToken = await prisma.achievoToken.findFirst({
                where: {
                    associated_user_id: user.id,
                },
            })

            // Create JWT for the user session
            const session_token = jwt.sign(
                {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
                jwtSecret,
                { expiresIn: '14d' }
            )

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
                body: JSON.stringify({ message: "Password changed, token updated." }),
            }
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error.', error }),
        };
    }
}