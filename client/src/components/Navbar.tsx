import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { LANGUAGE_STORAGE_KEY } from '../i18n';

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
        {t('navbar.brand')}
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">{t('navbar.dashboard')}</Link>
            <Link to="/applications">{t('navbar.applications')}</Link>
            <span className="navbar-user">{user?.name}</span>
            <button type="button" onClick={handleLogout}>
              {t('navbar.logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">{t('navbar.login')}</Link>
            <Link to="/register">{t('navbar.signup')}</Link>
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
