import React, { useState } from 'react';
import styles from './Firms.module.css';

export interface FirmsProps {
  userRole: 'admin' | 'manager' | 'volunteer';
}

interface FilterState {
  name: string;
  industry: string;
  size: string;
  status: string;
}

const Firms: React.FC<FirmsProps> = ({ userRole }) => {
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    industry: '',
    size: '',
    status: ''
  });

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      industry: '',
      size: '',
      status: ''
    });
  };

  const handleApplyFilters = () => {
    // TODO: Implement filter logic
    console.log('Applying filters:', filters);
  };

  return (
    <div className={styles.firmsContainer}>
      <div className={styles.header}>
        <h1>Firms Management</h1>
        <p>Manage and filter company information</p>
      </div>

      <div className={styles.filterSection}>
        <h2>Filter Firms</h2>

        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="nameFilter" className={styles.filterLabel}>
              Company Name
            </label>
            <input
              id="nameFilter"
              type="text"
              className={styles.filterInput}
              placeholder="Search by company name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="industryFilter" className={styles.filterLabel}>
              Industry
            </label>
            <select
              id="industryFilter"
              className={styles.filterSelect}
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
            >
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="sizeFilter" className={styles.filterLabel}>
              Company Size
            </label>
            <select
              id="sizeFilter"
              className={styles.filterSelect}
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
            >
              <option value="">All Sizes</option>
              <option value="startup">Startup (1-10)</option>
              <option value="small">Small (11-50)</option>
              <option value="medium">Medium (51-200)</option>
              <option value="large">Large (201-1000)</option>
              <option value="enterprise">Enterprise (1000+)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="statusFilter" className={styles.filterLabel}>
              Status
            </label>
            <select
              id="statusFilter"
              className={styles.filterSelect}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className={styles.filterActions}>
          <button
            className={styles.clearButton}
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
          <button
            className={styles.applyButton}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h3>Firms List</h3>
          <span className={styles.resultsCount}>
            {/* TODO: Show actual count */}
            Showing 0 firms
          </span>
        </div>

        <div className={styles.emptyState}>
          <p>No firms found matching the current filters.</p>
          <p className={styles.emptyHint}>
            Try adjusting your filters or clearing them to see all firms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Firms;

