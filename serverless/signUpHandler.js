/*
things this function needs to do:

1. check if user already exists -done
  1.1 check if username exists -done
  1.2 check if email exists -done

2. if user doesn't exist, create user -done
  2.001 check if password is valid -done
  2.01 encrypt password before storing in db -done

3 generate user token
  3.1 store user token in db -done
  3.2 return user token to client -done

4. call function that will send an email to user to verify email address
*/

/*
things to change when reusing this function:

  1. change prisma model names to specific project
  2. ensure prisma fields match client fields

*/

const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('./passwordHasher');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;
const { emailAuthCreator } = require('./emailAuthCreator');

exports.handler = async (event) => {

	// Attempt to parse json body
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

	const { username, password, email } = body;

	// ---Checking for user existence---
	// Returns true if username exists
	const usernameExists = async (username) => {
		const user = await prisma.achievoUser.findUnique({
			where: {
				username: username,
			},
		});
		return !!user; // Returns true if username exists
	};

	// Returns true if email exists
	const emailExists = async (email) => {
		const user = await prisma.achievoUser.findUnique({
			where: {
				email: email,
			},
		});
		return !!user; // Returns true if email exists
	}

	try {
		// Duplicate username found
		if (await usernameExists(username)) {
			return {
				statusCode: 409,
				body: JSON.stringify({ error: 'Username already in use.' }),
			}
		}

		// Duplicate email found
		if (await emailExists(email)) {
			return {
				statusCode: 409,
				body: JSON.stringify({ error: 'Email already in use' }),
			}
		}
	} catch (databaseQueryError) {
		console.error('Error during database query.', databaseQueryError);
		return {
			statusCode: 500,
			body: JSON.stringify({ databaseQueryError: 'Error during database query.', databaseQueryError }),
		};
	}

	// ---User doesn't exist---
	// Checks password strength
	// Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-_])[A-Za-z\d!@#$%^&*-_]{8,}$/;
	if (!passwordRegex.test(password)) {
		return {
			statusCode: 422,
			body: JSON.stringify({ error: 'Password Error: not strong.' }),
		};
	}

	try {
		const hashedPassword = await hashPassword(password);
		try {
			const newUser = await prisma.achievoUser.create({
				data: {
					username,
					password: hashedPassword,
					email,
				},
			});

			// Generate JWT token
			// Default expiration is two weeks
			const session_token = jwt.sign(
				{
					username: newUser.username,
					email: newUser.email,
					id: newUser.id,
				},
				jwtSecret,
				{ expiresIn: '14d' }
			);

			// Create token in database
			try {
				await prisma.achievoToken.create({
					data: {
						associated_user_id: newUser.id,
						jwt_token: session_token,
					},
				});
			} catch (createTokenError) {
				console.error(createTokenError)
				return {
					statusCode: 500,
					body: JSON.stringify({ message: 'Error creating token.', error: createTokenError }),
				};
			}

			// Create cookie
			const user_session_cookie = `user_session_token=${session_token}; HttpOnly; Secure; SameSite=Strict; Path=/;`;

			// Send email to user to verify email address
			try {
				emailVerificationExtension = await emailAuthCreator(username, email)
				await prisma.achievoEmailExtension.create({
					data: {
						extension: emailVerificationExtension,
						email,
						user_id: newUser.id,
					},
				});
			} catch (emailAuthError) {
				console.error(emailAuthError)
				return {
					statusCode: 500,
					body: JSON.stringify({ message: 'Error sending email verification.', error: emailAuthError }),
				};
			}


			// User account was successfully created
			return {
				statusCode: 201,
				headers: {
					'Set-Cookie': user_session_cookie,
				},
				body: JSON.stringify({ message: 'User created successfully | user session token set as cookie.' }),
			};
		} catch (createUserError) {
			// User account failed to create
			return {
				statusCode: 500,
				body: JSON.stringify({ error: 'An error occurred while creating the user.', createUserError }),
			};
		}
	} catch (hashError) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Error hashing password.', hashError }),
		};
	}
}