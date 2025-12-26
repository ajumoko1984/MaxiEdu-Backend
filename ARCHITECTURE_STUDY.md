# MaxiEdu Backend - Architecture & Code Structure Study

## 🏗️ Project Structure Overview

```
src/
├── app.ts                          # Express app setup with middleware
├── env.ts                          # Environment variables schema (Zod)
├── config/
│   ├── constants.ts                # HTTP_CODES, Namespaces
│   ├── data-source.ts              # TypeORM database connection
│   ├── env.config.ts               # Environment variables loaded
│   └── swagger.ts                  # Swagger/OpenAPI docs
├── controllers/
│   └── auth.controller.ts          # Business logic
├── dtos/
│   └── users.dto.ts                # Data Transfer Objects
├── entities/
│   └── user.entity.ts              # TypeORM Entity with validators
├── enums/
│   └── role.enum.ts                # User roles
├── helpers/
│   └── auth.helper.ts              # Auth helper functions
├── interfaces/
│   └── users.interface.ts          # TypeScript interfaces
├── middleware/
│   ├── auth.middleware.ts          # JWT authentication
│   └── fileUploader.middleware.ts  # File upload with multer
├── models/
│   └── labFile.model.ts            # Lab file model
├── repository/
│   └── users.repository.ts         # Database queries
├── routes/
│   ├── auth.route.ts               # Auth endpoints
│   └── index.ts                    # Route binding
├── schema/
│   └── auth.schema.ts              # Joi validation schemas
├── servers/
│   └── server.ts                   # Server startup
├── types/
│   └── index.ts                    # Global type definitions
└── utils/
    ├── index.ts                    # Helper utilities
    ├── jwt.ts                      # JWT token generation
    ├── logger.ts                   # Winston logger
    ├── apiQuery.ts                 # Query builder for filtering/sorting/pagination
    ├── mongooseApiQuery.ts         # Mongoose version
    └── response-handler.ts         # Unified response format
```

---

## 📋 Key Patterns & Conventions

### 1. **Entity Pattern (TypeORM)**

**File Structure:**
```typescript
// entities/school.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

@Entity("schools")
export class School {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  id!: string;

  @Column({ type: "varchar", unique: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  address!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
```

**Key Points:**
- UUID primary keys
- class-validator decorators for validation
- Timestamps for audit trail
- Soft delete support (isDeleted column)

### 2. **DTO Pattern (Data Transfer Objects)**

**File Structure:**
```typescript
// dtos/school.dto.ts
export interface CreateSchoolDto {
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

export interface UpdateSchoolDto {
  name?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}
```

**Key Points:**
- Separate interfaces for Create, Update, List
- Only expose necessary fields
- Use optionals for updates

### 3. **Validation Schema Pattern (Joi)**

**File Structure:**
```typescript
// schema/school.schema.ts
import { NextFunction, Response } from "express";
import Joi from "joi";
import { ExpressRequest } from "../app";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";

export function validateCreateSchool(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
    .keys({
      name: Joi.string().min(2).max(255).required(),
      address: Joi.string().max(500).optional(),
      phoneNumber: Joi.string().regex(/^\d{10,15}$/).optional(),
      email: Joi.string().email().optional(),
    })
    .unknown();

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error,
    });
  }

  return next();
}

export function validateUpdateSchool(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object()
    .keys({
      name: Joi.string().min(2).max(255).optional(),
      address: Joi.string().max(500).optional(),
      phoneNumber: Joi.string().regex(/^\d{10,15}$/).optional(),
      email: Joi.string().email().optional(),
    })
    .unknown();

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message || validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      res,
      code: HTTP_CODES.BAD_REQUEST,
      error,
    });
  }

  return next();
}
```

**Key Points:**
- Validates request body
- Returns error immediately if validation fails
- Calls `next()` if valid
- Used as middleware

### 4. **Repository Pattern (Database)**

