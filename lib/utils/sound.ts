/**
 * Utilitaire pour jouer des effets sonores de célébration
 */

// Cache pour les fichiers audio chargés
let ossAudio: HTMLAudioElement | null = null;

/**
 * Charge le fichier audio "oss" une seule fois
 */
function loadOssAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  
  if (!ossAudio) {
    try {
      ossAudio = new Audio("/sounds/oss.mp3");
      ossAudio.preload = "auto";
      ossAudio.volume = 0.7;
    } catch (error) {
      console.debug("Could not load OSS audio file:", error);
      return null;
    }
  }
  return ossAudio;
}

/**
 * Joue le son "oss" (fichier audio) ou un son synthétique en fallback
 */
export function playCelebrationSound(): void {
  const audio = loadOssAudio();
  
  if (audio) {
    // Essayer de jouer le fichier audio "oss"
    audio.currentTime = 0;
    audio.play().catch((error) => {
      // Si la lecture échoue (par exemple, pas de fichier), utiliser le fallback
      console.debug("Could not play OSS audio, using fallback:", error);
      playCelebrationSoundFallback();
    });
  } else {
    // Fallback vers son synthétique si le fichier n'existe pas
    playCelebrationSoundFallback();
  }
}

/**
 * Joue un son de célébration synthétique (fallback)
 */
function playCelebrationSoundFallback(): void {
  try {
    // Créer un contexte audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Fréquences pour un accord joyeux (Do-Mi-Sol)
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      
      // Enveloppe d'amplitude (fade in/out)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + index * 0.1);
      
      oscillator.start(audioContext.currentTime + index * 0.05);
      oscillator.stop(audioContext.currentTime + 0.6 + index * 0.1);
    });
  } catch (error) {
    // Si Web Audio API n'est pas disponible, ignorer silencieusement
    console.debug("Audio context not available:", error);
  }
}

/**
 * Joue un son de succès court
 */
export function playSuccessSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.25);
  } catch (error) {
    console.debug("Audio context not available:", error);
  }
}
