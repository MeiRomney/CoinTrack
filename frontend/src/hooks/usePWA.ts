import { useState, useEffect } from "react";

export interface PWAUpdateInfo {
  updateAvailable: boolean;
  waitingWorker: ServiceWorker | null;
  registration: ServiceWorkerRegistration | null;
}

export interface PWAHookResult {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  updateInfo: PWAUpdateInfo;
  installPrompt: (() => Promise<boolean>) | null;
  updateApp: () => Promise<void>;
  showInstallPrompt: () => Promise<boolean>;
}

// PWA installation and update management
export class PWAManager {
  private installPromptEvent: BeforeInstallPromptEvent | null = null;
  private updateCallbacks: Array<(updateInfo: PWAUpdateInfo) => void> = [];
  private onlineCallbacks: Array<(isOnline: boolean) => void> = [];
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initializePWA();
    this.setupInstallPrompt();
    this.setupOnlineDetection();
  }

  private async initializePWA() {
    if (
      !import.meta.env.VITE_PWA_ENABLED ||
      import.meta.env.VITE_PWA_ENABLED !== "true"
    ) {
      console.log("PWA is disabled via environment variable");
      return;
    }

    if ("serviceWorker" in navigator) {
      try {
        // Register the service worker
        this.registration = await navigator.serviceWorker.register("/sw.js");
        console.log(
          "Service worker registered successfully",
          this.registration,
        );

        // Listen for service worker updates
        this.registration.addEventListener("updatefound", () => {
          const newWorker = this.registration?.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("New service worker is waiting");
                this.notifyUpdateCallbacks({
                  updateAvailable: true,
                  waitingWorker: newWorker,
                  registration: this.registration,
                });
              }
            });
          }
        });

        // Listen for controlling service worker changes
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          console.log("Service worker is now controlling the page");
          // Refresh to load new content
          window.location.reload();
        });
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    } else {
      console.log("Service workers are not supported");
    }
  }

  private setupInstallPrompt() {
    window.addEventListener(
      "beforeinstallprompt",
      (event: BeforeInstallPromptEvent) => {
        // Prevent the mini-infobar from appearing on mobile
        event.preventDefault();
        // Save the event so it can be triggered later
        this.installPromptEvent = event;
        console.log("Install prompt event captured");
      },
    );

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      this.installPromptEvent = null;
    });
  }

  private setupOnlineDetection() {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      console.log("Network status changed:", isOnline ? "online" : "offline");
      this.notifyOnlineCallbacks(isOnline);

      // Show/hide offline indicator
      this.toggleOfflineIndicator(!isOnline);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  }

  private toggleOfflineIndicator(show: boolean) {
    let indicator = document.getElementById("offline-indicator");

    if (show && !indicator) {
      // Create offline indicator
      indicator = document.createElement("div");
      indicator.id = "offline-indicator";
      indicator.className = "offline-indicator";
      indicator.textContent =
        "You are currently offline. Some features may not be available.";
      document.body.appendChild(indicator);

      // Animate in
      setTimeout(() => {
        indicator?.classList.add("show");
      }, 100);
    } else if (!show && indicator) {
      // Hide and remove offline indicator
      indicator.classList.remove("show");
      setTimeout(() => {
        indicator?.remove();
      }, 300);
    }
  }

  public isInstallable(): boolean {
    return this.installPromptEvent !== null;
  }

  public isInstalled(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  }

  public async showInstallPrompt(): Promise<boolean> {
    if (!this.installPromptEvent) {
      console.log("No install prompt event available");
      return false;
    }

    try {
      // Show the install prompt
      this.installPromptEvent.prompt();

      // Wait for the user to respond
      const result = await this.installPromptEvent.userChoice;
      console.log("Install prompt result:", result.outcome);

      // Clean up the event
      this.installPromptEvent = null;

      return result.outcome === "accepted";
    } catch (error) {
      console.error("Error showing install prompt:", error);
      return false;
    }
  }

  public async updateApp(): Promise<void> {
    if (!this.registration?.waiting) {
      console.log("No waiting service worker available");
      return;
    }

    try {
      // Tell the waiting service worker to skip waiting and become active
      this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
      console.log("App update initiated");
    } catch (error) {
      console.error("Error updating app:", error);
    }
  }

  public onUpdate(callback: (updateInfo: PWAUpdateInfo) => void) {
    this.updateCallbacks.push(callback);

    // Return cleanup function
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  public onOnlineChange(callback: (isOnline: boolean) => void) {
    this.onlineCallbacks.push(callback);

    // Return cleanup function
    return () => {
      const index = this.onlineCallbacks.indexOf(callback);
      if (index > -1) {
        this.onlineCallbacks.splice(index, 1);
      }
    };
  }

  private notifyUpdateCallbacks(updateInfo: PWAUpdateInfo) {
    this.updateCallbacks.forEach((callback) => callback(updateInfo));
  }

  private notifyOnlineCallbacks(isOnline: boolean) {
    this.onlineCallbacks.forEach((callback) => callback(isOnline));
  }
}

// React hook for PWA functionality
export function usePWA(): PWAHookResult {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<PWAUpdateInfo>({
    updateAvailable: false,
    waitingWorker: null,
    registration: null,
  });

  useEffect(() => {
    const manager = pwaManager;

    // Set up online status listener
    const cleanupOnline = manager.onOnlineChange(setIsOnline);

    // Set up update listener
    const cleanupUpdate = manager.onUpdate(setUpdateInfo);

    // Check initial installable state
    setIsInstallable(manager.isInstallable());

    // Listen for install prompt events
    const handleInstallPrompt = () => {
      setIsInstallable(manager.isInstallable());
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstallPrompt);

    return () => {
      cleanupOnline();
      cleanupUpdate();
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstallPrompt);
    };
  }, []);

  return {
    isOnline,
    isInstallable,
    isInstalled: pwaManager.isInstalled(),
    updateInfo,
    installPrompt: isInstallable
      ? pwaManager.showInstallPrompt.bind(pwaManager)
      : null,
    updateApp: () => pwaManager.updateApp(),
    showInstallPrompt: () => pwaManager.showInstallPrompt(),
  };
}

// Global PWA manager instance
export const pwaManager = new PWAManager();

// Types for install prompt event
declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
