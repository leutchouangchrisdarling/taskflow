import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <span className="logo-dot" />
        <span>Darling Save</span>
      </Link>
      <div className="nav-meta">
        <span className="operator-badge">
          Analyste SecOps : <span className="operator-name">leutchouang chris darling</span>
        </span>
      </div>
    </header>
  );
}

export default Navbar;