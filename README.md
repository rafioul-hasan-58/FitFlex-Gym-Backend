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

| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| `POST` | `/api/auth/signup` | Register a new trainee       |
| `POST` | `/api/auth/login`  | Login for trainee & admin    |

---

### 👤 Trainee

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| `GET`  | `/api/trainee/profile`        | Get trainee profile (self)           |
| `PATCH`| `/api/trainee/profile`        | Update trainee profile               |
| `POST` | `/api/bookings`               | Book a class                         |
| `GET`  | `/api/bookings/my-bookings`   | View own booked classes              |

---

### 🏋️ Trainer

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| `GET`  | `/api/trainer/schedule`    | View assigned class schedule   |

---

### 🛠️ Admin

| Method | Endpoint                    | Description                            |
|--------|-----------------------------|----------------------------------------|
| `POST` | `/api/admin/trainer`        | Create a new trainer                   |
| `POST` | `/api/admin/class-schedule` | Assign class schedule to a trainer     |
| `GET`  | `/api/admin/class-schedule` | View all class schedules               |
| `PATCH`| `/api/admin/class-schedule/:id` | Update class schedule              |
| `DELETE`| `/api/admin/class-schedule/:id` | Delete class schedule              |
| `GET`  | `/api/admin/bookings`       | View all bookings                      |

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

**🌐 Live Server**
[Click here](https://fitflex-gym-backend.vercel.app)

**📬 Postman API**
[Click here](https://geenify.postman.co/workspace/Job-tasks~93785eb5-4937-475a-949a-7faa3e236a71/collection/39784613-5296fdd1-299e-418a-a186-b742b65ae532?action=share&creator=39784613)



