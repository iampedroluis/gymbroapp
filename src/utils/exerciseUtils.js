import exerciseData from "../data/data.json";

/**
 * Extrae todos los ejercicios individuales de la estructura de rutinas
 * @returns {Array} Array de ejercicios con estructura normalizada
 */
export const getAllExercises = () => {
  const allExercises = [];

  if (!exerciseData.rutinas) {
    return [];
  }

  exerciseData.rutinas.forEach((rutina) => {
    if (rutina.ejercicios) {
      rutina.ejercicios.forEach((grupoEjercicio) => {
        if (grupoEjercicio.rutina) {
          grupoEjercicio.rutina.forEach((ejercicio) => {
            // Normalizar la estructura del ejercicio para que coincida con el formato esperado
            allExercises.push({
              Ejercicio: ejercicio.nombre,
              "Grupo muscular": grupoEjercicio.nombre,
              Dificultad: ejercicio.nivel,
              Equipamiento: "Mancuernas", // Asumiendo que la mayoría usa mancuernas basado en los datos
              "Tipo de fuerza": "Fuerza",
              Mecanica: "Compuesto",
              "Músculo involucrado": grupoEjercicio.nombre,
              "Parte específica": grupoEjercicio.nombre,
              series: ejercicio.series,
              repeticiones: ejercicio.repeticiones,
              descanso: ejercicio.descanso,
              gif: ejercicio.gif,
              // Campos adicionales para mantener compatibilidad
              dia: rutina.dia,
              musculos: rutina.musculos,
              // Campo para iconos de músculo principal
              musculo_principal:
                ejercicio.musculo_principal ||
                grupoEjercicio.musculo_principal ||
                rutina.musculo_principal,
            });
          });
        }
      });
    }
  });

  return allExercises;
};

/**
 * Obtiene ejercicios filtrados por día
 * @param {string} dia - Día de la semana
 * @returns {Array} Array de ejercicios para ese día
 */
export const getExercisesByDay = (dia) => {
  if (!exerciseData.rutinas) {
    return [];
  }

  const rutinaDelDia = exerciseData.rutinas.find(
    (rutina) => rutina.dia === dia
  );

  if (!rutinaDelDia) {
    return [];
  }

  return rutinaDelDia;
};

/**
 * Obtiene todos los grupos musculares únicos
 * @returns {Array} Array de grupos musculares únicos
 */
export const getMuscleGroups = () => {
  const groups = new Set();

  getAllExercises().forEach((exercise) => {
    groups.add(exercise["Grupo muscular"]);
  });

  return Array.from(groups);
};

/**
 * Obtiene todas las dificultades únicas
 * @returns {Array} Array de dificultades únicas
 */
export const getDifficulties = () => {
  const difficulties = new Set();

  getAllExercises().forEach((exercise) => {
    difficulties.add(exercise.Dificultad);
  });

  return Array.from(difficulties);
};

/**
 * Obtiene todos los tipos de equipamiento únicos
 * @returns {Array} Array de equipamientos únicos
 */
export const getEquipmentTypes = () => {
  const equipment = new Set();

  getAllExercises().forEach((exercise) => {
    equipment.add(exercise.Equipamiento);
  });

  return Array.from(equipment);
};
