const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
require("dotenv").config();

const app = express();

const corsOptions = {
    origin: 'https://noteit.up.railway.app/', // Allow only your frontend origin
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));