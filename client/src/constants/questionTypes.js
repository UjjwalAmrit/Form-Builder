export const QUESTION_TYPES = {
  CATEGORIZE: 'categorize',
  CLOZE: 'cloze',
  COMPREHENSION: 'comprehension'
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.CATEGORIZE]: 'Categorize (Drag & Drop)',
  [QUESTION_TYPES.CLOZE]: 'Cloze (Fill in the Blank)',
  [QUESTION_TYPES.COMPREHENSION]: 'Comprehension (Passage + MCQ)'
};

export const QUESTION_TYPE_DESCRIPTIONS = {
  [QUESTION_TYPES.CATEGORIZE]: 'Users drag items into different categories',
  [QUESTION_TYPES.CLOZE]: 'Users fill in blanks in a passage',
  [QUESTION_TYPES.COMPREHENSION]: 'Users read a passage and answer multiple choice questions'
};
