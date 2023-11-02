# NestJS Full Authentication Service

This is a NestJS-based authentication service that provides features like registration, OTP verification, login, token authentication, update profile, forgot password, account suspend and account recovery and google login.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js: Make sure you have Node.js installed. You can download it [here](https://nodejs.org/).

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/vishal9044singh/nest-auth.git
   

2. Install dependencies:

cd nest-auth-service
npm install

3. Configure your environment variables as described in the Configuration section.

4. Start the application: npm start auth-service

Your NestJS authentication service should now be up and running.

5. Project Structure
The project structure follows the standard NestJS application structure. Here are the key directories:

apps: Contains all services inside this project.
src: Contains the main source code of the application.
src/auth: Authentication-related modules and services.
src/auth/schemas: Two schemas for users and otp.
src/auth/utils: Shared files like password decryption, google strategy and mobile number validator.
/shared: Shared utilities like mail service.
src/config: Configuration files.

6. Configuration
You'll need to set up some environment variables to configure your authentication service. Create a .env file in the root directory and define the following variables:

AUTH_PORT = 3001
JWT_SECRET = '' (whatever secret key you want to use for token)
DB_PORT = 27017
DB_HOST = 'localhost'
GOOGLE_CLIENT_ID = '' (setup a google console account and generate client id and secret key for google login)
GOOGLE_SECRET = ''

7. Endpoints
Here are some of the key endpoints provided by this authentication service:

POST /auth/register: Register a new user.
POST /auth/verify-otp: Verify OTP for registration.
POST /auth/login: Login and receive an access token.
POST /auth/forgotPassword: Request a password reset otp.
POST /auth/accountSuspend: Delete user's account temporarily.
......
For a complete list of endpoints, check the source code from authController.

Authentication
This service uses JSON Web Tokens (JWT) for authentication. When a user logs in, they receive an access token, which should be included in the Authorization header for protected routes. For example:

Authorization: Bearer <access_token>

8. Contributing
Feel free to contribute to this project by opening issues, submitting pull requests, or suggesting improvements. We welcome your contributions!

9. Contact
If you have any questions or need assistance with this project, feel free to contact:

Email - vishal9044singh@gmail.com
Project Repository: https://github.com/vishal9044singh/nest-auth.git

License
This project is licensed under the MIT License. See the LICENSE file for details.

This is a basic `README.md` template for a NestJS-based authentication service project. Customize it further to match the specific features and details of your project. Additionally, consider adding API documentation or references to relevant resources to help users understand how to use the service.
