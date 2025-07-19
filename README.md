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
