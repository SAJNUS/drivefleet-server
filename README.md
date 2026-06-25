# DriveFleet Server

DriveFleet Server is the robust backend REST API and real-time WebSocket server that powers the DriveFleet car rental platform. It provides secure authentication, seamless data management, and real-time communication for an optimal user experience.

## Related Links
- **Live Client Website:** [DriveFleet](https://drivefleet-client-wine.vercel.app/)
- **Client Repository:** [drivefleet-client](https://github.com/SAJNUS/drivefleet-client)

## Technology Stack
- **Node.js** & **Express.js** (Server Environment & Framework)
- **MongoDB** (NoSQL Database)
- **Socket.io** (Real-time WebSockets)
- **JWT** (JSON Web Tokens)
- **Cookie Parser** (Cookie handling)
- **CORS** (Cross-Origin Resource Sharing)
- **Dotenv** (Environment variable management)

## API Features
- **Secure Authentication:** Implementation of robust JWT authentication stored securely in HTTP-only cookies, alongside protected private APIs.
- **Car Management:** Comprehensive CRUD operations allowing car owners to list, update, and manage their rental vehicles.
- **Booking System:** An end-to-end booking management system handling trip confirmations, cancellations, and completions.
- **Rating & Reviews:** Secure endpoints to submit and aggregate ratings and reviews for vehicles after completed trips.
- **Real-Time Notifications:** Live notifications broadcasted via Socket.io.
- **Earnings Tracking:** Automated earnings tracking algorithms for car owners.

## Installation & Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/SAJNUS/drivefleet-server.git
cd drivefleet-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The backend server will run on `http://localhost:5050`.

## Environment Variables

Create a `.env` file in the root of the directory with the following structure:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

## Folder Structure

```text
drivefleet-server/
├── config/                 # DB connections and Socket setup
├── collections/            # MongoDB collection initializations
├── controllers/            # Route business logic and handlers
├── middleware/             # JWT and role-based Auth verifications
├── routes/                 # Express API endpoint definitions
├── services/               # Reusable backend functions and calculations
├── index.js                # Main application entry point
└── package.json            # Project metadata and dependencies
```

## Author
**Sajnus Saharear Hojayfa**
- Full-Stack Developer
- GitHub: [SAJNUS](https://github.com/SAJNUS)
