# AI Budget App

A comprehensive personal finance application that allows users to connect their bank accounts, track transactions, create and manage budgets, and gain insights into their spending habits.

## Features

- **User Authentication**: Secure login and registration system
- **Plaid Integration**: Connect your bank accounts securely via Plaid API
- **Transaction Tracking**: View all your financial transactions in one place
- **Budget Management**: Create, update, and delete budget categories
- **Financial Dashboard**: Get an overview of your financial health
- **Transaction Filtering**: Filter transactions by date, category, and more
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js**: React framework for building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling components
- **Shadcn**: For accessible UI components
- **Recharts**: For data visualization
- **React Plaid Link**: For Plaid integration

### Backend
- **Django**: Python web framework
- **Django REST Framework**: For building RESTful APIs
- **PostgreSQL**: Database (configured but using SQLite for development)
- **JWT Authentication**: For secure user authentication
- **Plaid API**: For bank account integration

## Screenshot
*Place screenshots of your application here*

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Plaid Developer Account

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to http://localhost:3000

## Environment Variables

The application requires the following environment variables:

### Backend (.env in backend directory)
```
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox  # or development/production
SECRET_KEY=your_django_secret_key
```

### Frontend (.env.local in frontend directory)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

- **frontend/**: Next.js application
  - **src/app/**: Pages and components
  - **src/app/components/**: UI components organized by feature
  - **src/app/context/**: React context providers
  - **src/utils/**: API and helper functions

- **backend/**: Django application
  - **users/**: User authentication
  - **plaid_integration/**: Plaid API integration
  - **bank_account/**: Bank account management
  - **transactions/**: Transaction management
  - **budgets/**: Budget management

## Mock Data

This application is configured with mock data for demonstration purposes. The data includes:
- Sample user accounts
- Sample bank accounts
- Sample transactions
- Sample budget categories

## License

[MIT License](LICENSE)