**File Structure:**
```typescript
// repository/school.repository.ts
import { Repository } from "typeorm";
import { School } from "../entities/school.entity";
import { AppDataSource } from "../config/data-source";
import APIQuery from "../utils/apiQuery";

class SchoolRepository {
  private readonly repository: Repository<School>;

  constructor() {
    this.repository = AppDataSource.getRepository(School);
  }

  // Create
  public async create(data: any): Promise<School> {
    return await this.repository.save(data);
  }

  // Read many with filtering/sorting/pagination
  public async findAll(queryString: any): Promise<School[]> {
    const query = this.repository
      .createQueryBuilder("school")
      .where("school.isDeleted = :isDeleted", { isDeleted: false });

    const apiQuery = new APIQuery(query, queryString, "school")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await apiQuery.getQuery().getMany();
  }

  // Read single
  public async findOne(query: any): Promise<School | null> {
    return await this.repository.findOne({ where: query });
  }

  // Update
  public async atomicUpdate(
    query: Partial<School>,
    updateData: Partial<School>
  ): Promise<School | null> {
    await this.repository.update(query, updateData);
    return this.findOne(query);
  }

  // Delete (soft delete - set isDeleted: true)
  public async deleteOne(query: Partial<School>): Promise<boolean> {
    const result = await this.repository.update(query, { isDeleted: true });
    return (result.affected ?? 0) > 0;
  }

  // Hard delete (optional)
  public async hardDelete(query: Partial<School>): Promise<boolean> {
    const result = await this.repository.delete(query);
    return (result.affected ?? 0) > 0;
  }
}

export default new SchoolRepository();
```

**Key Points:**
- Single instance (singleton pattern)
- Uses APIQuery for advanced filtering
- Implements CRUD operations
- Soft delete by default

### 5. **Controller Pattern (Business Logic)**

