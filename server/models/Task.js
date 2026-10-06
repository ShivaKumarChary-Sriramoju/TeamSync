import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  columnId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  labels: [String],
  dueDate: Date,
  order: { type: Number, required: true },
}, { timestamps: true });

taskSchema.index({ boardId: 1, columnId: 1, order: 1 });
taskSchema.index({ assigneeId: 1, dueDate: 1 });

export default mongoose.model('Task', taskSchema);
