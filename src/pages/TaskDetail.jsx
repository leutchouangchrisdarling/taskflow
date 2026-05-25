import { useParams, Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const statusMapping = {
  'A faire': { label: 'Critical Alert', className: 'badge-todo' },
  'En cours': { label: 'Investigating', className: 'badge-inprogress' },
  'Termine': { label: 'Resolved', className: 'badge-done' }
};

// Generates realistic mock logs depending on the alert title
function getMockLogs(tache) {
  const timestamp = new Date(tache.id).toISOString().slice(0, 19).replace('T', ' ');
  const titleLower = tache.titre.toLowerCase();

  if (titleLower.includes('ssh') || titleLower.includes('brute force')) {
    return [
      `[${timestamp}] srv-ssh-prod sshd[4912]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.89 user=root`,
      `[${timestamp}] srv-ssh-prod sshd[4912]: Failed password for root from 198.51.100.89 port 48928 ssh2`,
      `[${timestamp}] srv-ssh-prod sshd[4915]: Failed password for root from 198.51.100.89 port 48932 ssh2`,
      `[${timestamp}] srv-ssh-prod sshd[4922]: Failed password for invalid user admin from 198.51.100.89 port 48938 ssh2`,
      `[${timestamp}] srv-ssh-prod sshd[4930]: Failed password for invalid user admin from 198.51.100.89 port 48944 ssh2`,
      `[ALERT TRIGGERED]: SSH brute force firewall rules block initiated for IP 198.51.100.89.`
    ];
  }

  if (titleLower.includes('waf') || titleLower.includes('injection') || titleLower.includes('firewall')) {
    return [
      `[${timestamp}] [WAF-AUDIT] Incoming connection: 203.0.113.15 -> srv-web-prod:443`,
      `[${timestamp}] [WAF-RULE-3312] MATCHED signature "SQL Injection Attack Detected"`,
      `[${timestamp}] [WAF-BLOCKED] Payload: GET /api/v1/auth/login?user=admin'%20OR%20'1'='1`,
      `[${timestamp}] [WAF-RESPONSE] HTTP 403 Forbidden sent. Remote IP flagged in local IPTables blacklist.`
    ];
  }

  if (titleLower.includes('elk') || titleLower.includes('logstash') || titleLower.includes('elasticsearch')) {
    return [
      `[${timestamp}] [Logstash-Daemon] Initializing pipeline configurations...`,
      `[${timestamp}] [Logstash-Daemon] SSL/TLS certificate configured for port 5044.`,
      `[${timestamp}] [Logstash-Daemon] Pipeline running successfully. Elastic status: Connected.`,
      `[${timestamp}] [ELK-Status] Syslog message buffer clear. Sync: 100% nominal.`
    ];
  }

  // Fallback / User-generated tasks
  return [
    `[${timestamp}] [SYS-EVENT] Initializing ticket ID: #${tache.id}`,
    `[${timestamp}] [SYS-EVENT] Incident title: ${tache.titre}`,
    `[${timestamp}] [SYS-EVENT] Description log details:`,
    `  ${tache.description || 'Aucune description additionnelle fournie.'}`,
    `[${timestamp}] [SYS-EVENT] Status current flag: ${tache.statut}`
  ];
}

function TaskDetail() {
  const { id } = useParams();
  const [taches, setTaches] = useLocalStorage('taskflow_data', []);
  
  const tacheIndex = taches.findIndex(t => t.id === Number(id));
  const tache = taches[tacheIndex];

  if (!tache) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>Incident Introuvable ou Supprimé</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>L'identifiant #{id} ne correspond à aucun log répertorié.</p>
        <Link to="/" className="btn btn-primary">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  const statusInfo = statusMapping[tache.statut] || { label: tache.statut, className: 'badge-todo' };

  // Status updates respecting immutability
  const updateStatus = (newStatut) => {
    const updated = taches.map((t, idx) => {
      if (idx === tacheIndex) {
        // Return new object copy
        return { ...t, statut: newStatut };
      }
      return t;
    });
    setTaches(updated);
  };

  const logs = getMockLogs(tache);

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">
        ← Retour au Dashboard de Surveillance
      </Link>

      <div className="detail-card">
        <div className="detail-meta-row">
          <span className="incident-id">TICKET ID: #SYS-ALERT-{tache.id}</span>
          <span className={`badge ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>

        <h1 className="detail-title">{tache.titre}</h1>
        <p className="detail-desc">{tache.description}</p>

        {/* Console syslog view */}
        <div className="terminal-container">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
            </div>
            <span className="terminal-title">syslogd_viewer --stream --alert={tache.id}</span>
          </div>
          <div className="terminal-body">
            {logs.map((line, index) => (
              <div key={index} className="terminal-line">
                <span className="terminal-prompt">$</span>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Status manager console (teachers criteria validation: state update) */}
        <div className="status-updater">
          <h4 className="status-updater-title">Mettre à jour le statut de l'incident (Opérateur)</h4>
          <div className="status-btns">
            <button 
              onClick={() => updateStatus('A faire')}
              className={`btn ${tache.statut === 'A faire' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                backgroundColor: tache.statut === 'A faire' ? 'var(--danger)' : '', 
                borderColor: tache.statut === 'A faire' ? 'var(--danger)' : '' 
              }}
            >
              À Traiter / Alerte
            </button>
            <button 
              onClick={() => updateStatus('En cours')}
              className={`btn ${tache.statut === 'En cours' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                backgroundColor: tache.statut === 'En cours' ? 'var(--warning)' : '', 
                borderColor: tache.statut === 'En cours' ? 'var(--warning)' : '' 
              }}
            >
              Sous Enquête
            </button>
            <button 
              onClick={() => updateStatus('Termine')}
              className={`btn ${tache.statut === 'Termine' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                backgroundColor: tache.statut === 'Termine' ? 'var(--success)' : '', 
                borderColor: tache.statut === 'Termine' ? 'var(--success)' : '' 
              }}
            >
              Résolu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;