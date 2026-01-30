import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";
import { DashboardLayout } from "./components";
import { ThemeProvider } from "./contexts/theme-context";
import PortfolioPage from "./pages/portfolio-page";
import CryptoPage from "./pages/crypto-page";
import PricingPage from "./pages/pricing-page";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/crypto" element={<CryptoPage />} />
        <Route path="/pricing" element={<PricingPage />} />
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
