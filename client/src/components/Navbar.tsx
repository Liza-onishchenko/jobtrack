import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { LANGUAGE_STORAGE_KEY } from '../i18n';
import logo from '../image/logo.png';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  function changeLanguage(lang: 'en' | 'ua') {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt={t('navbar.brand')} className="navbar-logo" />
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('navbar.dashboard')}
            </NavLink>
            <NavLink to="/applications" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('navbar.applications')}
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('navbar.calendar')}
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `navbar-user${isActive ? ' active' : ''}`}
            >
              {user?.name}
            </NavLink>
            <button type="button" onClick={handleLogout}>
              {t('navbar.logout')}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('navbar.login')}
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('navbar.signup')}
            </NavLink>
          </>
        )}
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
      </div>
    </nav>
  );
}
