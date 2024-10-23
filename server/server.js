const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

const corsOptions = {
    origin: 'https://noteit.up.railway.app',
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.set('bufferCommands', false);  // Add this line before connecting

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,  // Retry within 5 seconds if the MongoDB server cannot be found
    socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
    connectTimeoutMS: 30000,  // Set 30 seconds connection timeout
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/u',userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));