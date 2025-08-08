import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  headerImage: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    type: {
      type: String,
      enum: ['categorize', 'cloze', 'comprehension'],
      required: true
    },
    questionText: String,
    image: String,
    // For categorize
    categories: [String],
    items: [{
      text: String,
      correctCategory: String
    }],
    // For cloze
    passage: String,
    blanks: [{
      word: String,
      options: [String]
    }],
    // For comprehension
    passageText: String,
    subQuestions: [{
      question: String,
      options: [String],
      correctAnswer: String
    }]
  }]
}, {
  timestamps: true
});

export default mongoose.model('Form', formSchema);
