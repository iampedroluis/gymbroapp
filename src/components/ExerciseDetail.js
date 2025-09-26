import React from "react";
import {
  getAppIcon,
  getMuscleGroupIcon,
  getDifficultyColor,
  getDifficultyBgColor,
} from "../utils/iconMapping";

const ExerciseDetail = ({ exercise, onClose }) => {
  if (!exercise) return null;

  const InfoRow = ({
    icon,
    label,
    value,
    valueColor = "text-ios-gray-900",
  }) => (
    <div className="flex items-center py-2">
      <img src={getAppIcon(icon)} alt={label} className="w-5 h-5 mr-3" />
      <span className="text-ios-gray-600 mr-2">{label}:</span>
      <span className={`font-medium ${valueColor}`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl max-h-96 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ios-gray-200">
          <h2 className="text-lg font-semibold text-ios-gray-900 flex-1 truncate">
            {exercise.Ejercicio}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-ios-gray-500 hover:text-ios-gray-700 active:scale-95 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {/* Exercise Icon and Basic Info */}
          <div className="flex items-center mb-4">
            <img
              src={getMuscleGroupIcon(exercise["Grupo muscular"])}
              alt={exercise["Grupo muscular"]}
              className="w-12 h-12 rounded-ios mr-4"
            />
            <div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBgColor(
                  exercise.Dificultad
                )} ${getDifficultyColor(exercise.Dificultad)} mb-1`}
              >
                {exercise.Dificultad}
              </div>
              <span className="px-3 py-1 bg-ios-blue bg-opacity-10 text-ios-blue text-sm rounded-full font-medium">
                {exercise["Grupo muscular"]}
              </span>
            </div>
          </div>

          {/* Exercise Details */}
          <div className="space-y-1">
            <InfoRow
              icon="equipamiento"
              label="Equipamiento"
              value={exercise.Equipamiento}
            />
            <InfoRow
              icon="fuerza"
              label="Tipo de fuerza"
              value={exercise["Tipo de fuerza"]}
            />
            <InfoRow
              icon="musculos"
              label="Mecánica"
              value={exercise.Mecanica}
            />
            <InfoRow
              icon="musculo-principal"
              label="Músculo involucrado"
              value={exercise["Músculo involucrado"]}
            />
            {exercise["Parte específica"] && (
              <InfoRow
                icon="musculos"
                label="Parte específica"
                value={exercise["Parte específica"]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
