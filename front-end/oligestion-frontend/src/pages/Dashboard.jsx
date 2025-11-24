import { useMemo, useState } from "react";

const sections = [
  {
    key: "overview",
    label: "Vue d'ensemble",
    subtitle: "Synthèse rapide",
    content: (
      <div className="dash-cards">
        <article>
          <h4>Projets actifs</h4>
          <p className="value">08</p>
          <span>+2 ce mois</span>
        </article>
        <article>
          <h4>Clients suivis</h4>
          <p className="value">24</p>
          <span>5 nouveaux devis</span>
        </article>
        <article>
          <h4>Chantiers livrés</h4>
          <p className="value">12</p>
          <span>3 en attente de validation</span>
        </article>
      </div>
    ),
  },
  {
    key: "planning",
    label: "Planning",
    subtitle: "Interventions à venir",
    content: (
      <ul className="list">
        {[
          { day: "Lun", task: "Installation rideaux - Client Rasoanaivo" },
          { day: "Mer", task: "Prise de côtes chambre parentale" },
          { day: "Ven", task: "Pose tête de lit capitonnée" },
        ].map((item) => (
          <li key={item.task}>
            <strong>{item.day}</strong>
            <span>{item.task}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: "estimations",
    label: "Estimations",
    subtitle: "Suivi des devis",
    content: (
      <table className="dash-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Projet</th>
            <th>Statut</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {[
            { client: "Villa Andohalo", projet: "Chambre invités", statut: "Envoyé", montant: "3,6 MAr" },
            { client: "Hôtel Baobab", projet: "15 chambres", statut: "En cours", montant: "27 MAr" },
            { client: "Famille Ralaivo", projet: "Suite parentale", statut: "Validé", montant: "5,4 MAr" },
          ].map((row) => (
            <tr key={row.client}>
              <td>{row.client}</td>
              <td>{row.projet}</td>
              <td>
                <span className={`pill pill-${row.statut === "Validé" ? "success" : row.statut === "Envoyé" ? "warning" : "info"}`}>
                  {row.statut}
                </span>
              </td>
              <td>{row.montant}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    key: "settings",
    label: "Paramétrage",
    subtitle: "Configuration générale",
    content: (
      <div className="settings-grid">
        <div>
          <h4>Identité visuelle</h4>
          <p>Logo, palette couleur, composants 3D.</p>
          <button>Mettre à jour</button>
        </div>
        <div>
          <h4>Équipe</h4>
          <p>Gestion des accès et rôles.</p>
          <button>Inviter</button>
        </div>
      </div>
    ),
  },
];

const Dashboard = () => {
  const [activeKey, setActiveKey] = useState("overview");
  const activeSection = useMemo(() => sections.find((section) => section.key === activeKey), [activeKey]);

  return (
    <div className="dashboard-main">
      <div className="section-tabs">
        {sections.map((section) => (
          <button
            key={section.key}
            className={section.key === activeKey ? "active" : ""}
            onClick={() => setActiveKey(section.key)}
          >
            {section.label}
          </button>
        ))}
      </div>
      <div className="section-header">
        <h2>{activeSection?.label}</h2>
        <p>{activeSection?.subtitle}</p>
      </div>
      <div className="section-content">{activeSection?.content}</div>
    </div>
  );
};

export default Dashboard;

