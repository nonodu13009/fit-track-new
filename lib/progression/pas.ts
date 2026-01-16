/**
 * Catalogue des pas de progression technique JJB (Gi) - Style Gracie Barra
 * 64 semaines réparties en 4 cycles de 16 semaines
 */

import { Pas, Paliers, ValidationCriteria, PasType } from "./types";

// Helper pour créer des paliers initiaux
function createInitialPaliers(): Paliers {
  return {
    K: {
      status: "not_started",
      repsCompleted: 0,
    },
    E: {
      status: "not_started",
      totalReps: 0,
      cleanReps: 0,
    },
    A: {
      status: "not_started",
      positionalTest: {
        attempts: 0,
        successes: 0,
        successRate: 0,
        sessions: [],
      },
      targetRate: 40,
    },
    I: {
      status: "not_started",
      freeSparringTest: {
        rounds: 0,
        occurrences: 0,
        sessions: [],
      },
      occurrencesMin: 1,
      sessionsRequired: 2,
    },
  };
}

// Helper pour créer des critères de validation par type
function createValidationCriteria(
  type: PasType,
  volumeMin: number,
  attempts: number,
  targetRate: number
): ValidationCriteria {
  return {
    checkpoints: [], // Sera rempli par chaque pas
    volumeMin,
    positionalTest: {
      attempts,
      targetRate,
    },
    freeSparringTest: {
      rounds: 3,
      occurrencesMin: 1,
    },
    stability: {
      sessionsRequired: 2,
    },
  };
}

// Helper pour créer un pas
function createPas(
  id: string,
  cycle: number,
  week: number,
  order: number,
  title: string,
  objectives: string[],
  type: PasType,
  checkpoints: string[],
  validationCriteria: ValidationCriteria,
  prerequisites?: string[]
): Pas {
  return {
    id,
    cycle,
    week,
    order,
    title,
    objectives,
    type,
    checkpoints,
    paliers: createInitialPaliers(),
    validationCriteria: {
      ...validationCriteria,
      checkpoints,
    },
    prerequisites,
  };
}

// ============================================================================
// CYCLE 1 : Fondations (Semaines 1-16) — "GB1-like"
// ============================================================================

