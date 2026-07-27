import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import ContactForm from '../components/ContactForm';

const FEATURES = [
  {
    title: 'Track applications',
    description:
      'Log every freelance job you apply to in one place — platform, status, budget, and notes.',
  },
  {
    title: 'See your statistics',
    description:
      'A dashboard with conversion rate, status breakdown, and platform distribution at a glance.',
  },
  {
    title: 'Filter and search',
    description: 'Filter your applications by platform or status to find exactly what you need.',
  },
];

export default function Landing() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="landing">
      <section className="hero">
        <h1>Track your freelance job applications in one place</h1>
        <p>
          JobTrack helps freelancers keep every application organized — from the first message
          sent to the final offer — so nothing falls through the cracks.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="button-link">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="button-link">
                Log in
              </Link>
              <Link to="/register" className="button-link secondary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        {FEATURES.map((feature) => (
          <div className="feature-card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="contact">
        <h2>Get in touch</h2>
        <p>Questions, feedback, or feature requests — send a message.</p>
        <ContactForm />
      </section>
    </div>
  );
}
