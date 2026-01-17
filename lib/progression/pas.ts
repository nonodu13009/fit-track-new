/**
 * Catalogue des pas de progression technique JJB (Gi) - Style Gracie Barra
 * 64 semaines réparties en 4 cycles de 16 semaines
 */

import { Pas, Paliers, ValidationCriteria, PasType, Checkpoint } from "./types";

// Helper pour créer un checkpoint
function createCheckpoint(label: string, explanation?: string): Checkpoint {
  return { label, explanation };
}

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
  checkpoints: Checkpoint[],
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
      createCheckpoint("Hanches relevées"),
      createCheckpoint("Jambe poussée correctement"),
      createCheckpoint("Déplacement fluide des deux côtés"),
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
      createCheckpoint("Appui sur tête/épaules"),
      createCheckpoint("Bridge latéral (rondade)"),
      createCheckpoint("Bridge avec rotation"),
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
      createCheckpoint("Posture correcte"),
      createCheckpoint("Protection de la tête"),
      createCheckpoint("Relevé fluide"),
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
      createCheckpoint("Frames en place avant mouvement"),
      createCheckpoint("Distance créée"),
      createCheckpoint("Posture défensive maintenue"),
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
      createCheckpoint("Distance appropriée maintenue"),
      createCheckpoint("Ajustements selon situation"),
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
      createCheckpoint("Frames en place avant de pousser"),
      createCheckpoint("Shrimping correct (hanches, espace)"),
      createCheckpoint("Récupération garde stable"),
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
      createCheckpoint("Technique alternative maîtrisée"),
      createCheckpoint("Transition fluide"),
      createCheckpoint("Pas de re-collage immédiat"),
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
      createCheckpoint("Frames en place avant de pousser"),
      createCheckpoint("Hips escape / bridge au bon timing"),
      createCheckpoint("Re-guard ou sortie stable"),
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
      createCheckpoint("Technique alternative maîtrisée"),
      createCheckpoint("Timing correct"),
      createCheckpoint("Stabilité après escape"),
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
      createCheckpoint("Grip correct"),
      createCheckpoint("Mouvement efficace"),
      createCheckpoint("Posture cassée"),
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
      createCheckpoint("Technique alternative"),
      createCheckpoint("Efficacité démontrée"),
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
      createCheckpoint("Setup correct (manche + genou)"),
      createCheckpoint("Exécution du sweep (ciseaux + rotation)"),
      createCheckpoint("Stabilisation 3 sec après sweep"),
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
      createCheckpoint("Setup correct (manche + hanche)"),
      createCheckpoint("Exécution (bump + rotation)"),
      createCheckpoint("Stabilisation 3 sec après sweep"),
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
      createCheckpoint("Setup correct (bras, position)"),
      createCheckpoint("Exécution armbar (technique propre)"),
      createCheckpoint("Cycle contrôle → setup → finition"),
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
      createCheckpoint("Setup correct"),
      createCheckpoint("Exécution triangle (technique propre)"),
      createCheckpoint("Cycle contrôle → setup → finition"),
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
      createCheckpoint("Transition fluide"),
      createCheckpoint("Garde récupérée stable"),
      createCheckpoint("Contrôle maintenu"),
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
      createCheckpoint("Knee shield en place"),
      createCheckpoint("Frames correctes"),
      createCheckpoint("Stabilité maintenue"),
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
      createCheckpoint("Transition fluide"),
      createCheckpoint("Garde complète récupérée"),
      createCheckpoint("Contrôle établi"),
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
      createCheckpoint("Setup correct"),
      createCheckpoint("Exécution du sweep"),
      createCheckpoint("Stabilisation 3 sec"),
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
      createCheckpoint("Setup correct (manches + contrôle jambes)"),
      createCheckpoint("Exécution du pass (torreando)"),
      createCheckpoint("Stabilisation 3 sec en side control"),
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
      createCheckpoint("Setup correct (manche + genou)"),
      createCheckpoint("Exécution du pass (coupe genou)"),
      createCheckpoint("Stabilisation 3 sec en side control"),
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
      createCheckpoint("Position de base (poids, contrôle)"),
      createCheckpoint("Contrôle des hanches et épaules"),
      createCheckpoint("Maintien 10 secondes contre résistance"),
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
      createCheckpoint("Transition fluide"),
      createCheckpoint("Mount stable"),
      createCheckpoint("Contrôle maintenu"),
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
      createCheckpoint("Position de base (genoux, équilibre)"),
      createCheckpoint("Contrôle des bras adversaire"),
      createCheckpoint("Maintien 10 secondes + 1 chaîne d'attaque"),
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
      createCheckpoint("Position de base (crochets, contrôle)"),
      createCheckpoint("Contrôle des bras adversaire"),
      createCheckpoint("Maintien 10 secondes + empêcher 1 escape"),
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
      createCheckpoint("Setup correct (collets croisés)"),
      createCheckpoint("Exécution du choke (technique propre)"),
      createCheckpoint("Cycle contrôle → setup → finition"),
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
      createCheckpoint("Grips corrects (collet + manche)"),
      createCheckpoint("Position de base"),
      createCheckpoint("Contrôle distance"),
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
      createCheckpoint("Setup depuis collar-sleeve"),
      createCheckpoint("Exécution du sweep"),
      createCheckpoint("Stabilisation 3 sec"),
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
      createCheckpoint("Sweep alternatif maîtrisé"),
      createCheckpoint("Stabilisation 3 sec"),
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
      createCheckpoint("Transition vers dos"),
      createCheckpoint("Back control établi"),
      createCheckpoint("Contrôle maintenu"),
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
      createCheckpoint("Récupération efficace"),
      createCheckpoint("Garde rétablie"),
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
      createCheckpoint("Technique alternative"),
      createCheckpoint("Efficacité démontrée"),
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
      createCheckpoint("Position DLR correcte"),
      createCheckpoint("Grips appropriés"),
      createCheckpoint("Contrôle distance"),
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
      createCheckpoint("Off-balance efficace"),
      createCheckpoint("Adversaire déséquilibré"),
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
      createCheckpoint("Setup depuis DLR"),
      createCheckpoint("Exécution du sweep"),
      createCheckpoint("Stabilisation 3 sec"),
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
      createCheckpoint("Transition garde → top"),
      createCheckpoint("Stabilisation (points)"),
      createCheckpoint("Contrôle maintenu"),
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
      createCheckpoint("Variations maîtrisées"),
      createCheckpoint("Adaptation selon situation"),
      createCheckpoint("Stabilisation 3 sec"),
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
      createCheckpoint("Finitions après passage"),
      createCheckpoint("Réponse au knee shield"),
      createCheckpoint("Stabilisation"),
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
      createCheckpoint("Setup correct"),
      createCheckpoint("Exécution avec pression"),
      createCheckpoint("Stabilisation 3 sec"),
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
      createCheckpoint("Passage réussi"),
      createCheckpoint("Side control stabilisé"),
      createCheckpoint("Transition vers mount"),
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
      createCheckpoint("Contrôle en turtle"),
      createCheckpoint("Prise de dos safe"),
      createCheckpoint("Back control établi"),
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
      createCheckpoint("Recapture efficace"),
      createCheckpoint("Back control rétabli"),
      createCheckpoint("Maintien 10 sec"),
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
      createCheckpoint("Setup correct (collet + jambe)"),
      createCheckpoint("Exécution du choke (technique propre)"),
      createCheckpoint("Cycle contrôle → setup → finition"),
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
      createCheckpoint("Prévention efficace"),
      createCheckpoint("Escape back solide"),
      createCheckpoint("Sortie stable"),
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
      createCheckpoint("Système choisi (collar-sleeve OU DLR)"),
      createCheckpoint("Compréhension approfondie"),
      createCheckpoint("Chaînes identifiées"),
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
      createCheckpoint("Chaîne complète maîtrisée"),
      createCheckpoint("Enchaînement fluide"),
      createCheckpoint("Finition ou contrôle"),
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
      createCheckpoint("Chaîne alternative maîtrisée"),
      createCheckpoint("Adaptation selon situation"),
      createCheckpoint("Efficacité démontrée"),
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
      createCheckpoint("Angle choisi"),
      createCheckpoint("Type de pression choisi"),
      createCheckpoint("Compréhension approfondie"),
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
      createCheckpoint("Chaîne complète maîtrisée"),
      createCheckpoint("Enchaînement fluide"),
      createCheckpoint("Mount ou dos établi"),
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
      createCheckpoint("Chaîne alternative maîtrisée"),
      createCheckpoint("Adaptation selon situation"),
      createCheckpoint("Efficacité démontrée"),
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
      createCheckpoint("Reconnaissance du passage rapide"),
      createCheckpoint("Défense appropriée"),
      createCheckpoint("Récupération garde"),
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
      createCheckpoint("Reconnaissance de la pression"),
      createCheckpoint("Défense appropriée"),
      createCheckpoint("Récupération garde"),
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
      createCheckpoint("Reconnaissance des grips"),
      createCheckpoint("Défense appropriée"),
      createCheckpoint("Neutralisation"),
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
      createCheckpoint("Reconnaissance précoce"),
      createCheckpoint("Sortie anticipée"),
      createCheckpoint("Prévention efficace"),
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
      createCheckpoint("Transition fluide"),
      createCheckpoint("Mount stable"),
      createCheckpoint("Contrôle maintenu"),
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
      createCheckpoint("Transition fluide"),
      createCheckpoint("Back control établi"),
      createCheckpoint("Contrôle maintenu"),
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
      createCheckpoint("Transition fluide"),
      createCheckpoint("Back control établi"),
      createCheckpoint("Contrôle maintenu"),
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
      createCheckpoint("Reconnaissance du moment"),
      createCheckpoint("Accélération appropriée"),
      createCheckpoint("Figement efficace"),
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
      createCheckpoint("Grips optimaux identifiés"),
      createCheckpoint("Application correcte"),
      createCheckpoint("Efficacité maximale"),
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
      createCheckpoint("Angles optimaux identifiés"),
      createCheckpoint("Application correcte"),
      createCheckpoint("Efficacité maximale"),
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
      createCheckpoint("Timing optimal identifié"),
      createCheckpoint("Application correcte"),
      createCheckpoint("Efficacité maximale"),
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
      createCheckpoint("Gestion du poids efficace"),
      createCheckpoint("Gestion de la fatigue"),
      createCheckpoint("Performance maintenue"),
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
      createCheckpoint("Contres identifiés"),
      createCheckpoint("Réponses développées"),
      createCheckpoint("Efficacité démontrée"),
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
      createCheckpoint("Scénarios identifiés"),
      createCheckpoint("Stratégies développées"),
      createCheckpoint("Plan A + Plan B"),
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
      createCheckpoint("Stratégie claire"),
      createCheckpoint("Application efficace"),
      createCheckpoint("Points marqués"),
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
      createCheckpoint("Stratégie de remontée"),
      createCheckpoint("Application efficace"),
      createCheckpoint("Score amélioré"),
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
      createCheckpoint("Gestion bordure efficace"),
      createCheckpoint("Gestion grips appropriée"),
      createCheckpoint("Stratégie adaptée"),
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
      createCheckpoint("Techniques en fin de round"),
      createCheckpoint("Gestion de l'énergie"),
      createCheckpoint("Performance maintenue"),
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
      createCheckpoint("Rounds chronométrés"),
      createCheckpoint("Contraintes respectées"),
      createCheckpoint("Performance match-like"),
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
      createCheckpoint("Résistance gérée"),
      createCheckpoint("Performance maintenue"),
      createCheckpoint("Robustesse démontrée"),
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
      createCheckpoint("Contrôle efficace"),
      createCheckpoint("Décisions appropriées"),
      createCheckpoint("Victoire par points"),
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
