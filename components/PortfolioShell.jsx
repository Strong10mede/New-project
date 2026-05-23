"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import ClassifiedModal from "@/components/ClassifiedModal";
import DesktopWindow from "@/components/DesktopWindow";
import EmulatorModal from "@/components/EmulatorModal";
import MatrixBackground from "@/components/MatrixBackground";
import PCBView from "@/components/PCBView";
import SocMapModal from "@/components/SocMapModal";
import Terminal from "@/components/Terminal";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavbar";
import TuxAssistant from "@/components/TuxAssistant";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { resumeData } from "@/lib/resumeData";

function PortfolioExperience() {
  const [isEmulatorOpen, setIsEmulatorOpen] = useState(false);
  const [isSocMapOpen, setIsSocMapOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [activeView, setActiveView] = useState("terminal");
  const { activateClassifiedMode, deactivateClassifiedMode, isClassifiedMode } = useTheme();
  const viewport = useVisualViewport();

  useKonamiCode(activateClassifiedMode);

  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  return (
    <main
      className="relative isolate h-[var(--visual-viewport-height,100dvh)] w-[var(--visual-viewport-width,100vw)] overflow-hidden bg-transparent"
      style={{
        ...viewport.cssVariables,
        transform: `translate3d(var(--visual-viewport-offset-left), var(--visual-viewport-offset-top), 0)`
      }}
    >
      <MatrixBackground />
      <TopNavbar activeView={activeView} onViewChange={setActiveView} />

      <div className="relative z-10 flex h-full min-h-0 flex-col px-2 pb-16 pt-16 sm:px-6 sm:pb-8 sm:pt-20">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <DesktopWindow
            title={
              activeView === "hardware"
                ? "Mayur PCB Hardware Node"
                : `${resumeData.promptUser}@${resumeData.promptHost}: ~`
            }
          >
            {activeView === "hardware" ? (
              <PCBView />
            ) : (
              <Terminal
                onOpenEmulator={() => setIsEmulatorOpen(true)}
                onOpenHardware={() => setActiveView("hardware")}
                onOpenSocMap={() => setIsSocMapOpen(true)}
              />
            )}
          </DesktopWindow>
        </div>
      </div>

      <EmulatorModal
        isOpen={isEmulatorOpen}
        onClose={() => setIsEmulatorOpen(false)}
      />
      <SocMapModal
        isOpen={isSocMapOpen}
        onClose={() => setIsSocMapOpen(false)}
      />
      <TuxAssistant />
      <ClassifiedModal
        isOpen={isClassifiedMode}
        onClose={deactivateClassifiedMode}
      />
    </main>
  );
}

export default function PortfolioShell() {
  return (
    <ThemeProvider>
      <PortfolioExperience />
    </ThemeProvider>
  );
}
