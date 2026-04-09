import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import HomePage from "./pages/home-page";
import { DashboardLayout } from "./components";
import { ThemeProvider } from "./contexts/theme-context";
import { NotificationProvider } from "./contexts/notification-context";
import { WalletProvider } from "./contexts/wallet-context";
import PortfolioPage from "./pages/portfolio-page";
import WalletPage from "./pages/wallet-page";
import CryptoPage from "./pages/crypto-page";
import PricingPage from "./pages/pricing-page";
import { ProfilePage } from "./pages/profile-page";
import { SettingsPage } from "./pages/settings-page";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "./lib/wagmi-config";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="crypto" element={<CryptoPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <NotificationProvider>
                <WalletProvider>
                  <div className="min-h-screen bg-background text-foreground">
                    <AppRoutes />
                  </div>
                </WalletProvider>
              </NotificationProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
