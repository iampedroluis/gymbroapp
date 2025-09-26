import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getExercisesByDay } from "../utils/exerciseUtils";
import { iconMapping, getAppIcon } from "../utils/iconMapping";
import useCompletedExercises from "../hooks/useCompletedExercises";

const Home = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exercisesForDay, setExercisesForDay] = useState([]);

  const { isExerciseCompleted, generateExerciseKey } = useCompletedExercises();

  // Días de la semana en español
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Obtener el día de la semana en español
  const getDayInSpanish = (date) => {
    const dayIndex = date.getDay();
    const spanishDays = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return spanishDays[dayIndex];
  };

  // Cargar ejercicios cuando cambia la fecha seleccionada
  useEffect(() => {
    const dayName = getDayInSpanish(selectedDate);
    const dayData = getExercisesByDay(dayName);

    if (dayData && dayData.ejercicios) {
      // Aplanar todos los ejercicios del día
      const allExercisesForDay = [];
      dayData.ejercicios.forEach((grupo) => {
        if (grupo.rutina) {
          grupo.rutina.forEach((ejercicio) => {
            allExercisesForDay.push({
              ...ejercicio,
              grupoMuscular: grupo.nombre,
              diaCompleto: dayData.dia,
              musculosDelDia: dayData.musculos,
            });
          });
        }
      });
      setExercisesForDay(allExercisesForDay);
    } else {
      setExercisesForDay([]);
    }
  }, [selectedDate]);

  // Generar días de la semana actual
  const generateWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.

    // Calcular el inicio de la semana (Domingo)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Verificar si una fecha tiene ejercicios
  const hasExercises = (date) => {
    const dayName = getDayInSpanish(date);
    const dayData = getExercisesByDay(dayName);
    return dayData && dayData.ejercicios && dayData.ejercicios.length > 0;
  };

  // Manejar click en ejercicio
  const handleExerciseClick = (ejercicio) => {
    // Preparado para futuro: navegación al detalle del ejercicio
    navigate(`/exercise/${encodeURIComponent(ejercicio.nombre)}`);
  };

  const weekDays = generateWeekDays();

  return (
    <div className="min-h-screen bg-ios-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-ios-gray-900 text-center">
            Rutina de Ejercicios
          </h1>
        </div>

        {/* Calendario - Semana Actual */}
        <div className="px-4 pb-4">
          {/* Título de semana actual */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-ios-gray-900">
              Semana Actual
            </h2>
            <p className="text-sm text-ios-gray-600">
              {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
            </p>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center py-2 text-sm font-medium text-ios-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => {
              const isSelected =
                day.toDateString() === selectedDate.toDateString();
              const isToday = day.toDateString() === new Date().toDateString();
              const hasWorkout = hasExercises(day);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative h-12 w-12 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? "bg-ios-blue text-white shadow-lg scale-110"
                        : isToday
                        ? "bg-ios-blue/20 text-ios-blue ring-2 ring-ios-blue/30"
                        : "text-ios-gray-900 hover:bg-ios-gray-100"
                    }
                  `}
                >
                  {day.getDate()}
                  {hasWorkout && (
                    <div
                      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        isSelected ? "bg-white" : "bg-ios-blue"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-4 py-4">
        {/* Información del día seleccionado */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-ios-gray-900 mb-1">
            {getDayInSpanish(selectedDate)}
          </h3>
          <p className="text-sm text-ios-gray-600">
            {selectedDate.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Cards de ejercicios */}
        {exercisesForDay.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-ios-blue/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center mb-2">
                {exercisesForDay[0]?.musculo_principal &&
                  exercisesForDay[0].musculo_principal.map((musculo, index) => (
                    <img
                      key={index}
                      src={(() => {
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
                        };
                        const iconKey =
                          muscleGroupIconMapping[musculo] || "biceps";
                        return getAppIcon(iconKey);
                      })()}
                      alt={musculo}
                      className="w-6 h-6 mr-2"
                    />
                  ))}
                <h4 className="font-semibold text-ios-gray-900">
                  Músculos del día: {exercisesForDay[0]?.musculosDelDia}
                </h4>
              </div>
              <p className="text-sm text-ios-gray-600">
                {exercisesForDay.length} ejercicio
                {exercisesForDay.length !== 1 ? "s" : ""} programado
                {exercisesForDay.length !== 1 ? "s" : ""}
              </p>
            </div>

            {exercisesForDay.map((ejercicio, index) => {
              const isCompleted = isExerciseCompleted(
                generateExerciseKey(
                  getDayInSpanish(selectedDate),
                  ejercicio.nombre
                )
              );
              return (
                <div
                  key={index}
                  onClick={() => handleExerciseClick(ejercicio)}
                  className={`rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    isCompleted
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* GIF del ejercicio */}
                    {ejercicio.gif && (
                      <div className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden bg-ios-gray-50 shadow-inner">
                        {(() => {
                          // Manejar tanto strings como arrays de GIFs
                          const gifFile = Array.isArray(ejercicio.gif)
                            ? ejercicio.gif[0]
                            : ejercicio.gif;

                          if (gifFile && gifFile.includes(".mp4")) {
                            return (
                              <video
                                src={require(`../media/${gifFile}`)}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.log("Error cargando video:", gifFile);
                                  e.target.style.display = "none";
                                }}
                              />
                            );
                          } else if (gifFile) {
                            return (
                              <img
                                src={require(`../media/${gifFile}`)}
                                alt={ejercicio.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.log("Error cargando gif:", gifFile);
                                  e.target.style.display = "none";
                                }}
                              />
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-ios-gray-900 truncate flex-1 mr-2">
                          {ejercicio.nombre}
                        </h5>
                        {/* Indicador de completado */}
                        {isExerciseCompleted(
                          generateExerciseKey(
                            getDayInSpanish(selectedDate),
                            ejercicio.nombre
                          )
                        ) && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-ios-gray-600 mb-2">
                        {ejercicio.grupoMuscular}
                        {isExerciseCompleted(
                          generateExerciseKey(
                            getDayInSpanish(selectedDate),
                            ejercicio.nombre
                          )
                        ) && (
                          <span className="text-green-600 ml-2">
                            • Completado
                          </span>
                        )}
                      </p>

                      {/* Información del ejercicio */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-ios-gray-500">
                        <div className="flex items-center space-x-1">
                          <img
                            src={iconMapping.series}
                            alt="Series"
                            className="w-4 h-4"
                          />
                          <span>{ejercicio.series} series</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <img
                            src={iconMapping.repeticiones}
                            alt="Repeticiones"
                            className="w-4 h-4"
                          />
                          <span>{ejercicio.repeticiones} reps</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <img
                            src={iconMapping.nivel}
                            alt="Nivel"
                            className="w-4 h-4"
                          />
                          <span>{ejercicio.nivel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Descanso */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-ios-gray-600">
                      <img
                        src={iconMapping.descanso}
                        alt="Descanso"
                        className="w-4 h-4"
                      />
                      <span>Descanso: {ejercicio.descanso}</span>
                    </div>

                    <div className="text-ios-blue">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <img
              src={iconMapping.descanso}
              alt="Descanso"
              className="w-16 h-16 mx-auto mb-4 opacity-50"
            />
            <h4 className="font-semibold text-ios-gray-900 mb-2">
              Día de descanso
            </h4>
            <p className="text-sm text-ios-gray-600">
              No hay ejercicios programados para este día. ¡Disfruta tu
              descanso!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
