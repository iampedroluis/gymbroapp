// Mapeo de iconos de la aplicación
const iconMapping = {
  // Iconos principales
  ejercicios: require("../icons/ejercicios.png"),
  musculos: require("../icons/musculos.png"),
  home: require("../icons/home.png"),
  equipamiento: require("../icons/equipamiento.png"),
  nivel: require("../icons/nivel.png"),
  fuerza: require("../icons/fuerza.png"),
  descanso: require("../icons/descanso.png"),
  series: require("../icons/series.png"),
  repeticiones: require("../icons/repeticiones.png"),
  filter: require("../icons/filter.png"),

  // Grupos musculares
  pecho: require("../icons/pecho.png"),
  espalda: require("../icons/espalda.png"),
  hombros: require("../icons/hombros.png"),
  deltoides: require("../icons/deltoides.png"),
  biceps: require("../icons/biceps.png"),
  tricep: require("../icons/tricep.png"),
  antebrazo: require("../icons/antebrazo.png"),
  abdominales: require("../icons/abdominales.png"),
  piernas: require("../icons/piernas.png"),
  cuadriceps: require("../icons/cuadriceps.png"),
  gluteos: require("../icons/gluteos.png"),
  cuello: require("../icons/cuello.png"),
  "musculo-principal": require("../icons/musculo-principal.png"),
};

// Mapeo específico para grupos musculares
const muscleGroupIconMapping = {
  Pecho: "pecho",
  Espalda: "espalda",
  Hombros: "hombros",
  Deltoides: "deltoides",
  Bíceps: "biceps",
  Tríceps: "tricep",
  Antebrazo: "antebrazo",
  Abdominales: "abdominales",
  Piernas: "piernas",
  Cuádriceps: "cuadriceps",
  Glúteos: "gluteos",
  Cuello: "cuello",
  // Grupos adicionales que pueden estar en los datos
  Brazo: "biceps",
  Dorsales: "espalda",
  Pectorales: "pecho",
  Femoral: "piernas",
  Pantorrillas: "piernas",
  Core: "abdominales",
};

/**
 * Obtiene la ruta del icono de la aplicación
 * @param {string} iconName - Nombre del icono
 * @returns {string} Ruta del icono
 */
export const getAppIcon = (iconName) => {
  const iconPath = iconMapping[iconName];
  return iconPath || "/icons/ejercicios.png"; // icono por defecto
};

/**
 * Obtiene el icono correspondiente a un grupo muscular
 * @param {string} muscleGroup - Nombre del grupo muscular
 * @returns {string} Ruta del icono
 */
export const getMuscleGroupIcon = (muscleGroup) => {
  const iconKey = muscleGroupIconMapping[muscleGroup];
  return getAppIcon(iconKey);
};

/**
 * Obtiene el color asociado a un nivel de dificultad
 * @param {string} difficulty - Nivel de dificultad
 * @returns {string} Clase de color de TailwindCSS
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    Principiante: "text-ios-green",
    Medio: "text-ios-orange",
    Alto: "text-ios-red",
    Avanzado: "text-ios-red",
  };
  return colors[difficulty] || "text-ios-gray-600";
};

/**
 * Obtiene el color de fondo asociado a un nivel de dificultad
 * @param {string} difficulty - Nivel de dificultad
 * @returns {string} Clase de color de fondo de TailwindCSS
 */
export const getDifficultyBgColor = (difficulty) => {
  const colors = {
    Principiante: "bg-ios-green bg-opacity-10",
    Medio: "bg-ios-orange bg-opacity-10",
    Alto: "bg-ios-red bg-opacity-10",
    Avanzado: "bg-ios-red bg-opacity-10",
  };
  return colors[difficulty] || "bg-ios-gray-100";
};

// Exportar los objetos de mapeo
export { iconMapping, muscleGroupIconMapping };
export default iconMapping;
