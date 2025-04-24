# BlockBook - College Venue Booking System

A modern web application for managing venue bookings in educational institutions.

## Features

- **User Authentication**
  - Role-based access (Admin, Faculty, Student, Student Council)
  - Secure login with email/password
  - Session management

- **Venue Management**
  - Browse available venues
  - View venue details and features
  - Check venue availability
  - Book venues for events

- **Booking System**
  - Create and manage booking requests
  - Multi-step approval workflow
  - Booking history tracking
  - Exchange requests between users

- **Approval Workflow**
  - Role-based approval steps
  - Faculty advisor approval
  - Student council approval
  - Security clearance
  - Status tracking

## Tech Stack

### Frontend
- React.js
- React Router v6
- Context API for state management
- CSS Modules for styling
- Axios for API calls

### Backend
- Django REST Framework
- Oracle Database
- JWT Authentication
- CORS enabled

## Project Structure

```
blockbook/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   └── styles/       # Global styles
│   └── public/           # Static assets
│
├── backend/              # Django backend
│   ├── api/             # API endpoints
│   ├── DBS/            # Django project settings
│   └── Database/       # Database scripts
│
└── docs/               # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- Oracle Database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blockbook.git
cd blockbook
```

2. Install frontend dependencies:
```bash
cd frontend/blockbook
npm install
```

3. Install backend dependencies:
```bash
cd ../../backend
pip install -r requirements.txt
```

4. Set up the database:
```bash
cd Database
sqlplus sys/sys as sysdba @NewTables.sql
sqlplus sys/sys as sysdba @NewData.sql
```

5. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### Development

1. Start the backend server:
```bash
cd backend
python manage.py runserver
```

2. Start the frontend development server:
```bash
cd frontend/blockbook
npm start
```

3. Access the application at `http://localhost:3000`

## Testing

Run frontend tests:
```bash
cd frontend/blockbook
npm test
```

Run backend tests:
```bash
cd backend
python manage.py test
```

## Deployment

1. Build the frontend:
```bash
cd frontend/blockbook
npm run build
```

2. Configure production settings:
```bash
cd backend
python manage.py collectstatic
```

3. Deploy using your preferred method (e.g., Docker, Heroku, AWS)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.