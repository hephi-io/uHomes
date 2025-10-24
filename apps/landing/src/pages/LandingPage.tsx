import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="hero">
        <div className="container">
          <h1>Welcome to uHomes</h1>
          <p>Your dream home awaits. Find the perfect property for you.</p>
          <div className="cta-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </header>

      <main>
        <section className="features">
          <div className="container">
            <h2>Why Choose uHomes?</h2>
            <div className="features-grid">
              <div className="feature">
                <h3>Smart Search</h3>
                <p>
                  Find properties that match your exact needs with our advanced
                  search.
                </p>
              </div>
              <div className="feature">
                <h3>Expert Guidance</h3>
                <p>
                  Get professional help from our experienced real estate agents.
                </p>
              </div>
              <div className="feature">
                <h3>Secure Transactions</h3>
                <p>
                  All transactions are secure and protected with
                  industry-leading security.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 uHomes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
