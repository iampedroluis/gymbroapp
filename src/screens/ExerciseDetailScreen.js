import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { iconMapping } from "../utils/iconMapping";
import { getExercisesByDay } from "../utils/exerciseUtils";
import ExerciseTimer from "../components/ExerciseTimer";
import useCompletedExercises from "../hooks/useCompletedExercises";

const ExerciseDetailScreen = () => {
  const { exerciseName } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    isExerciseCompleted,
    markExerciseCompleted,
    markExerciseIncomplete,
    generateExerciseKey,
  } = useCompletedExercises();

  // Funciones para manejar el estado de completado
  const handleExerciseComplete = () => {
    if (exercise) {
      const exerciseKey = generateExerciseKey(exercise.dia, exercise.nombre);
      markExerciseCompleted(exerciseKey);
    }
  };

  const handleCheckboxToggle = () => {
    if (exercise) {
      const exerciseKey = generateExerciseKey(exercise.dia, exercise.nombre);
      if (isExerciseCompleted(exerciseKey)) {
        markExerciseIncomplete(exerciseKey);
      } else {
        markExerciseCompleted(exerciseKey);
      }
    }
  };

  const exerciseKey = exercise
    ? generateExerciseKey(exercise.dia, exercise.nombre)
    : null;
  const completed = exerciseKey ? isExerciseCompleted(exerciseKey) : false;

  useEffect(() => {
    if (exerciseName) {
      findExercise(decodeURIComponent(exerciseName));
    }
  }, [exerciseName]);

  const findExercise = (name) => {
    // Buscar el ejercicio en todos los días
    const days = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    for (const day of days) {
      const dayData = getExercisesByDay(day);
      if (dayData && dayData.ejercicios) {
        for (const grupo of dayData.ejercicios) {
          if (grupo.rutina) {
            for (const ejercicio of grupo.rutina) {
              if (ejercicio.nombre === name) {
                // Encontramos el ejercicio, ahora construimos el objeto completo
                const exerciseDetail = {
                  ...ejercicio,
                  grupoMuscular: grupo.nombre,
                  dia: dayData.dia,
                  musculosDelDia: dayData.musculos,
                  descansoGeneral: dayData.descanso,
                  musculo_principal: dayData.musculo_principal,
                };
                setExercise(exerciseDetail);
                setLoading(false);
                return;
              }
            }
          }
        }
      }
    }

    // Si no se encuentra el ejercicio
    setExercise(null);
    setLoading(false);
  };

  const getDifficultyColor = (nivel) => {
    const colors = {
      Principiante: "text-green-600",
      Medio: "text-yellow-600",
      Alto: "text-red-600",
      Avanzado: "text-red-700",
    };
    return colors[nivel] || "text-gray-600";
  };

  const getDifficultyBgColor = (nivel) => {
    const colors = {
      Principiante: "bg-green-100",
      Medio: "bg-yellow-100",
      Alto: "bg-red-100",
      Avanzado: "bg-red-200",
    };
    return colors[nivel] || "bg-gray-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ios-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ios-blue mx-auto mb-4"></div>
          <p className="text-ios-gray-600">Cargando ejercicio...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-ios-gray-50">
        <div className="px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-ios-blue mb-6 text-center mt-5"
          >
            <svg
              className="w-5 h-5 mr-2 "
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

          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <h2 className="text-xl font-semibold text-ios-gray-900 mb-2">
              Ejercicio no encontrado
            </h2>
            <p className="text-ios-gray-600">
              No se pudo encontrar información sobre este ejercicio
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ios-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-ios-blue mb-4"
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

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-ios-gray-900 flex-1 mr-4">
              {exercise.nombre}
            </h1>
            {/* Checkbox de completado */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed-checkbox"
                checked={completed}
                onChange={handleCheckboxToggle}
                className="hidden"
              />
              <label
                htmlFor="completed-checkbox"
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                  completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                {completed && (
                  <svg
                    className="w-5 h-5"
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
              </label>
            </div>
          </div>
          <p className="text-ios-gray-600">
            {exercise.grupoMuscular} • {exercise.dia}
            {completed && (
              <span className="text-green-600 ml-2">• ✅ Completado</span>
            )}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* GIF del ejercicio */}
        {exercise.gif && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 pb-0 h-10">
              <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
                Demostración
              </h3>
            </div>
            <div className="bg-ios-gray-50 ">
              {(() => {
                // Manejar tanto strings como arrays de GIFs
                const gifFile = Array.isArray(exercise.gif)
                  ? exercise.gif[0]
                  : exercise.gif;

                if (gifFile && gifFile.includes(".mp4")) {
                  return (
                    <video
                      src={require(`../media/${gifFile}`)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-70 object-cover"
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
                      alt={exercise.nombre}
                      className="w-full h-104 object-cover"
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
          </div>
        )}

        {/* Información del ejercicio */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
            Información del Ejercicio
          </h3>

          <div className="space-y-4">
            {/* Series y Repeticiones */}
            <div className="flex items-center justify-between p-3 bg-ios-gray-50 rounded-xl">
              <div className="flex items-center">
                <img
                  src={iconMapping.series}
                  alt="Series"
                  className="w-6 h-6 mr-3"
                />
                <span className="font-medium text-ios-gray-900">Series</span>
              </div>
              <span className="text-ios-blue font-semibold">
                {exercise.series}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-ios-gray-50 rounded-xl">
              <div className="flex items-center">
                <img
                  src={iconMapping.repeticiones}
                  alt="Repeticiones"
                  className="w-6 h-6 mr-3"
                />
                <span className="font-medium text-ios-gray-900">
                  Repeticiones
                </span>
              </div>
              <span className="text-ios-blue font-semibold">
                {exercise.repeticiones}
              </span>
            </div>

            {/* Nivel */}
            <div className="flex items-center justify-between p-3 bg-ios-gray-50 rounded-xl">
              <div className="flex items-center">
                <img
                  src={iconMapping.nivel}
                  alt="Nivel"
                  className="w-6 h-6 mr-3"
                />
                <span className="font-medium text-ios-gray-900">Nivel</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBgColor(
                  exercise.nivel
                )} ${getDifficultyColor(exercise.nivel)}`}
              >
                {exercise.nivel}
              </span>
            </div>

            {/* Descanso */}
            <div className="flex items-center justify-between p-3 bg-ios-gray-50 rounded-xl">
              <div className="flex items-center">
                <img
                  src={iconMapping.descanso}
                  alt="Descanso"
                  className="w-6 h-6 mr-3"
                />
                <span className="font-medium text-ios-gray-900">Descanso</span>
              </div>
              <span className="text-ios-gray-700 font-medium">
                {exercise.descanso}
              </span>
            </div>
          </div>
        </div>

        {/* Información del día */}

        {/* Grupo muscular específico */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
            Músculos Principales
          </h3>

          <div className="space-y-3">
            {exercise.musculo_principal &&
            exercise.musculo_principal.length > 0 ? (
              exercise.musculo_principal.map((musculo, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-ios-blue/10 to-ios-blue/5 rounded-xl border border-ios-blue/20"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                      <img
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
                            "Pectoral superior (clavicular)": "pecho",
                            "Pectoral medio (esternocostal)": "pecho",
                            "Pectoral inferior (abdominal)": "pecho",
                            "Dorsal ancho": "espalda",
                            Trapecio: "espalda",
                            Romboides: "espalda",
                          };

                          const iconKey =
                            muscleGroupIconMapping[musculo] || "biceps";
                          return iconMapping[iconKey] || iconMapping.musculos;
                        })()}
                        alt={musculo}
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ios-gray-900">
                        {musculo}
                      </h4>
                      <p className="text-sm text-ios-gray-600">
                        Músculo objetivo{" "}
                        {index === 0 ? "principal" : "secundario"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gradient-to-r from-ios-blue/10 to-ios-blue/5 rounded-xl border border-ios-blue/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                    <img
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
                          "Pectoral superior (clavicular)": "pecho",
                          "Pectoral medio (esternocostal)": "pecho",
                          "Pectoral inferior (abdominal)": "pecho",
                          "Dorsal ancho": "espalda",
                          Trapecio: "espalda",
                          Romboides: "espalda",
                        };

                        const iconKey =
                          muscleGroupIconMapping[exercise.grupoMuscular] ||
                          "biceps";
                        return iconMapping[iconKey] || iconMapping.musculos;
                      })()}
                      alt={exercise.grupoMuscular}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ios-gray-900">
                      {exercise.grupoMuscular}
                    </h4>
                    <p className="text-sm text-ios-gray-600">
                      Músculo objetivo principal
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timer del Ejercicio */}
        <ExerciseTimer
          series={exercise.series}
          descansoSegundos={exercise.descanso}
          onComplete={() => {
            console.log("¡Ejercicio completado!");
          }}
          onExerciseComplete={handleExerciseComplete}
        />

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center py-3 px-4 bg-ios-gray-100 text-ios-gray-700 rounded-2xl font-medium transition-all duration-200 active:scale-95"
          >
            <img src={iconMapping.home} alt="Inicio" className="w-5 h-5 mr-2" />
            Volver al inicio
          </button>
          <button
            onClick={() => navigate("/exercises")}
            className="flex items-center justify-center py-3 px-4 bg-ios-blue text-white rounded-2xl font-medium transition-all duration-200 active:scale-95"
          >
            <img
              src={iconMapping.ejercicios}
              alt="Ejercicios"
              className="w-5 h-5 mr-2 filter brightness-0 invert"
            />
            Ver más ejercicios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailScreen;
