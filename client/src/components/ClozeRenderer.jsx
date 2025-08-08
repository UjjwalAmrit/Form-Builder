import React, { useState, useEffect } from 'react';
import './ClozeRenderer.css';

// CHANGED: The component now gets the answers directly from the `value` prop.
// I've renamed `value` to `answers` inside the component for clarity.
const ClozeRenderer = ({ question, value: answers, onChange }) => {
  // REMOVED: The conflicting internal `answers` state is gone.
  // The word bank state is still managed locally.
  const [wordBankOptions, setWordBankOptions] = useState([]);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    // This effect now ONLY manages the word bank based on the props.
    if (question.blanks) {
      const allOptions = new Set();
      question.blanks.forEach(blank => {
        blank.options?.forEach(opt => allOptions.add(opt));
      });

      const usedOptions = new Set((answers || []).filter(ans => ans !== ''));
      const remainingOptions = Array.from(allOptions).filter(opt => !usedOptions.has(opt));

      setWordBankOptions(remainingOptions.sort(() => Math.random() - 0.5));
    }
  }, [question, answers]); // It correctly re-calculates when the parent's `answers` prop changes.

  // This function now only signals the change to the parent component.
  const updateAnswer = (index, answer) => {
    const newAnswers = [...(answers || Array(question.blanks.length).fill(''))];
    newAnswers[index] = answer;
    onChange(newAnswers);
  };

  const handleDragStart = (e, optionText) => {
    e.dataTransfer.setData('text/plain', optionText);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragOverIndex(null);
    const droppedText = e.dataTransfer.getData('text/plain');
    updateAnswer(index, droppedText);
  };

  const clearBlank = (index) => {
    updateAnswer(index, '');
  };

  const renderPassageWithBlanks = () => {
    if (!question.passage || !question.blanks) return null;
    const parts = question.passage.split(/(\[Blank \d+\])/g);

    return parts.map((part, i) => {
      const match = part.match(/\[Blank (\d+)\]/);
      if (match) {
        const blankIndex = parseInt(match[1], 10) - 1;
        if (blankIndex < 0 || blankIndex >= question.blanks.length) return <span key={i}>{part}</span>;
        
        const blank = question.blanks[blankIndex];
        const currentAnswer = answers?.[blankIndex] || '';

        if (!blank.options || blank.options.length === 0) {
          return (
            <input
              key={i}
              type="text"
              className="blank-input"
              value={currentAnswer}
              onChange={(e) => updateAnswer(blankIndex, e.target.value)}
              placeholder={"_".repeat(blank.word.length)}
            />
          );
        }

        return (
          <div
            key={i}
            className={`cloze-blank ${currentAnswer ? 'filled' : ''} ${dragOverIndex === blankIndex ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, blankIndex)}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={(e) => handleDrop(e, blankIndex)}
            onClick={() => clearBlank(blankIndex)}
            title={currentAnswer ? "Click to clear" : "Drag an option here"}
          >
            {currentAnswer}
          </div>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="cloze-renderer">
      <div className="cloze-passage">{renderPassageWithBlanks()}</div>
      {wordBankOptions.length > 0 && (
        <div className="word-bank">
          <h4>Word Bank</h4>
          <div className="word-bank-options">
            {wordBankOptions.map((option, index) => (
              <div
                key={index}
                className="word-bank-option"
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
                onDragEnd={handleDragEnd}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="cloze-help-text">
        Drag words from the Word Bank to the matching blanks in the passage. For other blanks, type your answer directly.
      </p>
    </div>
  );
};

export default ClozeRenderer;