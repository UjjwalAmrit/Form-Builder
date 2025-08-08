export const validateForm = (formData) => {
  const errors = [];
  
  if (!formData.title || formData.title.trim().length === 0) {
    errors.push('Form title is required');
  }
  
  if (!formData.questions || formData.questions.length === 0) {
    errors.push('At least one question is required');
  }
  
  formData.questions?.forEach((question, index) => {
    if (!question.type || !['categorize', 'cloze', 'comprehension'].includes(question.type)) {
      errors.push(`Question ${index + 1}: Invalid question type`);
    }
    
    if (question.type === 'categorize') {
      if (!question.categories || question.categories.length === 0) {
        errors.push(`Question ${index + 1}: Categories are required for categorize questions`);
      }
      if (!question.items || question.items.length === 0) {
        errors.push(`Question ${index + 1}: Items are required for categorize questions`);
      }
    }
    
    if (question.type === 'cloze') {
      if (!question.passage || question.passage.trim().length === 0) {
        errors.push(`Question ${index + 1}: Passage is required for cloze questions`);
      }
      if (!question.blanks || question.blanks.length === 0) {
        errors.push(`Question ${index + 1}: At least one blank is required for cloze questions`);
      }
    }
    
    if (question.type === 'comprehension') {
      if (!question.passageText || question.passageText.trim().length === 0) {
        errors.push(`Question ${index + 1}: Passage text is required for comprehension questions`);
      }
      if (!question.subQuestions || question.subQuestions.length === 0) {
        errors.push(`Question ${index + 1}: At least one sub-question is required for comprehension questions`);
      }
    }
  });
  
  return errors;
};
