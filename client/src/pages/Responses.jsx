import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Responses.css'; // Import the new stylesheet

// Helper function (can be defined outside the component)
const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val);

const AnswerRenderer = ({ question, answer }) => {
  if (!question) {
    return (
      <div className="answer-container">
        <p>Error: Question data for this answer could not be found.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (question.type) {
      case 'categorize':
        return (
          <div className="answer-content">
            {Object.entries(answer).map(([category, items]) => (
              <div key={category} style={{ marginTop: '0.5rem' }}>
                <strong>{category}:</strong>
                <ul>{items.map((item, i) => <li key={i}>{item.text}</li>)}</ul>
              </div>
            ))}
          </div>
        );

      case 'cloze':
        const words = (Array.isArray(answer) ? answer : Object.values(answer))
          .map(item => (isObject(item) ? item.text : String(item)));
        return <div className="answer-content cloze-answer">"{words.join(' ... ')}"</div>;

      case 'comprehension':
        const subAnswers = Array.isArray(answer) ? answer : Object.values(answer);
        return (
          <div className="answer-content">
            {subAnswers.map((subAns, index) => {
              const displayAnswer = isObject(subAns) ? subAns.text : String(subAns);
              const questionText = question.subQuestions?.[index]?.questionText || `Sub-question ${index + 1}`;
              return (
                <div key={index} className="comprehension-sub-question">
                  <strong>{questionText}</strong>
                  <p style={{ paddingLeft: '1rem' }}>- {displayAnswer}</p>
                </div>
              );
            })}
          </div>
        );

      default:
        return <div className="answer-content">{String(answer)}</div>;
    }
  };

  return (
    <div className="answer-container">
      <div className="answer-question-header">
        <h4>{question.questionText || 'Unnamed Question'}</h4>
        <span>{question.type} Question</span>
      </div>
      {renderContent()}
    </div>
  );
};

const Responses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [questionsMap, setQuestionsMap] = useState(null); // For faster lookups
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [formRes, submissionsRes] = await Promise.all([
          axios.get(`/api/forms/${id}`),
          axios.get(`/api/forms/${id}/responses`, config),
        ]);

        const fetchedForm = formRes.data;
        setForm(fetchedForm);
        setSubmissions(submissionsRes.data);

        // Create a lookup map for questions for better performance
        const qMap = new Map(fetchedForm.questions.map(q => [q._id, q]));
        setQuestionsMap(qMap);

      } catch (err) {
        setError('Failed to fetch data. You may not have permission or the form does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading responses...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!form || !questionsMap) return null; // Wait for all data before rendering

  return (
    <div className="responses-page">
      <div className="container">
        <div className="responses-header">
          <h1>Responses for "{form.title}"</h1>
          <p>
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} • {form.questions.length} Questions
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="submission-card no-responses-card">
            <h3>No responses have been submitted yet.</h3>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission, index) => (
              <div key={submission._id} className="submission-card">
                <div className="submission-meta">
                  <h2>Submission #{index + 1}</h2>
                  <span>Submitted on: {new Date(submission.submittedAt).toLocaleString()}</span>
                </div>
                <div className="answers-list">
                  {submission.responses.map((ans) => (
                    <AnswerRenderer
                      key={ans.questionId}
                      question={questionsMap.get(ans.questionId)} // Faster lookup
                      answer={ans.answer}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Responses;