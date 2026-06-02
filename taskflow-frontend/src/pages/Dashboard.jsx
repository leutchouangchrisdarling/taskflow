import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ServerMetrics from '../components/ServerMetrics';
import useLocalStorage from '../hooks/useLocalStorage';
import { getTasks, createTask } from '../services/api';

const filtres = [
  { id: 'Tous', label: 'Tous les incidents' },
  { id: 'A faire', label: '🔴 Critiques / A traiter' },
  { id: 'En cours', label: '🟡 En cours d\'analyse' },
  { id: 'Termine', label: '🟢 Résolus' }
];

function Dashboard() {
  const [taches, setTaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtre, setFiltre] = useLocalStorage('taskflow_filtre', 'Tous');

  // Charger les tâches depuis l'API au montage
  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        const data = await getTasks();
        setTaches(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du chargement des tâches:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  const ajouterTache = async (nouvelle) => {
    try {
      // Envoyer la nouvelle tâche au backend
      const createdTask = await createTask(nouvelle);
      // Recharger les tâches pour avoir la liste à jour
      const updatedTasks = await getTasks();
      setTaches(updatedTasks);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la tâche:', err);
      setError(err.message);
    }
  };

  const tachesFiltrees = filtre === 'Tous' ? taches : taches.filter(t => t.statut === filtre);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '12px',
          padding: '48px', 
          display: 'inline-block'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid var(--border-color)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Chargement des incidents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--danger)',
          borderRadius: '12px',
          padding: '48px', 
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '16px' }}>⚠️ Erreur de connexion</h3>
          <p style={{ color: 'var(--text-main)', marginBottom: '16px' }}>{error}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Vérifiez que le serveur backend est démarré sur <code>http://localhost:5000</code>
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Console de Surveillance des Serveurs
        </h1>
        <p className="page-subtitle">
          Analyse de l'état de santé, logs syslog et alertes de sécurité en temps réel.
        </p>
        <div className="project-banner">
          <strong>Darling Save</strong> répond aux exigences SecOps de surveillance de serveurs distants : consolidation des journaux (Syslog via ELK), blocage des injections SQL par WAF, détection d'attaques SSH par force brute et gestion du cycle de vie des incidents système en temps réel.
        </div>
      </div>

      {/* Real-time server fleet telemetry */}
      <ServerMetrics tasks={taches} />

      {/* Logger for new incidents/alerts */}
      <TaskForm onAddTask={ajouterTache} />

      {/* Filter and status tabs */}
      <div className="filter-bar">
        {filtres.map(f => (
          <button 
            key={f.id} 
            onClick={() => setFiltre(f.id)} 
            className={`filter-btn ${filtre === f.id ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert Listings */}
      <div className="incident-list">
        {tachesFiltrees.map(tache => (
          <TaskCard key={tache.id} tache={tache} />
        ))}
        {tachesFiltrees.length === 0 && (
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            border: '1px dashed var(--border-color)', 
            borderRadius: '12px',
            padding: '48px', 
            textAlign: 'center', 
            color: 'var(--text-muted)' 
          }}>
            Aucun incident actif dans cette catégorie. Le système est nominal.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
