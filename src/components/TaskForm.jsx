import { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [statut, setStatut] = useState('A faire');
  const [ouvert, setOuvert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titre.trim()) return;
    onAddTask({
      id: Date.now(),
      titre,
      description,
      statut
    });
    setTitre('');
    setDescription('');
    setStatut('A faire');
    setOuvert(false);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      {!ouvert ? (
        <button 
          onClick={() => setOuvert(true)} 
          className="btn btn-primary"
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>+</span> Signaler un Incident / Log Alert
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form-panel">
          <h3 className="form-title">Nouveau Signalement d'Alerte</h3>
          
          <div className="form-group">
            <label className="form-label">Titre de l'incident / Composant concerné</label>
            <input
              className="form-input"
              placeholder="Ex: SSH brute-force détecté sur srv-prod-02"
              value={titre}
              onChange={e => setTitre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Extrait de log Syslog</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Ex: May 25 23:45:12 srv-prod-02 sshd[12042]: Failed password for invalid user admin from 198.51.100.42 port 49152 ssh2"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Niveau de Priorité Initiale</label>
            <select
              className="form-input"
              value={statut}
              onChange={e => setStatut(e.target.value)}
            >
              <option value="A faire">A faire (Alerte Critique)</option>
              <option value="En cours">En cours (Investigation active)</option>
              <option value="Termine">Termine (Incident résolu)</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Enregistrer l'Alerte
            </button>
            <button 
              type="button" 
              onClick={() => setOuvert(false)} 
              className="btn btn-secondary"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TaskForm;