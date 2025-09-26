import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./screens/Home";
import ExercisesScreen from "./screens/ExercisesScreen";
import MuscleGroupScreen from "./screens/MuscleGroupScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import FilterScreen from "./screens/FilterScreen";
import BottomNavigation from "./components/BottomNavigation";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ios-gray-50 font-ios">
        {/* Main content area with bottom padding for navigation */}
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/exercises" element={<ExercisesScreen />} />
            <Route path="/muscle-groups" element={<MuscleGroupScreen />} />
            <Route
              path="/exercise/:exerciseName"
              element={<ExerciseDetailScreen />}
            />
            <Route path="/filters" element={<FilterScreen />} />
          </Routes>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
