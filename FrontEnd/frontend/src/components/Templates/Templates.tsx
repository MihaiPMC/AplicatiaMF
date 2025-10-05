import React, { useState } from 'react';
import './Templates.css';

export type TemplateCategory = 'IT' | 'Barter' | 'Awards' | 'Foundations';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: TemplateCategory;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplatesProps {
  userRole: 'admin' | 'manager' | 'volunteer';
}

const Templates: React.FC<TemplatesProps> = ({ userRole }) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('IT');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    category: activeCategory
  });

  const categories: TemplateCategory[] = ['IT', 'Barter', 'Awards', 'Foundations'];
  const canEdit = userRole === 'admin' || userRole === 'manager';

  const filteredTemplates = templates.filter(template => template.category === activeCategory);

  const handleSaveTemplate = () => {
    if (!currentTemplate.name || !currentTemplate.subject || !currentTemplate.body) {
      alert('Please fill in all fields');
      return;
    }

    if (currentTemplate.id) {
      // Update existing template
      setTemplates(prev => prev.map(template =>
        template.id === currentTemplate.id
          ? { ...template, ...currentTemplate, updatedAt: new Date() } as EmailTemplate
          : template
      ));
    } else {
      // Add new template
      const newTemplate: EmailTemplate = {
        id: crypto.randomUUID(),
        name: currentTemplate.name!,
        subject: currentTemplate.subject!,
        body: currentTemplate.body!,
        category: currentTemplate.category!,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTemplates(prev => [...prev, newTemplate]);
    }

    setIsEditing(false);
    setCurrentTemplate({ name: '', subject: '', body: '', category: activeCategory });
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  const handleAddNew = () => {
    setCurrentTemplate({ name: '', subject: '', body: '', category: activeCategory });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentTemplate({ name: '', subject: '', body: '', category: activeCategory });
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <h1>Email Templates</h1>
        <div className="header-actions">
          {canEdit && !isEditing && (
            <button onClick={handleAddNew} className="btn btn-primary add-template-btn">
              <span className="btn-icon">+</span>
              Add Template
            </button>
          )}
        </div>
      </div>

      <div className="templates-tabs">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              if (!isEditing) {
                setCurrentTemplate(prev => ({ ...prev, category }));
              }
            }}
            className={`tab ${activeCategory === category ? 'active' : ''}`}
          >
            {category}
            <span className="tab-count">
              ({templates.filter(t => t.category === category).length})
            </span>
          </button>
        ))}
      </div>

      {isEditing ? (
        <div className="template-editor">
          <div className="editor-header">
            <h2>{currentTemplate.id ? 'Edit Template' : 'Create New Template'}</h2>
            <div className="category-badge">{currentTemplate.category}</div>
          </div>

          <div className="form-group">
            <label htmlFor="templateName">Template Name *</label>
            <input
              id="templateName"
              type="text"
              value={currentTemplate.name || ''}
              onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter a descriptive template name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="templateSubject">Email Subject *</label>
            <input
              id="templateSubject"
              type="text"
              value={currentTemplate.subject || ''}
              onChange={(e) => setCurrentTemplate(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter email subject (use {variable_name} for dynamic content)"
            />
            <small className="form-hint">
              Tip: Use curly braces for variables like {'{name}'}, {'{date}'}, {'{amount}'}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="templateBody">Email Body *</label>
            <textarea
              id="templateBody"
              value={currentTemplate.body || ''}
              onChange={(e) => setCurrentTemplate(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your email template here. Use {variable_name} for dynamic content that can be replaced later."
              rows={12}
            />
            <small className="form-hint">
              You can use variables in curly braces that will be replaced when using the template
            </small>
          </div>

          <div className="editor-actions">
            <button onClick={handleSaveTemplate} className="btn btn-primary">
              {currentTemplate.id ? 'Update Template' : 'Save Template'}
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="templates-list">
          <div className="list-header">
            <h2>{activeCategory} Templates ({filteredTemplates.length})</h2>
            {canEdit && filteredTemplates.length > 0 && (
              <button onClick={handleAddNew} className="btn btn-outline">
                Add Another Template
              </button>
            )}
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No templates found for {activeCategory}</h3>
              <p>Create your first {activeCategory.toLowerCase()} template to get started.</p>
              <button onClick={handleAddNew} className="btn btn-primary">
                Add Template
              </button>
            </div>
          ) : (
            <div className="templates-grid">
              {filteredTemplates.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <h3>{template.name}</h3>
                    {canEdit && (
                      <div className="template-actions">
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="btn-icon edit"
                          title="Edit template"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="btn-icon delete"
                          title="Delete template"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="template-content">
                    <p className="template-subject"><strong>Subject:</strong> {template.subject}</p>
                    <p className="template-body">{template.body.substring(0, 150)}...</p>
                    <p className="template-meta">
                      Created: {template.createdAt.toLocaleDateString()} |
                      Updated: {template.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Templates;