const CYCLE_1_PAS: Pas[] = [
  // Sem. 1-4 : Sécurité + mouvements + survie
  createPas(
    "pas-01-01",
    1,
    1,
    1,
    "Shrimp (déplacement au sol)",
    ["Se déplacer efficacement au sol"],
    "fondamental",
    [
      "Hanches relevées",
      "Jambe poussée correctement",
      "Déplacement fluide des deux côtés",
    ],
    createValidationCriteria("fondamental", 100, 0, 0),
    undefined
  ),
  createPas(
    "pas-01-02",
    1,
    1,
    2,
    "Bridge (pont)",
    ["Renforcer et utiliser le pont"],
    "fondamental",
    [
      "Appui sur tête/épaules",
      "Bridge latéral (rondade)",
      "Bridge avec rotation",
    ],
    createValidationCriteria("fondamental", 100, 0, 0),
    ["pas-01-01"]
  ),
  createPas(
    "pas-01-03",
    1,
    1,
    3,
    "Technical stand-up (relevé technique)",
    ["Se relever en sécurité"],
    "fondamental",
    [
      "Posture correcte",
      "Protection de la tête",
      "Relevé fluide",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-02"]
  ),
  createPas(
    "pas-01-04",
    1,
    2,
    4,
    "Frames de base",
    ["Créer de l'espace avec les frames"],
    "fondamental",
    [
      "Frames en place avant mouvement",
      "Distance créée",
      "Posture défensive maintenue",
    ],
    createValidationCriteria("fondamental", 100, 0, 0),
    ["pas-01-03"]
  ),
  createPas(
    "pas-01-05",
    1,
    2,
    5,
    "Gestion de la distance",
    ["Contrôler la distance avec l'adversaire"],
    "fondamental",
    [
      "Distance appropriée maintenue",
      "Ajustements selon situation",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-04"]
  ),
  createPas(
    "pas-01-06",
    1,
    3,
    6,
    "Escape side control (technique 1)",
    ["Échapper du side control"],
    "escape",
    [
      "Frames en place avant de pousser",
      "Shrimping correct (hanches, espace)",
      "Récupération garde stable",
    ],
    createValidationCriteria("escape", 50, 10, 50),
    ["pas-01-05"]
  ),
  createPas(
    "pas-01-07",
    1,
    3,
    7,
    "Escape side control (technique 2)",
    ["Alternative d'escape du side control"],
    "escape",
    [
      "Technique alternative maîtrisée",
      "Transition fluide",
      "Pas de re-collage immédiat",
    ],
    createValidationCriteria("escape", 50, 10, 50),
    ["pas-01-06"]
  ),
  createPas(
    "pas-01-08",
    1,
    4,
    8,
    "Escape mount (technique 1)",
    ["Échapper de la montée"],
    "escape",
    [
      "Frames en place avant de pousser",
      "Hips escape / bridge au bon timing",
      "Re-guard ou sortie stable",
    ],
    createValidationCriteria("escape", 50, 10, 50),
    ["pas-01-07"]
  ),
  createPas(
    "pas-01-09",
    1,
    4,
    9,
    "Escape mount (technique 2)",
    ["Alternative d'escape de la montée"],
    "escape",
    [
      "Technique alternative maîtrisée",
      "Timing correct",
      "Stabilité après escape",
    ],
    createValidationCriteria("escape", 50, 10, 50),
    ["pas-01-08"]
  ),

  // Sem. 5-8 : Garde fermée
  createPas(
    "pas-01-10",
    1,
    5,
    10,
    "Posture break (technique 1)",
    ["Casser la posture en garde fermée"],
    "fondamental",
    [
      "Grip correct",
      "Mouvement efficace",
      "Posture cassée",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-09"]
  ),
  createPas(
    "pas-01-11",
    1,
    5,
    11,
    "Posture break (technique 2)",
    ["Alternative pour casser la posture"],
    "fondamental",
    [
      "Technique alternative",
      "Efficacité démontrée",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-10"]
  ),
  createPas(
    "pas-01-12",
    1,
    6,
    12,
    "Scissor Sweep",
    ["Exécuter le balayage ciseaux"],
    "sweep",
    [
      "Setup correct (manche + genou)",
      "Exécution du sweep (ciseaux + rotation)",
      "Stabilisation 3 sec après sweep",
    ],
    createValidationCriteria("sweep", 50, 10, 40),
    ["pas-01-11"]
  ),
  createPas(
    "pas-01-13",
    1,
    6,
    13,
    "Hip Bump Sweep",
    ["Exécuter le hip bump sweep"],
    "sweep",
    [
      "Setup correct (manche + hanche)",
      "Exécution (bump + rotation)",
      "Stabilisation 3 sec après sweep",
    ],
    createValidationCriteria("sweep", 50, 10, 40),
    ["pas-01-12"]
  ),
  createPas(
    "pas-01-14",
    1,
    7,
    14,
    "Armbar depuis garde fermée",
    ["Exécuter la clé de bras"],
    "soumission",
    [
      "Setup correct (bras, position)",
      "Exécution armbar (technique propre)",
      "Cycle contrôle → setup → finition",
    ],
    createValidationCriteria("soumission", 30, 10, 30),
    ["pas-01-13"]
  ),
  createPas(
    "pas-01-15",
    1,
    7,
    15,
    "Triangle depuis garde fermée",
    ["Exécuter le triangle choke"],
    "soumission",
    [
      "Setup correct",
      "Exécution triangle (technique propre)",
      "Cycle contrôle → setup → finition",
    ],
    createValidationCriteria("soumission", 30, 10, 30),
    ["pas-01-14"]
  ),
  createPas(
    "pas-01-16",
    1,
    8,
    16,
    "Re-guard de base",
    ["Récupérer la garde depuis positions défavorables"],
    "fondamental",
    [
      "Transition fluide",
      "Garde récupérée stable",
      "Contrôle maintenu",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-15"]
  ),

  // Sem. 9-12 : Demi-garde + passages
  createPas(
    "pas-01-17",
    1,
    9,
    17,
    "Demi-garde knee shield : survivre",
    ["Survivre en demi-garde"],
    "fondamental",
    [
      "Knee shield en place",
      "Frames correctes",
      "Stabilité maintenue",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-16"]
  ),
  createPas(
    "pas-01-18",
    1,
    9,
    18,
    "Demi-garde : récupérer garde complète",
    ["Récupérer la garde complète depuis demi-garde"],
    "fondamental",
    [
      "Transition fluide",
      "Garde complète récupérée",
      "Contrôle établi",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-17"]
  ),
  createPas(
    "pas-01-19",
    1,
    10,
    19,
    "Sweep de demi-garde",
    ["Exécuter un sweep depuis demi-garde"],
    "sweep",
    [
      "Setup correct",
      "Exécution du sweep",
      "Stabilisation 3 sec",
    ],
    createValidationCriteria("sweep", 50, 10, 40),
    ["pas-01-18"]
  ),
  createPas(
    "pas-01-20",
    1,
    11,
    20,
    "Torreando (passage garde ouverte)",
    ["Passer la garde ouverte"],
    "passage",
    [
      "Setup correct (manches + contrôle jambes)",
      "Exécution du pass (torreando)",
      "Stabilisation 3 sec en side control",
    ],
    createValidationCriteria("passage", 50, 10, 30),
    ["pas-01-19"]
  ),
  createPas(
    "pas-01-21",
    1,
    11,
    21,
    "Knee Cut (passage garde fermée)",
    ["Passer la garde fermée"],
    "passage",
    [
      "Setup correct (manche + genou)",
      "Exécution du pass (coupe genou)",
      "Stabilisation 3 sec en side control",
    ],
    createValidationCriteria("passage", 50, 10, 30),
    ["pas-01-20"]
  ),
  createPas(
    "pas-01-22",
    1,
    12,
    22,
    "Stabiliser side control",
    ["Maintenir la position latérale"],
    "contrôle",
    [
      "Position de base (poids, contrôle)",
      "Contrôle des hanches et épaules",
      "Maintien 10 secondes contre résistance",
    ],
    createValidationCriteria("contrôle", 0, 5, 10), // holdTime = 10s
    ["pas-01-21"]
  ),

  // Sem. 13-16 : Contrôles + dos
  createPas(
    "pas-01-23",
    1,
    13,
    23,
    "Transition Side → Mount",
    ["Monter en mount depuis side control"],
    "contrôle",
    [
      "Transition fluide",
      "Mount stable",
      "Contrôle maintenu",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-01-22"]
  ),
  createPas(
    "pas-01-24",
    1,
    14,
    24,
    "Mount : maintien + chaîne d'attaque",
    ["Contrôler la montée et attaquer"],
    "contrôle",
    [
      "Position de base (genoux, équilibre)",
      "Contrôle des bras adversaire",
      "Maintien 10 secondes + 1 chaîne d'attaque",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-01-23"]
  ),
  createPas(
    "pas-01-25",
    1,
    15,
    25,
    "Back control : entrée + maintien",
    ["Contrôler le dos"],
    "contrôle",
    [
      "Position de base (crochets, contrôle)",
      "Contrôle des bras adversaire",
      "Maintien 10 secondes + empêcher 1 escape",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-01-24"]
  ),
  createPas(
    "pas-01-26",
    1,
    16,
    26,
    "Cross-collar choke (dos)",
    ["Exécuter l'étranglement croisé avec Gi"],
    "soumission",
    [
      "Setup correct (collets croisés)",
      "Exécution du choke (technique propre)",
      "Cycle contrôle → setup → finition",
    ],
    createValidationCriteria("soumission", 30, 10, 30),
    ["pas-01-25"]
  ),
];

// ============================================================================
// CYCLE 2 : Intermédiaire (Semaines 17-32) — "GB2-like"
// ============================================================================

const CYCLE_2_PAS: Pas[] = [
  // Sem. 17-20 : Garde ouverte Gi (système 1)
  createPas(
    "pas-02-01",
    2,
    17,
    27,
    "Collar-sleeve : entrée",
    ["Entrer en collar-sleeve"],
    "fondamental",
    [
      "Grips corrects (collet + manche)",
      "Position de base",
      "Contrôle distance",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-01-26"]
  ),
  createPas(
    "pas-02-02",
    2,
    18,
    28,
    "Collar-sleeve : sweep 1",
    ["Exécuter un sweep depuis collar-sleeve"],
    "sweep",
    [
      "Setup depuis collar-sleeve",
      "Exécution du sweep",
      "Stabilisation 3 sec",
    ],
    createValidationCriteria("sweep", 50, 10, 40),
    ["pas-02-01"]
  ),
  createPas(
    "pas-02-03",
    2,
    18,
    29,
    "Collar-sleeve : sweep 2",
    ["Alternative de sweep depuis collar-sleeve"],
    "sweep",
    [
      "Sweep alternatif maîtrisé",
      "Stabilisation 3 sec",
    ],
    createValidationCriteria("sweep", 50, 10, 40),
    ["pas-02-02"]
  ),
  createPas(
    "pas-02-04",
    2,
    19,
    30,
    "Collar-sleeve : back take",
    ["Prendre le dos depuis collar-sleeve"],
    "fondamental",
    [
      "Transition vers dos",
      "Back control établi",
      "Contrôle maintenu",
    ],
    createValidationCriteria("fondamental", 30, 10, 40),
    ["pas-02-03"]
  ),
  createPas(
    "pas-02-05",
    2,
    20,
    31,
    "Retention garde ouverte (récupération 1)",
    ["Récupérer la garde quand on tente de passer"],
    "fondamental",
    [
      "Récupération efficace",
      "Garde rétablie",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-02-04"]
  ),
  createPas(
    "pas-02-06",
    2,
    20,
    32,
    "Retention garde ouverte (récupération 2)",
    ["Alternative de récupération"],
    "fondamental",
    [
      "Technique alternative",
      "Efficacité démontrée",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-02-05"]
  ),

  // Sem. 21-24 : Garde ouverte Gi (système 2)
  createPas(
    "pas-02-07",
    2,
    21,
    33,
    "DLR : entrée",
    ["Entrer en De La Riva"],
    "fondamental",
    [
      "Position DLR correcte",
      "Grips appropriés",
      "Contrôle distance",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-02-06"]
  ),
  createPas(
    "pas-02-08",
    2,
    22,
    34,
    "DLR : off-balance",
    ["Déséquilibrer depuis DLR"],
    "fondamental",
    [
      "Off-balance efficace",
      "Adversaire déséquilibré",
    ],
    createValidationCriteria("fondamental", 50, 0, 0),
    ["pas-02-07"]
  ),
  createPas(
    "pas-02-09",
    2,
    22,
    35,
    "DLR : sweep",
    ["Exécuter un sweep depuis DLR"],
    "sweep",
    [
      "Setup depuis DLR",
      "Exécution du sweep",
      "Stabilisation 3 sec",
    ],
    createValidationCriteria("sweep", 50, 10, 40),
    ["pas-02-08"]
  ),
  createPas(
    "pas-02-10",
    2,
    23,
    36,
    "Transitions garde → top → stabiliser",
    ["Transitions fluides vers top"],
    "fondamental",
    [
      "Transition garde → top",
      "Stabilisation (points)",
      "Contrôle maintenu",
    ],
    createValidationCriteria("fondamental", 30, 10, 40),
    ["pas-02-09"]
  ),

  // Sem. 25-28 : Passages angle + pression
  createPas(
    "pas-02-11",
    2,
    25,
    37,
    "Knee cut : variations",
    ["Variations de knee cut"],
    "passage",
    [
      "Variations maîtrisées",
      "Adaptation selon situation",
      "Stabilisation 3 sec",
    ],
    createValidationCriteria("passage", 50, 10, 30),
    ["pas-02-10"]
  ),
  createPas(
    "pas-02-12",
    2,
    25,
    38,
    "Knee cut : finitions + réponse knee shield",
    ["Finir le passage et répondre aux défenses"],
    "passage",
    [
      "Finitions après passage",
      "Réponse au knee shield",
      "Stabilisation",
    ],
    createValidationCriteria("passage", 50, 10, 30),
    ["pas-02-11"]
  ),
  createPas(
    "pas-02-13",
    2,
    26,
    39,
    "Over/under pass",
    ["Passer avec pression over/under"],
    "passage",
    [
      "Setup correct",
      "Exécution avec pression",
      "Stabilisation 3 sec",
    ],
    createValidationCriteria("passage", 50, 10, 30),
    ["pas-02-12"]
  ),
  createPas(
    "pas-02-14",
    2,
    27,
    40,
    "Pass-to-control : passer → side → mount",
    ["Enchaîner passage → contrôle → mount"],
    "contrôle",
    [
      "Passage réussi",
      "Side control stabilisé",
      "Transition vers mount",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-02-13"]
  ),

  // Sem. 29-32 : Turtle / dos / finitions
  createPas(
    "pas-02-15",
    2,
    29,
    41,
    "Turtle : contrôle + prise de dos",
    ["Contrôler en turtle et prendre le dos"],
    "contrôle",
    [
      "Contrôle en turtle",
      "Prise de dos safe",
      "Back control établi",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-02-14"]
  ),
  createPas(
    "pas-02-16",
    2,
    30,
    42,
    "Back maintain : recapture",
    ["Récupérer le dos si perdu"],
    "contrôle",
    [
      "Recapture efficace",
      "Back control rétabli",
      "Maintien 10 sec",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-02-15"]
  ),
  createPas(
    "pas-02-17",
    2,
    31,
    43,
    "Bow & arrow choke",
    ["Exécuter le bow and arrow choke"],
    "soumission",
    [
      "Setup correct (collet + jambe)",
      "Exécution du choke (technique propre)",
      "Cycle contrôle → setup → finition",
    ],
    createValidationCriteria("soumission", 30, 10, 30),
    ["pas-02-16"]
  ),
  createPas(
    "pas-02-18",
    2,
    32,
    44,
    "Défense prise de dos + escape back",
    ["Prévenir et échapper de la prise de dos"],
    "escape",
    [
      "Prévention efficace",
      "Escape back solide",
      "Sortie stable",
    ],
    createValidationCriteria("escape", 50, 10, 50),
    ["pas-02-17"]
  ),
];

// ============================================================================
// CYCLE 3 : Avancé (Semaines 33-48) — "GB2+ / pré-GB3"
// ============================================================================

const CYCLE_3_PAS: Pas[] = [
  // Sem. 33-36 : Spécialisation garde (A-game)
  createPas(
    "pas-03-01",
    3,
    33,
    45,
    "Spécialisation garde : choix système principal",
    ["Choisir et développer son système de garde principal"],
    "fondamental",
    [
      "Système choisi (collar-sleeve OU DLR)",
      "Compréhension approfondie",
      "Chaînes identifiées",
    ],
    createValidationCriteria("fondamental", 0, 0, 0),
    ["pas-02-18"]
  ),
  createPas(
    "pas-03-02",
    3,
    34,
    46,
    "Chaîne garde 1 : entrée → sweep/back → contrôle → finition",
    ["Construire une chaîne complète depuis la garde"],
    "sweep",
    [
      "Chaîne complète maîtrisée",
      "Enchaînement fluide",
      "Finition ou contrôle",
    ],
    createValidationCriteria("sweep", 30, 10, 40),
    ["pas-03-01"]
  ),
  createPas(
    "pas-03-03",
    3,
    35,
    47,
    "Chaîne garde 2 : alternative complète",
    ["Développer une deuxième chaîne depuis la garde"],
    "sweep",
    [
      "Chaîne alternative maîtrisée",
      "Adaptation selon situation",
      "Efficacité démontrée",
    ],
    createValidationCriteria("sweep", 30, 10, 40),
    ["pas-03-02"]
  ),

  // Sem. 37-40 : Spécialisation passage (A-game)
  createPas(
    "pas-03-04",
    3,
    37,
    48,
    "Spécialisation passage : choix angle + pression",
    ["Choisir son angle et type de pression de passage"],
    "passage",
    [
      "Angle choisi",
      "Type de pression choisi",
      "Compréhension approfondie",
    ],
    createValidationCriteria("passage", 0, 0, 0),
    ["pas-03-03"]
  ),
  createPas(
    "pas-03-05",
    3,
    38,
    49,
    "Chaîne passage 1 : entrée → passer → side → mount/dos",
    ["Construire une chaîne complète de passage"],
    "passage",
    [
      "Chaîne complète maîtrisée",
      "Enchaînement fluide",
      "Mount ou dos établi",
    ],
    createValidationCriteria("passage", 30, 10, 30),
    ["pas-03-04"]
  ),
  createPas(
    "pas-03-06",
    3,
    39,
    50,
    "Chaîne passage 2 : alternative complète",
    ["Développer une deuxième chaîne de passage"],
    "passage",
    [
      "Chaîne alternative maîtrisée",
      "Adaptation selon situation",
      "Efficacité démontrée",
    ],
    createValidationCriteria("passage", 30, 10, 30),
    ["pas-03-05"]
  ),

  // Sem. 41-44 : Anti-game (défenses & contres)
  createPas(
    "pas-03-07",
    3,
    41,
    51,
    "Défense vs passage rapide",
    ["Défendre contre les passages rapides"],
    "fondamental",
    [
      "Reconnaissance du passage rapide",
      "Défense appropriée",
      "Récupération garde",
    ],
    createValidationCriteria("fondamental", 30, 10, 40),
    ["pas-03-06"]
  ),
  createPas(
    "pas-03-08",
    3,
    42,
    52,
    "Défense vs passage pression",
    ["Défendre contre les passages avec pression"],
    "fondamental",
    [
      "Reconnaissance de la pression",
      "Défense appropriée",
      "Récupération garde",
    ],
    createValidationCriteria("fondamental", 30, 10, 40),
    ["pas-03-07"]
  ),
  createPas(
    "pas-03-09",
    3,
    43,
    53,
    "Défense vs grips Gi dominants",
    ["Défendre contre les grips dominants"],
    "fondamental",
    [
      "Reconnaissance des grips",
      "Défense appropriée",
      "Neutralisation",
    ],
    createValidationCriteria("fondamental", 30, 10, 40),
    ["pas-03-08"]
  ),
  createPas(
    "pas-03-10",
    3,
    44,
    54,
    "Early exits : prévention",
    ["Sortir avant d'être collé/écrasé"],
    "escape",
    [
      "Reconnaissance précoce",
      "Sortie anticipée",
      "Prévention efficace",
    ],
    createValidationCriteria("escape", 30, 10, 50),
    ["pas-03-09"]
  ),

  // Sem. 45-48 : Transitions & tempo
  createPas(
    "pas-03-11",
    3,
    45,
    55,
    "Transitions Side → Mount",
    ["Transitions fluides side → mount"],
    "contrôle",
    [
      "Transition fluide",
      "Mount stable",
      "Contrôle maintenu",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-03-10"]
  ),
  createPas(
    "pas-03-12",
    3,
    46,
    56,
    "Transitions Side → Back",
    ["Transitions fluides side → back"],
    "contrôle",
    [
      "Transition fluide",
      "Back control établi",
      "Contrôle maintenu",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-03-11"]
  ),
  createPas(
    "pas-03-13",
    3,
    47,
    57,
    "Transitions Mount → Back",
    ["Transitions fluides mount → back"],
    "contrôle",
    [
      "Transition fluide",
      "Back control établi",
      "Contrôle maintenu",
    ],
    createValidationCriteria("contrôle", 0, 5, 10),
    ["pas-03-12"]
  ),
  createPas(
    "pas-03-14",
    3,
    48,
    58,
    "Gestion du rythme : accélérer / figer",
    ["Gérer le tempo du match"],
    "fondamental",
    [
      "Reconnaissance du moment",
      "Accélération appropriée",
      "Figement efficace",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-03-13"]
  ),
];

// ============================================================================
// CYCLE 4 : Expérimenté (Semaines 49-64) — "GB3-like"
// ============================================================================

const CYCLE_4_PAS: Pas[] = [
  // Sem. 49-52 : Micro-détails & efficacité
  createPas(
    "pas-04-01",
    4,
    49,
    59,
    "Micro-détails : grips optimaux",
    ["Perfectionner les grips"],
    "fondamental",
    [
      "Grips optimaux identifiés",
      "Application correcte",
      "Efficacité maximale",
    ],
    createValidationCriteria("fondamental", 0, 0, 0),
    ["pas-03-14"]
  ),
  createPas(
    "pas-04-02",
    4,
    50,
    60,
    "Micro-détails : angles précis",
    ["Perfectionner les angles"],
    "fondamental",
    [
      "Angles optimaux identifiés",
      "Application correcte",
      "Efficacité maximale",
    ],
    createValidationCriteria("fondamental", 0, 0, 0),
    ["pas-04-01"]
  ),
  createPas(
    "pas-04-03",
    4,
    51,
    61,
    "Micro-détails : timing parfait",
    ["Perfectionner le timing"],
    "fondamental",
    [
      "Timing optimal identifié",
      "Application correcte",
      "Efficacité maximale",
    ],
    createValidationCriteria("fondamental", 0, 0, 0),
    ["pas-04-02"]
  ),
  createPas(
    "pas-04-04",
    4,
    52,
    62,
    "Gestion poids + fatigue",
    ["Gérer le poids et la fatigue"],
    "fondamental",
    [
      "Gestion du poids efficace",
      "Gestion de la fatigue",
      "Performance maintenue",
    ],
    createValidationCriteria("fondamental", 0, 0, 0),
    ["pas-04-03"]
  ),

  // Sem. 53-56 : Contres de contres
  createPas(
    "pas-04-05",
    4,
    53,
    63,
    "Contres de contres : couche 2",
    ["Développer des réponses aux réponses"],
    "fondamental",
    [
      "Contres identifiés",
      "Réponses développées",
      "Efficacité démontrée",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-04"]
  ),

  // Sem. 57-60 : Stratégie match
  createPas(
    "pas-04-06",
    4,
    57,
    64,
    "Stratégie match : scénarios",
    ["Développer une stratégie de match"],
    "fondamental",
    [
      "Scénarios identifiés",
      "Stratégies développées",
      "Plan A + Plan B",
    ],
    createValidationCriteria("fondamental", 0, 0, 0),
    ["pas-04-05"]
  ),
  createPas(
    "pas-04-07",
    4,
    58,
    65,
    "Stratégie match : mener aux points",
    ["Stratégie pour mener aux points"],
    "fondamental",
    [
      "Stratégie claire",
      "Application efficace",
      "Points marqués",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-06"]
  ),
  createPas(
    "pas-04-08",
    4,
    59,
    66,
    "Stratégie match : remonter",
    ["Stratégie pour remonter un score défavorable"],
    "fondamental",
    [
      "Stratégie de remontée",
      "Application efficace",
      "Score amélioré",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-07"]
  ),
  createPas(
    "pas-04-09",
    4,
    60,
    67,
    "Stratégie match : gestion bordure + grips",
    ["Gérer la bordure et les grips en match"],
    "fondamental",
    [
      "Gestion bordure efficace",
      "Gestion grips appropriée",
      "Stratégie adaptée",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-08"]
  ),

  // Sem. 61-64 : Performance & robustesse
  createPas(
    "pas-04-10",
    4,
    61,
    68,
    "Enchaînements sous fatigue",
    ["Maintenir les enchaînements sous fatigue"],
    "fondamental",
    [
      "Techniques en fin de round",
      "Gestion de l'énergie",
      "Performance maintenue",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-09"]
  ),
  createPas(
    "pas-04-11",
    4,
    62,
    69,
    "Sparring match-like : rounds chronométrés",
    ["Sparring avec contraintes de match"],
    "fondamental",
    [
      "Rounds chronométrés",
      "Contraintes respectées",
      "Performance match-like",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-10"]
  ),
  createPas(
    "pas-04-12",
    4,
    63,
    70,
    "Robustesse : tenir sous résistance",
    ["Maintenir le niveau sous résistance"],
    "fondamental",
    [
      "Résistance gérée",
      "Performance maintenue",
      "Robustesse démontrée",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-11"]
  ),
  createPas(
    "pas-04-13",
    4,
    64,
    71,
    "Gagner sans soumettre : contrôle + décisions",
    ["Savoir gagner un round sans soumettre"],
    "fondamental",
    [
      "Contrôle efficace",
      "Décisions appropriées",
      "Victoire par points",
    ],
    createValidationCriteria("fondamental", 0, 10, 40),
    ["pas-04-12"]
  ),
];

// ============================================================================
// Export de tous les pas
// ============================================================================

export const PAS: Pas[] = [
  ...CYCLE_1_PAS,
  ...CYCLE_2_PAS,
  ...CYCLE_3_PAS,
  ...CYCLE_4_PAS,
];

/**
 * Helper pour obtenir un pas par ID
 */
export function getPasById(pasId: string): Pas | undefined {
  return PAS.find((pas) => pas.id === pasId);
}

/**
 * Helper pour obtenir tous les pas d'un cycle
 */
export function getPasByCycle(cycle: number): Pas[] {
  return PAS.filter((pas) => pas.cycle === cycle);
}

/**
 * Helper pour obtenir tous les pas d'une semaine
 */
export function getPasByWeek(cycle: number, week: number): Pas[] {
  return PAS.filter((pas) => pas.cycle === cycle && pas.week === week);
}

/**
 * Helper pour obtenir le nombre total de pas
 */
export function getTotalPasCount(): number {
  return PAS.length;
}

/**
 * Helper pour obtenir le nombre de pas par cycle
 */
export function getPasCountByCycle(cycle: number): number {
  return getPasByCycle(cycle).length;
}
