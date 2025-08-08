import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiXCircle } from 'react-icons/fi';
import './ClozeEditor.css';

const ClozeEditor = ({ question, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentOptions, setCurrentOptions] = useState('');
  const [editingBlankIndex, setEditingBlankIndex] = useState(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    // BUG FIX: This logic now correctly checks if the selected word is already a blank
    // and allows creating multiple blanks.
    if (text && question.passage?.includes(text) && !question.blanks?.some(b => b.word === text)) {
      setSelectedText(text);
      setCurrentOptions('');
      setEditingBlankIndex(null);
      setIsModalOpen(true);
    }
  };

  const handleSaveBlank = () => {
    const optionsArray = currentOptions ? currentOptions.split(',').map(opt => opt.trim()) : [];

    if (editingBlankIndex !== null) {
      const updatedBlanks = [...question.blanks];
      updatedBlanks[editingBlankIndex].options = optionsArray;
      onChange({ ...question, blanks: updatedBlanks });
    } else {
      const newBlankIndex = (question.blanks || []).length + 1;
      const placeholder = `[Blank ${newBlankIndex}]`;
      const newBlank = { word: selectedText, options: optionsArray, placeholder };
      
      const updatedPassage = question.passage.replace(new RegExp(`\\b${selectedText}\\b`), placeholder);
      const updatedBlanks = [...(question.blanks || []), newBlank];
      onChange({ ...question, passage: updatedPassage, blanks: updatedBlanks });
    }
    closeModal();
  };

  const removeBlank = (indexToRemove) => {
    if (!question.blanks) return;
    
    const blankToRemove = question.blanks[indexToRemove];
    let passageWithRestoredWord = question.passage.replace(blankToRemove.placeholder, blankToRemove.word);
    
    const remainingBlanks = question.blanks
      .filter((_, i) => i !== indexToRemove)
      .map((blank, newIndex) => {
        const newPlaceholder = `[Blank ${newIndex + 1}]`;
        passageWithRestoredWord = passageWithRestoredWord.replace(blank.placeholder, newPlaceholder);
        return { ...blank, placeholder: newPlaceholder };
      });

    onChange({ ...question, passage: passageWithRestoredWord, blanks: remainingBlanks });
  };
  
  const openEditModal = (index) => {
    const blankToEdit = question.blanks[index];
    setSelectedText(blankToEdit.word);
    setCurrentOptions(blankToEdit.options.join(', '));
    setEditingBlankIndex(index);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedText('');
    setCurrentOptions('');
    setEditingBlankIndex(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div>
      <div className="form-group">
        <label>Question Text</label>
        <input type="text" className="form-control" value={question.questionText || ''} onChange={(e) => onChange({ ...question, questionText: e.target.value })} placeholder="Enter question text (e.g., 'Fill in the blanks')" />
      </div>

      <div className="form-group">
        <label>Passage</label>
        <textarea className="form-control cloze-passage-editor" value={question.passage || ''} onChange={(e) => onChange({ ...question, passage: e.target.value })} placeholder="Enter passage text. Then, select words with your mouse to convert them to blanks." rows="6" onMouseUp={handleTextSelection} />
        <small className="editor-help-text">Select text in the passage above to convert it into a blank.</small>
      </div>
      
      {question.blanks && question.blanks.length > 0 && (
        <div className="form-group">
          <label>Created Blanks ({question.blanks.length})</label>
          <div className="blanks-list">
            {question.blanks.map((blank, index) => (
              <div key={index} className="blank-item-row">
                <span className="blank-placeholder">{blank.placeholder}</span>
                <span className="blank-original-word">"{blank.word}"</span>
                
                {/* NEW FEATURE: Display options as pills */}
                {blank.options.length > 0 ? (
                  <div className="blank-options-container">
                    {blank.options.map((opt, optIndex) => (
                      <span key={optIndex} className="blank-option-pill">{opt}</span>
                    ))}
                  </div>
                ) : (
                  <span className="blank-type-info">Text Input</span>
                )}
                
                <div className="blank-actions">
                  <button type="button" onClick={() => openEditModal(index)} title="Edit Options"><FiEdit2 /></button>
                  <button type="button" onClick={() => removeBlank(index)} className="delete-blank-btn" title="Remove Blank"><FiX /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Editing blank for: <span>"{selectedText}"</span></h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Dropdown Options</label>
                <textarea className="form-control" value={currentOptions} onChange={(e) => setCurrentOptions(e.target.value)} placeholder="Enter comma-separated options (e.g., to, on, by). Leave empty for a simple text input." rows="4" />
                <small className="editor-help-text">Leave this empty to create a text input blank.</small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={closeModal} className="add-question-btn"><FiXCircle /> Cancel</button>
              <button type="button" onClick={handleSaveBlank} className="save-form-btn"><FiSave /> Save Blank</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClozeEditor;