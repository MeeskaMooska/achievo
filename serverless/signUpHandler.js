// Sign up handler function Version - 1.0
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

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const HOSTNAME = process.env.HOSTNAME;
//const { emailAuthCreator } = require('./authCreater');
const axios = require('axios');

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

	try {
		try {
			let user_id;

			await axios.post(`${HOSTNAME}/achievo_api/add_user`, {username, password, email})
				.then(response => {
					console.log(response.data);
					user_id = response.data.user_id;
					console.log("*" * 100);
				})
				.catch(error => {
					if (error.response) {
						console.error('Error: ' + error.response.data.error);
						console.error('Status: ' + error.response.status);
					} else if (error.request) {
						console.error('Error recieving response: ' + error.request);
					}

					return {
						statusCode: 400,
						body: JSON.stringify({ error: 'Error creating user.', error }),
					};
				})

			// Generate JWT token
			// Default expiration is two weeks
			const session_token = jwt.sign(
				{
					username: username,
					email: email,
					id: user_id,
				},
				jwtSecret,
				{ expiresIn: '14d' }
			);

			// Create token in database
			await axios.post(`${HOSTNAME}/achievo_api/store_token`, {user_id, access_token: session_token})
				.then(response => {
					console.log(response.data);
				})
				.catch(error => {
					if (error.response) {
						console.error('Error: ' + error.response.data.error);
						console.error('Status: ' + error.response.status);
					} else if (error.request) {
						console.error('Error recieving response: ' + error.request);
					}

					return {
						statusCode: 400,
						body: JSON.stringify({ error: 'Error creating user token.', error }),
					};
				})

			// Create cookie
			const user_session_cookie = `user_session_token=${session_token}; HttpOnly; Secure; SameSite=Strict; Path=/;`;

			/*
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
			*/

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