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
1. django - 
```sh
pip install django
```
2. oracledb - 
```sh
pip install oracledb
```
- **Database Management System** (OracleSQL)
- **Node.js & npm** (for React.js frontend)

## Database

- **SQLPlus** [Install Oracle Database 23ai Free Platforms](https://www.oracle.com/database/free/get-started/#free-platforms)
[Types of Logins](https://docs.oracle.com/en/database/oracle/oracle-database/19/admin/getting-started-with-database-administration.html#GUID-EA8CC987-EF18-4434-B962-01312CD3A8AC)

1. Make a user after inital boot by running 
```sh
sqlplus / as sysdba
```
on cmd prompt
```sh
CREATE USER my_django_user IDENTIFIED BY my_secure_password;
ALTER USER my_django_user DEFAULT TABLESPACE SYSTEM;
ALTER USER my_django_user QUOTA UNLIMITED ON SYSTEM;
GRANT CONNECT, RESOURCE TO my_django_user;
```
2. Locate and open tnsnames.ora and Add an alias for XE that points to XEPDB1
```sh
XE =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
    (CONNECT_DATA =
      (SERVICE_NAME = XEPDB1)
    )
  )
```

## Software Stack

| Component          | Technology Used          |
|-------------------|--------------------------|
| **Frontend**      | React.js                  |
| **Backend**       | Django (Python)           |
| **Database**      | OracleSQL / MySQL         |
| **DB Connectivity** | Django ORM / SQLAlchemy (if applicable) |

## References

- [Django & Database Connectivity Tutorial](https://youtu.be/hzjlOKhnJrs?si=URqF2D9xWqiYn4EC)

pdbadmin, pdbpassword
git, rootpw
sqlplus / as sysdba

sqlplus sys@XE as sysdba   
sqlplus your_user@XE
