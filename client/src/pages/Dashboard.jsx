import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiEye, FiShare, FiClipboard, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/forms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForms(response.data);
    } catch (error) {
      setError('Failed to fetch forms. Please try logging in again.');
      console.error("Fetch forms error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form and all its responses? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/forms/${formId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForms(prevForms => prevForms.filter(form => form._id !== formId));
      } catch (error) {
        alert('Failed to delete form. Please try again.');
        console.error("Delete form error:", error);
      }
    }
  };

  const copyToClipboard = (formId) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Form link copied to clipboard!');
    }, () => {
      alert('Failed to copy link.');
    });
  };

  if (loading) return <div className="loading">Loading forms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Forms</h1>
          <Link to="/builder" className="create-form-btn">
            <FiPlus />
            Create New Form
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="no-forms-card">
            <h3>No forms created yet</h3>
            <p>Create your first form to get started</p>
            <Link to="/builder" className="create-form-btn">
              Create Form
            </Link>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map((form) => (
              <div key={form._id} className="form-card">
                <button 
                  onClick={() => handleDelete(form._id)} 
                  className="delete-form-btn" 
                  title="Delete Form"
                >
                  <FiTrash2 size={18} />
                </button>

                <div className="form-card-content">
                  <h3>{form.title}</h3>
                  <p>{form.description || 'No description provided.'}</p>
                  <div className="form-card-meta">
                    {form.questions.length} question{form.questions.length !== 1 ? 's' : ''} • 
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="form-card-actions">
                  <Link to={`/builder/${form._id}`} className="action-btn">
                    <FiEdit /> Edit
                  </Link>
                  <Link to={`/form/${form._id}`} className="action-btn" target="_blank" rel="noopener noreferrer">
                    <FiEye /> Preview
                  </Link>
                  <Link to={`/form/${form._id}/responses`} className="action-btn">
                    <FiClipboard /> Responses
                  </Link>
                  <button onClick={() => copyToClipboard(form._id)} className="action-btn share-btn">
                    <FiShare /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;