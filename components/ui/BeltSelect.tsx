"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculer la position du dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px = mt-2
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideSelect = selectRef.current?.contains(target);
      const isClickInsideDropdown = dropdownRef.current?.contains(target);
      
      if (!isClickInsideSelect && !isClickInsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Petit délai pour éviter de fermer immédiatement après l'ouverture
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const selectedGrade = value || null;
  const selectedBeltInfo = selectedGrade ? parseBeltGrade(selectedGrade, type) : null;

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="fixed z-[100] max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-surface shadow-lg"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
      }}
    >
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
  );

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Bouton déclencheur */}
      <button
        ref={buttonRef}
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

      {/* Dropdown avec portail pour éviter les problèmes d'overflow */}
      {isOpen && typeof window !== "undefined" && createPortal(dropdownContent, document.body)}
    </div>
  );
}