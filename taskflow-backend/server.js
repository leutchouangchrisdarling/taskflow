const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Jalon 4 : Middlewares
// Limiter le CORS à http://localhost:5173
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// Jalon 1 : Route Ping
app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: "Serveur TaskFlow operationnel" });
});

// Jalon 3 : Routes REST
app.use('/api/tasks', taskRoutes);

// Jalon 2 : MongoDB + Mongoose
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connecté à la base de données MongoDB');
        app.listen(PORT, () => {
            console.log(`Le serveur écoute sur le port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erreur de connexion à MongoDB:', error);
    });
