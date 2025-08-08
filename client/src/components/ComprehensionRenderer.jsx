import React, { useState, useEffect } from 'react'

const ComprehensionRenderer = ({ question, value, onChange }) => {
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    if (value) {
      setAnswers(value)
    } else {
      const initialAnswers = {}
      question.subQuestions?.forEach((_, index) => {
        initialAnswers[index] = ''
      })
      setAnswers(initialAnswers)
    }
  }, [question, value])

  const updateAnswer = (questionIndex, answer) => {
    const newAnswers = { ...answers, [questionIndex]: answer }
    setAnswers(newAnswers)
    onChange(newAnswers)
  }

  return (
    <div>
      {/* Passage */}
      {question.passageText && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '4px',
          marginBottom: '25px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ marginBottom: '15px' }}>Passage:</h4>
          <div style={{
            fontSize: '16px',
            lineHeight: '1.6',
            whiteSpace: 'pre-line'
          }}>
            {question.passageText}
          </div>
        </div>
      )}

      {/* Questions */}
      <div>
        <h4 style={{ marginBottom: '20px' }}>Questions:</h4>
        {question.subQuestions?.map((subQuestion, index) => (
          <div key={index} style={{
            marginBottom: '25px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: 'white'
          }}>
            <h5 style={{ marginBottom: '15px', color: '#333' }}>
              {index + 1}. {subQuestion.question}
            </h5>
            
            <div>
              {subQuestion.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className="mcq-option"
                  onClick={() => updateAnswer(index, option)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    margin: '8px 0',
                    border: '2px solid',
                    borderColor: answers[index] === option ? '#007bff' : '#ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: answers[index] === option ? '#f8f9ff' : 'white',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => updateAnswer(index, option)}
                    style={{ marginRight: '12px' }}
                  />
                  <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '20px' }}>
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComprehensionRenderer
