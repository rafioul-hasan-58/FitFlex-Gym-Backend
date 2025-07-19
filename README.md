# 💪 FitFlex - Gym Management System

## 🚀Project Overview
##### FitFlex Gym Backend is a role-based gym management system designed to handle class scheduling, trainer management, and trainee bookings. Built with TypeScript, Express.js, Prisma, and PostgreSQL, it ensures secure authentication, booking limits, and structured trainer schedules. Admins can manage trainers and class slots, while trainees can register and book available classes. The system enforces business rules such as a maximum of 5 schedules per trainer per day and up to 10 trainees per class, making it efficient and scalable for real-world gym operations.

## 🔗 Relation Diagram

[Click here to view the ER Diagram](https://lucid.app/lucidchart/21412eb7-ae84-46bf-95cb-0510c057b46e/edit?viewport_loc=-1801%2C-1009%2C2558%2C1184%2C0_0&invitationId=inv_f06b09ff-8b3a-481c-a836-0806b92fa691)

---
## 🛠️ Technologies & Stack Used

<table>
  <tr>
    <td><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" /></td>
    <td><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" /></td>
    <td><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" /></td>
    <td><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" /></td>
    <td><img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" /></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Zod-ECEFF1?style=for-the-badge&logoColor=black" /></td>
    <td><img src="https://img.shields.io/badge/dotenv-8DD6F9?style=for-the-badge&logoColor=black" /></td>
    <td><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /></td>
  </tr>
</table>

## 📡API Endpoints

### 🔐 Auth

#### ExampleURL : [https://fitflex-gym-backend.vercel.app/api/auth/register]

| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| `POST` | `/api/auth/register` | Register a new trainee       |
| `POST` | `/api/auth/login`  | Login for Users   |
| `POST` | `/api/auth/refresh-token` | Get Refresh Token      |
| `PATCH` | `/api/auth/change-password`  | Change Password  |

---

### 👤 Trainee

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| `POST`  | `/api/users/my-profile`        | Retrive User Profile          |
| `POST`  | `/api/users/update-my-profile`        | Update User Profile          |
| `GET`| `/api/class-schedules/get-all-class-schedules`        | Get all available class schedule              |
| `GET`| `/api/class-schedules/get-class-schedule/:id`        | Get class schedule by id              |
| `POST`  | `/api/bookings/book-class-schedule`        | Book class schedule           |
| `GET`  | `/api/bookings/my-bookings`        | Get trainee bookings           |
| `GET`  | `/api/bookings/get-booking/:id`        | Get trainee booking by id           |
| `DELETE`  | `/api/bookings/cancel-booking/:id`        | Cancelled booked class           |


---

### 🏋️ Trainer

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| `GET`  | `/class-schedules/get-trainer-schedules`    | View assigned class schedule   |
| `GET`  | `/class-schedules/get-class-schedule/:id`    | View assigned class schedule by id  |

---

### 🛠️ Admin

| Method | Endpoint                    | Description                            |
|--------|-----------------------------|----------------------------------------|
| `POST` | `/api/users/create-trainer`        | Create a new trainer                   |
| `PATCH` | `/api/users/update-trainer/:id`        | Update trainer                   |
| `DELETE` | `/api/users/delete-trainer/:id`        | Delete trainer                   |
| `POST`| `/api/class-schedules/add-class-schedule'` | Create class schedule              |
| `GET`| `/api/class-schedules/get-all-class-schedules'` | Get all class schedules with filters and pagination            |
| `PATCH`| `/api/class-schedules/update-class-schedule/:id'` | Update class schedule              |
| `DELETE`| `/api/class-schedules/delete-class-schedule/:id'` | Delete class schedule              |


---
## 🛢️ Database Schema (Prisma)

```prisma
model User {
  id            String          @id @default(uuid())
  name          String
  email         String          @unique
  password      String
  role          userRole        @default(Trainee)
  bookings      Booking[]
  createdAt     DateTime?       @default(now())
  updatedAt     DateTime?       @updatedAt
  ClassSchedule ClassSchedule[]
}

model ClassSchedule {
  id        String    @id @default(uuid())
  date      DateTime
  startTime DateTime
  endTime   DateTime
  trainer   User      @relation(fields: [trainerId], references: [id])
  trainerId String
  bookings  Booking[]
  createdAt DateTime? @default(now())
  updatedAt DateTime? @updatedAt
}

model Booking {
  id              String        @id @default(uuid())
  classScheduleId String
  traineeId       String
  classSchedule   ClassSchedule @relation(fields: [classScheduleId], references: [id])
  trainee         User          @relation(fields: [traineeId], references: [id])
  createdAt       DateTime?     @default(now())
  updatedAt       DateTime?     @updatedAt

  @@unique([classScheduleId, traineeId]) // only one booking per trainee per classSchedule
}

enum userRole {
  Admin
  Trainer
  Trainee
}
```
## 🔐 Admin Credentials (For Testing)

To test and explore the admin functionalities of **FitFlex**, use the default admin account created during initial database seeding:

```json
{
  "role": "Admin",
  "email": "admin@gmail.com",
  "password": "123456"
}
```
## 🚀 Getting Started – Run Locally

Follow these steps to run the project locally on your machine.

### 📦 Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **PostgreSQL** (ensure it's running locally or on a remote DB)
- **Prisma** (included in devDependencies)

---

### 🛠️ Step-by-Step Setup

1. **📁 Clone the Repository**
```bash
git clone https://github.com/your-username/fitflex-backend.git
cd fitflex-backend
```
2. **📦 Install Dependencies**
```bash
npm install
```
3. **⚙️ Set Up Environment Variables**
```

DATABASE_URL="your_db_url"
PORT="your_port"
NODE_ENV="your_enviroment(eg.development)"
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_ACCESS_EXPIRES_IN="expairs_in(eg.100d)"
JWT_REFRESH_EXPIRES_IN="expairs_in(eg.100d)"

```
4. **🧱 Migrate the Database with Prisma**
```bash
npx prisma migrate dev --name init
```
5. **▶️ Start the Server**
```bash
npm run dev
```
**📍 http://localhost:5000/api**

**🌐 Live Hosting Link** [https://fitflex-gym-backend.vercel.app]

**📬 Postman Documentation**
[Click here](https://geenify.postman.co/workspace/Job-tasks~93785eb5-4937-475a-949a-7faa3e236a71/request/39784613-5c1cdad8-f8d7-4eea-8033-a56869dc3748?action=share&creator=39784613&ctx=documentation&active-environment=39784613-6935471e-1480-49df-8666-3f63ced67c7d)

## 🧪 Testing Example with Postman

### 1. Login to Get JWT Token

- **Request:** `POST {{baseUrl}}/auth/login`
- **Body (JSON):**

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```
### Expected Response:
```json
{
    "success": true,
    "message": "User logged in successfully",
    "statusCode": 200,
    "Data": {
        "accessToken": "_access_token_"
    }
}
```
### Creating Trainer example
#### 🔐 Set Access Token in Header With variable of Authorization
- **Request:** `POST {{baseURL}}/users/create-trainer`
- **Body (JSON):**

```json
{
  "name": "MrTrainer",
  "email": "mrtrainer111@gmail.com",
  "password": "123456"
}


```
### Expected Response:
```json
{
    "success": true,
    "message": "Trainer created successfully",
    "statusCode": 200,
    "Data": {
        "id": "64cecf82-e42c-479e-b46e-d7135241fd7a",
        "name": "MrTrainer",
        "email": "mrtrainer111@gmail.com",
        "password": "$2b$10$6WBUoBQIVbQZYftu9chDh.PxziOikkVLA76ZbFHaiIiL6OVQmfAh6",
        "role": "Trainer",
        "createdAt": "2025-07-19T17:43:44.559Z",
        "updatedAt": "2025-07-19T17:43:44.559Z"
    }
}
```
### Add Schedule classes example
#### 🔐 Set Access Token in Header With variable of Authorization
- **Request:** `POST {{baseURL}}/class-schedules/add-class-schedule`
- **Body (JSON):**

```json
{
  "date": "2025-07-22",
  "startTime": "07:00:00",
  "endTime": "09:00:00",
  "trainerId": "trainer_id"
}


```
### Expected Response:
```json
{
    "success": true,
    "message": "Class schedule added successfully",
    "statusCode": 200,
    "Data": {
        "id": "9ed800a1-71c5-4851-bf84-e4398492af23",
        "date": "2025-07-22T00:00:00.000Z",
        "startTime": "2025-07-22T07:00:00.000Z",
        "endTime": "2025-07-22T09:00:00.000Z",
        "trainerId": "68d3bfb2-245a-43b6-9eee-6556387ea418",
        "createdAt": "2025-07-19T17:47:33.453Z",
        "updatedAt": "2025-07-19T17:47:33.453Z"
    }
}
```
### Add Booking example
#### 🔐 Set Access Token in Header With variable of Authorization
- **Request:** `POST {{baseURL}}/bookings/book-class-schedule`
- **Body (JSON):**

```json
{
    "classScheduleId": "_class_schedule_id_"
}
```
### Expected Response:
```json
{
    "success": true,
    "message": "Class schedule booked successfully",
    "statusCode": 200,
    "Data": {
        "id": "73ad57f9-bdd4-497c-983d-de45f3c80116",
        "classScheduleId": "5ce0c9f9-3283-4551-98f8-c02d0c62f4f4",
        "traineeId": "74a76f29-5941-4cf7-8bd8-9aa1b4d51862",
        "createdAt": "2025-07-19T17:50:48.619Z",
        "updatedAt": "2025-07-19T17:50:48.619Z"
    }
}
```

## 👨‍💻 Developer

### Rafioul Hasan Sourob
##### 📧 rafioulhasan2@gmail.com 
##### 📞 +8801752966422
##### 🔗 [Portfolio](https://rafioul-sourav-portfolio.vercel.app)  

