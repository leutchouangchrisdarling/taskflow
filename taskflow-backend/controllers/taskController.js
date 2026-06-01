const Task = require('../models/Task');

// 1. getAllTasks() - Retourne toutes les tâches
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la récupération des tâches" });
    }
};

// 2. createTask() - Crée une nouvelle tâche à partir de req.body
const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        // Création et sauvegarde via Mongoose
        const newTask = new Task({ title, description, status });
        const savedTask = await newTask.save();
        
        res.status(201).json(savedTask);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Erreur de validation: ${error.message}` });
        }
        res.status(500).json({ message: "Erreur serveur lors de la création de la tâche" });
    }
};

// 3. updateTaskStatus() - Met à jour uniquement le statut via req.params.id
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validation simple du statut avant mise à jour
        if (!status || !["A faire", "En cours", "Termine"].includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(400).json({ message: "Format d'ID invalide" });
        }
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la tâche" });
    }
};

// 4. deleteTask() - Supprime une tâche via son id
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
         if (error.name === 'CastError') {
             return res.status(400).json({ message: "Format d'ID invalide" });
        }
        res.status(500).json({ message: "Erreur serveur lors de la suppression de la tâche" });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    updateTaskStatus,
    deleteTask
};
