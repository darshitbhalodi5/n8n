"use client";

import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, ChevronDown } from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";

export function CanvasControls() {
  const { handleZoomIn, handleZoomOut, handleFitView, zoomLevel } = useWorkflow();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      // Use both mousedown and click for better compatibility
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Detect OS for keyboard shortcut display
  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const cmdKey = isMac ? "⌘" : "Ctrl";

  const menuItems = [
    {
      id: "zoom-in",
      label: "Zoom in",
      shortcut: `${cmdKey} +`,
      icon: ZoomIn,
      onClick: () => {
        handleZoomIn();
      },
      disabled: false,
    },
    {
      id: "zoom-out",
      label: "Zoom out",
      shortcut: `${cmdKey} -`,
      icon: ZoomOut,
      onClick: () => {
        handleZoomOut();
      },
      disabled: false,
    },
    {
      id: "zoom-to-fit",
      label: "Zoom to fit",
      shortcut: "D",
      icon: Maximize2,
      onClick: () => {
        handleFitView();
      },
      disabled: false,
    },
    {
      id: "zoom-to-selection",
      label: "Zoom to selection",
      shortcut: "F",
      icon: Maximize2,
      onClick: () => {},
      disabled: true,
    },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2" ref={dropdownRef}>
      {/* Zoom Level Indicator */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-3 py-1.5 rounded-full text-white/80 text-xs hover:bg-white/5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <span>{zoomLevel}%</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden min-w-[200px]">
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-xs transition-all duration-200 text-left ${
                    item.disabled
                      ? "text-white/30 cursor-not-allowed"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-white/50 font-normal">
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
