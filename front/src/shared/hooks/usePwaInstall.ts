import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// 1. VARIABLES GLOBALES HORS DE REACT
// Elles survivent à la navigation et s'initialisent dès le chargement de l'app.
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<
  (prompt: BeforeInstallPromptEvent | null) => void
>();

// 2. ÉCOUTEUR GLOBAL (Attrape l'événement même sur la page Login)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;

    // On avertit tous les composants React qui écoutent (Dashboard, Profile...)
    promptListeners.forEach((listener) => listener(globalDeferredPrompt));
  });
}

export const usePwaInstall = () => {
  // On s'initialise avec la variable globale (si l'event a déjà été attrapé sur le Login)
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);

  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('pwa_prompt_dismissed') === 'true';
  });

  useEffect(() => {
    // 3. Abonnement aux futures mises à jour du prompt global
    const handlePromptChange = (prompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(prompt);
    };
    promptListeners.add(handlePromptChange);

    // 4. On vérifie immédiatement si l'app est ouverte depuis l'écran d'accueil
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as any).standalone);
    setIsInstalled(!!isStandalone);

    // 5. On écoute le succès de l'installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. Écoute active du changement de mode d'affichage (ex: l'utilisateur installe et lance)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      promptListeners.delete(handlePromptChange); // Nettoyage de l'abonnement
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;

    // Déclenche la modale système d'installation
    await deferredPrompt.prompt();

    // Attend le choix de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    // S'il accepte, on purge le prompt
    if (outcome === 'accepted') {
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
    }
  };

  const dismissPrompt = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  return {
    isInstallable: !!deferredPrompt && !isInstalled && !isDismissed,
    isInstalled,
    promptInstall,
    dismissPrompt,
  };
};
