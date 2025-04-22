# DBS (Database System Project)

A database management system project with a **Django** backend and a **React.js** (or plain HTML/CSS/JS) frontend, organized in independent directories.

---

## Directory Structure

```
DBS/
├── backend/    # Django backend (API, admin, etc.)
├── frontend/   # Frontend (HTML/CSS/JS/React)
└── README.md
```

---

## Requirements

### Backend

- Python 3.9+
- Django 5.x
- djangorestframework
- django-cors-headers

Install dependencies:

```bash
cd backend
pip install django djangorestframework django-cors-headers
```

### Frontend

- For plain HTML/CSS/JS: No dependencies required.
- For React: Node.js and npm.

---

## Running the Backend (Django)

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Run database migrations (if needed):

    ```bash
    python manage.py migrate
    ```

3. Start the Django development server:

    ```bash
    python manage.py runserver
    ```

4. The API will be available at `http://localhost:8000/api/`

---

## Running the Frontend

### Plain HTML/CSS/JS

- Open `frontend/index.html` directly in your browser.

### React (optional)

1. Initialize a React app in `/frontend/` (if not already):

    ```bash
    cd frontend
    npx create-react-app .
    ```

2. Install dependencies and start the React app:

    ```bash
    npm install
    npm start
    ```

3. The React app will run on `http://localhost:3000/` by default.

---

## Integration

- The frontend communicates with the backend via REST API calls to `http://localhost:8000/api/`
- Make sure the backend server is running before using frontend features that require API access.

---