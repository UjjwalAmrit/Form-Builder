import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import CategorizeRenderer from '../components/CategorizeRenderer'
import ClozeRenderer from '../components/ClozeRenderer'
import ComprehensionRenderer from '../components/ComprehensionRenderer'
import "./FormRenderer.css";

const FormRenderer = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const response = await axios.get(`/api/forms/${id}`)
      setForm(response.data)
      
      // Initialize responses object
      const initialResponses = {}
      response.data.questions.forEach((_, index) => {
        initialResponses[index] = null
      })
      setResponses(initialResponses)
    } catch (error) {
      setError('Form not found or failed to load')
    } finally {
      setLoading(false)
    }
  }

  const updateResponse = (questionIndex, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleSubmit = async () => {
    // Validate all questions are answered
    const unanswered = Object.keys(responses).filter(key => 
      responses[key] === null || responses[key] === undefined || responses[key] === ''
    )

    if (unanswered.length > 0) {
      alert(`Please answer question${unanswered.length > 1 ? 's' : ''}: ${unanswered.map(i => parseInt(i) + 1).join(', ')}`)
      return
    }

    try {
      setSubmitting(true)
      
      // Format responses for API
      const formattedResponses = form.questions.map((question, index) => ({
        questionId: question._id,
        answer: responses[index]
      }))

      await axios.post(`/api/forms/${id}/responses`, {
        responses: formattedResponses
      })

      setSubmitted(true)
    } catch (error) {
      alert('Failed to submit form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loading">Loading form...</div>
  if (error) return <div className="error">{error}</div>
  if (!form) return <div className="error">Form not found</div>

  if (submitted) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: '#28a745', marginBottom: '20px' }}>Form Submitted Successfully!</h2>
          <p style={{ color: '#666', fontSize: '18px' }}>
            Thank you for your response. Your answers have been recorded.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        {form.headerImage && (
          <img
            src={form.headerImage || "/placeholder.svg"}
            alt="Form header"
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '20px'
            }}
          />
        )}
        
        <h1 style={{ marginBottom: '10px' }}>{form.title}</h1>
        {form.description && (
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            {form.description}
          </p>
        )}
      </div>

      {form.questions.map((question, index) => (
        <div key={index} className="card">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>
              Question {index + 1}
              {question.questionText && ` - ${question.questionText}`}
            </h3>
          </div>

          {question.type === 'categorize' && (
            <CategorizeRenderer
              question={question}
              value={responses[index]}
              onChange={(answer) => updateResponse(index, answer)}
            />
          )}

          {question.type === 'cloze' && (
            <ClozeRenderer
              question={question}
              value={responses[index]}
              onChange={(answer) => updateResponse(index, answer)}
            />
          )}

          {question.type === 'comprehension' && (
            <ComprehensionRenderer
              question={question}
              value={responses[index]}
              onChange={(answer) => updateResponse(index, answer)}
            />
          )}
        </div>
      ))}

      <div className="card" style={{ textAlign: 'center' }}>
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={submitting}
          style={{ fontSize: '16px', padding: '12px 30px' }}
        >
          {submitting ? 'Submitting...' : 'Submit Form'}
        </button>
      </div>
    </div>
  )
}

export default FormRenderer
