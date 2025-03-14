import mongoose from "mongoose";
import connectToDatabase from "../../../lib/mongodb";
import Task from "../../../models/Task";

export default async function handler(req, res) {
  await connectToDatabase();

  const {
    query: { id },
    method,
  } = req;

  // Vérifier si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "ID invalide" });
  }

  switch (method) {
    case "GET":
      try {
        const task = await Task.findById(id);
        if (!task) {
          return res
            .status(404)
            .json({ success: false, error: "Tâche non trouvée" });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const task = await Task.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!task) {
          return res
            .status(404)
            .json({ success: false, error: "Tâche non trouvée" });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
          return res
            .status(404)
            .json({ success: false, error: "Tâche non trouvée" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Méthode non supportée" });
      break;
  }
}
