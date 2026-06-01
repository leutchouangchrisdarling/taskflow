# TaskFlow Backend

Backend de l'application TaskFlow utilisant Node.js, Express, et MongoDB.

## Prérequis

- Node.js installé
- MongoDB installé et en cours d'exécution (ou URI MongoDB Atlas)

## Installation

1. Cloner le projet ou naviguer dans `taskflow-backend/`
2. Installer les dépendances :
   ```bash
   npm install
   ```

## Configuration

Assurez-vous que le fichier `.env` est configuré correctement :
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
```

## Démarrage

- Démarrer en mode développement :
  ```bash
  npm run dev
  ```
- Démarrer en mode production :
  ```bash
  npm start
  ```

## API Endpoints

- `GET /api/ping` : Vérification de l'état du serveur
- `GET /api/tasks` : Récupérer toutes les tâches
- `POST /api/tasks` : Créer une nouvelle tâche
- `PUT /api/tasks/:id` : Mettre à jour le statut d'une tâche
- `DELETE /api/tasks/:id` : Supprimer une tâche
