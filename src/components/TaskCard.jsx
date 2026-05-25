import { Link } from 'react-router-dom';

const statusMapping = {
  'A faire': { label: 'Critical Alert', className: 'badge-todo' },
  'En cours': { label: 'Investigating', className: 'badge-inprogress' },
  'Termine': { label: 'Resolved', className: 'badge-done' }
};

function TaskCard({ tache }) {
  const statusInfo = statusMapping[tache.statut] || { label: tache.statut, className: 'badge-todo' };

  return (
    <Link to={`/task/${tache.id}`}>
      <div className="incident-card">
        <div className="incident-header">
          <h3 className="incident-title">{tache.titre}</h3>
          <span className={`badge ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>
        <p className="incident-desc">{tache.description}</p>
        <div className="incident-footer">
          <span className="incident-id">SYS-ALERT-#{tache.id}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Détails de l'incident →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default TaskCard;