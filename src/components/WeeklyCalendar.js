import React, { useState } from "react";

const WeeklyCalendar = ({ currentDay, onDaySelect }) => {
  const daysOfWeek = [
    { name: "Lunes", short: "L" },
    { name: "Martes", short: "M" },
    { name: "Miércoles", short: "X" },
    { name: "Jueves", short: "J" },
    { name: "Viernes", short: "V" },
    { name: "Sábado", short: "S" },
    { name: "Domingo", short: "D" },
  ];

  return (
    <div className="ios-card mb-6">
      <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
        Calendario Semanal
      </h3>
      <div className="flex justify-between">
        {daysOfWeek.map((day, index) => {
          const isSelected = currentDay === day.name;
          const isToday = getCurrentDayName() === day.name;

          return (
            <button
              key={index}
              onClick={() => onDaySelect(day.name)}
              className={`flex flex-col items-center p-3 rounded-ios transition-all duration-200 active:scale-95 ${
                isSelected
                  ? "bg-ios-blue text-white"
                  : isToday
                  ? "bg-ios-green bg-opacity-10 text-ios-green"
                  : "text-ios-gray-600 hover:bg-ios-gray-100"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : ""
                }`}
              >
                {day.short}
              </span>
              <span
                className={`text-xs mt-1 ${
                  isSelected ? "text-white" : "text-ios-gray-500"
                }`}
              >
                {day.name.slice(0, 3)}
              </span>
              {isToday && !isSelected && (
                <div className="w-1 h-1 bg-ios-green rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
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

export default WeeklyCalendar;
