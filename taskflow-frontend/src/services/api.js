const API_BASE_URL = 'http://localhost:5000/api';

// Helper pour convertir les champs frontend vers backend
function toBackendFormat(taskData) {
  return {
    title: taskData.titre,
    description: taskData.description,
    status: taskData.statut
  };
}

// Helper pour convertir les champs backend vers frontend
function toFrontendFormat(taskData) {
  return {
    id: taskData._id,
    titre: taskData.title,
    description: taskData.description,
    statut: taskData.status
  };
}

// Récupérer toutes les tâches
async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des tâches');
  }
  const backendTasks = await response.json();
  // Convertir le format backend vers frontend
  return backendTasks.map(toFrontendFormat);
}

// Créer une nouvelle tâche
async function createTask(taskData) {
  const backendData = toBackendFormat(taskData);
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la tâche');
  }
  const createdTask = await response.json();
  // Retourner au format frontend
  return toFrontendFormat(createdTask);
}

// Mettre à jour le statut d'une tâche
async function updateTaskStatus(taskId, newStatus) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la tâche');
  }
  const updatedTask = await response.json();
  // Retourner au format frontend
  return toFrontendFormat(updatedTask);
}

// Supprimer une tâche
async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la tâche');
  }
  return response.json();
}

// Tester la connexion au serveur
async function pingServer() {
  const response = await fetch(`${API_BASE_URL}/ping`);
  if (!response.ok) {
    throw new Error('Serveur non accessible');
  }
  return response.json();
}

export {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  pingServer,
  API_BASE_URL,
};
