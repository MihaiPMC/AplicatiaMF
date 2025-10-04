import React, { useState } from 'react';
import './App.css';
import Header, { User } from './components/Header/Header';
import Login, { LoginFormData } from './components/Login/Login';
import Register, { RegisterFormData } from './components/Register/Register';

type AppView = 'home' | 'login' | 'app' | 'register';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  // Mock user database - in real app, this would come from your backend
  const mockUsers: { [email: string]: { role: 'admin' | 'manager' | 'volunteer', name: string } } = {
    'admin@example.com': { role: 'admin', name: 'Admin User' },
    'manager@example.com': { role: 'manager', name: 'Manager User' },
    'volunteer@example.com': { role: 'volunteer', name: 'Volunteer User' }
  };

  const handleLogin = (loginData: LoginFormData) => {
    const userData = mockUsers[loginData.email];
    if (userData) {
      setIsAuthenticated(true);
      setUser({
        id: '1',
        name: userData.name,
        role: userData.role
      });
      setCurrentView('app');
    }
  };

  const handleRegister = (registerData: RegisterFormData) => {
    // Mock registration success
    setIsAuthenticated(true);
    setUser({
      id: '2',
      name: registerData.email.split('@')[0],
      role: 'volunteer' // All new users start as volunteers
    });
    setCurrentView('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(undefined);
    setCurrentView('login');
  };

  const handleShowLogin = () => {
    setCurrentView('login');
  };

  const handleShowRegister = () => {
    setCurrentView('register');
  };

  const handleReturnHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'home') {
    return (
      <div className="App">
        <Header
          user={user}
          isAuthenticated={isAuthenticated}
          onLogin={handleShowLogin}
          onLogout={handleLogout}
        />
        <main className="home-container">
          <div className="hero-section">
            <h1 className="hero-title">Welcome to MF-App</h1>
            <p className="hero-subtitle">
              Your comprehensive application management platform designed to streamline workflows
              and enhance productivity for teams and organizations.
            </p>
            <div className="hero-buttons">
              <button onClick={handleShowLogin} className="btn btn-primary">
                Sign In
              </button>
              <button onClick={handleShowRegister} className="btn btn-secondary">
                Create Account
              </button>
            </div>
          </div>

          <div className="features-section">
            <h2 className="features-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Dashboard Analytics</h3>
                <p>Comprehensive overview of your data and activities with real-time insights.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏢</div>
                <h3>Firm Management</h3>
                <p>Organize and manage company information efficiently across your organization.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Template System</h3>
                <p>Create, customize, and manage form templates for consistent data collection.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={handleShowRegister}
        onReturnHome={handleReturnHome}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onShowLogin={handleShowLogin}
        onReturnHome={handleReturnHome}
      />
    );
  }

  return (
    <div className="App">
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        onLogin={handleShowLogin}
        onLogout={handleLogout}
      />
      <main style={{ padding: '2rem' }}>
        <h1>Welcome to MyApp</h1>
        <p>
          Hello {user?.name}! You are logged in as a {user?.role}.
        </p>
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          <p>Available navigation options depend on your role:</p>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0.5rem auto' }}>
            {user?.role === 'volunteer' && (
              <>
                <li>Dashboard - View your assignments</li>
                <li>Templates - Access form templates</li>
              </>
            )}
            {user?.role === 'manager' && (
              <>
                <li>Dashboard - Manage overview</li>
                <li>Firms - Manage company information</li>
                <li>Templates - Manage form templates</li>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <li>Dashboard - Admin overview</li>
                <li>Firms - Manage all companies</li>
                <li>Templates - Manage all templates</li>
                <li>User Management - Assign roles to users</li>
              </>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
