# DBS (Database System Project)

A database management system project using **Django** for the backend and **React.js** for the frontend.

---

## Software Stack

| Component         | Technology Used         |
|:-----------------|:------------------------|
| Frontend           | React.js                 |
| Backend            | Django (Python)          |
| Database           | Oracle SQL               |
| DB Connectivity    | Django ORM / oracledb    |

---

## Table of Contents

- [Getting Started](#getting-started)
- [Frontend Workflow](#frontend-workflow)
- [Database Configuration](#database-configuration)
- [Development Credentials](#development-credentials)
- [References](#references)

---

## Getting Started

### Setup Virtual Environment (Optional)

```bash
python -m venv env
env\Scripts\activate        # Windows
source env/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

Ignore virtual environment in Git:
```bash
echo "env/" >> .gitignore
git rm -r --cached env
git commit -m "Ignored virtual environment"
git push origin main
```

### Run Django Server

```bash
python manage.py runserver
```
Open `http://127.0.0.1:8000/` in a browser.

---

## Frontend Workflow

- Frontend React code lives in `/frontend/`
- Install dependencies:
  ```bash
  cd frontend
  npm install
  ```

- Run development server:
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
  ```

**Integrating with Django:**
- Copy `/frontend/dist/` contents to `Application/static/js/`
- In your Django template:
  ```html
  <div id="root"></div>
  <script src="{% static 'js/bundle.js' %}"></script>
  ```

---

## Database Configuration

### Install Oracle SQL  
[Oracle 23ai Free Download](https://www.oracle.com/database/free/get-started/#free-platforms)

### Create Database User

```sql
sqlplus / as sysdba

CREATE USER my_django_user IDENTIFIED BY my_secure_password;
ALTER USER my_django_user DEFAULT TABLESPACE SYSTEM;
ALTER USER my_django_user QUOTA UNLIMITED ON SYSTEM;
GRANT CONNECT, RESOURCE TO my_django_user;
ALTER USER my_django_user ACCOUNT UNLOCK;
```

### tnsnames.ora Setup

Add:
```ora
XE =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
    (CONNECT_DATA =
      (SERVICE_NAME = XEPDB1)
    )
  )
```

### Managing PDB

```sql
ALTER SESSION SET CONTAINER = XEPDB1;
ALTER PLUGGABLE DATABASE ALL OPEN;
ALTER PLUGGABLE DATABASE XEPDB1 SAVE STATE;
```

Check status:
```sql
SELECT STATUS FROM V$INSTANCE;
SELECT OPEN_MODE FROM V$DATABASE;
```

### Change Password

```sql
ALTER USER username IDENTIFIED BY newpassword;
```

### SQLPlus GUI Login Syntax

```
username[@service_name] [AS SYSDBA]
```

Examples:
```bash
sys@FREE AS SYSDBA
sys@XE AS SYSDBA
```

---

## Development Credentials

- **Oracle PDB Admin:** `pdbadmin` / `pdbpassword`
- **Test User:** `git` / `rootpw`
- **SQLPlus Commands:**
  ```bash
  sqlplus / as sysdba
  sqlplus sys@XE as sysdba
  sqlplus your_user@XE
  ```

---

## References

- [Django & Database Tutorial](https://youtu.be/hzjlOKhnJrs?si=URqF2D9xWqiYn4EC)
- [Oracle 23ai Free](https://www.oracle.com/database/free/get-started/#free-platforms)
- [Django Docs](https://docs.djangoproject.com/en/5.0/)
- [React Docs](https://react.dev/)

---