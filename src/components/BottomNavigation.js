import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAppIcon } from "../utils/iconMapping";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "home",
      label: "Inicio",
      icon: "home",
      path: "/home",
    },
    {
      id: "exercises",
      label: "Ejercicios",
      icon: "ejercicios",
      path: "/exercises",
    },
    {
      id: "muscles",
      label: "Músculos",
      icon: "musculos",
      path: "/muscle-groups",
    },
    {
      id: "filters",
      label: "Filtros",
      icon: "filter",
      path: "/filters",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ios-gray-200 px-2 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-1 px-3 rounded-ios transition-all duration-200 ${
                isActive
                  ? "text-ios-blue"
                  : "text-ios-gray-500 hover:text-ios-gray-700 active:scale-95"
              }`}
            >
              <img
                src={getAppIcon(item.icon)}
                alt={item.label}
                className={`w-6 h-6 mb-1 transition-all duration-200 ${
                  isActive ? "filter brightness-0 saturate-100" : "opacity-60"
                }`}
                style={
                  isActive
                    ? {
                        filter:
                          "brightness(0) saturate(100%) invert(43%) sepia(97%) saturate(3605%) hue-rotate(208deg) brightness(99%) contrast(101%)",
                      }
                    : {}
                }
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
