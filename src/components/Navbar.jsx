import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = !!localStorage.getItem('token');
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg mb-5 sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={handleLinkClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          نظام كشف الحساب
        </Link>
        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/')}`} to="/" onClick={handleLinkClick}>الرئيسية</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/traders')}`} to="/traders" onClick={handleLinkClick}>كشوفات التجار</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/general')}`} to="/general" onClick={handleLinkClick}>المصروفات (علينا)</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/stock')}`} to="/stock" onClick={handleLinkClick}>الاستوك (المخزن)</Link>
            </li>
          </ul>
          <div className="d-flex">
            {localStorage.getItem('token') ? (
              <button className="btn btn-outline-danger btn-sm fw-bold px-3 rounded-pill" onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>
                خروج
              </button>
            ) : (
              <Link className="btn btn-primary btn-sm fw-bold px-3 rounded-pill" to="/login" onClick={handleLinkClick}>
                دخول الإدارة
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
