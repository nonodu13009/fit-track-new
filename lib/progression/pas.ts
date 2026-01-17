/**
 * Catalogue des pas de progression technique JJB (Gi) - Style Gracie Barra
 * 64 semaines réparties en 4 cycles de 16 semaines
 */

import { Pas, Paliers, ValidationCriteria, PasType, Checkpoint } from "./types";

// Helper pour créer un checkpoint
function createCheckpoint(
  label: string,
  explanation?: string,
  youtubeUrl?: string
): Checkpoint {
  return { label, explanation, youtubeUrl };
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
      createCheckpoint(
        "Hanches relevées",
        "Tu ne \"rampes\" pas à plat. Tu montes légèrement les hanches sur l'épaule/haut du dos pour libérer tes hanches du sol et pouvoir créer de l'espace. Si tes hanches restent collées, tu n'avances pas vraiment et tu prends la pression.",
        "https://www.youtube.com/results?search_query=Shrimp+%28d%C3%A9placement+au+sol%29+Hanches+relev%C3%A9es+bjj"
      ),
      createCheckpoint(
        "Jambe poussée correctement",
        "La jambe qui pousse doit être bien ancrée (pied au sol), et elle sert de moteur. Tu pousses fort pour reculer/te décaler, pendant que l'autre jambe se replie pour \"récupérer\" l'espace. Si tu pousses avec une jambe molle ou trop loin, le mouvement se casse.",
        "https://www.youtube.com/results?search_query=Shrimp+%28d%C3%A9placement+au+sol%29+Jambe+pouss%C3%A9e+correctement+bjj"
      ),
      createCheckpoint(
        "Déplacement fluide des deux côtés",
        "Tu sais shrimp à droite et à gauche sans te bloquer, en gardant le même principe : appui solide + hanches qui se décalent + retour des genoux. Objectif : que ce soit \"automatique\" des deux côtés, sans réfléchir.",
        "https://www.youtube.com/results?search_query=Shrimp+%28d%C3%A9placement+au+sol%29+D%C3%A9placement+fluide+des+deux+c%C3%B4t%C3%A9s+bjj"
      )
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
      createCheckpoint(
        "Appui sur tête/épaules",
        "Le pont doit se faire sur les épaules/haut du dos (et éventuellement la tête en support léger), pas sur la nuque. Le but est de protéger ton cou et de générer de la puissance avec le dos + jambes.",
        "https://www.youtube.com/results?search_query=Bridge+%28pont%29+Appui+sur+t%C3%AAte%2F%C3%A9paules+bjj"
      ),
      createCheckpoint(
        "Bridge latéral (rondade)",
        "Tu ne bridges pas seulement vers le haut : tu sais \"rouler\" sur une épaule pour te tourner sur le côté. C'est le pont utile en grappling : ça crée un angle pour sortir, pas juste pousser quelqu'un.",
        "https://www.youtube.com/results?search_query=Bridge+%28pont%29+Bridge+lat%C3%A9ral+%28rondade%29+bjj"
      ),
      createCheckpoint(
        "Bridge avec rotation",
        "Tu combines montée de hanches + rotation du bassin/épaules pour faire basculer la pression et créer une ouverture. Un bon bridge n'est pas un \"saut\" : c'est un déplacement du poids avec un angle.",
        "https://www.youtube.com/results?search_query=Bridge+%28pont%29+Bridge+avec+rotation+bjj"
      )
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
      createCheckpoint(
        "Posture correcte",
        "Tu te relèves sans offrir ton dos ni tes jambes. Base: une main au sol, l'autre \"protège\", une jambe entre toi et l'adversaire, puis tu recules pour te relever stable.",
        "https://www.youtube.com/results?search_query=Technical+stand-up+%28relev%C3%A9+technique%29+Posture+correcte+bjj"
      ),
      createCheckpoint(
        "Protection de la tête",
        "Pendant que tu te relèves, ton bras \"libre\" sert de bouclier (garde la tête/ligne du menton protégée). Tu ne te redresses pas en laissant l'adversaire te frapper/saisir.",
        "https://www.youtube.com/results?search_query=Technical+stand-up+%28relev%C3%A9+technique%29+Protection+de+la+t%C3%AAte+bjj"
      ),
      createCheckpoint(
        "Relevé fluide",
        "Ça doit être propre et continu : assis → main au sol → hanches qui reculent → jambe qui passe → debout. Pas de pause au milieu, pas de croisement maladroit des jambes.",
        "https://www.youtube.com/results?search_query=Technical+stand-up+%28relev%C3%A9+technique%29+Relev%C3%A9+fluide+bjj"
      )
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
      createCheckpoint(
        "Frames en place avant mouvement",
        "Avant de bouger, tu \"poses tes barrières\" : avant-bras/coudes placés pour empêcher l'adversaire de t'écraser. Si tu bouges sans frames, tu te fais recoller/écraser.",
        "https://www.youtube.com/results?search_query=Frames+de+base+Frames+en+place+avant+mouvement+bjj"
      ),
      createCheckpoint(
        "Distance créée",
        "Un frame sert à créer un espace utile (quelques centimètres suffisent) pour respirer, replacer un genou, shrimper, re-guard. Si tu frames mais que ton adversaire reste collé poitrine contre poitrine, ça ne marche pas.",
        "https://www.youtube.com/results?search_query=Frames+de+base+Distance+cr%C3%A9%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Posture défensive maintenue",
        "Même en bougeant, tu gardes coudes \"près\", structure solide, tête protégée. L'idée : tu ne tends pas les bras en mode \"push-up\" (sinon tu te fais casser).",
        "https://www.youtube.com/results?search_query=Frames+de+base+Posture+d%C3%A9fensive+maintenue+bjj"
      )
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
      createCheckpoint(
        "Distance appropriée maintenue",
        "Tu sais rester à la bonne distance selon le besoin : proche si tu contrôles, loin si tu défends/recomposes. Trop loin = tu perds le contact et tu te fais passer. Trop près = tu te fais écraser.",
        "https://www.youtube.com/results?search_query=Gestion+de+la+distance+Distance+appropri%C3%A9e+maintenue+bjj"
      ),
      createCheckpoint(
        "Ajustements selon situation",
        "Tu sais changer la distance en temps réel : frames pour éloigner, genoux/crochets pour ramener, hanches pour sortir. Pas de \"distance unique\", tu ajustes selon la pression et les grips.",
        "https://www.youtube.com/results?search_query=Gestion+de+la+distance+Ajustements+selon+situation+bjj"
      )
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
      createCheckpoint(
        "Frames en place avant de pousser",
        "Tu mets d'abord les cadres (avant-bras au cou/hanche, ou structure équivalente). Ensuite seulement tu t'en sers pour créer un micro-espace. Si tu pousses sans structure, tu te fatigues et tu te fais écraser.",
        "https://www.youtube.com/results?search_query=Escape+side+control+%28technique+1%29+Frames+en+place+avant+de+pousser+bjj"
      ),
      createCheckpoint(
        "Shrimping correct (hanches, espace)",
        "Ton shrimp sert à sortir les hanches, pas à \"tortiller\". Tu fais un vrai décalage du bassin pour glisser un genou à l'intérieur. Critère simple : après le shrimp, ton genou doit pouvoir entrer.",
        "https://www.youtube.com/results?search_query=Escape+side+control+%28technique+1%29+Shrimping+correct+%28hanches%2C+espace%29+bjj"
      ),
      createCheckpoint(
        "Récupération garde stable",
        "Une fois le genou dedans, tu reconstruis : genou/coude connectés, jambes actives, et tu reviens en garde sans te faire recoller tout de suite. Pas juste \"je mets une jambe\", mais \"je sécurise la garde\".",
        "https://www.youtube.com/results?search_query=Escape+side+control+%28technique+1%29+R%C3%A9cup%C3%A9ration+garde+stable+bjj"
      )
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
      createCheckpoint(
        "Technique alternative maîtrisée",
        "Tu as une 2e option claire (ex: underhook + sortir sur le côté, ou autre variante enseignée) et tu sais quand l'utiliser (selon la pression, la position de la tête, etc.). L'objectif : ne pas être \"bloqué\" si la 1ère ne marche pas.",
        "https://www.youtube.com/results?search_query=Escape+side+control+%28technique+2%29+Technique+alternative+ma%C3%AEtris%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Transition fluide",
        "Tu passes d'une étape à l'autre sans pause : frames → angle → déplacement → recomposition. Les transitions lentes donnent à l'adversaire le temps de réajuster.",
        "https://www.youtube.com/results?search_query=Escape+side+control+%28technique+2%29+Transition+fluide+bjj"
      ),
      createCheckpoint(
        "Pas de re-collage immédiat",
        "Après la sortie, tu empêches le retour direct en side control : tu gardes des barrières (genoux, frames, grips) et tu te replaces. Si tu te fais recoller en 1 seconde, l'escape n'est pas validé.",
        "https://www.youtube.com/results?search_query=Escape+side+control+%28technique+2%29+Pas+de+re-collage+imm%C3%A9diat+bjj"
      )
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
      createCheckpoint(
        "Frames en place avant de pousser",
        "Tu protèges d'abord ta ligne haute (coudes près, mains/avant-bras en bouclier). Sans ça, tu exposes tes bras et tu te fais attaquer (americana, armbar, cross-collar…).",
        "https://www.youtube.com/results?search_query=Escape+mount+%28technique+1%29+Frames+en+place+avant+de+pousser+bjj"
      ),
      createCheckpoint(
        "Hips escape / bridge au bon timing",
        "Tu bridges au moment où l'adversaire est un peu \"léger\" (main au sol, mouvement, etc.), puis tu utilises ça pour glisser tes hanches et récupérer une jambe. Le timing > la force.",
        "https://www.youtube.com/results?search_query=Escape+mount+%28technique+1%29+Hips+escape+%2F+bridge+au+bon+timing+bjj"
      ),
      createCheckpoint(
        "Re-guard ou sortie stable",
        "Tu finis dans une position défendable (demi-garde, garde fermée, ou sortie). Si tu \"bouges\" mais restes sous mount, ce n'est pas validé.",
        "https://www.youtube.com/results?search_query=Escape+mount+%28technique+1%29+Re-guard+ou+sortie+stable+bjj"
      )
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
      createCheckpoint(
        "Technique alternative maîtrisée",
        "Tu as une 2e sortie (ex: elbow escape vs upa, ou variante selon l'enseignement) et tu la fais proprement : étapes claires, pas improvisé.",
        "https://www.youtube.com/results?search_query=Escape+mount+%28technique+2%29+Technique+alternative+ma%C3%AEtris%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Timing correct",
        "Tu déclenches au bon moment (quand l'adversaire pousse/attaque, quand son poids se décale). Si tu le fais \"au hasard\", ça devient un effort inutile.",
        "https://www.youtube.com/results?search_query=Escape+mount+%28technique+2%29+Timing+correct+bjj"
      ),
      createCheckpoint(
        "Stabilité après escape",
        "Une fois sorti, tu stabilises (genoux serrés, frames, distance, tête en sécurité). Objectif : ne pas te faire remonter direct.",
        "https://www.youtube.com/results?search_query=Escape+mount+%28technique+2%29+Stabilit%C3%A9+apr%C3%A8s+escape+bjj"
      )
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
      createCheckpoint(
        "Grip correct",
        "Tes prises doivent vraiment contrôler (col, manche, tête, bras… selon la version). Un \"faux grip\" donne l'illusion mais ne casse rien.",
        "https://www.youtube.com/results?search_query=Posture+break+%28technique+1%29+Grip+correct+bjj"
      ),
      createCheckpoint(
        "Mouvement efficace",
        "Tu utilises tout le corps : jambes + hanches + traction. Pas seulement les bras. Critère : tu sens la posture de l'adversaire \"se plier\" sans te cramer.",
        "https://www.youtube.com/results?search_query=Posture+break+%28technique+1%29+Mouvement+efficace+bjj"
      ),
      createCheckpoint(
        "Posture cassée",
        "Résultat visible : tête/épaules de l'adversaire avancent, mains au sol ou base compromise, il ne peut plus rester droit. Si l'adversaire reste droit et stable, ce n'est pas cassé.",
        "https://www.youtube.com/results?search_query=Posture+break+%28technique+1%29+Posture+cass%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Technique alternative",
        "Tu sais casser la posture d'une autre façon (autre angle/grips/mécanique) pour t'adapter à une défense différente.",
        "https://www.youtube.com/results?search_query=Posture+break+%28technique+2%29+Technique+alternative+bjj"
      ),
      createCheckpoint(
        "Efficacité démontrée",
        "Tu peux le faire sur partenaire qui résiste un minimum : pas \"quand il se laisse faire\". La posture casse réellement.",
        "https://www.youtube.com/results?search_query=Posture+break+%28technique+2%29+Efficacit%C3%A9+d%C3%A9montr%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Setup correct (manche + genou)",
        "Tu contrôles le haut (manche/col selon la version) et tu positionnes bien ton genou \"barrière\" devant l'adversaire. Sans setup, le sweep devient un coup de chance.",
        "https://www.youtube.com/results?search_query=Scissor+Sweep+Setup+correct+%28manche+%2B+genou%29+bjj"
      ),
      createCheckpoint(
        "Exécution du sweep (ciseaux + rotation)",
        "Les jambes font le \"ciseau\" pendant que tu tires/pousses avec le haut du corps pour tourner l'adversaire. Ce n'est pas juste \"couper avec les jambes\" : c'est jambes + rotation + direction.",
        "https://www.youtube.com/results?search_query=Scissor+Sweep+Ex%C3%A9cution+du+sweep+%28ciseaux+%2B+rotation%29+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec après sweep",
        "Tu finis en top (mount/side selon la version) et tu bloques la tentative de ré-guard immédiate. 3 secondes stables = contrôle réel, pas un renversement.",
        "https://www.youtube.com/results?search_query=Scissor+Sweep+Stabilisation+3+sec+apr%C3%A8s+sweep+bjj"
      )
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
      createCheckpoint(
        "Setup correct (manche + hanche)",
        "Tu contrôles le bras/épaule et tu te places bien sur le côté, pas face à face. Ton angle doit permettre de \"rentrer la hanche\" sous l'adversaire.",
        "https://www.youtube.com/results?search_query=Hip+Bump+Sweep+Setup+correct+%28manche+%2B+hanche%29+bjj"
      ),
      createCheckpoint(
        "Exécution (bump + rotation)",
        "Tu montes sur la hanche, tu \"bump\" avec le bassin et tu tournes pour faire tomber. Si tu restes trop droit ou trop loin, ça ne bascule pas.",
        "https://www.youtube.com/results?search_query=Hip+Bump+Sweep+Ex%C3%A9cution+%28bump+%2B+rotation%29+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec après sweep",
        "Même logique : tu stabilises en haut, tu empêches qu'il te remette en garde tout de suite.",
        "https://www.youtube.com/results?search_query=Hip+Bump+Sweep+Stabilisation+3+sec+apr%C3%A8s+sweep+bjj"
      )
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
      createCheckpoint(
        "Setup correct (bras, position)",
        "Tu isoles un bras et tu contrôles la posture. Ton bassin doit être proche, angle correct, et tu ne \"saute\" pas à l'armbar sans contrôle.",
        "https://www.youtube.com/results?search_query=Armbar+depuis+garde+ferm%C3%A9e+Setup+correct+%28bras%2C+position%29+bjj"
      ),
      createCheckpoint(
        "Exécution armbar (technique propre)",
        "Genou serré, talons actifs, hanches qui montent, pouce de l'adversaire orienté correctement. Pas d'arrachage : c'est une ligne + un levier.",
        "https://www.youtube.com/results?search_query=Armbar+depuis+garde+ferm%C3%A9e+Ex%C3%A9cution+armbar+%28technique+propre%29+bjj"
      ),
      createCheckpoint(
        "Cycle contrôle → setup → finition",
        "Tu montres que tu sais enchaîner : d'abord contrôle (posture/bras), ensuite mise en place (angle/jambe sur la tête), puis finition propre. Pas une action \"en vrac\".",
        "https://www.youtube.com/results?search_query=Armbar+depuis+garde+ferm%C3%A9e+Cycle+contr%C3%B4le+%E2%86%92+setup+%E2%86%92+finition+bjj"
      )
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
      createCheckpoint(
        "Setup correct",
        "Tu casses la posture, tu fais entrer un bras et tu fermes l'angle. Sans posture cassée et sans angle, le triangle est \"mou\".",
        "https://www.youtube.com/results?search_query=Triangle+depuis+garde+ferm%C3%A9e+Setup+correct+bjj"
      ),
      createCheckpoint(
        "Exécution triangle (technique propre)",
        "Tu verrouilles la jambe sur la nuque, tu ajustes l'angle, tu serres genoux + tu contrôles la tête/bras. Objectif : pression propre, pas juste \"croiser les jambes\".",
        "https://www.youtube.com/results?search_query=Triangle+depuis+garde+ferm%C3%A9e+Ex%C3%A9cution+triangle+%28technique+propre%29+bjj"
      ),
      createCheckpoint(
        "Cycle contrôle → setup → finition",
        "Idem : contrôle d'abord, triangle ensuite, finition après ajustement d'angle. Le triangle se \"règle\".",
        "https://www.youtube.com/results?search_query=Triangle+depuis+garde+ferm%C3%A9e+Cycle+contr%C3%B4le+%E2%86%92+setup+%E2%86%92+finition+bjj"
      )
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
      createCheckpoint(
        "Transition fluide",
        "Tu passes d'une position défensive (side, demi, open…) vers une garde sans t'arrêter. Tu utilises hanches + genoux + frames, pas juste une jambe qui traîne.",
        "https://www.youtube.com/results?search_query=Re-guard+de+base+Transition+fluide+bjj"
      ),
      createCheckpoint(
        "Garde récupérée stable",
        "Une fois la garde récupérée, tu la \"verrouilles\" (distance, crochets, genoux, grips). Si elle s'ouvre immédiatement, ce n'est pas stabilisé.",
        "https://www.youtube.com/results?search_query=Re-guard+de+base+Garde+r%C3%A9cup%C3%A9r%C3%A9e+stable+bjj"
      ),
      createCheckpoint(
        "Contrôle maintenu",
        "Tu ne fais pas que \"survivre\". Tu récupères une garde où tu peux contrôler : ralentir l'adversaire, le garder devant toi, préparer une attaque ou un sweep.",
        "https://www.youtube.com/results?search_query=Re-guard+de+base+Contr%C3%B4le+maintenu+bjj"
      )
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
      createCheckpoint(
        "Knee shield en place",
        "Ton genou bouclier est bien positionné entre toi et l'adversaire (pas écrasé à plat). Il sert à empêcher la pression poitrine/hanche de te rouler.",
        "https://www.youtube.com/results?search_query=Demi-garde+knee+shield+%3A+survivre+Knee+shield+en+place+bjj"
      ),
      createCheckpoint(
        "Frames correctes",
        "Tes bras soutiennent le knee shield : un cadre sur l'épaule/cou, l'autre sur la hanche/bras selon la situation. Sans frames, le shield se fait écraser.",
        "https://www.youtube.com/results?search_query=Demi-garde+knee+shield+%3A+survivre+Frames+correctes+bjj"
      ),
      createCheckpoint(
        "Stabilité maintenue",
        "Tu peux tenir la position même si l'adversaire essaie de passer (pression raisonnable). Objectif : respirer, garder l'espace, préparer la suite.",
        "https://www.youtube.com/results?search_query=Demi-garde+knee+shield+%3A+survivre+Stabilit%C3%A9+maintenue+bjj"
      )
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
      createCheckpoint(
        "Transition fluide",
        "Tu sais passer de demi-garde à garde complète sans te faire aplatir : tu crées l'espace, tu remets le genou à l'intérieur, puis tu récupères la 2e jambe.",
        "https://www.youtube.com/results?search_query=Demi-garde+%3A+r%C3%A9cup%C3%A9rer+garde+compl%C3%A8te+Transition+fluide+bjj"
      ),
      createCheckpoint(
        "Garde complète récupérée",
        "Les deux jambes reviennent devant et tu peux fermer ou contrôler en open guard selon la version. Critère : l'adversaire n'a plus l'angle de passage.",
        "https://www.youtube.com/results?search_query=Demi-garde+%3A+r%C3%A9cup%C3%A9rer+garde+compl%C3%A8te+Garde+compl%C3%A8te+r%C3%A9cup%C3%A9r%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Contrôle établi",
        "Une fois la garde complète récupérée, tu as des grips/contrôle qui stoppent l'adversaire (posture cassée, distance, etc.). Pas juste \"je reviens et je subis\".",
        "https://www.youtube.com/results?search_query=Demi-garde+%3A+r%C3%A9cup%C3%A9rer+garde+compl%C3%A8te+Contr%C3%B4le+%C3%A9tabli+bjj"
      )
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
      createCheckpoint(
        "Setup correct",
        "Tu as les bons contrôles (bras/hanche/jambe) et tu crées un déséquilibre avant de forcer le sweep. Sans déséquilibre, tu pousses un mur.",
        "https://www.youtube.com/results?search_query=Sweep+de+demi-garde+Setup+correct+bjj"
      ),
      createCheckpoint(
        "Exécution du sweep",
        "Tu utilises les hanches, l'angle, et la jambe qui \"ramasse\"/bascule. Le mouvement doit être dirigé (où tu veux le faire tomber), pas un effort aléatoire.",
        "https://www.youtube.com/results?search_query=Sweep+de+demi-garde+Ex%C3%A9cution+du+sweep+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec",
        "Après le sweep, tu sécurises ta position top (base, pression, tête/bras en contrôle). 3 secondes = tu as vraiment gagné la position.",
        "https://www.youtube.com/results?search_query=Sweep+de+demi-garde+Stabilisation+3+sec+bjj"
      )
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
      createCheckpoint(
        "Setup correct (manches + contrôle jambes)",
        "Tu contrôles les jambes (chevilles/pantalon selon gi) et tu empêches l'adversaire de remettre ses pieds/frames. Sans contrôle des jambes, il te \"récupère\" tout de suite.",
        "https://www.youtube.com/results?search_query=Torreando+%28passage+garde+ouverte%29+Setup+correct+%28manches+%2B+contr%C3%B4le+jambes%29+bjj"
      ),
      createCheckpoint(
        "Exécution du pass (torreando)",
        "Tu dévies les jambes d'un côté et tu passes ton corps de l'autre avec un angle et du timing. Ce n'est pas juste courir autour : tu enlèves ses jambes de ta ligne.",
        "https://www.youtube.com/results?search_query=Torreando+%28passage+garde+ouverte%29+Ex%C3%A9cution+du+pass+%28torreando%29+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec en side control",
        "Tu finis en side control solide (poids bas, tête bien placée, hanches contrôlées). Si l'adversaire remet le genou direct, tu n'as pas stabilisé.",
        "https://www.youtube.com/results?search_query=Torreando+%28passage+garde+ouverte%29+Stabilisation+3+sec+en+side+control+bjj"
      )
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
      createCheckpoint(
        "Setup correct (manche + genou)",
        "Tu as le contrôle du haut (manche/col/underhook selon version) et ton genou \"coupe\" avec un angle. Sans contrôle du haut, tu te fais recoller en garde.",
        "https://www.youtube.com/results?search_query=Knee+Cut+%28passage+garde+ferm%C3%A9e%29+Setup+correct+%28manche+%2B+genou%29+bjj"
      ),
      createCheckpoint(
        "Exécution du pass (coupe genou)",
        "Ton genou traverse la ligne de la cuisse adverse, tu gardes la pression et tu empêches le genou de l'adversaire de se relever. Ça doit être un \"passage en diagonale\", pas un slide sans poids.",
        "https://www.youtube.com/results?search_query=Knee+Cut+%28passage+garde+ferm%C3%A9e%29+Ex%C3%A9cution+du+pass+%28coupe+genou%29+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec en side control",
        "Tu verrouilles side control : contrôle tête/épaule + hanches. 3 sec stables, même si l'adversaire bouge.",
        "https://www.youtube.com/results?search_query=Knee+Cut+%28passage+garde+ferm%C3%A9e%29+Stabilisation+3+sec+en+side+control+bjj"
      )
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
      createCheckpoint(
        "Position de base (poids, contrôle)",
        "Ton poids est bas et réparti, tu ne poses pas tes mains \"en appui\" inutile. Ta poitrine/épaule contrôlent, tes hanches empêchent le retournement.",
        "https://www.youtube.com/results?search_query=Stabiliser+side+control+Position+de+base+%28poids%2C+contr%C3%B4le%29+bjj"
      ),
      createCheckpoint(
        "Contrôle des hanches et épaules",
        "Tu bloques les deux : épaules (tête/bras) et hanches (genoux/ceinture). Si tu contrôles une seule zone, l'adversaire s'échappe par l'autre.",
        "https://www.youtube.com/results?search_query=Stabiliser+side+control+Contr%C3%B4le+des+hanches+et+%C3%A9paules+bjj"
      ),
      createCheckpoint(
        "Maintien 10 secondes contre résistance",
        "Pendant 10 secondes, l'adversaire essaie vraiment de bouger, et tu restes en contrôle sans te faire remettre en garde. C'est un test simple de \"position réelle\".",
        "https://www.youtube.com/results?search_query=Stabiliser+side+control+Maintien+10+secondes+contre+r%C3%A9sistance+bjj"
      )
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
      createCheckpoint(
        "Transition fluide",
        "Tu ne laisses pas d'espace pendant le passage : tu montes le genou, tu bloques les bras, tu avances progressivement. Une transition fluide = pas de scramble.",
        "https://www.youtube.com/results?search_query=Transition+Side+%E2%86%92+Mount+Transition+fluide+bjj"
      ),
      createCheckpoint(
        "Mount stable",
        "Une fois en mount, tu as une base solide (genoux/chevilles/poids) et tu n'es pas déséquilibré. Si tu te fais \"bucker\" direct, la mount n'est pas posée.",
        "https://www.youtube.com/results?search_query=Transition+Side+%E2%86%92+Mount+Mount+stable+bjj"
      ),
      createCheckpoint(
        "Contrôle maintenu",
        "Tu contrôles les bras/ligne haute et tu empêches l'adversaire de tourner sur le côté. L'idée : mount = domination, pas juste \"être assis\".",
        "https://www.youtube.com/results?search_query=Transition+Side+%E2%86%92+Mount+Contr%C3%B4le+maintenu+bjj"
      )
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
      createCheckpoint(
        "Position de base (genoux, équilibre)",
        "Genoux serrés, bassin lourd, posture stable. Tu sais ajuster haut/bas mount pour rester équilibré selon ses mouvements.",
        "https://www.youtube.com/results?search_query=Mount+%3A+maintien+%2B+cha%C3%AEne+d%27attaque+Position+de+base+%28genoux%2C+%C3%A9quilibre%29+bjj"
      ),
      createCheckpoint(
        "Contrôle des bras adversaire",
        "Tu empêches qu'il cadre/repousse en contrôlant au moins un bras (crossface, contrôle poignet, underhook, etc.). Sans contrôle des bras, tu perds la mount.",
        "https://www.youtube.com/results?search_query=Mount+%3A+maintien+%2B+cha%C3%AEne+d%27attaque+Contr%C3%B4le+des+bras+adversaire+bjj"
      ),
      createCheckpoint(
        "Maintien 10 secondes + 1 chaîne d'attaque",
        "Tu tiens 10 secondes, puis tu enchaînes une attaque logique (ex: isoler un bras → montée S-mount → armbar / ou montée haute → cross-collar). Le point : position + attaque, pas attaque \"dans le vide\".",
        "https://www.youtube.com/results?search_query=Mount+%3A+maintien+%2B+cha%C3%AEne+d%27attaque+Maintien+10+secondes+%2B+1+cha%C3%AEne+d%27attaque+bjj"
      )
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
      createCheckpoint(
        "Position de base (crochets, contrôle)",
        "Tes crochets (ou body triangle) contrôlent ses hanches, et ton haut du corps colle. Si tes jambes sont \"molles\", il glisse.",
        "https://www.youtube.com/results?search_query=Back+control+%3A+entr%C3%A9e+%2B+maintien+Position+de+base+%28crochets%2C+contr%C3%B4le%29+bjj"
      ),
      createCheckpoint(
        "Contrôle des bras adversaire",
        "Priorité : contrôler ses mains/bras (main-fighting). Sans ça, tu perds le dos ou tu te fais défendre facilement.",
        "https://www.youtube.com/results?search_query=Back+control+%3A+entr%C3%A9e+%2B+maintien+Contr%C3%B4le+des+bras+adversaire+bjj"
      ),
      createCheckpoint(
        "Maintien 10 secondes + empêcher 1 escape",
        "Pendant 10 secondes, il tente une sortie (tourner, enlever crochet, glisser), et tu sais recoller/récupérer. Objectif : prouver que tu \"gardes\" le dos.",
        "https://www.youtube.com/results?search_query=Back+control+%3A+entr%C3%A9e+%2B+maintien+Maintien+10+secondes+%2B+emp%C3%AAcher+1+escape+bjj"
      )
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
      createCheckpoint(
        "Setup correct (collets croisés)",
        "Tu obtiens les deux grips profonds et propres, sans te faire enlever les mains. Si tes grips sont trop superficiels, ça devient un tirage sans effet.",
        "https://www.youtube.com/results?search_query=Cross-collar+choke+%28dos%29+Setup+correct+%28collets+crois%C3%A9s%29+bjj"
      ),
      createCheckpoint(
        "Exécution du choke (technique propre)",
        "Tu utilises les avant-bras/poignets comme des lames, tu resserres les coudes et tu tires vers toi avec une mécanique propre. Pas de force brute avec les biceps.",
        "https://www.youtube.com/results?search_query=Cross-collar+choke+%28dos%29+Ex%C3%A9cution+du+choke+%28technique+propre%29+bjj"
      ),
      createCheckpoint(
        "Cycle contrôle → setup → finition",
        "Tu montres la logique : d'abord contrôle des mains, ensuite grips, ensuite finition. Si tu perds le contrôle des mains, tu reviens à ça avant de forcer.",
        "https://www.youtube.com/results?search_query=Cross-collar+choke+%28dos%29+Cycle+contr%C3%B4le+%E2%86%92+setup+%E2%86%92+finition+bjj"
      )
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
      createCheckpoint(
        "Grips corrects (collet + manche)",
        "Tes grips sont solides et utiles : collet qui contrôle la posture/épaule, manche qui contrôle le bras. Si tu prends \"au hasard\", tu n'as pas de leviers.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+entr%C3%A9e+Grips+corrects+%28collet+%2B+manche%29+bjj"
      ),
      createCheckpoint(
        "Position de base",
        "Tu as une garde stable : hanches mobiles, jambes prêtes à cadrer, pas à plat. Tu peux attaquer ou défendre sans te faire écraser.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+entr%C3%A9e+Position+de+base+bjj"
      ),
      createCheckpoint(
        "Contrôle distance",
        "Tu sais garder l'adversaire à la distance voulue : ni trop proche (pression), ni trop loin (il casse les grips). Tu ajustes avec jambes + grips.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+entr%C3%A9e+Contr%C3%B4le+distance+bjj"
      )
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
      createCheckpoint(
        "Setup depuis collar-sleeve",
        "Le sweep part d'un déséquilibre créé par les grips + placement des pieds. Tu prépares, puis tu exécutes. Si tu lances sans off-balance, ça rate.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+sweep+1+Setup+depuis+collar-sleeve+bjj"
      ),
      createCheckpoint(
        "Exécution du sweep",
        "Tu fais tomber dans la bonne direction en combinant traction/poussée et déplacement de tes hanches. Ce n'est pas juste \"tirer\".",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+sweep+1+Ex%C3%A9cution+du+sweep+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec",
        "Après le sweep, tu contrôles la position top et tu empêches la récupération immédiate.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+sweep+1+Stabilisation+3+sec+bjj"
      )
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
      createCheckpoint(
        "Sweep alternatif maîtrisé",
        "Tu as une 2e option depuis le même système (si l'adversaire défend le premier). L'idée : un système = plusieurs sorties.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+sweep+2+Sweep+alternatif+ma%C3%AEtris%C3%A9+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec",
        "Même validation : tu finis en contrôle, pas en scramble.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+sweep+2+Stabilisation+3+sec+bjj"
      )
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
      createCheckpoint(
        "Transition vers dos",
        "Tu utilises l'ouverture créée (déséquilibre, réaction) pour passer sur un angle et aller au dos, sans t'exposer.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+back+take+Transition+vers+dos+bjj"
      ),
      createCheckpoint(
        "Back control établi",
        "Une fois derrière, tu poses tes crochets / contrôle de hanches et tu colles le haut du corps.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+back+take+Back+control+%C3%A9tabli+bjj"
      ),
      createCheckpoint(
        "Contrôle maintenu",
        "Tu stabilises (main-fighting, crochets actifs) au lieu de \"chasser la soumission\" trop vite.",
        "https://www.youtube.com/results?search_query=Collar-sleeve+%3A+back+take+Contr%C3%B4le+maintenu+bjj"
      )
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
      createCheckpoint(
        "Récupération efficace",
        "Quand on essaie de te passer, tu remets des barrières (genoux/frames/pieds) et tu reviens devant lui. Objectif : empêcher le passage, pas juste survivre.",
        "https://www.youtube.com/results?search_query=Retention+garde+ouverte+%28r%C3%A9cup%C3%A9ration+1%29+R%C3%A9cup%C3%A9ration+efficace+bjj"
      ),
      createCheckpoint(
        "Garde rétablie",
        "Tu finis avec une garde claire (collar-sleeve, DLR, demi, etc.), pas juste \"les jambes dans le vide\".",
        "https://www.youtube.com/results?search_query=Retention+garde+ouverte+%28r%C3%A9cup%C3%A9ration+1%29+Garde+r%C3%A9tablie+bjj"
      )
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
      createCheckpoint(
        "Technique alternative",
        "Tu as une 2e façon de récupérer (ex: inversion de hanches, pummel de jambes, re-guard en turtle… selon ton système). Tu n'es pas mono-solution.",
        "https://www.youtube.com/results?search_query=Retention+garde+ouverte+%28r%C3%A9cup%C3%A9ration+2%29+Technique+alternative+bjj"
      ),
      createCheckpoint(
        "Efficacité démontrée",
        "Tu le fais sous pression réelle : l'adversaire avance et tu récupères quand même.",
        "https://www.youtube.com/results?search_query=Retention+garde+ouverte+%28r%C3%A9cup%C3%A9ration+2%29+Efficacit%C3%A9+d%C3%A9montr%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Position DLR correcte",
        "Ton crochet DLR est bien placé (ligne de jambe, tension), et tu ne laisses pas ton genou se faire écraser. La position doit te donner contrôle + mobilité.",
        "https://www.youtube.com/results?search_query=DLR+%3A+entr%C3%A9e+Position+DLR+correcte+bjj"
      ),
      createCheckpoint(
        "Grips appropriés",
        "Tu as des grips qui soutiennent la DLR (cheville/pantalon/manche/col selon version). Sans grips, tu te fais dégager.",
        "https://www.youtube.com/results?search_query=DLR+%3A+entr%C3%A9e+Grips+appropri%C3%A9s+bjj"
      ),
      createCheckpoint(
        "Contrôle distance",
        "Tu gardes la distance avec tes jambes et tu empêches l'adversaire de se coller ou de reculer librement.",
        "https://www.youtube.com/results?search_query=DLR+%3A+entr%C3%A9e+Contr%C3%B4le+distance+bjj"
      )
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
      createCheckpoint(
        "Off-balance efficace",
        "Tu sais déséquilibrer (tirer/pousser, déplacer son poids) sans te désorganiser. L'adversaire doit poser une main ou ajuster ses appuis.",
        "https://www.youtube.com/results?search_query=DLR+%3A+off-balance+Off-balance+efficace+bjj"
      ),
      createCheckpoint(
        "Adversaire déséquilibré",
        "Résultat visible : il \"compense\" (pas, main au sol, posture cassée). Si rien ne bouge, ton off-balance n'est pas réel.",
        "https://www.youtube.com/results?search_query=DLR+%3A+off-balance+Adversaire+d%C3%A9s%C3%A9quilibr%C3%A9+bjj"
      )
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
      createCheckpoint(
        "Setup depuis DLR",
        "Tu crées d'abord le déséquilibre et tu places tes hanches/jambes dans la bonne direction.",
        "https://www.youtube.com/results?search_query=DLR+%3A+sweep+Setup+depuis+DLR+bjj"
      ),
      createCheckpoint(
        "Exécution du sweep",
        "Tu bascules l'adversaire avec ta jambe crochet + direction du haut du corps. Le sweep suit l'off-balance, il ne le remplace pas.",
        "https://www.youtube.com/results?search_query=DLR+%3A+sweep+Ex%C3%A9cution+du+sweep+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec",
        "Tu termines en top en contrôlant immédiatement.",
        "https://www.youtube.com/results?search_query=DLR+%3A+sweep+Stabilisation+3+sec+bjj"
      )
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
      createCheckpoint(
        "Transition garde → top",
        "Tu passes en top après sweep/reversal sans te mettre en danger (base, tête, mains, genoux).",
        "https://www.youtube.com/results?search_query=Transitions+garde+%E2%86%92+top+%E2%86%92+stabiliser+Transition+garde+%E2%86%92+top+bjj"
      ),
      createCheckpoint(
        "Stabilisation (points)",
        "Tu sais quelle position \"compte\" et tu la verrouilles : side/mount/dos. Même hors compétition, l'idée est de stabiliser avant d'attaquer.",
        "https://www.youtube.com/results?search_query=Transitions+garde+%E2%86%92+top+%E2%86%92+stabiliser+Stabilisation+%28points%29+bjj"
      ),
      createCheckpoint(
        "Contrôle maintenu",
        "Tu empêches la récupération de garde/escape immédiat.",
        "https://www.youtube.com/results?search_query=Transitions+garde+%E2%86%92+top+%E2%86%92+stabiliser+Contr%C3%B4le+maintenu+bjj"
      )
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
      createCheckpoint(
        "Variations maîtrisées",
        "Tu as au moins 2 options de knee cut (selon underhook, crossface, angle, réaction). Pas un seul passage \"rigide\".",
        "https://www.youtube.com/results?search_query=Knee+cut+%3A+variations+Variations+ma%C3%AEtris%C3%A9es+bjj"
      ),
      createCheckpoint(
        "Adaptation selon situation",
        "Si l'adversaire met knee shield, frames, ou inverse, tu ajustes sans paniquer.",
        "https://www.youtube.com/results?search_query=Knee+cut+%3A+variations+Adaptation+selon+situation+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec",
        "Après le passage, tu verrouilles la position.",
        "https://www.youtube.com/results?search_query=Knee+cut+%3A+variations+Stabilisation+3+sec+bjj"
      )
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
      createCheckpoint(
        "Finitions après passage",
        "Tu sais finir proprement : contrôler tête/bras, empêcher le genou de rentrer, installer side/mount.",
        "https://www.youtube.com/results?search_query=Knee+cut+%3A+finitions+%2B+r%C3%A9ponse+knee+shield+Finitions+apr%C3%A8s+passage+bjj"
      ),
      createCheckpoint(
        "Réponse au knee shield",
        "Tu as une réponse claire au bouclier (changer d'angle, écraser, pummel, backstep… selon ton jeu). Tu ne restes pas bloqué.",
        "https://www.youtube.com/results?search_query=Knee+cut+%3A+finitions+%2B+r%C3%A9ponse+knee+shield+R%C3%A9ponse+au+knee+shield+bjj"
      ),
      createCheckpoint(
        "Stabilisation",
        "Tu confirmes la position stable avant de chasser une attaque.",
        "https://www.youtube.com/results?search_query=Knee+cut+%3A+finitions+%2B+r%C3%A9ponse+knee+shield+Stabilisation+bjj"
      )
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
      createCheckpoint(
        "Setup correct",
        "Tu as la bonne entrée : une jambe contrôlée \"over\", l'autre \"under\", tête placée, hanches basses. Sans setup, tu te fais remettre en guard.",
        "https://www.youtube.com/results?search_query=Over%2Funder+pass+Setup+correct+bjj"
      ),
      createCheckpoint(
        "Exécution avec pression",
        "Tu avances avec le corps entier, pas avec les bras. Pression progressive, angle, et tu neutralises les hanches de l'adversaire.",
        "https://www.youtube.com/results?search_query=Over%2Funder+pass+Ex%C3%A9cution+avec+pression+bjj"
      ),
      createCheckpoint(
        "Stabilisation 3 sec",
        "Tu termines en contrôle et tu bloques sa récupération.",
        "https://www.youtube.com/results?search_query=Over%2Funder+pass+Stabilisation+3+sec+bjj"
      )
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
      createCheckpoint(
        "Passage réussi",
        "Tu passes réellement la ligne des jambes sans te faire recoller.",
        "https://www.youtube.com/results?search_query=Pass-to-control+%3A+passer+%E2%86%92+side+%E2%86%92+mount+Passage+r%C3%A9ussi+bjj"
      ),
      createCheckpoint(
        "Side control stabilisé",
        "Tu t'installes : contrôle épaules + hanches, poids bas.",
        "https://www.youtube.com/results?search_query=Pass-to-control+%3A+passer+%E2%86%92+side+%E2%86%92+mount+Side+control+stabilis%C3%A9+bjj"
      ),
      createCheckpoint(
        "Transition vers mount",
        "Tu montes en mount au bon moment, sans donner d'espace ni perdre le contrôle.",
        "https://www.youtube.com/results?search_query=Pass-to-control+%3A+passer+%E2%86%92+side+%E2%86%92+mount+Transition+vers+mount+bjj"
      )
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
      createCheckpoint(
        "Contrôle en turtle",
        "Tu contrôles sans te faire renverser : poids bien placé, angles, tu bloques les hanches/épaules.",
        "https://www.youtube.com/results?search_query=Turtle+%3A+contr%C3%B4le+%2B+prise+de+dos+Contr%C3%B4le+en+turtle+bjj"
      ),
      createCheckpoint(
        "Prise de dos safe",
        "Tu prends le dos sans te jeter : tu sécurises un crochet/ceinture, tu contrôles une main, tu évites le roll.",
        "https://www.youtube.com/results?search_query=Turtle+%3A+contr%C3%B4le+%2B+prise+de+dos+Prise+de+dos+safe+bjj"
      ),
      createCheckpoint(
        "Back control établi",
        "Tu finis avec un dos stable (crochets + main-fighting).",
        "https://www.youtube.com/results?search_query=Turtle+%3A+contr%C3%B4le+%2B+prise+de+dos+Back+control+%C3%A9tabli+bjj"
      )
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
      createCheckpoint(
        "Recapture efficace",
        "Quand il commence à s'échapper, tu sais remettre le crochet/recoller (hip follow, pummel de jambes, etc.) au lieu de perdre tout.",
        "https://www.youtube.com/results?search_query=Back+maintain+%3A+recapture+Recapture+efficace+bjj"
      ),
      createCheckpoint(
        "Back control rétabli",
        "Tu reviens en position dominante, pas juste \"accroché\".",
        "https://www.youtube.com/results?search_query=Back+maintain+%3A+recapture+Back+control+r%C3%A9tabli+bjj"
      ),
      createCheckpoint(
        "Maintien 10 sec",
        "Tu tiens 10 secondes malgré la défense active.",
        "https://www.youtube.com/results?search_query=Back+maintain+%3A+recapture+Maintien+10+sec+bjj"
      )
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
      createCheckpoint(
        "Setup correct (collet + jambe)",
        "Tu as le collet profond et une prise qui contrôle le corps (pantalon/jambe). Sans grips profonds, ça ne serre pas.",
        "https://www.youtube.com/results?search_query=Bow+%26+arrow+choke+Setup+correct+%28collet+%2B+jambe%29+bjj"
      ),
      createCheckpoint(
        "Exécution du choke (technique propre)",
        "Tu tires comme un arc : un bras \"tire\", l'autre \"pousse/écarte\", et ton corps se place en angle. Ce n'est pas un tirage de bras, c'est une mécanique d'ensemble.",
        "https://www.youtube.com/results?search_query=Bow+%26+arrow+choke+Ex%C3%A9cution+du+choke+%28technique+propre%29+bjj"
      ),
      createCheckpoint(
        "Cycle contrôle → setup → finition",
        "Tu contrôles d'abord, tu installes les grips, puis tu finis sans précipitation.",
        "https://www.youtube.com/results?search_query=Bow+%26+arrow+choke+Cycle+contr%C3%B4le+%E2%86%92+setup+%E2%86%92+finition+bjj"
      )
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
      createCheckpoint(
        "Prévention efficace",
        "Avant même d'être en danger, tu protèges tes hanches/ta nuque, tu enlèves les grips, tu empêches l'installation des crochets.",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+prise+de+dos+%2B+escape+back+Pr%C3%A9vention+efficace+bjj"
      ),
      createCheckpoint(
        "Escape back solide",
        "Si le dos est pris, tu priorises main-fighting, puis tu sors sur un côté, tu enlèves un crochet, et tu reconstruis une garde/position.",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+prise+de+dos+%2B+escape+back+Escape+back+solide+bjj"
      ),
      createCheckpoint(
        "Sortie stable",
        "Tu ne finis pas \"à genoux sans défense\". Tu finis dans une position stable (garde, demi, top, ou distance).",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+prise+de+dos+%2B+escape+back+Sortie+stable+bjj"
      )
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
      createCheckpoint(
        "Système choisi (collar-sleeve OU DLR)",
        "Tu as choisi un système principal et tu t'y tiens pour progresser (au lieu de tout faire un peu). Ça sert à construire des réflexes.",
        "https://www.youtube.com/results?search_query=Sp%C3%A9cialisation+garde+%3A+choix+syst%C3%A8me+principal+Syst%C3%A8me+choisi+%28collar-sleeve+OU+DLR%29+bjj"
      ),
      createCheckpoint(
        "Compréhension approfondie",
        "Tu sais pourquoi ça marche : grips, angles, réactions adverses, et positions clés. Pas juste \"je connais 2 moves\".",
        "https://www.youtube.com/results?search_query=Sp%C3%A9cialisation+garde+%3A+choix+syst%C3%A8me+principal+Compr%C3%A9hension+approfondie+bjj"
      ),
      createCheckpoint(
        "Chaînes identifiées",
        "Tu as des enchaînements prévus : si A est défendu, tu vas à B, puis C. Un système = un arbre de décisions.",
        "https://www.youtube.com/results?search_query=Sp%C3%A9cialisation+garde+%3A+choix+syst%C3%A8me+principal+Cha%C3%AEnes+identifi%C3%A9es+bjj"
      )
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
      createCheckpoint(
        "Chaîne complète maîtrisée",
        "Tu peux faire toute la séquence sans te perdre : entrée, déséquilibre, sweep ou dos, stabilisation, puis attaque.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+garde+1+%3A+entr%C3%A9e+%E2%86%92+sweep%2Fback+%E2%86%92+contr%C3%B4le+%E2%86%92+finition+Cha%C3%AEne+compl%C3%A8te+ma%C3%AEtris%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Enchaînement fluide",
        "Les transitions sont naturelles, pas en \"étapes isolées\". On sent une continuité.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+garde+1+%3A+entr%C3%A9e+%E2%86%92+sweep%2Fback+%E2%86%92+contr%C3%B4le+%E2%86%92+finition+Encha%C3%AEnement+fluide+bjj"
      ),
      createCheckpoint(
        "Finition ou contrôle",
        "Tu finis soit par une soumission propre, soit par un contrôle dominant stable si la soumission n'est pas là.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+garde+1+%3A+entr%C3%A9e+%E2%86%92+sweep%2Fback+%E2%86%92+contr%C3%B4le+%E2%86%92+finition+Finition+ou+contr%C3%B4le+bjj"
      )
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
      createCheckpoint(
        "Chaîne alternative maîtrisée",
        "Tu as une 2e chaîne complète quand l'adversaire s'adapte à la première.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+garde+2+%3A+alternative+compl%C3%A8te+Cha%C3%AEne+alternative+ma%C3%AEtris%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Adaptation selon situation",
        "Tu choisis la chaîne en fonction de la réaction adverse, pas au hasard.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+garde+2+%3A+alternative+compl%C3%A8te+Adaptation+selon+situation+bjj"
      ),
      createCheckpoint(
        "Efficacité démontrée",
        "Ça marche sur résistance réelle, pas uniquement en drill.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+garde+2+%3A+alternative+compl%C3%A8te+Efficacit%C3%A9+d%C3%A9montr%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Angle choisi",
        "Tu sais quel type d'angle tu préfères (extérieur, intérieur, backstep…) et tu le construis volontairement.",
        "https://www.youtube.com/results?search_query=Sp%C3%A9cialisation+passage+%3A+choix+angle+%2B+pression+Angle+choisi+bjj"
      ),
      createCheckpoint(
        "Type de pression choisi",
        "Tu sais comment tu \"gagnes\" : vitesse/angle OU pression progressive. Et tu appliques de façon cohérente.",
        "https://www.youtube.com/results?search_query=Sp%C3%A9cialisation+passage+%3A+choix+angle+%2B+pression+Type+de+pression+choisi+bjj"
      ),
      createCheckpoint(
        "Compréhension approfondie",
        "Tu comprends les réactions adverses typiques et comment les punir.",
        "https://www.youtube.com/results?search_query=Sp%C3%A9cialisation+passage+%3A+choix+angle+%2B+pression+Compr%C3%A9hension+approfondie+bjj"
      )
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
      createCheckpoint(
        "Chaîne complète maîtrisée",
        "Tu sais connecter entrée + passage + stabilisation + montée mount/dos.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+passage+1+%3A+entr%C3%A9e+%E2%86%92+passer+%E2%86%92+side+%E2%86%92+mount%2Fdos+Cha%C3%AEne+compl%C3%A8te+ma%C3%AEtris%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Enchaînement fluide",
        "Tu passes sans pause qui permettrait à l'adversaire de recomposer.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+passage+1+%3A+entr%C3%A9e+%E2%86%92+passer+%E2%86%92+side+%E2%86%92+mount%2Fdos+Encha%C3%AEnement+fluide+bjj"
      ),
      createCheckpoint(
        "Mount ou dos établi",
        "Tu termines en vraie position dominante, pas en contrôle \"moyen\".",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+passage+1+%3A+entr%C3%A9e+%E2%86%92+passer+%E2%86%92+side+%E2%86%92+mount%2Fdos+Mount+ou+dos+%C3%A9tabli+bjj"
      )
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
      createCheckpoint(
        "Chaîne alternative maîtrisée",
        "Quand la première route est bloquée, tu bascules sur une deuxième route logique.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+passage+2+%3A+alternative+compl%C3%A8te+Cha%C3%AEne+alternative+ma%C3%AEtris%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Adaptation selon situation",
        "Tu choisis selon le type de garde, la réaction, les grips.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+passage+2+%3A+alternative+compl%C3%A8te+Adaptation+selon+situation+bjj"
      ),
      createCheckpoint(
        "Efficacité démontrée",
        "Tu peux l'imposer sur un partenaire qui résiste.",
        "https://www.youtube.com/results?search_query=Cha%C3%AEne+passage+2+%3A+alternative+compl%C3%A8te+Efficacit%C3%A9+d%C3%A9montr%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Reconnaissance du passage rapide",
        "Tu identifies vite les signaux : déplacement explosif, changement d'angle, attaque des hanches.",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+passage+rapide+Reconnaissance+du+passage+rapide+bjj"
      ),
      createCheckpoint(
        "Défense appropriée",
        "Tu réponds avec des frames, des crochets, et un repositionnement de hanches, pas juste \"je serre les jambes\".",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+passage+rapide+D%C3%A9fense+appropri%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Récupération garde",
        "Tu reviens devant lui et tu reconstruis une garde claire.",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+passage+rapide+R%C3%A9cup%C3%A9ration+garde+bjj"
      )
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
      createCheckpoint(
        "Reconnaissance de la pression",
        "Tu reconnais quand il cherche à t'écraser progressivement (crossface, underhook, poids bas).",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+passage+pression+Reconnaissance+de+la+pression+bjj"
      ),
      createCheckpoint(
        "Défense appropriée",
        "Tu gardes structure (frames), tu crées des angles, tu refuses d'être \"à plat\".",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+passage+pression+D%C3%A9fense+appropri%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Récupération garde",
        "Tu recomposes une garde stable au lieu de subir jusqu'au passage.",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+passage+pression+R%C3%A9cup%C3%A9ration+garde+bjj"
      )
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
      createCheckpoint(
        "Reconnaissance des grips",
        "Tu sais quels grips sont dangereux (col haut, manche dominante, pants grip…) et ce qu'ils permettent.",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+grips+Gi+dominants+Reconnaissance+des+grips+bjj"
      ),
      createCheckpoint(
        "Défense appropriée",
        "Tu casses le grip au bon moment, avec la bonne direction, et tu ne laisses pas le grip \"s'installer\".",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+grips+Gi+dominants+D%C3%A9fense+appropri%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Neutralisation",
        "Tu reviens à une situation neutre (distance, grips équilibrés, posture).",
        "https://www.youtube.com/results?search_query=D%C3%A9fense+vs+grips+Gi+dominants+Neutralisation+bjj"
      )
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
      createCheckpoint(
        "Reconnaissance précoce",
        "Tu sens très tôt quand tu perds la position (angle, underhook perdu, genou qui s'écrase).",
        "https://www.youtube.com/results?search_query=Early+exits+%3A+pr%C3%A9vention+Reconnaissance+pr%C3%A9coce+bjj"
      ),
      createCheckpoint(
        "Sortie anticipée",
        "Tu sors avant d'être totalement coincé (re-guard, inversion, turtle contrôlée).",
        "https://www.youtube.com/results?search_query=Early+exits+%3A+pr%C3%A9vention+Sortie+anticip%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Prévention efficace",
        "Tu réduis les situations où tu te fais enfermer : meilleure base, meilleur placement, meilleurs frames.",
        "https://www.youtube.com/results?search_query=Early+exits+%3A+pr%C3%A9vention+Pr%C3%A9vention+efficace+bjj"
      )
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
      createCheckpoint(
        "Transition fluide",
        "Tu montes sans donner d'espace, en contrôlant les bras.",
        "https://www.youtube.com/results?search_query=Transitions+Side+%E2%86%92+Mount+Transition+fluide+bjj"
      ),
      createCheckpoint(
        "Mount stable",
        "Tu poses ta base et tu ajustes selon ses mouvements.",
        "https://www.youtube.com/results?search_query=Transitions+Side+%E2%86%92+Mount+Mount+stable+bjj"
      ),
      createCheckpoint(
        "Contrôle maintenu",
        "Tu empêches le half-guard/re-guard immédiat.",
        "https://www.youtube.com/results?search_query=Transitions+Side+%E2%86%92+Mount+Contr%C3%B4le+maintenu+bjj"
      )
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
      createCheckpoint(
        "Transition fluide",
        "Tu prends l'angle dos quand l'adversaire tourne/frames, sans te jeter.",
        "https://www.youtube.com/results?search_query=Transitions+Side+%E2%86%92+Back+Transition+fluide+bjj"
      ),
      createCheckpoint(
        "Back control établi",
        "Crochets + main-fighting posés rapidement.",
        "https://www.youtube.com/results?search_query=Transitions+Side+%E2%86%92+Back+Back+control+%C3%A9tabli+bjj"
      ),
      createCheckpoint(
        "Contrôle maintenu",
        "Tu stabilises avant d'attaquer.",
        "https://www.youtube.com/results?search_query=Transitions+Side+%E2%86%92+Back+Contr%C3%B4le+maintenu+bjj"
      )
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
      createCheckpoint(
        "Transition fluide",
        "Tu profites des réactions (il tourne, il cadre) pour prendre le dos.",
        "https://www.youtube.com/results?search_query=Transitions+Mount+%E2%86%92+Back+Transition+fluide+bjj"
      ),
      createCheckpoint(
        "Back control établi",
        "Tu installes une position solide, pas juste \"je suis derrière\".",
        "https://www.youtube.com/results?search_query=Transitions+Mount+%E2%86%92+Back+Back+control+%C3%A9tabli+bjj"
      ),
      createCheckpoint(
        "Contrôle maintenu",
        "Tu gardes le dos malgré ses défenses.",
        "https://www.youtube.com/results?search_query=Transitions+Mount+%E2%86%92+Back+Contr%C3%B4le+maintenu+bjj"
      )
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
      createCheckpoint(
        "Reconnaissance du moment",
        "Tu sais quand accélérer (ouverture, déséquilibre, fatigue adverse) et quand figer (position gagnée, besoin de respirer).",
        "https://www.youtube.com/results?search_query=Gestion+du+rythme+%3A+acc%C3%A9l%C3%A9rer+%2F+figer+Reconnaissance+du+moment+bjj"
      ),
      createCheckpoint(
        "Accélération appropriée",
        "Tu accélères avec une intention (passer, prendre le dos, finir), pas pour \"bouger\".",
        "https://www.youtube.com/results?search_query=Gestion+du+rythme+%3A+acc%C3%A9l%C3%A9rer+%2F+figer+Acc%C3%A9l%C3%A9ration+appropri%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Figement efficace",
        "Tu sais verrouiller une position et casser le rythme adverse sans te faire pénaliser par l'inaction (tu contrôles vraiment).",
        "https://www.youtube.com/results?search_query=Gestion+du+rythme+%3A+acc%C3%A9l%C3%A9rer+%2F+figer+Figement+efficace+bjj"
      )
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
      createCheckpoint(
        "Grips optimaux identifiés",
        "Tu sais exactement où mettre tes doigts/poignet (profondeur, angle, main dominante) pour que ça soit maximal.",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+grips+optimaux+Grips+optimaux+identifi%C3%A9s+bjj"
      ),
      createCheckpoint(
        "Application correcte",
        "Tu poses ces grips en rolling, pas uniquement en drill. Tu sais les sécuriser.",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+grips+optimaux+Application+correcte+bjj"
      ),
      createCheckpoint(
        "Efficacité maximale",
        "Tes grips donnent un avantage clair : posture cassée, passes plus faciles, attaques plus propres.",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+grips+optimaux+Efficacit%C3%A9+maximale+bjj"
      )
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
      createCheckpoint(
        "Angles optimaux identifiés",
        "Tu sais quel angle rend la technique facile (ex: 30° plutôt que face).",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+angles+pr%C3%A9cis+Angles+optimaux+identifi%C3%A9s+bjj"
      ),
      createCheckpoint(
        "Application correcte",
        "Tu arrives à créer cet angle sous pression, pas seulement quand on te laisse faire.",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+angles+pr%C3%A9cis+Application+correcte+bjj"
      ),
      createCheckpoint(
        "Efficacité maximale",
        "Grâce à l'angle, tu utilises moins de force et tu réussis plus souvent.",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+angles+pr%C3%A9cis+Efficacit%C3%A9+maximale+bjj"
      )
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
      createCheckpoint(
        "Timing optimal identifié",
        "Tu sais quand déclencher : au moment où l'adversaire pousse, recule, respire, change de base.",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+timing+parfait+Timing+optimal+identifi%C3%A9+bjj"
      ),
      createCheckpoint(
        "Application correcte",
        "Tu déclenches au bon moment en sparring, pas \"quand tu peux\".",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+timing+parfait+Application+correcte+bjj"
      ),
      createCheckpoint(
        "Efficacité maximale",
        "Le bon timing rend la technique \"facile\" et répétable.",
        "https://www.youtube.com/results?search_query=Micro-d%C3%A9tails+%3A+timing+parfait+Efficacit%C3%A9+maximale+bjj"
      )
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
      createCheckpoint(
        "Gestion du poids efficace",
        "Tu sais répartir ton poids pour contrôler sans te cramer : pression intelligente, posture, respiration.",
        "https://www.youtube.com/results?search_query=Gestion+poids+%2B+fatigue+Gestion+du+poids+efficace+bjj"
      ),
      createCheckpoint(
        "Gestion de la fatigue",
        "Tu sais quand ralentir, quand respirer, et tu évites les efforts inutiles (pousser un mur, tirer sans angle).",
        "https://www.youtube.com/results?search_query=Gestion+poids+%2B+fatigue+Gestion+de+la+fatigue+bjj"
      ),
      createCheckpoint(
        "Performance maintenue",
        "Même fatigué, tu gardes une technique correcte et des décisions propres.",
        "https://www.youtube.com/results?search_query=Gestion+poids+%2B+fatigue+Performance+maintenue+bjj"
      )
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
      createCheckpoint(
        "Contres identifiés",
        "Tu connais les défenses adverses principales contre tes attaques/passes.",
        "https://www.youtube.com/results?search_query=Contres+de+contres+%3A+couche+2+Contres+identifi%C3%A9s+bjj"
      ),
      createCheckpoint(
        "Réponses développées",
        "Tu as des réponses automatiques à ces défenses (2e couche), pas besoin d'improviser.",
        "https://www.youtube.com/results?search_query=Contres+de+contres+%3A+couche+2+R%C3%A9ponses+d%C3%A9velopp%C3%A9es+bjj"
      ),
      createCheckpoint(
        "Efficacité démontrée",
        "Tu peux l'imposer sur un partenaire qui résiste.",
        "https://www.youtube.com/results?search_query=Contres+de+contres+%3A+couche+2+Efficacit%C3%A9+d%C3%A9montr%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Scénarios identifiés",
        "Tu sais reconnaître les situations types d'un match : tu mènes, tu es mené, égalité, fin de round, adversaire agressif/passif. Tu identifies vite le contexte.",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+sc%C3%A9narios+Sc%C3%A9narios+identifi%C3%A9s+bjj"
      ),
      createCheckpoint(
        "Stratégies développées",
        "Pour chaque scénario, tu as une réponse claire : si tu mènes → tu sécurises, si tu es mené → tu attaques, si égalité → tu prends l'initiative. Pas de \"je vois ce qui se passe\".",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+sc%C3%A9narios+Strat%C3%A9gies+d%C3%A9velopp%C3%A9es+bjj"
      ),
      createCheckpoint(
        "Plan A + Plan B",
        "Tu as toujours une route principale et une alternative. Si le plan A est bloqué (défense, résistance), tu bascules immédiatement sur le plan B sans hésiter.",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+sc%C3%A9narios+Plan+A+%2B+Plan+B+bjj"
      )
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
      createCheckpoint(
        "Stratégie claire",
        "Tu sais comment tu vas marquer : takedown → side → mount, ou pull guard → sweep → top, ou passage direct. Tu as un chemin précis vers les points, pas \"je vais voir\".",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+mener+aux+points+Strat%C3%A9gie+claire+bjj"
      ),
      createCheckpoint(
        "Application efficace",
        "Tu exécutes ta stratégie sous pression : tu entres, tu passes, tu stabilises, tu marques. Les transitions sont fluides et tu ne perds pas de temps en positions \"neutres\".",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+mener+aux+points+Application+efficace+bjj"
      ),
      createCheckpoint(
        "Points marqués",
        "Tu obtiens réellement les points : takedown validé, passage stabilisé 3 sec, mount/maintenu. Ce n'est pas \"j'ai essayé\", c'est \"j'ai marqué\".",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+mener+aux+points+Points+marqu%C3%A9s+bjj"
      )
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
      createCheckpoint(
        "Stratégie de remontée",
        "Quand tu es mené, tu sais comment remonter : escape → top, ou sweep → points, ou soumission. Tu as un plan clair pour inverser le score, pas juste \"je dois attaquer\".",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+remonter+Strat%C3%A9gie+de+remont%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Application efficace",
        "Tu appliques ta stratégie même sous pression : tu ne paniques pas, tu restes technique, et tu exécutes les mouvements qui te font remonter. Pas d'efforts désespérés.",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+remonter+Application+efficace+bjj"
      ),
      createCheckpoint(
        "Score amélioré",
        "Tu réussis à marquer des points ou à soumettre pour remonter au score. Résultat concret : tu passes de -2 à 0, ou de 0 à +4, etc. Ce n'est pas juste \"j'ai essayé de remonter\".",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+remonter+Score+am%C3%A9lior%C3%A9+bjj"
      )
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
      createCheckpoint(
        "Gestion bordure efficace",
        "Tu sais utiliser la bordure du tapis : tu pousses l'adversaire vers le bord pour limiter ses options, ou tu évites de te faire sortir. Tu utilises l'espace comme un outil tactique.",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+gestion+bordure+%2B+grips+Gestion+bordure+efficace+bjj"
      ),
      createCheckpoint(
        "Gestion grips appropriée",
        "Tu gères les grips selon le contexte : si tu mènes → tu sécurises, si tu es mené → tu casses et tu attaques. Tu ne laisses pas l'adversaire installer des grips dominants sans réagir.",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+gestion+bordure+%2B+grips+Gestion+grips+appropri%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Stratégie adaptée",
        "Tu adaptes ta stratégie selon la situation : bordure + grips adverses → tu changes d'angle, tu reset, ou tu forces une transition. Tu ne restes pas bloqué dans une position défavorable.",
        "https://www.youtube.com/results?search_query=Strat%C3%A9gie+match+%3A+gestion+bordure+%2B+grips+Strat%C3%A9gie+adapt%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Techniques en fin de round",
        "Même fatigué en fin de round, tu sais enchaîner des techniques efficaces : passes simples, contrôles basiques, soumissions directes. Tu ne te crames pas sur des mouvements complexes.",
        "https://www.youtube.com/results?search_query=Encha%C3%AEnements+sous+fatigue+Techniques+en+fin+de+round+bjj"
      ),
      createCheckpoint(
        "Gestion de l'énergie",
        "Tu économises ton énergie : tu utilises la technique plutôt que la force, tu respires, tu ralentis quand nécessaire, et tu accélères seulement aux moments clés. Pas de gaspillage.",
        "https://www.youtube.com/results?search_query=Encha%C3%AEnements+sous+fatigue+Gestion+de+l%27%C3%A9nergie+bjj"
      ),
      createCheckpoint(
        "Performance maintenue",
        "Même fatigué, tu gardes une technique correcte : passes propres, contrôles solides, décisions logiques. La fatigue ne transforme pas ton jeu en \"scramble désespéré\".",
        "https://www.youtube.com/results?search_query=Encha%C3%AEnements+sous+fatigue+Performance+maintenue+bjj"
      )
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
      createCheckpoint(
        "Rounds chronométrés",
        "Tu t'entraînes avec des rounds chronométrés (ex: 5 min, 6 min selon règles) et tu respectes le temps. Tu ne t'arrêtes pas avant la fin, tu gères le rythme sur toute la durée.",
        "https://www.youtube.com/results?search_query=Sparring+match-like+%3A+rounds+chronom%C3%A9tr%C3%A9s+Rounds+chronom%C3%A9tr%C3%A9s+bjj"
      ),
      createCheckpoint(
        "Contraintes respectées",
        "Tu respectes les contraintes d'un match : règles de points, limites du tapis, gestion du temps, pas de pause. Tu t'entraînes dans les conditions réelles, pas en \"rolling libre\".",
        "https://www.youtube.com/results?search_query=Sparring+match-like+%3A+rounds+chronom%C3%A9tr%C3%A9s+Contraintes+respect%C3%A9es+bjj"
      ),
      createCheckpoint(
        "Performance match-like",
        "Ton niveau en sparring chronométré est proche de ton niveau en match : stratégie claire, gestion du temps, techniques efficaces. Pas de différence majeure entre entraînement et compétition.",
        "https://www.youtube.com/results?search_query=Sparring+match-like+%3A+rounds+chronom%C3%A9tr%C3%A9s+Performance+match-like+bjj"
      )
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
      createCheckpoint(
        "Résistance gérée",
        "Face à un adversaire qui résiste vraiment (force, vitesse, technique), tu ne te casses pas : tu adaptes, tu changes d'angle, tu utilises la technique plutôt que la force brute.",
        "https://www.youtube.com/results?search_query=Robustesse+%3A+tenir+sous+r%C3%A9sistance+R%C3%A9sistance+g%C3%A9r%C3%A9e+bjj"
      ),
      createCheckpoint(
        "Performance maintenue",
        "Même sous résistance forte, tu gardes une technique correcte : passes propres, contrôles solides, décisions logiques. Tu ne dégrades pas ton jeu quand ça devient dur.",
        "https://www.youtube.com/results?search_query=Robustesse+%3A+tenir+sous+r%C3%A9sistance+Performance+maintenue+bjj"
      ),
      createCheckpoint(
        "Robustesse démontrée",
        "Tu réussis à imposer tes techniques sur des partenaires qui résistent activement : passes validées, soumissions terminées, contrôles maintenus. Ta technique fonctionne même sous pression.",
        "https://www.youtube.com/results?search_query=Robustesse+%3A+tenir+sous+r%C3%A9sistance+Robustesse+d%C3%A9montr%C3%A9e+bjj"
      )
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
      createCheckpoint(
        "Contrôle efficace",
        "Tu sais maintenir des positions dominantes (mount, side, back) de façon stable et sécurisée. Tu contrôles vraiment, pas juste \"tu es en haut\". L'adversaire ne peut pas facilement s'échapper.",
        "https://www.youtube.com/results?search_query=Gagner+sans+soumettre+%3A+contr%C3%B4le+%2B+d%C3%A9cisions+Contr%C3%B4le+efficace+bjj"
      ),
      createCheckpoint(
        "Décisions appropriées",
        "Tu prends les bonnes décisions : si la soumission n'est pas là, tu sécurises les points au lieu de forcer. Tu choisis stabilité + points plutôt que risque + échec. Tu joues intelligent.",
        "https://www.youtube.com/results?search_query=Gagner+sans+soumettre+%3A+contr%C3%B4le+%2B+d%C3%A9cisions+D%C3%A9cisions+appropri%C3%A9es+bjj"
      ),
      createCheckpoint(
        "Victoire par points",
        "Tu gagnes des matches en accumulant les points (takedown, passage, mount, etc.) sans nécessairement soumettre. Tu démontres que tu peux gagner par contrôle et stratégie, pas uniquement par finition.",
        "https://www.youtube.com/results?search_query=Gagner+sans+soumettre+%3A+contr%C3%B4le+%2B+d%C3%A9cisions+Victoire+par+points+bjj"
      )
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
