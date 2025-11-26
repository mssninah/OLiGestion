import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo/logo.png";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Produits" },
  { to: "/room", label: "Studio chambre" },
];

const AppLayout = () => (
  <div className="app-shell">
    <header className="dashboard-header">
      <div className="brand">
        <img src={logo} alt="OLi Studio" className="logo-img" />
        <div>
          <strong>OLi Studio </strong>
          <span>Prenons soin de vous </span>
        </div>
      </div>
      <div className="header-actions">
        <button title="Notifications">🔔</button>
        <button title="Paramètres">⚙️</button>
        <div className="user-chip">
          <div className="avatar">NR</div>
          <div>
            <strong>Ninah R.</strong>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>

    <div className="app-body">
      <nav className="sidebar">
        <p className="sidebar-title">Navigation</p>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? "active" : "")}
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>
    </div>

    <footer className="dashboard-footer">© {new Date().getFullYear()} Razafitsialoninah · Tous droits réservés</footer>
  </div>
);

export default AppLayout;

