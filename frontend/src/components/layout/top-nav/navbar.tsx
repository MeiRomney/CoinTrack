import React, { useState } from "react";
import { useTheme } from "../../../contexts/theme-context";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import {
  Navbar as NavbarUI,
  NavbarActions,
  NavbarAvatar,
  NavbarContent,
  NavbarInner,
  NavbarItem,
  NavbarLinks,
  NavbarLogo,
  NavbarMobileItem,
  NavbarMobileLinks,
  NavbarMobileMenu,
  NavbarMobileMenuButton,
  NavbarMobileProfile,
  NavbarMobileProfileInfo,
  NavbarMobileProfileLink,
  NavbarMobileProfileLinks,
  NavbarNotificationButton,
  NavbarSearch,
  NavbarSection,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  Switch,
  SwitchField,
  Label,
  DropdownDivider,
} from "../../ui";
import { primaryGroupNav } from "./navbar-config";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const { theme, setTheme, actualTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("english");
  const [currency, setCurrency] = useState("usd");

  // Helper function to determine if a route is current
  const isCurrentRoute = (route: string) => {
    if (route === "/dashboard" && location.pathname === "/") return true;
    if (route === "/dashboard" && location.pathname === "/dashboard")
      return true;
    return location.pathname.startsWith(route) && route !== "/dashboard";
  };

  return (
    <NavbarUI className={className}>
      <NavbarContent>
        <NavbarInner>
          <NavbarSection className="flex px-2 lg:px-0">
            <NavbarLogo src="/img/cointrack-logo.png" alt="CoinTrack" />
            <NavbarLinks>
              {primaryGroupNav.map((item) => (
                <NavbarItem
                  key={item.key}
                  href={item.route}
                  active={isCurrentRoute(item.route)}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.route);
                  }}
                >
                  {item.label}
                </NavbarItem>
              ))}
            </NavbarLinks>
          </NavbarSection>

          <NavbarSearch placeholder="Search coins, transactions..." />

          <NavbarMobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          <NavbarActions>
            <NavbarItem>
              <Dropdown>
                <DropdownButton plain className="!bg-transparent !border-none">
                  <Cog6ToothIcon className="!size-6" />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom end">
                  <DropdownItem>
                    <SwitchField>
                      <Label className="flex items-center gap-2 font-medium">
                        Theme
                      </Label>
                      <Switch
                        color="orange"
                        checked={actualTheme === "dark"}
                        onChange={() =>
                          setTheme(actualTheme === "dark" ? "light" : "dark")
                        }
                        title={
                          actualTheme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                        }
                      >
                        {actualTheme === "dark" ? (
                          <MoonIcon className="size-2.5 fill-blue-400" />
                        ) : (
                          <SunIcon className="size-2.5 fill-yellow-500" />
                        )}
                      </Switch>
                    </SwitchField>
                  </DropdownItem>

                  <DropdownDivider />

                  <DropdownItem asChild>
                    <Dropdown>
                      <DropdownButton
                        plain
                        className="!bg-transparent !border-none !p-0 flex items-center justify-between w-full text-sm"
                      >
                        <Label className="font-medium">Language</Label>
                        <span className="flex items-center gap-1 capitalize">
                          {language}
                          <ChevronRightIcon className="w-4 h-4" />
                        </span>
                      </DropdownButton>
                      <DropdownMenu anchor="right start">
                        <DropdownItem onClick={() => setLanguage("english")}>
                          English
                        </DropdownItem>
                        <DropdownItem onClick={() => setLanguage("khmer")}>
                          Khmer
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </DropdownItem>

                  <DropdownDivider />

                  <DropdownItem asChild>
                    <Dropdown>
                      <DropdownButton
                        plain
                        className="!bg-transparent !border-none !p-0 flex items-center justify-between w-full text-sm"
                      >
                        <Label className="font-medium">Currency</Label>
                        <span className="flex items-center gap-1 uppercase">
                          {currency}
                          <ChevronRightIcon className="w-4 h-4" />
                        </span>
                      </DropdownButton>
                      <DropdownMenu anchor="right start">
                        <DropdownItem onClick={() => setCurrency("usd")}>
                          USD
                        </DropdownItem>
                        <DropdownItem onClick={() => setCurrency("khr")}>
                          KHR
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>

            <NavbarNotificationButton
              onClick={() => console.log("Notifications")}
            />

            <Dropdown>
              <DropdownButton
                plain
                className="!bg-transparent !border-none cursor-pointer"
              >
                <NavbarAvatar
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem
                  href="/profile"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Your profile
                </DropdownItem>
                <DropdownItem
                  href="/settings"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/settings");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle sign out
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarActions>
        </NavbarInner>
      </NavbarContent>

      <NavbarMobileMenu isOpen={isMobileMenuOpen}>
        <NavbarMobileLinks>
          {primaryGroupNav.map((item) => (
            <NavbarMobileItem
              key={item.key}
              href={item.route}
              active={isCurrentRoute(item.route)}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.route);
                setIsMobileMenuOpen(false);
              }}
            >
              {item.label}
            </NavbarMobileItem>
          ))}
          <NavbarMobileItem>
            <Dropdown>
              <DropdownButton plain className="!bg-transparent !border-none">
                <Cog6ToothIcon className="!size-6" />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem>
                  <SwitchField>
                    <Label className="flex items-center gap-2 font-medium">
                      Theme
                    </Label>
                    <Switch
                      color="orange"
                      checked={actualTheme === "dark"}
                      onChange={() =>
                        setTheme(actualTheme === "dark" ? "light" : "dark")
                      }
                      title={
                        actualTheme === "dark"
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                    >
                      {actualTheme === "dark" ? (
                        <MoonIcon className="size-2.5 fill-blue-400" />
                      ) : (
                        <SunIcon className="size-2.5 fill-yellow-500" />
                      )}
                    </Switch>
                  </SwitchField>
                </DropdownItem>

                <DropdownDivider />

                <DropdownItem asChild>
                  <Dropdown>
                    <DropdownButton
                      plain
                      className="!bg-transparent !border-none !p-0 flex items-center justify-between w-full text-sm"
                    >
                      <Label className="font-medium">Language</Label>
                      <span className="flex items-center gap-1 capitalize">
                        {language}
                        <ChevronRightIcon className="w-4 h-4" />
                      </span>
                    </DropdownButton>
                    <DropdownMenu anchor="right start">
                      <DropdownItem onClick={() => setLanguage("english")}>
                        English
                      </DropdownItem>
                      <DropdownItem onClick={() => setLanguage("khmer")}>
                        Khmer
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </DropdownItem>

                <DropdownDivider />

                <DropdownItem asChild>
                  <Dropdown>
                    <DropdownButton
                      plain
                      className="!bg-transparent !border-none !p-0 flex items-center justify-between w-full text-sm"
                    >
                      <Label className="font-medium">Currency</Label>
                      <span className="flex items-center gap-1 uppercase">
                        {currency}
                        <ChevronRightIcon className="w-4 h-4" />
                      </span>
                    </DropdownButton>
                    <DropdownMenu anchor="right start">
                      <DropdownItem onClick={() => setCurrency("usd")}>
                        USD
                      </DropdownItem>
                      <DropdownItem onClick={() => setCurrency("khr")}>
                        KHR
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarMobileItem>
        </NavbarMobileLinks>

        <NavbarMobileProfile>
          <NavbarMobileProfileInfo
            name="Tom Cook"
            email="tom@example.com"
            avatarSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            onNotificationClick={() => console.log("Mobile notifications")}
          />
          <NavbarMobileProfileLinks>
            <NavbarMobileProfileLink
              href="/profile"
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile");
                setIsMobileMenuOpen(false);
              }}
            >
              Your profile
            </NavbarMobileProfileLink>
            <NavbarMobileProfileLink
              href="/settings"
              onClick={(e) => {
                e.preventDefault();
                navigate("/settings");
                setIsMobileMenuOpen(false);
              }}
            >
              Settings
            </NavbarMobileProfileLink>
            <NavbarMobileProfileLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Handle sign out
                setIsMobileMenuOpen(false);
              }}
            >
              Sign out
            </NavbarMobileProfileLink>
          </NavbarMobileProfileLinks>
        </NavbarMobileProfile>
      </NavbarMobileMenu>
    </NavbarUI>
  );
}
