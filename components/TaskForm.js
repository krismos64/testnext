import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../styles/TaskForm.module.css";

const TaskForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
      });
      setIsEditing(true);
    } else {
      setFormData({
        title: "",
        description: "",
      });
      setIsEditing(false);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, isEditing ? initialData._id : null);
    if (!isEditing) {
      setFormData({
        title: "",
        description: "",
      });
    }
  };

  return (
    <motion.div
      className={styles.formContainer}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.formTitle}>
          {isEditing ? "Modifier la tâche" : "Ajouter une nouvelle tâche"}
        </h2>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Titre
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Entrez le titre de la tâche"
            maxLength={50}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description (optionnelle)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Entrez une description (optionnelle)"
            maxLength={200}
            rows={3}
          />
        </div>

        <div className={styles.buttonGroup}>
          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </motion.button>

          {isEditing && (
            <motion.button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Annuler
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;
