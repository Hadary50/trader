import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg mb-5 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          نظام كشف الحساب
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">الرئيسية</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/traders')}`} to="/traders">كشوفات التجار</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/general')}`} to="/general">المصروفات (علينا)</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
