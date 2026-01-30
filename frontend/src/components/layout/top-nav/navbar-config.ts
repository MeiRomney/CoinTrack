import {
  CreditCardIcon,
  CurrencyDollarIcon,
  HomeIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import { routeConfig } from "../../../config/navigation/routes";

export const primaryGroupNav = [
  {
    key: "home",
    label: "Home",
    icon: HomeIcon,
    route: routeConfig.home,
  },
  {
    key: "portfolio",
    label: "Portfolio",
    icon: WalletIcon,
    route: routeConfig.portfolio,
  },
  {
    key: "crypto",
    label: "Crypto",
    icon: CurrencyDollarIcon,
    route: routeConfig.crypto,
  },
  {
    key: "pricing",
    label: "Pricing",
    icon: CreditCardIcon,
    route: routeConfig.pricing,
  },
];
