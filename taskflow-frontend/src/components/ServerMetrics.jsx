function ServerMetrics({ tasks = [] }) {
  const activeAlerts = tasks.filter(t => t.statut === 'A faire').length;
  const inProgressAlerts = tasks.filter(t => t.statut === 'En cours').length;

  let securityLevel = 'Protégé';
  if (activeAlerts > 2) {
    securityLevel = 'Menace Élevée';
  } else if (activeAlerts > 0) {
    securityLevel = 'Investigation';
  }


  // Generate deterministic load based on task count
  const cpuLoad = Math.min(12 + tasks.length * 7.5, 95).toFixed(1);
  const memoryLoad = Math.min(42 + tasks.length * 2.3, 90).toFixed(1);

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Statut Cyber-Sécurité</span>
        <div className="metric-value" style={{ display: 'flex', alignItems: 'center', fontSize: '1.45rem' }}>
          <span 
            className="metric-status-pulse" 
            style={{ 
              backgroundColor: activeAlerts > 2 ? 'var(--danger)' : activeAlerts > 0 ? 'var(--warning)' : 'var(--success)',
              boxShadow: activeAlerts > 2 ? '0 0 8px var(--danger)' : activeAlerts > 0 ? '0 0 8px var(--warning)' : '0 0 8px var(--success)'
            }}
          />
          {activeAlerts > 2 ? 'Alerte Critique' : activeAlerts > 0 ? 'Incidents Actifs' : 'Système Sain'}
        </div>
        <span className="metric-sub">{securityLevel} — WAF & SSH Actifs</span>
      </div>

      <div className="metric-card">
        <span className="metric-label">Alertes Non Résolues</span>
        <div className="metric-value" style={{ color: activeAlerts > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
          {activeAlerts}
        </div>
        <span className="metric-sub">{inProgressAlerts} en cours d'analyse</span>
      </div>

      <div className="metric-card">
        <span className="metric-label">Consommation CPU Fleet</span>
        <div className="metric-value">{cpuLoad}%</div>
        <span className="metric-sub">Mémoire: {memoryLoad}%</span>
      </div>

      <div className="metric-card">
        <span className="metric-label">Flux Syslog (Indexation)</span>
        <div className="metric-value" style={{ color: 'var(--success)' }}>
          {1420 + tasks.length * 15} msg/s
        </div>
        <span className="metric-sub">ELK Index: actif & sécurisé</span>
      </div>
    </div>
  );
}

export default ServerMetrics;
