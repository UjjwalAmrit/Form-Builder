import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import './ComprehensionEditor.css'; // Make sure the stylesheet is imported

const ComprehensionEditor = ({ question, onChange }) => {
  const addSubQuestion = () => {
    const newSubQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    };
    onChange({
      ...question,
      subQuestions: [...(question.subQuestions || []), newSubQuestion]
    });
  };

  // Improved immutable update function
  const updateSubQuestion = (index, field, value) => {
    const updatedSubQuestions = (question.subQuestions || []).map((sq, i) => {
      if (i === index) {
        return { ...sq, [field]: value };
      }
      return sq;
    });
    onChange({ ...question, subQuestions: updatedSubQuestions });
  };

  // Improved immutable update function for options
  const updateOption = (subIndex, optIndex, value) => {
    const updatedSubQuestions = (question.subQuestions || []).map((sq, subIdx) => {
      if (subIdx === subIndex) {
        const newOptions = sq.options.map((opt, optIdx) => (optIdx === optIndex ? value : opt));
        return { ...sq, options: newOptions };
      }
      return sq;
    });
    onChange({ ...question, subQuestions: updatedSubQuestions });
  };

  const removeSubQuestion = (index) => {
    onChange({
      ...question,
      subQuestions: (question.subQuestions || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="comprehension-editor">
      <div className="form-group">
        <label>Question Text (Optional)</label>
        <input
          type="text"
          className="form-control"
          value={question.questionText || ''}
          onChange={(e) => onChange({ ...question, questionText: e.target.value })}
          placeholder="e.g., 'Read the passage and answer the questions'"
        />
      </div>

      <div className="form-group">
        <label>Passage</label>
        <textarea
          className="form-control"
          value={question.passageText || ''}
          onChange={(e) => onChange({ ...question, passageText: e.target.value })}
          placeholder="Enter the passage text for users to read"
          rows="8"
        />
      </div>

      <div className="form-group">
        <div className="sub-questions-header">
          <label>Questions ({(question.subQuestions || []).length})</label>
          <button type="button" onClick={addSubQuestion} className="add-sub-question-btn">
            <FiPlus /> Add Question
          </button>
        </div>

        {(question.subQuestions || []).map((subQ, index) => (
          <div key={index} className="sub-question-card">
            <div className="sub-question-card-header">
              <h4>Question {index + 1}</h4>
              <button type="button" onClick={() => removeSubQuestion(index)} className="remove-sub-question-btn" title="Remove Sub-question">
                <FiX size={16} />
              </button>
            </div>

            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                className="form-control"
                value={subQ.question}
                onChange={(e) => updateSubQuestion(index, 'question', e.target.value)}
                placeholder="Enter the question based on the passage"
              />
            </div>

            <div className="form-group">
              <label>Options</label>
              {subQ.options.map((option, optIndex) => (
                <div key={optIndex} className="option-row">
                  <span className="option-label">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) => updateOption(index, optIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Correct Answer</label>
              <select
                className="form-control correct-answer-select"
                value={subQ.correctAnswer}
                onChange={(e) => updateSubQuestion(index, 'correctAnswer', e.target.value)}
              >
                <option value="">Select correct answer</option>
                {subQ.options.map((option, optIndex) => (
                  option && <option key={optIndex} value={option}>
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {(question.subQuestions || []).length === 0 && (
          <div className="no-sub-questions-placeholder">
            No questions added yet. Click "Add Question" to create your first question.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensionEditor;