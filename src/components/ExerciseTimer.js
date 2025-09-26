import React, { useState, useEffect } from "react";

const ExerciseTimer = ({
  series,
  descansoSegundos,
  onComplete,
  onExerciseComplete,
}) => {
  const [currentSeries, setCurrentSeries] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Convertir tiempo de descanso de formato "60-90 segundos" a número
  const parseRestTime = (descansoStr) => {
    if (!descansoStr) return 60; // default
    const match = descansoStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 60;
  };

  const restSeconds = parseRestTime(descansoSegundos);

  useEffect(() => {
    let interval;
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            setTimerActive(false);
            // Avanzar automáticamente a la siguiente serie
            if (currentSeries < series) {
              setCurrentSeries((prevSeries) => prevSeries + 1);
            } else {
              // Es la última serie, completar ejercicio
              setIsCompleted(true);
              if (onComplete) onComplete();
              if (onExerciseComplete) onExerciseComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [
    isResting,
    restTime,
    currentSeries,
    series,
    onComplete,
    onExerciseComplete,
  ]);

  const startSeries = () => {
    setTimerActive(true);
    // Iniciar inmediatamente el período de descanso
    setIsResting(true);
    setRestTime(restSeconds);
  };

  const completeSeries = () => {
    // Función para cuando el usuario complete manualmente la serie actual
    if (currentSeries < series) {
      setIsResting(true);
      setRestTime(restSeconds);
    } else {
      // Es la última serie
      setIsCompleted(true);
      setTimerActive(false);
      if (onComplete) onComplete();
      if (onExerciseComplete) onExerciseComplete();
    }
  };

  const resetTimer = () => {
    setCurrentSeries(1);
    setIsResting(false);
    setRestTime(0);
    setIsCompleted(false);
    setTimerActive(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-bold text-green-600 mb-2">
            ¡Ejercicio Completado!
          </h3>
          <p className="text-ios-gray-600 mb-4">
            Has completado todas las {series} series
          </p>
          <button
            onClick={resetTimer}
            className="bg-ios-blue text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 active:scale-95"
          >
            Repetir Ejercicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="text-center">
        {/* Contador de Series */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-ios-gray-900 mb-2">
            Serie {currentSeries} de {series}
          </h3>
          <div className="flex justify-center space-x-2">
            {[...Array(series)].map((_, index) => {
              let circleClass;
              if (index < currentSeries - 1) {
                // Series completadas - verde
                circleClass = "bg-green-500";
              } else if (index === currentSeries - 1) {
                // Serie actual - azul tanto si está activa como descansando
                circleClass = "bg-blue-500";
              } else {
                // Series pendientes - gris
                circleClass = "bg-ios-gray-200";
              }

              return (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${circleClass}`}
                />
              );
            })}
          </div>
        </div>

        {/* Timer de Descanso */}
        {isResting && (
          <div className="mb-6">
            {/* Círculo de progreso mejorado con SVG */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 120 120"
              >
                {/* Círculo de fondo */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Círculo de progreso */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={314.16} // 2 * π * 50
                  strokeDashoffset={314.16 * (restTime / restSeconds)}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              {/* Número del contador */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">
                  {restTime}
                </span>
              </div>
            </div>

            <p className="text-lg font-semibold text-blue-600 mb-2">
              {currentSeries < series
                ? `Serie ${currentSeries} completada`
                : "¡Todas las series completadas!"}
            </p>
            <p className="text-sm text-gray-500">Descansando...</p>
          </div>
        )}

        {/* Botones de Control */}
        <div className="space-y-3">
          {!isResting && !timerActive && currentSeries === 1 && (
            <button
              onClick={startSeries}
              className="w-full bg-ios-blue text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 active:scale-95"
            >
              Descanso
            </button>
          )}

          {!isResting && !timerActive && currentSeries > 1 && (
            <button
              onClick={completeSeries}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 active:scale-95"
            >
              ✅ Completar Serie {currentSeries}
            </button>
          )}

          {isResting && (
            <div className="space-y-2">
              <button
                disabled
                className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-semibold text-lg cursor-not-allowed border-2 border-blue-200"
              >
                ⏱️ Descansando... {restTime}s
              </button>
              <p className="text-xs text-ios-gray-500 text-center">
                {currentSeries < series
                  ? `Siguiente: Serie ${currentSeries + 1} de ${series}`
                  : "¡Última serie completada!"}
              </p>
            </div>
          )}

          {(currentSeries > 1 || timerActive) && (
            <button
              onClick={resetTimer}
              className="w-full bg-ios-gray-100 text-ios-gray-700 py-3 rounded-2xl font-medium transition-all duration-200 active:scale-95"
            >
              🔄 Reiniciar Ejercicio
            </button>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 pt-4 border-t border-ios-gray-100">
          <p className="text-sm text-ios-gray-600">
            Descanso entre series: {descansoSegundos}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimer;
