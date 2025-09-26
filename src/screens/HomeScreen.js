import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAppIcon } from "../utils/iconMapping";
import { getAllExercises } from "../utils/exerciseUtils";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalExercises: 0,
    muscleGroups: 0,
    difficulties: {},
    equipmentTypes: 0,
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const exercises = getAllExercises();
    const uniqueExercises = new Set();
    const uniqueMuscleGroups = new Set();
    const uniqueEquipment = new Set();
    const difficulties = {};

    exercises.forEach((exercise) => {
      uniqueExercises.add(exercise.Ejercicio);
      uniqueMuscleGroups.add(exercise["Grupo muscular"]);
      uniqueEquipment.add(exercise.Equipamiento);

      const difficulty = exercise.Dificultad;
      difficulties[difficulty] = (difficulties[difficulty] || 0) + 1;
    });

    setStats({
      totalExercises: uniqueExercises.size,
      muscleGroups: uniqueMuscleGroups.size,
      difficulties,
      equipmentTypes: uniqueEquipment.size,
    });
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`ios-card border-l-4`} style={{ borderLeftColor: color }}>
      <div className="flex items-center">
        <img src={getAppIcon(icon)} alt={title} className="w-8 h-8 mr-3" />
        <div>
          <div className="text-2xl font-bold text-ios-gray-900">{value}</div>
          <div className="text-sm text-ios-gray-600">{title}</div>
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ title, icon, color, onPress }) => (
    <button
      onClick={onPress}
      className="ios-button flex flex-col items-center justify-center h-24 w-full text-white transition-all duration-200 active:scale-95"
      style={{ backgroundColor: color }}
    >
      <img
        src={getAppIcon(icon)}
        alt={title}
        className="w-8 h-8 mb-2 filter brightness-0 invert"
      />
      <span className="text-sm font-medium">{title}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-ios-gray-50">
      {/* Header */}
      <div className="bg-white shadow-ios mb-6">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-ios-gray-900 mb-2">ZeveApp</h1>
          <p className="text-ios-gray-600">Tu compañero de entrenamiento</p>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Hero Section */}
        <div className="ios-card text-center py-8">
          <img
            src={getAppIcon("ejercicios")}
            alt="Ejercicios"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-ios-gray-900 mb-2">
            ¡Comienza tu entrenamiento!
          </h2>
          <p className="text-ios-gray-600">
            Descubre ejercicios personalizados para cada grupo muscular
          </p>
        </div>

        {/* Statistics */}
        <div>
          <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
            Estadísticas
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              title="Total Ejercicios"
              value={stats.totalExercises}
              icon="ejercicios"
              color="#007AFF"
            />
            <StatCard
              title="Grupos Musculares"
              value={stats.muscleGroups}
              icon="musculos"
              color="#34C759"
            />
            <StatCard
              title="Tipos de Equipamiento"
              value={stats.equipmentTypes}
              icon="equipamiento"
              color="#FF9500"
            />
            <StatCard
              title="Niveles de Dificultad"
              value={Object.keys(stats.difficulties).length}
              icon="nivel"
              color="#FF3B30"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton
              title="Explorar Ejercicios"
              icon="ejercicios"
              color="#007AFF"
              onPress={() => navigate("/exercises")}
            />
            <QuickActionButton
              title="Grupos Musculares"
              icon="musculos"
              color="#34C759"
              onPress={() => navigate("/muscle-groups")}
            />
          </div>
        </div>

        {/* Difficulty Distribution */}
        {Object.keys(stats.difficulties).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
              Distribución por Dificultad
            </h3>
            <div className="ios-card space-y-3">
              {Object.entries(stats.difficulties).map(([difficulty, count]) => {
                const colors = {
                  Principiante: "#34C759",
                  Medio: "#FF9500",
                  Alto: "#FF3B30",
                  Avanzado: "#FF3B30",
                };
                const color = colors[difficulty] || "#8E8E93";

                return (
                  <div
                    key={difficulty}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-ios-gray-900">{difficulty}</span>
                    </div>
                    <span className="font-semibold text-ios-gray-700">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
