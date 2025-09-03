<!--
  Payroll Management System — README
  Generated: 2025-09-03 18:11
-->

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-007396?logo=java" alt="Java 17"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen?logo=springboot" alt="Spring Boot 3.3"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite" alt="Vite 7"/>
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql" alt="MySQL 8"/>
  <img src="https://img.shields.io/badge/JWT-secure-000000?logo=jsonwebtokens" alt="JWT"/>
  <img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?logo=swagger" alt="Swagger UI"/>
</p>

<h1 align="center">📦 Payroll Management System (Admin & Employee)</h1>
<p align="center">
Automated payroll with role‑based access, leave workflow, salary processing, and secure JWT authentication.
</p>

---

## ✨ Highlights

- 👤 **Two roles**: <b>Admin</b> and <b>Employee</b> (role-based routing & API authorization)
- 🧾 **Payroll runs**: Draft → Process → Lock, with per-employee items (basic, bonus, deductions, net)
- 🌿 **Leave management**: Apply / approve / reject with status tracking
- 🧑‍💼 **Employee management**: CRUD, profile updates, salary base
- 📈 **Reports**: Monthly payroll summary & department cost
- 🔐 **Security**: Spring Security + JWT, CORS, BCrypt
- 🧭 **API docs**: Swagger UI enabled
- 💻 **Frontend**: React + Vite + Axios + React Router + Bootstrap

> This repository is a **monorepo**: Spring Boot backend in `PayRoll_Management/` and React frontend in `/src` (project name: `payroll-frontend`).

---

## 🗂️ Repository Structure

```
CapeStoneProject_FullStack-master/
├── PayRoll_Management/          # Spring Boot backend
│   ├── pom.xml
│   └── src/main/java/com/example/…
│       ├── controller/           # Auth, Users, Employees, Payroll, Leave, Reports, Self
│       ├── entity/               # User, Employee, PayrollRun, PayrollItem, LeaveRequest, enums
│       ├── repo/                 # JPA repositories
│       ├── security/             # JWT, filters, config
│       └── service/              # Business logic
│   └── src/main/resources/
│       ├── application.yml       # MySQL, JPA, JWT config
│       └── application.properties
├── .env                          # Frontend base URL (Vite) → VITE_API_BASE
├── package.json                  # React app
├── src/                          # React app source
│   ├── lib/api.js                # Axios instance with JWT interceptors
│   ├── auth/                     # AuthContext, ProtectedRoute
│   ├── components/               # NavBar, tabs, layout
│   ├── pages/                    # Admin + Employee pages
│   └── App.jsx                   # Routes (role-based)
└── vite.config.js
```

---

## 🧱 Domain Model (ERD)

```mermaid
erDiagram
    USER ||--o| EMPLOYEE : "1 to 1"
    EMPLOYEE ||--o{ LEAVEREQUEST : has
    PAYROLLRUN ||--o{ PAYROLLITEM : contains
    EMPLOYEE ||--o{ PAYROLLITEM : earns

    USER {
      bigint id PK
      string username
      string password (BCrypt)
      string email
      enum role (ADMIN|EMPLOYEE)
      boolean enabled
    }
    EMPLOYEE {
      bigint id PK
      bigint user_id FK
      string first_name
      string last_name
      date   dob
      string phone
      string address
      string designation
      string department
      decimal base_salary
    }
    LEAVEREQUEST {
      bigint id PK
      bigint employee_id FK
      date   start_date
      date   end_date
      enum   leave_type
      enum   status (PENDING|APPROVED|REJECTED)
      datetime created_at
    }
    PAYROLLRUN {
      bigint id PK
      int    year
      int    month
      enum   status (DRAFT|PROCESSED|LOCKED)
      datetime created_at
    }
    PAYROLLITEM {
      bigint id PK
      bigint run_id FK
      bigint employee_id FK
      decimal basic_salary
      decimal deductions
      decimal bonus
      decimal net_salary
    }
```

---

## 🔭 Architecture

```mermaid
flowchart LR
  A[Browser] -->|React Router + Axios| B[React App (Vite)]
  B -->|JWT in Authorization header| C[/Spring Boot REST API/]
  C --> D[(Spring Security + JWT Filter)]
  D --> E[(Services)]
  E --> F[(JPA/Hibernate)]
  F --> G[(MySQL 8)]
  C --> H[[Swagger UI / OpenAPI]]
```

---

## 🧪 Feature Matrix

| Module | Admin | Employee |
|---|:--:|:--:|
| Auth (JWT) | ✅ | ✅ |
| Employee CRUD | ✅ | — |
| View/Update My Profile | — | ✅ |
| Apply / Manage Leave | Approve/Reject | Apply/View |
| Payroll Runs | Create/Process/Lock | — |
| My Salary Slip | — | ✅ |
| Reports | Payroll Summary, Dept Cost | — |

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+**
- **Maven 3.9+**
- **Node.js 20+ & npm**
- **MySQL 8+** (local instance)
- **Git**

### 1) Backend — Spring Boot

> Location: `PayRoll_Management/`

**Configure DB & JWT** (edit `src/main/resources/application.yml`):
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/payroll_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
    username: root
    password: "<your_mysql_password>"
  jpa:
    hibernate:
      ddl-auto: update
jwt:
  secret: "<change-me-256-bit-secret>"
  expiryMinutes: 120
```

> ⚠️ Never commit real passwords or secrets. Use environment variables in production (e.g., `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`).

**Run**:
```bash
cd PayRoll_Management
mvn spring-boot:run
```
- Server: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/`

### 2) Frontend — React (Vite)

> Location: repo root (the React app is at `/src` with `package.json` at the root)

