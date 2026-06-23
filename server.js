const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB } = require('./config/db');

const healthRoutes = require('./routes/healthRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('DriveFleet Server Running');
});

app.use('/health', healthRoutes);
app.use('/cars', carRoutes);
app.use('/bookings', bookingRoutes);
app.use('/auth', authRoutes);

async function startServer() {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected');

    app.listen(port, () => {
      console.log(`🚀 DriveFleet server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;