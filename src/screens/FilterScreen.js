import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAppIcon, getMuscleGroupIcon } from "../utils/iconMapping";
import { getAllExercises } from "../utils/exerciseUtils";

const FilterScreen = () => {
  const navigate = useNavigate();
  // const location = useLocation(); // Removed as it's not being used

  const [filters, setFilters] = useState({
    muscleGroup: "",
    difficulty: "",
    equipment: "",
  });

  const [availableOptions, setAvailableOptions] = useState({
    muscleGroups: [],
    difficulties: [],
    equipment: [],
  });

  useEffect(() => {
    processAvailableOptions();
  }, []);

  const processAvailableOptions = () => {
    const exercises = getAllExercises();
    const muscleGroups = new Set();
    const difficulties = new Set();
    const equipment = new Set();

    exercises.forEach((exercise) => {
      // Use musculo_principal if available, otherwise fall back to Grupo muscular
      const muscleGroup = exercise.musculo_principal
        ? exercise.musculo_principal[0]
        : exercise["Grupo muscular"];
      muscleGroups.add(muscleGroup);
      difficulties.add(exercise.Dificultad);
      equipment.add(exercise.Equipamiento);
    });

    setAvailableOptions({
      muscleGroups: Array.from(muscleGroups).sort(),
      difficulties: Array.from(difficulties).sort(),
      equipment: Array.from(equipment).sort(),
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      muscleGroup: "",
      difficulty: "",
      equipment: "",
    });
  };

  const applyFilters = () => {
    // Navegar de vuelta a ejercicios con los filtros aplicados
    navigate("/exercises", {
      state: {
        filters: filters,
      },
    });
  };

  const hasActiveFilters =
    filters.muscleGroup || filters.difficulty || filters.equipment;

  const FilterSection = ({
    title,
    options,
    selectedValue,
    filterType,
    iconKey,
    getOptionIcon,
  }) => (
    <div className="ios-card mb-6">
      <div className="flex items-center mb-4">
        <img src={getAppIcon(iconKey)} alt={title} className="w-6 h-6 mr-3" />
        <h3 className="text-lg font-semibold text-ios-gray-900">{title}</h3>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedValue === option;
          return (
            <button
              key={index}
              onClick={() => handleFilterChange(filterType, option)}
              className={`w-full flex items-center p-3 rounded-ios border transition-all duration-200 active:scale-98 ${
                isSelected
                  ? "bg-ios-blue border-ios-blue text-white"
                  : "bg-white border-ios-gray-200 text-ios-gray-900 hover:border-ios-gray-300"
              }`}
            >
              {getOptionIcon && (
                <img
                  src={getOptionIcon(option)}
                  alt={option}
                  className={`w-8 h-8 mr-3 rounded ${
                    isSelected ? "filter brightness-0 invert" : ""
                  }`}
                />
              )}
              <span className="flex-1 text-left font-medium">{option}</span>
              {isSelected && (
                <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Principiante: "#34C759",
      Medio: "#FF9500",
      Alto: "#FF3B30",
      Avanzado: "#FF3B30",
    };
    return colors[difficulty] || "#8E8E93";
  };

  const DifficultyOption = ({ difficulty, isSelected, onPress }) => (
    <button
      onClick={onPress}
      className={`w-full flex items-center p-3 rounded-ios border transition-all duration-200 active:scale-98 ${
        isSelected
          ? "border-2"
          : "bg-white border-ios-gray-200 hover:border-ios-gray-300"
      }`}
      style={
        isSelected
          ? {
              borderColor: getDifficultyColor(difficulty),
              backgroundColor: getDifficultyColor(difficulty) + "1A",
            }
          : {}
      }
    >
      <div
        className="w-4 h-4 rounded-full mr-3"
        style={{ backgroundColor: getDifficultyColor(difficulty) }}
      ></div>
      <span
        className={`flex-1 text-left font-medium ${
          isSelected ? "font-semibold" : "text-ios-gray-900"
        }`}
      >
        {difficulty}
      </span>
      {isSelected && (
        <svg
          className="w-5 h-5 ml-2"
          fill={getDifficultyColor(difficulty)}
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-ios-gray-50">
      {/* Header */}
      <div className="bg-white shadow-ios mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-ios-blue active:scale-95 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Volver
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-ios-red text-sm font-medium active:scale-95 transition-all duration-200"
              >
                Limpiar todo
              </button>
            )}
          </div>

          <h1 className="text-3xl font-bold text-ios-gray-900">Filtros</h1>
        </div>
      </div>

      <div className="px-6">
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="ios-card mb-6 bg-ios-blue bg-opacity-5 border-ios-blue border">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-ios-blue rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-ios-blue">
                Filtros Activos
              </h3>
            </div>
            <div className="space-y-2">
              {filters.muscleGroup && (
                <div className="flex items-center">
                  <span className="text-sm text-ios-gray-600 mr-2">
                    Grupo muscular:
                  </span>
                  <span className="text-sm font-medium text-ios-gray-900">
                    {filters.muscleGroup}
                  </span>
                </div>
              )}
              {filters.difficulty && (
                <div className="flex items-center">
                  <span className="text-sm text-ios-gray-600 mr-2">
                    Dificultad:
                  </span>
                  <span className="text-sm font-medium text-ios-gray-900">
                    {filters.difficulty}
                  </span>
                </div>
              )}
              {filters.equipment && (
                <div className="flex items-center">
                  <span className="text-sm text-ios-gray-600 mr-2">
                    Equipamiento:
                  </span>
                  <span className="text-sm font-medium text-ios-gray-900">
                    {filters.equipment}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Muscle Groups Filter */}
        <FilterSection
          title="Grupo Muscular"
          options={availableOptions.muscleGroups}
          selectedValue={filters.muscleGroup}
          filterType="muscleGroup"
          iconKey="musculos"
          getOptionIcon={getMuscleGroupIcon}
        />

        {/* Difficulty Filter */}
        <div className="ios-card mb-6">
          <div className="flex items-center mb-4">
            <img
              src={getAppIcon("nivel")}
              alt="Dificultad"
              className="w-6 h-6 mr-3"
            />
            <h3 className="text-lg font-semibold text-ios-gray-900">
              Dificultad
            </h3>
          </div>

          <div className="space-y-2">
            {availableOptions.difficulties.map((difficulty, index) => (
              <DifficultyOption
                key={index}
                difficulty={difficulty}
                isSelected={filters.difficulty === difficulty}
                onPress={() => handleFilterChange("difficulty", difficulty)}
              />
            ))}
          </div>
        </div>

        {/* Equipment Filter */}
        <FilterSection
          title="Equipamiento"
          options={availableOptions.equipment}
          selectedValue={filters.equipment}
          filterType="equipment"
          iconKey="equipamiento"
        />

        {/* Action Buttons */}
        <div className="space-y-4 pb-6">
          <button
            onClick={applyFilters}
            className="w-full ios-button py-4 text-lg font-semibold"
          >
            Aplicar Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-white bg-opacity-30 text-sm px-2 py-1 rounded-full">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full py-4 border-2 border-ios-red text-ios-red rounded-ios font-semibold transition-all duration-200 active:scale-98"
            >
              Limpiar Todos los Filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterScreen;
