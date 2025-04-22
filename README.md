# DBS (Database System Project)

A college room/venue booking system using **Django** (Python) for the backend, **Oracle SQL** for the database, and **React.js** or plain HTML/CSS/JS for the frontend.

---

## Tech Stack

| Layer      | Technology         |
|------------|--------------------|
| Frontend   | React.js / HTML/JS |
| Backend    | Django (Python)    |
| Database   | Oracle SQL         |
| DB Access  | Django ORM / oracledb |

---

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt  # or install django, djangorestframework, django-cors-headers
python manage.py migrate         # run migrations if needed
python manage.py runserver
```
- API runs at: [http://localhost:8000/api/](http://localhost:8000/api/)

### Frontend

#### Plain HTML/JS
- Open `frontend/index.html` in your browser.

#### React (optional)
```bash
cd frontend
npm install
npm start
```
- React app runs at: [http://localhost:3000/](http://localhost:3000/)

---

## Database Setup

- Install [Oracle Database Free](https://www.oracle.com/database/free/get-started/#free-platforms)
- Create a user and grant privileges:
  ```sql
  CREATE USER git IDENTIFIED BY rootpw;
  ALTER USER git QUOTA UNLIMITED ON SYSTEM;
  GRANT CONNECT, RESOURCE TO git;
  ALTER USER git ACCOUNT UNLOCK;
  ```
- Make sure your Oracle service (e.g., `FREE`, `XE`, or `XEPDB1`) is running and open.

- Example SQLPlus login:
  ```
  sqlplus git/rootpw@localhost:1521/FREE
  ```

---

## Integration

- The frontend communicates with the backend via REST API calls to `http://localhost:8000/api/`
- CORS is enabled by default in backend settings.

---

## Troubleshooting

- If you see Oracle connection errors, check:
  - The Oracle service name in your Django `settings.py` matches your running service.
  - The Oracle listener is running (`lsnrctl status`).
  - Your user/password are correct and the account is unlocked.

---

## References

- [Django Docs](https://docs.djangoproject.com/en/5.0/)
- [React Docs](https://react.dev/)
- [Oracle Free Database](https://www.oracle.com/database/free/get-started/#free-platforms)