**File Structure:**
```typescript
// controllers/school.controller.ts
import { Response } from "express";
import schoolRepository from "../repository/school.repository";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";

const logger = new Logger("School Controller");

class SchoolController {
  // Create
  async createSchool(req: ExpressRequest, res: Response) {
    try {
      const { name, address, phoneNumber, email } = req.body;

      // Check if already exists
      const exists = await schoolRepository.findOne({ name });
      if (exists) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.CONFLICT,
          error: "School with this name already exists",
        });
      }

      const school = await schoolRepository.create({
        name,
        address,
        phoneNumber,
        email,
      });

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.CREATED,
        message: "School created successfully",
        data: school,
      });
    } catch (error: any) {
      logger.error(`Error in createSchool: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Read all
  async getAllSchools(req: ExpressRequest, res: Response) {
    try {
      const schools = await schoolRepository.findAll(req.query);

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "Schools retrieved successfully",
        data: schools,
      });
    } catch (error: any) {
      logger.error(`Error in getAllSchools: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Read one
  async getSchoolById(req: ExpressRequest, res: Response) {
    try {
      const { id } = req.params;

      const school = await schoolRepository.findOne({ id });

      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "School retrieved successfully",
        data: school,
      });
    } catch (error: any) {
      logger.error(`Error in getSchoolById: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Update
  async updateSchool(req: ExpressRequest, res: Response) {
    try {
      const { id } = req.params;
      const allowed: any = {};

      // Only allow specific fields to be updated
      if (req.body.name) allowed.name = req.body.name;
      if (req.body.address) allowed.address = req.body.address;
      if (req.body.phoneNumber) allowed.phoneNumber = req.body.phoneNumber;
      if (req.body.email) allowed.email = req.body.email;

      const school = await schoolRepository.atomicUpdate({ id }, allowed);

      if (!school) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "School updated successfully",
        data: school,
      });
    } catch (error: any) {
      logger.error(`Error in updateSchool: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }

  // Delete
  async deleteSchool(req: ExpressRequest, res: Response) {
    try {
      const { id } = req.params;

      const success = await schoolRepository.deleteOne({ id });

      if (!success) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.NOT_FOUND,
          error: "School not found",
        });
      }

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "School deleted successfully",
      });
    } catch (error: any) {
      logger.error(`Error in deleteSchool: ${error.message}`);
      return ResponseHandler.sendErrorResponse({
        res,
        code: HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: "Internal server error",
      });
    }
  }
}

export default new SchoolController();
```

**Key Points:**
- Singleton pattern
- Try-catch for all methods
- Proper error handling
- Logging for debugging
- Business logic separation

### 6. **Routes Pattern**

**File Structure:**
```typescript
// routes/school.route.ts
import express from "express";
import schoolController from "../controllers/school.controller";
import authMiddleware from "../middleware/auth.middleware";
import { validateCreateSchool, validateUpdateSchool } from "../schema/school.schema";
import { ROLE } from "../enums/role.enum";

const router = express.Router();

// Only SUPER_ADMIN can access school routes
router.post(
  "/",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  validateCreateSchool,
  schoolController.createSchool
);

router.get(
  "/",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getAllSchools
);

router.get(
  "/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.getSchoolById
);

router.put(
  "/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  validateUpdateSchool,
  schoolController.updateSchool
);

router.delete(
  "/:id",
  authMiddleware.auth([ROLE.SUPER_ADMIN]),
  schoolController.deleteSchool
);

export default router;
```

**Key Points:**
- Mount with prefix in main routes
- Auth middleware with role check
- Validation middleware
- Controller method call

### 7. **Response Handler Pattern**

**Success Response:**
```typescript
ResponseHandler.sendSuccessResponse({
  res,
  code: HTTP_CODES.OK,
  message: "Operation successful",
  data: { /* your data */ }
});

// Returns:
{
  "success": true,
  "code": 200,
  "message": "Operation successful",
  "data": { /* your data */ }
}
```

**Error Response:**
```typescript
ResponseHandler.sendErrorResponse({
  res,
  code: HTTP_CODES.NOT_FOUND,
  error: "Resource not found"
});

// Returns:
{
  "success": false,
  "code": 404,
  "message": "Resource not found"
}
```

---

## 🔐 Authentication & Authorization

### Token Generation
```typescript
const jwtData = {
  id: user.id,
  email: user.email,
  accountType: user.accountType,
  firstName: user.firstName,
  lastName: user.lastName,
};

const token = await generateJwtToken({ data: jwtData });
```

### Middleware Usage
```typescript
// Anyone (no role check)
authMiddleware.auth()

// Specific roles only
authMiddleware.auth([ROLE.SUPER_ADMIN])
authMiddleware.auth([ROLE.SUPER_ADMIN, ROLE.ADMIN])
```

### Request Object
```typescript
interface ExpressRequest extends Request {
  user?: IUsers;  // Attached by auth middleware
}

// Usage in controller
const userId = req.user?.id;
const userRole = req.user?.accountType;
```

---

## 🔍 API Query Utility Features

### Filtering
```
GET /api/v1/schools?name=MySchool&email=admin@school.com

// Automatically filters by name and email
```

### Sorting
```
GET /api/v1/schools?sort=name:ASC,createdAt:DESC

// Sorts by name ascending, then by createdAt descending
```

### Field Selection
```
GET /api/v1/schools?fields=name,email,address

// Returns only specified fields
```

### Pagination
```
GET /api/v1/schools?page=1&limit=10

// Returns 10 items, skipping 0 (page 1)
GET /api/v1/schools?page=2&limit=10
// Returns 10 items, skipping 10 (page 2)
```

### Combined Example
```
GET /api/v1/schools?page=1&limit=10&sort=name:ASC&fields=name,email&isActive=true
```

---

## 🎯 HTTP Codes Reference

```typescript
const HTTP_CODES = {
  OK: 200,                    // Success
  CREATED: 201,               // Resource created
  NO_CONTENT: 204,            // Success, no content
  BAD_REQUEST: 400,           // Invalid input
  UNAUTHORIZED: 401,          // No/invalid token
  FORBIDDEN: 403,             // No permission
  NOT_FOUND: 404,             // Resource not found
  CONFLICT: 409,              // Resource already exists
  INTERNAL_SERVER_ERROR: 500, // Server error
};
```

---

## 📝 Logging Pattern

```typescript
const logger = new Logger("Controller/Feature Name", Namespaces.Entry);

// In methods
logger.info("User logged in successfully");
logger.error(`Error in method: ${error.message}`);
logger.debug("Debug information", debugObject);
```

---

## 🗄️ Database Integration

### Register Entity in DataSource
```typescript
// config/data-source.ts
export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    User,
    School,  // Add here
    // other entities...
  ],
  synchronize: true,
  logging: false,
});
```

---

## 📌 Best Practices Summary

1. **One Entity = One File** (user.entity.ts, school.entity.ts)
2. **One Repository = One File** (users.repository.ts, schools.repository.ts)
3. **One Controller = One File** (auth.controller.ts, school.controller.ts)
4. **One Route = One File** (auth.route.ts, school.route.ts)
5. **One Schema = One File** (auth.schema.ts, school.schema.ts)
6. **Singleton Pattern** for Repository and Controller classes
7. **Always use try-catch** in controller methods
8. **Always validate** with Joi schema middleware
9. **Always check auth** with middleware
10. **Always return ResponseHandler** formatted responses

---

## 🚀 Ready for Super Admin Module!

You now have all the patterns needed to build:
- Entity for School
- DTO for Create/Update
- Validation schema
- Repository with CRUD
- Controller with business logic
- Routes with auth protection

**Follow the same patterns, and your module will be production-ready!**
