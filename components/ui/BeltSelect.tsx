"use client";

import { useState, useRef, useEffect } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { BeltIcon } from "./BeltIcon";
import { parseBeltGrade, type BeltType } from "@/lib/utils/belt";

interface BeltSelectProps {
  value: string;
  onChange: (value: string) => void;
  grades: readonly string[];
  placeholder?: string;
  className?: string;
  type?: BeltType; // "jjb" ou "judo" pour forcer le type
}

export function BeltSelect({
  value,
  onChange,
  grades,
  placeholder = "Sélectionnez votre grade",
  className = "",
  type,
}: BeltSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const selectedGrade = value || null;
  const selectedBeltInfo = selectedGrade ? parseBeltGrade(selectedGrade, type) : null;

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Bouton déclencheur */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-lg border px-4 py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple/50 ${
          isOpen
            ? "border-accent-purple bg-surface shadow-glow-purple"
            : "border-white/10 bg-surface hover:border-accent-purple/50"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {selectedBeltInfo ? (
              <>
                <BeltIcon grade={selectedGrade!} size={24} />
                <span className="text-white truncate">{selectedGrade}</span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <CaretDown
            size={20}
            className={`text-gray-400 transition-transform flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-surface shadow-lg">
          <div className="py-2">
            {grades.map((grade) => {
              const isSelected = grade === value;
              const beltInfo = parseBeltGrade(grade, type);

              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => {
                    onChange(grade);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 ${
                    isSelected ? "bg-accent-purple/20" : ""
                  }`}
                >
                  {beltInfo ? (
                    <>
                      <BeltIcon grade={grade} size={24} />
                      <span className="text-white flex-1">{grade}</span>
                      {isSelected && (
                        <Check size={18} weight="bold" className="text-accent-purple flex-shrink-0" />
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-white flex-1">{grade}</span>
                      {isSelected && (
                        <Check size={18} weight="bold" className="text-accent-purple flex-shrink-0" />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}