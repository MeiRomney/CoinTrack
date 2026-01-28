import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";
import { DashboardLayout } from "./components";
import { ThemeProvider } from "./contexts/theme-context";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/dashboard" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <AppRoutes />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
