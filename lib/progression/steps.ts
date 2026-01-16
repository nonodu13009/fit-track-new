/**
 * Catalogue des steps de progression technique JJB (Gi)
 * 25 steps réparties en 4 blocs de 4 semaines
 */

import { Step } from "./types";

export const STEPS: Step[] = [
  // BLOC 1 : Fondamentaux survie + mouvements + posture
  {
    id: "step-01",
    block: 1,
    order: 1,
    title: "Posture de base (Seiza, Shizentai)",
    objectives: ["Comprendre les positions de base debout et à genoux"],
    checklist: [
      {
        id: "check-01-01",
        label: "Seiza correcte (genoux au sol, dos droit)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-01-02",
        label: "Shizentai naturelle (pieds écartés, poids réparti)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-01-03",
        label: "Transition fluide Seiza ↔ Shizentai",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-01-01",
        label: "Maintenir Seiza 30s sans bouger",
        type: "REQUIRED",
        target: 30,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-01-02",
        label: "Maintenir Shizentai 1min sans bouger",
        type: "OPTIONAL",
        target: 60,
        current: 0,
        unit: "s",
      },
    ],
  },
  {
    id: "step-02",
    block: 1,
    order: 2,
    title: "Chute avant (Mae Ukemi)",
    objectives: ["Apprendre à chuter en sécurité"],
    checklist: [
      {
        id: "check-02-01",
        label: "Roulade avant correcte (bras, épaule, dos)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-02-02",
        label: "Protection de la tête",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-02-03",
        label: "Chute depuis position debout",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-02-01",
        label: "5 chutes consécutives sans douleur",
        type: "REQUIRED",
        target: 5,
        current: 0,
      },
      {
        id: "kpi-02-02",
        label: "10 chutes consécutives",
        type: "OPTIONAL",
        target: 10,
        current: 0,
      },
    ],
    prerequisites: ["step-01"],
  },
  {
    id: "step-03",
    block: 1,
    order: 3,
    title: "Chute arrière (Ushiro Ukemi)",
    objectives: ["Chuter en arrière en sécurité"],
    checklist: [
      {
        id: "check-03-01",
        label: "Roulade arrière correcte",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-03-02",
        label: "Protection de la tête et du cou",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-03-03",
        label: "Chute depuis position debout",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-03-01",
        label: "5 chutes consécutives sans douleur",
        type: "REQUIRED",
        target: 5,
        current: 0,
      },
      {
        id: "kpi-03-02",
        label: "10 chutes consécutives",
        type: "OPTIONAL",
        target: 10,
        current: 0,
      },
    ],
    prerequisites: ["step-02"],
  },
  {
    id: "step-04",
    block: 1,
    order: 4,
    title: "Déplacement au sol (Shrimping)",
    objectives: ["Se déplacer efficacement au sol"],
    checklist: [
      {
        id: "check-04-01",
        label: "Shrimping de base (hanches relevées, jambe poussée)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-04-02",
        label: "Shrimping des deux côtés",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-04-03",
        label: "Shrimping avec résistance partenaire",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-04-01",
        label: "10 shrimps consécutifs chaque côté",
        type: "REQUIRED",
        target: 10,
        current: 0,
      },
      {
        id: "kpi-04-02",
        label: "20 shrimps consécutifs chaque côté",
        type: "OPTIONAL",
        target: 20,
        current: 0,
      },
    ],
    prerequisites: ["step-03"],
  },
  {
    id: "step-05",
    block: 1,
    order: 5,
    title: "Bridge (Pont)",
    objectives: ["Renforcer et utiliser le pont"],
    checklist: [
      {
        id: "check-05-01",
        label: "Bridge de base (appui sur tête/épaules)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-05-02",
        label: "Bridge latéral (rondade)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-05-03",
        label: "Bridge avec rotation",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-05-01",
        label: "Maintenir bridge 10s",
        type: "REQUIRED",
        target: 10,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-05-02",
        label: "Maintenir bridge 30s",
        type: "OPTIONAL",
        target: 30,
        current: 0,
        unit: "s",
      },
    ],
    prerequisites: ["step-04"],
  },
  // BLOC 2 : Garde + sweeps simples + maintien
  {
    id: "step-06",
    block: 2,
    order: 6,
    title: "Garde fermée (Closed Guard)",
    objectives: ["Comprendre et utiliser la garde fermée"],
    checklist: [
      {
        id: "check-06-01",
        label: "Position de base (jambes croisées, contrôle)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-06-02",
        label: "Contrôle des manches",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-06-03",
        label: "Transition garde fermée → ouverte",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-06-01",
        label: "Maintenir garde fermée 30s avec partenaire résistant",
        type: "REQUIRED",
        target: 30,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-06-02",
        label: "Maintenir garde fermée 1min",
        type: "OPTIONAL",
        target: 60,
        current: 0,
        unit: "s",
      },
    ],
    prerequisites: ["step-05"],
  },
  {
    id: "step-07",
    block: 2,
    order: 7,
    title: "Garde ouverte (Open Guard)",
    objectives: ["Utiliser la garde ouverte"],
    checklist: [
      {
        id: "check-07-01",
        label: "Position de base (pieds sur hanches/épaules)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-07-02",
        label: "Contrôle distance avec jambes",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-07-03",
        label: "Transitions entre variantes garde ouverte",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-07-01",
        label: "Maintenir garde ouverte 20s avec partenaire résistant",
        type: "REQUIRED",
        target: 20,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-07-02",
        label: "Maintenir garde ouverte 45s",
        type: "OPTIONAL",
        target: 45,
        current: 0,
        unit: "s",
      },
    ],
    prerequisites: ["step-06"],
  },
  {
    id: "step-08",
    block: 2,
    order: 8,
    title: "Scissor Sweep (Balayage ciseaux)",
    objectives: ["Exécuter le balayage ciseaux"],
    checklist: [
      {
        id: "check-08-01",
        label: "Setup correct (manche + genou)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-08-02",
        label: "Exécution du sweep (ciseaux + rotation)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-08-03",
        label: "Sweep depuis garde fermée",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-08-01",
        label: "3 sweeps réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-08-02",
        label: "5 sweeps réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-07"],
  },
  {
    id: "step-09",
    block: 2,
    order: 9,
    title: "Hip Bump Sweep",
    objectives: ["Exécuter le hip bump sweep"],
    checklist: [
      {
        id: "check-09-01",
        label: "Setup correct (manche + hanche)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-09-02",
        label: "Exécution (bump + rotation)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-09-03",
        label: "Sweep depuis garde ouverte",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-09-01",
        label: "3 sweeps réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-09-02",
        label: "5 sweeps réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-08"],
  },
  {
    id: "step-10",
    block: 2,
    order: 10,
    title: "Maintien latéral (Side Control)",
    objectives: ["Maintenir la position latérale"],
    checklist: [
      {
        id: "check-10-01",
        label: "Position de base (poids, contrôle)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-10-02",
        label: "Contrôle des hanches et épaules",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-10-03",
        label: "Transitions entre variantes side control",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-10-01",
        label: "Maintenir side control 30s avec partenaire résistant",
        type: "REQUIRED",
        target: 30,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-10-02",
        label: "Maintenir side control 1min",
        type: "OPTIONAL",
        target: 60,
        current: 0,
        unit: "s",
      },
    ],
    prerequisites: ["step-09"],
  },
  // BLOC 3 : Passages + contrôles + transitions
  {
    id: "step-11",
    block: 3,
    order: 11,
    title: "Knee on Belly",
    objectives: ["Contrôler avec genou sur ventre"],
    checklist: [
      {
        id: "check-11-01",
        label: "Position de base (genou, équilibre)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-11-02",
        label: "Contrôle des bras adversaire",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-11-03",
        label: "Transitions knee on belly → side control",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-11-01",
        label: "Maintenir knee on belly 20s avec partenaire résistant",
        type: "REQUIRED",
        target: 20,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-11-02",
        label: "Maintenir knee on belly 45s",
        type: "OPTIONAL",
        target: 45,
        current: 0,
        unit: "s",
      },
    ],
    prerequisites: ["step-10"],
  },
  {
    id: "step-12",
    block: 3,
    order: 12,
    title: "Mount (Montée)",
    objectives: ["Contrôler la montée"],
    checklist: [
      {
        id: "check-12-01",
        label: "Position de base (genoux, équilibre)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-12-02",
        label: "Contrôle des bras adversaire",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-12-03",
        label: "Transitions mount → side control",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-12-01",
        label: "Maintenir mount 20s avec partenaire résistant",
        type: "REQUIRED",
        target: 20,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-12-02",
        label: "Maintenir mount 45s",
        type: "OPTIONAL",
        target: 45,
        current: 0,
        unit: "s",
      },
    ],
    prerequisites: ["step-11"],
  },
  {
    id: "step-13",
    block: 3,
    order: 13,
    title: "Pass garde fermée (Knee Cut)",
    objectives: ["Passer la garde fermée"],
    checklist: [
      {
        id: "check-13-01",
        label: "Setup correct (manche + genou)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-13-02",
        label: "Exécution du pass (coupe genou)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-13-03",
        label: "Pass depuis garde ouverte",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-13-01",
        label: "3 passes réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-13-02",
        label: "5 passes réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-12"],
  },
  {
    id: "step-14",
    block: 3,
    order: 14,
    title: "Pass garde ouverte (Torreando)",
    objectives: ["Passer la garde ouverte"],
    checklist: [
      {
        id: "check-14-01",
        label: "Setup correct (manches + contrôle jambes)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-14-02",
        label: "Exécution du pass (torreando)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-14-03",
        label: "Pass depuis garde fermée",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-14-01",
        label: "3 passes réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-14-02",
        label: "5 passes réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-13"],
  },
  {
    id: "step-15",
    block: 3,
    order: 15,
    title: "Transition Side Control → Mount",
    objectives: ["Transitions fluides entre positions"],
    checklist: [
      {
        id: "check-15-01",
        label: "Transition side control → mount",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-15-02",
        label: "Transition mount → side control",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-15-03",
        label: "Transition avec contrôle continu",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-15-01",
        label: "5 transitions réussis en sparring léger",
        type: "REQUIRED",
        target: 5,
        current: 0,
      },
      {
        id: "kpi-15-02",
        label: "10 transitions réussis",
        type: "OPTIONAL",
        target: 10,
        current: 0,
      },
    ],
    prerequisites: ["step-14"],
  },
  // BLOC 4 : Dos + finitions Gi + stratégie match
  {
    id: "step-16",
    block: 4,
    order: 16,
    title: "Back Control (Contrôle du dos)",
    objectives: ["Contrôler le dos"],
    checklist: [
      {
        id: "check-16-01",
        label: "Position de base (crochets, contrôle)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-16-02",
        label: "Contrôle des bras adversaire",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-16-03",
        label: "Transitions back control → mount",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-16-01",
        label: "Maintenir back control 20s avec partenaire résistant",
        type: "REQUIRED",
        target: 20,
        current: 0,
        unit: "s",
      },
      {
        id: "kpi-16-02",
        label: "Maintenir back control 45s",
        type: "OPTIONAL",
        target: 45,
        current: 0,
        unit: "s",
      },
    ],
    prerequisites: ["step-15"],
  },
  {
    id: "step-17",
    block: 4,
    order: 17,
    title: "Rear Naked Choke (RNC)",
    objectives: ["Exécuter l'étranglement arrière"],
    checklist: [
      {
        id: "check-17-01",
        label: "Setup correct (bras, position)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-17-02",
        label: "Exécution du choke (technique propre)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-17-03",
        label: "RNC depuis différentes positions",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-17-01",
        label: "3 RNC réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-17-02",
        label: "5 RNC réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-16"],
  },
  {
    id: "step-18",
    block: 4,
    order: 18,
    title: "Cross Collar Choke (Gi)",
    objectives: ["Exécuter l'étranglement croisé avec Gi"],
    checklist: [
      {
        id: "check-18-01",
        label: "Setup correct (collets croisés)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-18-02",
        label: "Exécution du choke (technique propre)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-18-03",
        label: "Cross collar depuis garde fermée",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-18-01",
        label: "3 cross collar réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-18-02",
        label: "5 cross collar réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-17"],
  },
  {
    id: "step-19",
    block: 4,
    order: 19,
    title: "Bow and Arrow Choke (Gi)",
    objectives: ["Exécuter le bow and arrow choke"],
    checklist: [
      {
        id: "check-19-01",
        label: "Setup correct (collet + jambe)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-19-02",
        label: "Exécution du choke (technique propre)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-19-03",
        label: "Bow and arrow depuis back control",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-19-01",
        label: "3 bow and arrow réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-19-02",
        label: "5 bow and arrow réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-18"],
  },
  {
    id: "step-20",
    block: 4,
    order: 20,
    title: "Americana (Kimura)",
    objectives: ["Exécuter les clés d'épaule"],
    checklist: [
      {
        id: "check-20-01",
        label: "Setup correct (bras, position)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-20-02",
        label: "Exécution Americana (technique propre)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-20-03",
        label: "Exécution Kimura",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-20-01",
        label: "3 Americana réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-20-02",
        label: "3 Kimura réussis",
        type: "OPTIONAL",
        target: 3,
        current: 0,
      },
    ],
    prerequisites: ["step-19"],
  },
  {
    id: "step-21",
    block: 4,
    order: 21,
    title: "Armbar (Clé de bras)",
    objectives: ["Exécuter la clé de bras"],
    checklist: [
      {
        id: "check-21-01",
        label: "Setup correct (bras, position)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-21-02",
        label: "Exécution armbar (technique propre)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-21-03",
        label: "Armbar depuis garde fermée",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-21-01",
        label: "3 armbar réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-21-02",
        label: "5 armbar réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-20"],
  },
  {
    id: "step-22",
    block: 4,
    order: 22,
    title: "Escape garde fermée",
    objectives: ["Échapper de la garde fermée"],
    checklist: [
      {
        id: "check-22-01",
        label: "Posture correcte (debout, genoux)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-22-02",
        label: "Ouverture de la garde (technique)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-22-03",
        label: "Escape avec contrôle",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-22-01",
        label: "3 escapes réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-22-02",
        label: "5 escapes réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-21"],
  },
  {
    id: "step-23",
    block: 4,
    order: 23,
    title: "Escape side control",
    objectives: ["Échapper du side control"],
    checklist: [
      {
        id: "check-23-01",
        label: "Shrimping correct (hanches, espace)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-23-02",
        label: "Récupération garde (technique)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-23-03",
        label: "Escape avec contrôle",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-23-01",
        label: "3 escapes réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-23-02",
        label: "5 escapes réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-22"],
  },
  {
    id: "step-24",
    block: 4,
    order: 24,
    title: "Escape mount",
    objectives: ["Échapper de la montée"],
    checklist: [
      {
        id: "check-24-01",
        label: "Bridge correct (hanches, espace)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-24-02",
        label: "Récupération garde (technique)",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-24-03",
        label: "Escape avec contrôle",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-24-01",
        label: "3 escapes réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-24-02",
        label: "5 escapes réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-23"],
  },
  {
    id: "step-25",
    block: 4,
    order: 25,
    title: "Stratégie match (Flow)",
    objectives: ["Enchaîner techniques en situation"],
    checklist: [
      {
        id: "check-25-01",
        label: "Flow garde → sweep → contrôle",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-25-02",
        label: "Flow contrôle → passage → finition",
        type: "REQUIRED",
        checked: false,
      },
      {
        id: "check-25-03",
        label: "Flow complet (garde → finition)",
        type: "OPTIONAL",
        checked: false,
      },
    ],
    kpis: [
      {
        id: "kpi-25-01",
        label: "3 flows réussis en sparring léger",
        type: "REQUIRED",
        target: 3,
        current: 0,
      },
      {
        id: "kpi-25-02",
        label: "5 flows réussis",
        type: "OPTIONAL",
        target: 5,
        current: 0,
      },
    ],
    prerequisites: ["step-24"],
  },
];

/**
 * Helper pour obtenir une step par ID
 */
export function getStepById(stepId: string): Step | undefined {
  return STEPS.find((step) => step.id === stepId);
}

/**
 * Helper pour obtenir toutes les steps d'un bloc
 */
export function getStepsByBlock(block: number): Step[] {
  return STEPS.filter((step) => step.block === block);
}

/**
 * Helper pour obtenir le nombre total de steps
 */
export function getTotalStepsCount(): number {
  return STEPS.length;
}
