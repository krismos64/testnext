import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Récupérer les tâches au chargement de la page
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fonction pour récupérer les tâches depuis l'API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();

      if (data.success) {
        setTasks(data.data);
      } else {
        setError("Erreur lors de la récupération des tâches");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter ou mettre à jour une tâche
  const handleSubmit = async (formData, taskId = null) => {
    try {
      if (taskId) {
        // Mise à jour d'une tâche existante
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
          setTasks(
            tasks.map((task) => (task._id === taskId ? data.data : task))
          );
          setSuccess("Tâche mise à jour avec succès");
          setEditingTask(null);
        } else {
          setError(data.error || "Erreur lors de la mise à jour de la tâche");
        }
      } else {
        // Création d'une nouvelle tâche
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
          setTasks([data.data, ...tasks]);
          setSuccess("Tâche ajoutée avec succès");
        } else {
          setError(data.error || "Erreur lors de l'ajout de la tâche");
        }
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }

    // Effacer les messages après 3 secondes
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
  };

  // Fonction pour supprimer une tâche
  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        setSuccess("Tâche supprimée avec succès");
      } else {
        setError(data.error || "Erreur lors de la suppression de la tâche");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }

    // Effacer les messages après 3 secondes
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
  };

  // Fonction pour marquer une tâche comme complétée ou non
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      const data = await res.json();

      if (data.success) {
        setTasks(tasks.map((task) => (task._id === taskId ? data.data : task)));
      } else {
        setError(data.error || "Erreur lors de la mise à jour de la tâche");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  // Fonction pour éditer une tâche
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  // Fonction pour annuler l'édition
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <>
      <Head>
        <title>Gestionnaire de Tâches</title>
        <meta
          name="description"
          content="Application de gestion de tâches avec Next.js et MongoDB"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <header className="header">
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Gestionnaire de Tâches
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Une application simple pour gérer vos tâches quotidiennes avec
            MongoDB et Next.js
          </motion.p>
        </header>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <TaskForm
          onSubmit={handleSubmit}
          initialData={editingTask}
          onCancel={handleCancelEdit}
        />

        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="task-list">
            {tasks.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FaClipboardList className="empty-state-icon" />
                <p className="empty-state-text">
                  Aucune tâche pour le moment. Ajoutez-en une !
                </p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </>
  );
}
