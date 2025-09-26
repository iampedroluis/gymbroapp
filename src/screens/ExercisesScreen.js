import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAppIcon,
  getMuscleGroupIcon,
  getDifficultyColor,
  getDifficultyBgColor,
} from "../utils/iconMapping";
import { getAllExercises } from "../utils/exerciseUtils";

const ExercisesScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    muscleGroup: "",
    difficulty: "",
    equipment: "",
  });

  useEffect(() => {
    const uniqueExercises = getUniqueExercises();
    setExercises(uniqueExercises);
    setFilteredExercises(uniqueExercises);
  }, []);

  useEffect(() => {
    // Apply filters from navigation state
    if (location.state?.filters) {
      setFilters(location.state.filters);
    }
    if (location.state?.filterMuscleGroup) {
      setFilters((prev) => ({
        ...prev,
        muscleGroup: location.state.filterMuscleGroup,
      }));
    }
  }, [location.state]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, filters, exercises]);

  const getUniqueExercises = () => {
    const exercisesMap = new Map();
    const allExercises = getAllExercises();

    allExercises.forEach((exercise) => {
      const key = exercise.Ejercicio;
      if (!exercisesMap.has(key)) {
        // Use musculo_principal if available, otherwise fall back to Grupo muscular
        const primaryMuscle = exercise.musculo_principal
          ? exercise.musculo_principal[0]
          : exercise["Grupo muscular"];
        exercisesMap.set(key, {
          ...exercise,
          muscleGroups: [primaryMuscle],
          involvedMuscles: [exercise["Músculo involucrado"]],
        });
      } else {
        const existing = exercisesMap.get(key);
        const primaryMuscle = exercise.musculo_principal
          ? exercise.musculo_principal[0]
          : exercise["Grupo muscular"];
        if (!existing.muscleGroups.includes(primaryMuscle)) {
          existing.muscleGroups.push(primaryMuscle);
        }
        if (
          !existing.involvedMuscles.includes(exercise["Músculo involucrado"])
        ) {
          existing.involvedMuscles.push(exercise["Músculo involucrado"]);
        }
      }
    });

    return Array.from(exercisesMap.values());
  };

  const applyFilters = () => {
    let filtered = exercises;

    // Filtro de búsqueda por texto
    if (searchText) {
      filtered = filtered.filter(
        (exercise) =>
          exercise.Ejercicio.toLowerCase().includes(searchText.toLowerCase()) ||
          exercise.muscleGroups.some((muscle) =>
            muscle.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    // Filtro por grupo muscular
    if (filters.muscleGroup) {
      filtered = filtered.filter((exercise) => {
        // Check both muscleGroups and musculo_principal
        const muscleGroupMatch =
          exercise.muscleGroups &&
          exercise.muscleGroups.includes(filters.muscleGroup);
        const musculoPrincipalMatch =
          exercise.musculo_principal &&
          exercise.musculo_principal.includes(filters.muscleGroup);
        return muscleGroupMatch || musculoPrincipalMatch;
      });
    }

    // Filtro por dificultad
    if (filters.difficulty) {
      filtered = filtered.filter(
        (exercise) => exercise.Dificultad === filters.difficulty
      );
    }

    // Filtro por equipamiento
    if (filters.equipment) {
      filtered = filtered.filter(
        (exercise) => exercise.Equipamiento === filters.equipment
      );
    }

    setFilteredExercises(filtered);
  };

  const clearFilters = () => {
    setFilters({
      muscleGroup: "",
      difficulty: "",
      equipment: "",
    });
    setSearchText("");
  };

  const ExerciseCard = ({ exercise }) => (
    <div
      className="ios-card mb-4 active:scale-98 transition-all duration-200 cursor-pointer hover:shadow-ios-lg"
      onClick={() =>
        navigate(`/exercise/${encodeURIComponent(exercise.Ejercicio)}`)
      }
    >
      <div className="flex items-start">
        <img
          src={getMuscleGroupIcon(
            exercise.musculo_principal
              ? exercise.musculo_principal[0]
              : exercise.muscleGroups[0]
          )}
          alt={
            exercise.musculo_principal
              ? exercise.musculo_principal[0]
              : exercise.muscleGroups[0]
          }
          className="w-12 h-12 rounded-ios mr-4 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-ios-gray-900 mb-1 truncate">
            {exercise.Ejercicio}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {exercise.muscleGroups.map((muscle, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-ios-blue bg-opacity-10 text-ios-blue text-xs rounded-full font-medium"
              >
                {muscle}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(
                  exercise.Dificultad
                )} ${getDifficultyColor(exercise.Dificultad)}`}
              >
                {exercise.Dificultad}
              </div>
              <span className="text-ios-gray-600">{exercise.Equipamiento}</span>
            </div>
            <div className="text-ios-blue">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const hasActiveFilters =
    filters.muscleGroup ||
    filters.difficulty ||
    filters.equipment ||
    searchText;

  return (
    <div className="min-h-screen bg-ios-gray-50">
      {/* Header */}
      <div className="bg-white shadow-ios mb-6">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-ios-gray-900 mb-4">
            Ejercicios
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar ejercicios..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="ios-input pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-ios-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Filter Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/filters")}
            className="flex items-center space-x-2 px-4 py-2 bg-ios-blue text-white rounded-ios text-sm font-medium transition-all duration-200 active:scale-95"
          >
            <img
              src={getAppIcon("equipamiento")}
              alt="Filtros"
              className="w-4 h-4 filter brightness-0 invert"
            />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="bg-white bg-opacity-30 text-xs px-2 py-1 rounded-full">
                Activos
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-ios-red text-sm font-medium active:scale-95 transition-all duration-200"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-4">
          <p className="text-ios-gray-600 text-sm">
            {filteredExercises.length}{" "}
            {filteredExercises.length === 1
              ? "ejercicio encontrado"
              : "ejercicios encontrados"}
          </p>
        </div>

        {/* Exercise List */}
        <div className="pb-6">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise, index) => (
              <ExerciseCard key={index} exercise={exercise} />
            ))
          ) : (
            <div className="ios-card text-center py-12">
              <img
                src={getAppIcon("ejercicios")}
                alt="Sin resultados"
                className="w-16 h-16 mx-auto mb-4 opacity-50"
              />
              <h3 className="text-lg font-semibold text-ios-gray-900 mb-2">
                No se encontraron ejercicios
              </h3>
              <p className="text-ios-gray-600 mb-4">
                Intenta ajustar tus filtros o búsqueda
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="ios-button text-sm">
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisesScreen;
