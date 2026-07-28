import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../app/hooks';
import TelegramIcon from '../components/TelegramIcon';

const FEATURE_KEYS = ['track', 'stats', 'filter'] as const;

export default function Landing() {
  const { t } = useTranslation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <h1>{t('landing.heroTitle')}</h1>
          <p>{t('landing.heroDescription')}</p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="button-link">
                {t('landing.goToDashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="button-link">
                  {t('landing.login')}
                </Link>
                <Link to="/register" className="button-link secondary">
                  {t('landing.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <img src="/dashboard.png" alt="JobTrack dashboard preview" className="dashboard-mockup" />
        </div>
      </section>

      <section className="features">
        {FEATURE_KEYS.map((key) => (
          <div className="feature-card" key={key}>
            <h3>{t(`landing.features.${key}.title`)}</h3>
            <p>{t(`landing.features.${key}.description`)}</p>
          </div>
        ))}
      </section>

      <section className="contact">
        <h2>{t('landing.contactHeading')}</h2>
        <p>{t('landing.contactSubheading')}</p>
        <a
          href="https://t.me/liiza1"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-button"
        >
          <TelegramIcon />
          {t('landing.telegramButton')}
        </a>
      </section>
    </div>
  );
}
