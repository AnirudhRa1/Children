import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">NGO Portal</div>
        <div className="nav-links">
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <h1>Welcome to Our NGO Portal</h1>
          <p>Making a difference in our community, one step at a time.</p>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <h3>Our Mission</h3>
            <p>Dedicated to creating positive change through community service and sustainable development.</p>
          </div>
          <div className="feature-card">
            <h3>Get Involved</h3>
            <p>Join our volunteer programs and make a meaningful impact in your community.</p>
          </div>
          <div className="feature-card">
            <h3>Donate</h3>
            <p>Support our cause and help us reach more communities in need.</p>
          </div>
          <div className="feature-card">
            <h3>Events</h3>
            <p>Stay updated with our upcoming events and community initiatives.</p>
          </div>
        </section>

        <section className="impact-section">
          <h2>Our Impact</h2>
          <div className="impact-stats">
            <div className="stat-card">
              <h3>1000+</h3>
              <p>Communities Served</p>
            </div>
            <div className="stat-card">
              <h3>5000+</h3>
              <p>Volunteers</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>Active Projects</p>
            </div>
          </div>
        </section>

        {/* 🚀 Reader Test Button */}
        <section className="reader-button-section">
          <button onClick={() => navigate('/reader')} className="start-test-button">
            Start Reading Test
          </button>
        </section>
      </main>
    </div>
  );
}
