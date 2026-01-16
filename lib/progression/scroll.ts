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
 * Scroll vers un pas dans la timeline
 */
export function scrollToStep(stepId: string): void {
  // Compatibilité: accepter stepId ou pasId
  const elementId = `pas-${stepId}`;
  scrollToElement(elementId);
}

/**
 * Scroll vers un pas (nouveau nom)
 */
export function scrollToPas(pasId: string): void {
  scrollToStep(pasId);
}

/**
 * Scroll vers le pas actif (utilisé au chargement de la page)
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

/**
 * Alias pour compatibilité
 */
export const scrollToActivePas = scrollToActiveStep;
