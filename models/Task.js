import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Veuillez ajouter un titre"],
    trim: true,
    maxlength: [50, "Le titre ne peut pas dépasser 50 caractères"],
  },
  description: {
    type: String,
    required: false,
    maxlength: [200, "La description ne peut pas dépasser 200 caractères"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
