import React, { useState, useEffect } from "react";
import {
  getAppIcon,
  getDifficultyColor,
  getDifficultyBgColor,
} from "../utils/iconMapping";
import WeeklyCalendar from "./WeeklyCalendar";
import exerciseData from "../data/data.json";

const ExerciseCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState([]);
  const [currentDay, setCurrentDay] = useState(getCurrentDayName());

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = () => {
    try {
      const routineData = exerciseData.rutinas || [];
      setRoutines(routineData);
    } catch (error) {
      console.error("Error loading routines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDaySelect = (day) => {
    setCurrentDay(day);
  };

  const getCurrentDayRoutine = () => {
    return routines.find((routine) => routine.dia === currentDay);
  };

  const ExerciseGroup = ({ group }) => (
    <div className="ios-card mb-4">
      <h3 className="text-lg font-semibold text-ios-gray-900 mb-3">
        {group.nombre}
      </h3>
      <div className="space-y-3">
        {group.rutina.map((exercise, index) => (
          <div key={index} className="p-3 bg-ios-gray-50 rounded-ios">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-ios-gray-900 flex-1">
                {exercise.nombre}
              </h4>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(
                  exercise.nivel
                )} ${getDifficultyColor(exercise.nivel)}`}
              >
                {exercise.nivel}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-ios-gray-600">
              <div className="flex items-center">
                <img
                  src={getAppIcon("series")}
                  alt="Series"
                  className="w-4 h-4 mr-1"
                />
                <span>{exercise.series} series</span>
              </div>
              <div className="flex items-center">
                <img
                  src={getAppIcon("repeticiones")}
                  alt="Repeticiones"
                  className="w-4 h-4 mr-1"
                />
                <span>{exercise.repeticiones} reps</span>
              </div>
              <div className="flex items-center">
                <img
                  src={getAppIcon("descanso")}
                  alt="Descanso"
                  className="w-4 h-4 mr-1"
                />
                <span>{exercise.descanso}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ios-blue mx-auto mb-4"></div>
          <p className="text-ios-gray-600">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  const currentRoutine = getCurrentDayRoutine();

  return (
    <div className="space-y-6">
      <WeeklyCalendar currentDay={currentDay} onDaySelect={handleDaySelect} />

      {currentRoutine ? (
        <div>
          <div className="ios-card mb-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ios-gray-900 mb-2">
                {currentDay}
              </h2>
              <p className="text-ios-blue font-medium mb-1">
                {currentRoutine.musculos}
              </p>
              <div className="flex items-center justify-center text-sm text-ios-gray-600">
                <img
                  src={getAppIcon("descanso")}
                  alt="Descanso"
                  className="w-4 h-4 mr-1"
                />
                <span>Descanso: {currentRoutine.descanso}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {currentRoutine.ejercicios.map((group, index) => (
              <ExerciseGroup key={index} group={group} />
            ))}
          </div>
        </div>
      ) : (
        <div className="ios-card text-center py-12">
          <img
            src={getAppIcon("descanso")}
            alt="Día de descanso"
            className="w-16 h-16 mx-auto mb-4 opacity-50"
          />
          <h3 className="text-lg font-semibold text-ios-gray-900 mb-2">
            Día de Descanso
          </h3>
          <p className="text-ios-gray-600">
            No hay rutina programada para {currentDay}
          </p>
        </div>
      )}
    </div>
  );
};

function getCurrentDayName() {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[new Date().getDay()];
}

export default ExerciseCalendar;
