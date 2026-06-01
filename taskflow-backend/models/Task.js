const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre est obligatoire"],
        maxlength: [100, "Le titre ne doit pas dépasser 100 caractères"]
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["A faire", "En cours", "Termine"],
        default: "A faire"
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
