import React, { useState } from 'react';
import styles from './Header.module.css';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'volunteer' | 'manager';
}

export interface HeaderProps {
  user?: User;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

interface NavItem {
  label: string;
  href: string;
  roles: string[];
}

const Header: React.FC<HeaderProps> = ({ user, isAuthenticated, onLogin, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', roles: ['admin', 'volunteer', 'manager'] },
    { label: 'Firms', href: '/firms', roles: ['admin', 'manager'] },
    { label: 'Templates', href: '/templates', roles: ['admin', 'manager', 'volunteer'] },
  ];

  const filteredNavItems = isAuthenticated && user
    ? navItems.filter(item => item.roles.includes(user.role))
    : [];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/logo512.png" alt="Logo" className={styles.logoImage} />
          <span className={styles.logoText}>MF-App</span>
        </div>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            {filteredNavItems.map((item) => (
              <li key={item.label} className={styles.navItem}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            ))}
            <li className={styles.navItem}>
              {isAuthenticated ? (
                <button onClick={onLogout} className={styles.authButton}>
                  Logout
                </button>
              ) : (
                <button onClick={onLogin} className={styles.authButton}>
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>

        <button
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
