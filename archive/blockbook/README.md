# BlockBook Frontend

A modern React application for the BlockBook college venue booking system.

## Features

- **User Authentication**
  - Login/Logout functionality
  - Role-based access control
  - Session management
  - Password reset

- **Venue Management**
  - Browse available venues
  - View venue details and features
  - Check venue availability
  - Filter venues by capacity and features

- **Booking System**
  - Create booking requests
  - View booking history
  - Cancel bookings
  - Check booking status

- **Approval Workflow**
  - Faculty approval interface
  - Status tracking
  - Comments and feedback
  - Email notifications

- **User Management**
  - Profile management
  - Role-specific dashboards
  - Activity history
  - Settings and preferences

## Tech Stack

- **Frontend Framework**: React.js
- **Routing**: React Router v6
- **State Management**: Context API
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **UI Components**: Custom components
- **Icons**: React Icons
- **Date Handling**: date-fns

## Project Structure

```
frontend/blockbook/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Loading/
│   │   ├── auth/
│   │   ├── venues/
│   │   ├── bookings/
│   │   └── approvals/
│   ├── pages/
│   │   ├── Landing/
│   │   ├── Home/
│   │   ├── Venues/
│   │   ├── Bookings/
│   │   ├── Approvals/
│   │   └── Profile/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApi.js
│   ├── utils/
│   │   ├── api.js
│   │   └── validation.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## Installation

1. Install Node.js (v14 or higher)
2. Clone the repository
3. Install dependencies:
```bash
npm install
```

## Development

1. Start development server:
```bash
npm start
```

2. Run tests:
```bash
npm test
```

3. Build for production:
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=BlockBook
```

## Component Guidelines

1. **File Structure**
   - One component per file
   - Use PascalCase for component names
   - Include index.jsx for component exports
   - Use CSS Modules for styling

2. **Code Style**
   - Use functional components with hooks
   - Follow React best practices
   - Use PropTypes for type checking
   - Include JSDoc comments for complex functions

3. **State Management**
   - Use Context API for global state
   - Use local state for component-specific data
   - Implement proper error handling
   - Use loading states for async operations

## API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in the `utils/api.js` file.

Example API call:
```javascript
import { api } from '../utils/api';

const getVenues = async () => {
  try {
    const response = await api.get('/venues/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

## Authentication Flow

1. User enters credentials on the landing page
2. Frontend sends login request to `/authenticate/`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Token is included in subsequent API requests
6. Protected routes check for valid token

## Error Handling

- Use try-catch blocks for async operations
- Display user-friendly error messages
- Log errors to console in development
- Implement fallback UI for errors
- Handle network errors gracefully

## Performance Optimization

- Use React.memo for pure components
- Implement code splitting
- Optimize images and assets
- Use lazy loading for routes
- Minimize re-renders

## Testing

1. Run unit tests:
```bash
npm test
```

2. Run coverage:
```bash
npm run test:coverage
```

3. Run linting:
```bash
npm run lint
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `build` directory to your hosting service

3. Configure environment variables in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
