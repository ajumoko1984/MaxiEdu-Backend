# MaxiEdu Backend API

MaxiEdu is a comprehensive school management system providing integrated modules for managing schools, students, teachers, classes, attendance, results, and more. The platform supports multiple schools with role-based access control and secure authentication.

## Table of Contents

- [Modules](#modules)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [NPM Commands](#npm-commands)

## Modules

### Authentication Module
Handles registration, login, and user authentication for all roles. Manages sessions, password recovery, and profile updates securely using JWT.

### Super Admin Module
Manages all schools across the platform. Handles creation, updates, deletions, and system-wide analytics.

### School Admin Module
Controls school-specific operations including teachers, students, subjects, classes, dorms, and transport management.

### Teacher Module
Provides tools for class management, attendance marking, material uploads, and CBT creation.

### Student Module
Allows students to view results, attendance, materials, and participate in online classes and CBTs.

### Attendance Module
QR-based and manual attendance tracking with comprehensive reporting.

### ID Card Generator Module
Generates digital/printable ID cards for students and teachers.

### File Upload Module
Handles educational resource uploads and management.

### Result Module
Comprehensive result management and reporting system.

### Payment Module
Online fee payment processing and transaction management.

### Online Class Module
Virtual classroom scheduling and management.

### CBT Module
Computer-Based Testing system for assessments.

### Settings Module
Profile and institutional settings management.
- [Contributing](#contributing)
- [License](#license)


## Prerequisites

Before running this project, ensure you have the following prerequisites:

- Node.js v20+
- MongoDB (for user and school data)
- TypeScript 5.x
- Environment supporting JWT and file uploads

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/maxiedu-backend.git
   ```

2. Install dependencies:

   ```bash
   cd maxiedu-backend
   npm install
   ```

3. Configure environment:

   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your:
   - Database connection
   - JWT secrets
   - Storage settings
   - Email configuration
   - Payment gateway keys

4. Start development server:

   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

```
POST /auth/register-super-admin   # Create super admin (initial setup)
POST /auth/login                 # Login for all users
POST /auth/logout                # Logout current session
POST /auth/forgot-password       # Send reset link
POST /auth/reset-password        # Reset user password
GET  /auth/profile              # Get user profile
PUT  /auth/profile              # Update user profile
```

### Super Admin Endpoints

```
GET    /super-admin/schools      # List all schools
POST   /super-admin/schools      # Create new school
GET    /super-admin/schools/:id  # Get school details
PUT    /super-admin/schools/:id  # Update school info
DELETE /super-admin/schools/:id  # Delete a school
GET    /super-admin/overview     # Platform-wide stats
```

### School Admin Endpoints

```
GET  /school/dashboard           # School admin dashboard
POST /school/teachers           # Add a teacher
GET  /school/teachers           # List teachers
POST /school/students           # Add student
GET  /school/students           # List all students
POST /school/classes            # Create class
POST /school/subjects           # Add subject
POST /school/dorms              # Add dorm
POST /school/transport          # Add transport route
```

For complete API documentation including request/response examples, visit our [API Documentation](https://api-docs.maxiedu.com).

## NPM Commands

- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server
- `npm run build`: Build TypeScript code
- `npm test`: Run test suite
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
