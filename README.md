# DBS (Database System Project)

A database management system project using Django for backend connectivity and React.js for the frontend.

## Getting Started

### Setup Virtual Environment (Optional)
1. Create a virtual environment:
   ```sh
   python -m venv env
   ```
2. Activate the virtual environment:
   ```sh
   env\Scripts\activate  # Windows
   source env/bin/activate  # macOS/Linux
   ```
3. Install dependencies: (Not implemeneted yet)
   ```sh
   pip install -r requirements.txt
   ```
#### Ignoring the Virtual Environment in Git (If making an Virtual Environment)
To prevent unnecessary files from being committed, add `env/` to `.gitignore`:
```sh
echo "env/" >> .gitignore
git rm -r --cached env
git commit -m "Ignored virtual environment"
git push origin main
```

### Run the Django Server
Start the development server:
```sh
python manage.py runserver
```
Then, open the provided URL in a browser.

### Frontend Setup
- Add scripts to the "templates" directory.
- Each view (part of an Application) may be treated as a page (Not entirely sure yet).

### ER Diagram
- [Draw.io](https://drive.google.com/file/d/1WJjh5lrJ64GN1YOzslRlE_pABrI_ygNp/view?usp=sharing)

## Prerequisites

- **Python** (3.x recommended)
- **Database Management System** (OracleSQL or MySQL)
- **Node.js & npm** (for React.js frontend)

## Software Stack

| Component          | Technology Used          |
|-------------------|--------------------------|
| **Frontend**      | React.js                  |
| **Backend**       | Django (Python)           |
| **Database**      | OracleSQL / MySQL         |
| **DB Connectivity** | Django ORM / SQLAlchemy (if applicable) |

## References

- [Django & Database Connectivity Tutorial](https://youtu.be/hzjlOKhnJrs?si=URqF2D9xWqiYn4EC)

