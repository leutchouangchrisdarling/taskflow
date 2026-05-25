import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ServerMetrics from '../components/ServerMetrics';
import useLocalStorage from '../hooks/useLocalStorage';

const tachesInitiales = [
  { 
    id: 1, 
    titre: "Brute Force SSH détecté sur le port 22", 
    description: "Analyse Syslog de srv-prod-01: plus de 150 tentatives de mot de passe échouées pour l'utilisateur root depuis l'IP publique 198.51.100.89 en moins de 60 secondes. WAF et règles IPtables à configurer pour bannir cette IP.", 
    statut: "A faire" 
  },
  { 
    id: 2, 
    titre: "Configuration du pare-feu applicatif (WAF)", 
    description: "Mettre à jour les règles ModSecurity d'Azure Application Gateway pour bloquer les tentatives d'injections SQL de type 'OR 1=1' détectées sur l'endpoint d'authentification de l'API.", 
    statut: "En cours" 
  },
  { 
    id: 3, 
    titre: "Logs centralisés ELK: Intégration TLS Logstash", 
    description: "Configuration réussie de Logstash avec des certificats TLS auto-signés pour chiffrer la transmission des logs Syslog provenant des serveurs Web distants.", 
    statut: "Termine" 
  },
  { 
    id: 4, 
    titre: "Mise à jour Terraform pour les groupes de sécurité", 
    description: "Restreindre le port SSH (22) dans le fichier de configuration Terraform `main.tf` afin de n'autoriser que les adresses IP publiques du VPN d'administration. Actuellement ouvert sur 0.0.0.0/0.", 
    statut: "A faire" 
  }
];

const filtres = [
  { id: 'Tous', label: 'Tous les incidents' },
  { id: 'A faire', label: '🔴 Critiques / A traiter' },
  { id: 'En cours', label: '🟡 En cours d\'analyse' },
  { id: 'Termine', label: '🟢 Résolus' }
];

function Dashboard() {
  const [taches, setTaches] = useLocalStorage('taskflow_data', tachesInitiales);
  const [filtre, setFiltre] = useLocalStorage('taskflow_filtre', 'Tous');

  const ajouterTache = (nouvelle) => {
    // Immutability respect: creating a new array instead of pushing directly
    setTaches([...taches, nouvelle]);
  };

  const tachesFiltrees = filtre === 'Tous' ? taches : taches.filter(t => t.statut === filtre);

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