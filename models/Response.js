import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  responses: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed
  }]
});

export default mongoose.model('Response', responseSchema);
