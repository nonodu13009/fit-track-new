/**
 * Helpers pour le scroll vers une step cible
 */

/**
 * Scroll vers un élément avec smooth behavior
 */
export function scrollToElement(
  elementId: string,
  options: ScrollIntoViewOptions = {}
): void {
  if (typeof window === "undefined") {
    return;
  }

  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
    ...options,
  });
}

/**
 * Scroll vers une step dans la timeline
 */
export function scrollToStep(stepId: string): void {
  const elementId = `step-node-${stepId}`;
  scrollToElement(elementId);
}

/**
 * Scroll vers la step active (utilisé au chargement de la page)
 */
export function scrollToActiveStep(stepId: string | null): void {
  if (!stepId) {
    return;
  }
  
  // Petit délai pour s'assurer que le DOM est prêt
  setTimeout(() => {
    scrollToStep(stepId);
  }, 100);
}
