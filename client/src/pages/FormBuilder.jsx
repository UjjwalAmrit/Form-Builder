import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import CategorizeEditor from '../components/CategorizeEditor';
import ClozeEditor from '../components/ClozeEditor';
import ComprehensionEditor from '../components/ComprehensionEditor';
import './FormBuilder.css'; // Make sure the stylesheet is imported

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', headerImage: '', questions: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`/api/forms/${id}`, config);
      setForm(response.data);
    } catch (error) {
      setError('Failed to fetch form');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert('Please enter a form title');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (id) {
        await axios.put(`/api/forms/${id}`, form, config);
        alert('Form updated successfully!');
      } else {
        const response = await axios.post('/api/forms', form, config);
        navigate(`/builder/${response.data._id}`);
        alert('Form created successfully!');
      }
    } catch (error) {
      alert('Failed to save form');
      console.error("Save form error:", error);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type) => {
    let questionData = {};
    switch (type) {
      case 'categorize':
        questionData = { categories: [], items: [] };
        break;
      case 'cloze':
        questionData = { passage: '', blanks: [] };
        break;
      case 'comprehension':
        questionData = { passageText: '', subQuestions: [] };
        break;
      default:
        break;
    }
    const newQuestion = { type, questionText: '', ...questionData };
    setForm(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const updateQuestion = (index, updatedQuestion) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? updatedQuestion : q))
    }));
  };

  const deleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setForm(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading) return <div className="loading">Loading form...</div>;

  return (
    <div className="builder-page">
      <div className="container">
        <div className="builder-header">
          <h1>{id ? 'Edit Form' : 'Create New Form'}</h1>
          <button onClick={handleSave} className="save-form-btn" disabled={saving}>
            <FiSave />
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="builder-card">
          <h3>Form Details</h3>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" className="form-control" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter form title" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Enter form description" rows="3" />
          </div>
          <div className="form-group">
            <label>Header Image URL</label>
            <input type="url" className="form-control" value={form.headerImage} onChange={(e) => setForm(prev => ({ ...prev, headerImage: e.target.value }))} placeholder="Enter image URL (optional)" />
          </div>
        </div>

        <div className="builder-card questions-card-container">
          <div className="questions-header">
            <h3>Questions ({form.questions.length})</h3>
            <div className="add-question-group">
              <button onClick={() => addQuestion('categorize')} className="add-question-btn"><FiPlus /> Categorize</button>
              <button onClick={() => addQuestion('cloze')} className="add-question-btn"><FiPlus /> Cloze</button>
              <button onClick={() => addQuestion('comprehension')} className="add-question-btn"><FiPlus /> Comprehension</button>
            </div>
          </div>

          <div className="questions-list">
            {form.questions.length === 0 ? (
              <div className="no-questions-message">
                <p>No questions added yet. Click a button above to add your first question.</p>
              </div>
            ) : (
              form.questions.map((question, index) => (
                <div key={index} className="question-editor-card">
                  <div className="question-editor-header">
                    <h4>Question {index + 1} - {question.type.charAt(0).toUpperCase() + question.type.slice(1)}</h4>
                    <button onClick={() => deleteQuestion(index)} className="delete-btn">
                      <FiTrash2 /> Delete
                    </button>
                  </div>

                  {question.type === 'categorize' && <CategorizeEditor question={question} onChange={(updated) => updateQuestion(index, updated)} />}
                  {question.type === 'cloze' && <ClozeEditor question={question} onChange={(updated) => updateQuestion(index, updated)} />}
                  {question.type === 'comprehension' && <ComprehensionEditor question={question} onChange={(updated) => updateQuestion(index, updated)} />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;