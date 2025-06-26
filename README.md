# ATS Project - Employer Authentication and Application Management

## Overview

This project implements authentication systems for both employers (admins) and regular users, along with job application management including resume and cover letter uploads.

## Features

### Employer Authentication
- Employer registration with hashed passwords.
- Employer login with JWT token generation.
- Role-based access control using JWT tokens.
- Authentication middleware to protect routes and verify employer roles.

### User Authentication
- User registration with hashed passwords.
- User login with JWT token generation.
- Authentication middleware to protect user routes.

### Job Applications
- Submit applications with resume and cover letter file uploads.
- Validation of inputs using Joi.
- Duplicate application prevention.
- Retrieve applications by job ID with resume and cover letter paths included.

## API Endpoints

### Employer Routes
- `POST /employer/register-employer` - Register a new employer.
- `POST /employer/login-employer` - Login an employer.

### User Routes
- `POST /user/register` - Register a new user.
- `POST /user/login` - Login a user.

### Application Routes
- `POST /application/:jobId` - Submit an application with resume and cover letter files.
- `GET /application/job/:jobId` - Get applications for a job (employer only).
- `GET /application/my` - Get applications submitted by the logged-in user.

## Validation

- Input validation is performed using Joi schemas.
- Validation errors return HTTP 400 with descriptive messages.

## Error Handling

- Proper HTTP status codes are used (200, 201, 400, 401, 403, 404, 409, 500).
- Repeated error handling logic is refactored for maintainability.

## Testing Recommendations

- Test employer and user registration and login flows, including validation errors.
- Test protected routes with and without valid JWT tokens.
- Test application submission with valid and invalid files.
- Test retrieval of applications ensuring resume and cover letter paths are included.

## Setup

- Ensure environment variables include `JWT_SECRET`.
- Use a tool like Postman to test API endpoints.
- Serve uploaded files statically if needed for access.

## Notes

- Employer model includes a `role` field defaulting to "employer" for role-based access control.
- Application model stores file paths for resume and cover letter.
