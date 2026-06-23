const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('DriveFleet Server Running');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`DriveFleet server running on port ${port}`);
  });
}

module.exports = app;
