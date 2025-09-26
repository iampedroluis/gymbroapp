import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMuscleGroupIcon, getAppIcon } from "../utils/iconMapping";
import { getAllExercises } from "../utils/exerciseUtils";

const MuscleGroupScreen = () => {
  const navigate = useNavigate();
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [filteredMuscleGroups, setFilteredMuscleGroups] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    processMuscleGroups();
  }, []);

  useEffect(() => {
    filterMuscleGroups();
  }, [searchText, muscleGroups]);

  const processMuscleGroups = () => {
    const exercises = getAllExercises();
    const muscleGroupMap = new Map();

    exercises.forEach((exercise) => {
      // Use musculo_principal if available, otherwise fall back to Grupo muscular
      const groupName = exercise.musculo_principal ? exercise.musculo_principal[0] : exercise["Grupo muscular"];
      const exerciseName = exercise.Ejercicio;
      const specificPart = exercise["Parte específica"];
      const difficulty = exercise.Dificultad;

      if (!muscleGroupMap.has(groupName)) {
        muscleGroupMap.set(groupName, {
          name: groupName,
          exercises: new Set(),
          specificParts: new Set(),
          difficulties: new Set(),
          exerciseCount: 0,
        });
      }

      const group = muscleGroupMap.get(groupName);
      group.exercises.add(exerciseName);
      if (specificPart) group.specificParts.add(specificPart);
      group.difficulties.add(difficulty);
    });

    // Convertir sets a arrays y calcular conteos
    const processedGroups = Array.from(muscleGroupMap.values()).map(
      (group) => ({
        ...group,
        exercises: Array.from(group.exercises),
        specificParts: Array.from(group.specificParts),
        difficulties: Array.from(group.difficulties),
        exerciseCount: group.exercises.size,
      })
    );

    // Ordenar por cantidad de ejercicios
    processedGroups.sort((a, b) => b.exerciseCount - a.exerciseCount);

    setMuscleGroups(processedGroups);
    setFilteredMuscleGroups(processedGroups);
  };

  const filterMuscleGroups = () => {
    if (!searchText) {
      setFilteredMuscleGroups(muscleGroups);
      return;
    }

    const filtered = muscleGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchText.toLowerCase()) ||
        group.specificParts.some((part) =>
          part.toLowerCase().includes(searchText.toLowerCase())
        )
    );

    setFilteredMuscleGroups(filtered);
  };

  const handleMuscleGroupPress = (muscleGroup) => {
    // Navegar a la pantalla de ejercicios con filtro de grupo muscular
    navigate("/exercises", {
      state: {
        filterMuscleGroup: muscleGroup.name,
      },
    });
  };

  const MuscleGroupCard = ({ group }) => (
    <div
      className="ios-card mb-4 active:scale-98 transition-all duration-200 cursor-pointer hover:shadow-ios-lg"
      onClick={() => handleMuscleGroupPress(group)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          <img
            src={getMuscleGroupIcon(group.name)}
            alt={group.name}
            className="w-16 h-16 rounded-ios-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-ios-gray-900 mb-1">
            {group.name}
          </h3>

          <div className="flex items-center space-x-4 text-sm text-ios-gray-600 mb-2">
            <div className="flex items-center">
              <img
                src={getAppIcon("ejercicios")}
                alt="Ejercicios"
                className="w-4 h-4 mr-1"
              />
              <span>{group.exerciseCount} ejercicios</span>
            </div>

            <div className="flex items-center">
              <img
                src={getAppIcon("nivel")}
                alt="Dificultades"
                className="w-4 h-4 mr-1"
              />
              <span>{group.difficulties.length} niveles</span>
            </div>
          </div>

          {/* Specific parts */}
          {group.specificParts.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {group.specificParts.slice(0, 3).map((part, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-ios-gray-100 text-ios-gray-700 text-xs rounded-full"
                >
                  {part}
                </span>
              ))}
              {group.specificParts.length > 3 && (
                <span className="px-2 py-1 bg-ios-gray-100 text-ios-gray-700 text-xs rounded-full">
                  +{group.specificParts.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Difficulty levels */}
          <div className="flex items-center space-x-2">
            {group.difficulties.map((difficulty, index) => {
              const colors = {
                Principiante: "bg-ios-green bg-opacity-10 text-ios-green",
                Medio: "bg-ios-orange bg-opacity-10 text-ios-orange",
                Alto: "bg-ios-red bg-opacity-10 text-ios-red",
                Avanzado: "bg-ios-red bg-opacity-10 text-ios-red",
              };
              const colorClass =
                colors[difficulty] || "bg-ios-gray-100 text-ios-gray-600";

              return (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded-full font-medium ${colorClass}`}
                >
                  {difficulty}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          <div className="text-ios-blue">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
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
  );

  return (
    <div className="min-h-screen bg-ios-gray-50">
      {/* Header */}
      <div className="bg-white shadow-ios mb-6">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-ios-gray-900 mb-4">
            Grupos Musculares
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar grupos musculares..."
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
        {/* Results Counter */}
        <div className="mb-4">
          <p className="text-ios-gray-600 text-sm">
            {filteredMuscleGroups.length}{" "}
            {filteredMuscleGroups.length === 1
              ? "grupo encontrado"
              : "grupos encontrados"}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="ios-card mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-ios-blue mb-1">
                {muscleGroups.length}
              </div>
              <div className="text-xs text-ios-gray-600">Grupos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ios-green mb-1">
                {muscleGroups.reduce(
                  (total, group) => total + group.exerciseCount,
                  0
                )}
              </div>
              <div className="text-xs text-ios-gray-600">Ejercicios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ios-orange mb-1">
                {muscleGroups.reduce(
                  (total, group) => total + group.specificParts.length,
                  0
                )}
              </div>
              <div className="text-xs text-ios-gray-600">Partes</div>
            </div>
          </div>
        </div>

        {/* Muscle Groups List */}
        <div className="pb-6">
          {filteredMuscleGroups.length > 0 ? (
            filteredMuscleGroups.map((group, index) => (
              <MuscleGroupCard key={index} group={group} />
            ))
          ) : (
            <div className="ios-card text-center py-12">
              <img
                src={getAppIcon("musculos")}
                alt="Sin resultados"
                className="w-16 h-16 mx-auto mb-4 opacity-50"
              />
              <h3 className="text-lg font-semibold text-ios-gray-900 mb-2">
                No se encontraron grupos musculares
              </h3>
              <p className="text-ios-gray-600">Intenta ajustar tu búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuscleGroupScreen;
