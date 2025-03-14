import { motion } from "framer-motion";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import styles from "../styles/TaskCard.module.css";

const TaskCard = ({ task, onDelete, onToggleComplete, onEdit }) => {
  return (
    <motion.div
      className={`${styles.card} ${task.completed ? styles.completed : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
        <p className={styles.date}>
          {new Date(task.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className={styles.actions}>
        <motion.button
          className={`${styles.button} ${styles.completeButton}`}
          onClick={() => onToggleComplete(task._id, !task.completed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaCheck />
        </motion.button>

        <motion.button
          className={`${styles.button} ${styles.editButton}`}
          onClick={() => onEdit(task)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaEdit />
        </motion.button>

        <motion.button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={() => onDelete(task._id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
