import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  title: { type: String, required: true },
  columns: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true }
  }]
}, { timestamps: true });

export default mongoose.model('Board', boardSchema);