**Configure API base** (create or edit `.env` in repo root):
```bash
VITE_API_BASE=http://localhost:8080/api/v1
```
**Install & run**:
```bash
npm install
npm run dev
```
- App: `http://localhost:5173`

> CORS is pre-configured to allow `http://localhost:5173` (plus 3000/4200) in the backend.

---

## 🔑 First Admin Setup

Out of the box, public **register** creates an **EMPLOYEE**. To create your **first ADMIN**:

1. Register any user via API or the UI.
2. Update the role in MySQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE username = '<your_username>';
```
3. Sign in; you will now see Admin dashboard routes.

> Later, use **Admin → Users** to create/activate more users without direct DB edits.

---

## 🧭 API Overview (selected)

> All endpoints are under `/api/v1/*` and secured with JWT (unless marked Public).

### Auth
- `POST /auth/login` → `{ username, password }`
- `POST /auth/register` → public employee registration
- `POST /auth/logout` → blacklist token

### Users (Admin)
- `GET /users` → list users
- `POST /users` → create user (role ADMIN/EMPLOYEE)
- `PATCH /users/{id}/status` → enable/disable
- `GET /users/me` → current user

### Employees (Admin / Self)
- `GET /employees` (Admin)  
- `POST /employees` (Admin)  
- `GET /employees/{id}` (Admin/Self)  
- `PUT /employees/{id}` (Admin)  
- `DELETE /employees/{id}` (Admin)  
- `GET /employees/{id}/salary-structures` (Admin)  
- `POST /employees/{id}/salary-structures` (Admin)

### Self (Employee)
- `GET /self/profile`
- `PUT /self/profile`
- `GET /self/payroll/my/{year}/{month}`

### Leave
- `GET /leave` (Admin lists all / Employee lists own)
- `POST /leave` (Employee apply)
- `PATCH /leave/{id}` (Admin approve/reject)

### Payroll
- `GET /payroll/runs`
- `POST /payroll/runs` (create)
- `POST /payroll/runs/{id}/process`
- `POST /payroll/runs/{id}/lock`
- `GET /payroll/runs/{id}/items`
- `DELETE /payroll/runs/{id}` (if DRAFT)

### Reports (Admin)
- `GET /reports/payrollsummary?year=&month=`
- `GET /reports/department-cost?year=&month=`

---

## 🧭 Frontend Routes (role-based)

```text
/                      → Welcome
/login                 → Login
/register              → Register

/admin                 → AdminDashboard
/admin/users           → Manage users
/admin/employees       → Employees CRUD
/admin/employees/:id   → Employee details
/admin/payroll         → Payroll runs & items
/admin/leaves          → Approvals
/admin/leaves/:id      → Leave details
/admin/reports         → Payroll summary & dept cost

/me                    → EmployeeDashboard
/me/profile            → View/update profile
/me/leaves             → My leaves
/me/leave/apply        → Apply leave
/me/payroll            → My salary slip
```

---

## 🖼️ Screens & Visuals

> Add screenshots in `docs/screenshots/` and reference them here.

<p align="center">
  <img src="https://github.com/ikatyang/emoji-cheat-sheet/raw/master/public/graphics/emojis/bar_chart.png" height="20"/> 
  <b>Dashboard</b>
</p>

| Login | Admin: Employees | Admin: Payroll |
|---|---|---|
| <img src="docs/screenshots/login.png" width="300" /> | <img src="docs/screenshots/admin-employees.png" width="300" /> | <img src="docs/screenshots/admin-payroll.png" width="300" /> |

| Employee: My Payroll | Employee: Apply Leave | Reports |
|---|---|---|
| <img src="docs/screenshots/employee-payroll.png" width="300" /> | <img src="docs/screenshots/employee-apply-leave.png" width="300" /> | <img src="docs/screenshots/reports.png" width="300" /> |

---

## 🧰 Developer Notes

- **Code style**: meaningful names, DTOs for requests, layered services
- **Validation**: jakarta validation on DTOs and entities
- **JWT**: stored in `localStorage`; Axios interceptor injects `Authorization: Bearer <token>` automatically
- **CORS**: `http://localhost:5173` allowed by default
- **Swagger**: explore and test APIs from the browser

---

## 🐛 Troubleshooting

- **Blank React screen / Vite HMR errors**:  
  - Delete cache and reinstall:  
    - Windows: `rmdir /s /q node_modules && npm cache clean --force && npm install`  
    - macOS/Linux: `rm -rf node_modules && npm cache clean --force && npm install`
  - Ensure `.env` has `VITE_API_BASE=http://localhost:8080/api/v1`

- **401 Unauthorized**: Token missing/expired → you’ll be redirected to `/login`. Re‑authenticate.

- **CORS errors**: Confirm frontend runs on an allowed origin (5173/3000/4200) or update `CorsConfiguration` in backend.

- **MySQL connection**: Verify `application.yml` credentials & that `payroll_db` exists.

- **Create first admin**: Use the SQL snippet in **First Admin Setup** above.

---

## 🗺️ Project Roadmap

- Departments & Jobs as first‑class entities
- Salary structures with effective dates
- Attendance integration
- Exports (PDF payslips, CSV reports)
- Docker Compose for one‑command dev up

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/awesome`
3. Commit changes: `git commit -m "feat: add awesome"`
4. Push: `git push origin feature/awesome`
5. Open a Pull Request

---

## 📄 License

This project is for capstone/learning purposes. Add a license file if you plan to distribute.

---

<p align="center">
  Built with ❤️ using <a href="https://spring.io/projects/spring-boot">Spring Boot</a>, 
  <a href="https://react.dev/">React</a> & <a href="https://www.mysql.com/">MySQL</a>.
</p>
