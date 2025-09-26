import { useState, useEffect } from "react";

const useCompletedExercises = () => {
  const [completedExercises, setCompletedExercises] = useState(new Set());

  // Función para obtener el inicio de la semana (lunes)
  const getWeekStart = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el inicio
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  };

  // Función para verificar si es una nueva semana
  const isNewWeek = (savedWeekStart) => {
    const currentWeekStart = getWeekStart();
    return currentWeekStart !== savedWeekStart;
  };

  // Cargar ejercicios completados del localStorage al inicializar
  useEffect(() => {
    const saved = localStorage.getItem("completedExercises");
    const savedWeekStart = localStorage.getItem("exercisesWeekStart");

    try {
      // Si es una nueva semana, reiniciar los ejercicios completados
      if (!savedWeekStart || isNewWeek(savedWeekStart)) {
        console.log(
          "Nueva semana detectada, reiniciando ejercicios completados"
        );
        setCompletedExercises(new Set());
        localStorage.setItem("exercisesWeekStart", getWeekStart());
        localStorage.removeItem("completedExercises");
        return;
      }

      // Cargar ejercicios completados si es la misma semana
      if (saved) {
        const parsedSet = new Set(JSON.parse(saved));
        setCompletedExercises(parsedSet);
      }
    } catch (error) {
      console.error("Error loading completed exercises:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    if (completedExercises.size > 0) {
      localStorage.setItem(
        "completedExercises",
        JSON.stringify(Array.from(completedExercises))
      );
      localStorage.setItem("exercisesWeekStart", getWeekStart());
    }
  }, [completedExercises]);

  const markExerciseCompleted = (exerciseKey) => {
    setCompletedExercises((prev) => new Set([...prev, exerciseKey]));
  };

  const markExerciseIncomplete = (exerciseKey) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exerciseKey);
      return newSet;
    });
  };

  const isExerciseCompleted = (exerciseKey) => {
    return completedExercises.has(exerciseKey);
  };

  const clearAllCompleted = () => {
    setCompletedExercises(new Set());
    localStorage.removeItem("completedExercises");
  };

  const resetWeeklyProgress = () => {
    setCompletedExercises(new Set());
    localStorage.removeItem("completedExercises");
    localStorage.setItem("exercisesWeekStart", getWeekStart());
  };

  // Generar una clave única para el ejercicio basada en día y nombre
  const generateExerciseKey = (dia, ejercicioNombre) => {
    return `${dia}-${ejercicioNombre}`;
  };

  return {
    completedExercises,
    markExerciseCompleted,
    markExerciseIncomplete,
    isExerciseCompleted,
    clearAllCompleted,
    resetWeeklyProgress,
    generateExerciseKey,
  };
};

export default useCompletedExercises;
