import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { LANGUAGE_STORAGE_KEY } from '../i18n';
import logo from '../image/logo.png';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    dispatch(logout());
    navigate('/login');
  }

  function changeLanguage(lang: 'en' | 'ua') {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  const langSwitcher = (
    <div className="lang-switcher">
      <button
        type="button"
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={i18n.language === 'ua' ? 'active' : ''}
        onClick={() => changeLanguage('ua')}
      >
        UA
      </button>
    </div>
  );

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt={t('navbar.brand')} className="navbar-logo" />
        </Link>
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `navbar-user${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {user?.name}
              </NavLink>
              <button
                type="button"
                className="navbar-toggle"
                aria-label={isMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                aria-expanded={isMenuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <div className={`navbar-links${isMenuOpen ? ' open' : ''}`}>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  {t('navbar.dashboard')}
                </NavLink>
                <NavLink
                  to="/applications"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  {t('navbar.applications')}
                </NavLink>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  {t('navbar.calendar')}
                </NavLink>
                {langSwitcher}
                <button type="button" onClick={handleLogout}>
                  {t('navbar.logout')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="navbar-guest-links">
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('navbar.login')}
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {t('navbar.signup')}
                </NavLink>
              </div>
              <button
                type="button"
                className="navbar-toggle navbar-toggle-guest"
                aria-label={isMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
                aria-expanded={isMenuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <div className={`navbar-lang-menu${isMenuOpen ? ' open' : ''}`}>{langSwitcher}</div>
            </>
          )}
        </div>
      </nav>
      {isMenuOpen && (
        <div
          className="navbar-overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
