import type { Question } from './types';

/**
 * All 32 sovereignty assessment questions (4 per SOV category).
 * Based on EU SEAL framework + Dutch investigation findings
 * (Rekenkamer, Solvinity/Kyndryl, SIDN, Belastingdienst/M365).
 */
export const QUESTIONS: Question[] = [
  // SOV-1: Strategische Soevereiniteit (15%)
  {
    id: 'sov1_q1',
    category: 'sov1',
    question: 'Wie is eigenaar van uw primaire cloudprovider?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Niet-EU eigenaar, geen EU-verankering' },
      { level: 1, label: 'SEAL-1', description: 'Niet-EU eigenaar met EU-vestiging' },
      { level: 2, label: 'SEAL-2', description: 'Joint venture met EU-partij' },
      { level: 3, label: 'SEAL-3', description: 'EU-eigenaar met beperkte niet-EU invloed' },
      { level: 4, label: 'SEAL-4', description: 'Volledig EU-eigendom en -bestuur' },
    ],
  },
  {
    id: 'sov1_q2',
    category: 'sov1',
    question: 'Heeft uw organisatie zeggenschap over strategische beslissingen van de provider?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen inspraak' },
      { level: 1, label: 'SEAL-1', description: 'SLA met basale service-garanties' },
      { level: 2, label: 'SEAL-2', description: 'Contractuele adviesrechten' },
      { level: 3, label: 'SEAL-3', description: 'Mede-zeggenschap via klantenpanel/board' },
      { level: 4, label: 'SEAL-4', description: 'Volledige controle of eigen beheer' },
    ],
  },
  {
    id: 'sov1_q3',
    category: 'sov1',
    question: 'Is de provider financieel verankerd in het EU-ecosysteem?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen EU-financiële banden' },
      { level: 1, label: 'SEAL-1', description: 'Beperkte EU-omzet' },
      { level: 2, label: 'SEAL-2', description: 'Significant deel EU-omzet' },
      { level: 3, label: 'SEAL-3', description: 'Hoofdzakelijk EU-klanten en -investeerders' },
      { level: 4, label: 'SEAL-4', description: 'Volledig EU-gevestigd en -gefinancierd' },
    ],
  },
  {
    id: 'sov1_q4',
    category: 'sov1',
    question: 'Hoe is de governance van de provider gestructureerd?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen transparantie over governance' },
      { level: 1, label: 'SEAL-1', description: 'Basisinformatie beschikbaar' },
      { level: 2, label: 'SEAL-2', description: 'Governance gedocumenteerd, niet-EU controle' },
      { level: 3, label: 'SEAL-3', description: 'EU-gecontroleerd bestuur met transparantie' },
      { level: 4, label: 'SEAL-4', description: 'Volledig transparant EU-bestuur' },
    ],
  },

  // SOV-2: Juridisch & Jurisdictie (10%)
  {
    id: 'sov2_q1',
    category: 'sov2',
    question: 'Is uw provider onderworpen aan buitenlandse wetgeving (bijv. US CLOUD Act)?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Volledig onderworpen, geen bescherming' },
      { level: 1, label: 'SEAL-1', description: 'Onderworpen, contractuele beperking' },
      { level: 2, label: 'SEAL-2', description: 'Onderworpen maar EU-datalocatie' },
      { level: 3, label: 'SEAL-3', description: 'Beperkte blootstelling, technische mitigatie' },
      { level: 4, label: 'SEAL-4', description: 'Geen buitenlandse jurisdictie van toepassing' },
    ],
  },
  {
    id: 'sov2_q2',
    category: 'sov2',
    question: 'Onder welk recht vallen geschillen met de provider?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Niet-EU recht, niet-EU rechtbank' },
      { level: 1, label: 'SEAL-1', description: 'Arbitrage met EU-element' },
      { level: 2, label: 'SEAL-2', description: 'EU-recht maar niet-EU handhaving' },
      { level: 3, label: 'SEAL-3', description: 'EU-recht en EU-handhaving' },
      { level: 4, label: 'SEAL-4', description: 'Nederlands recht, Nederlandse rechter' },
    ],
  },
  {
    id: 'sov2_q3',
    category: 'sov2',
    question: 'Voldoet de verwerkingsovereenkomst volledig aan de AVG?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen verwerkersovereenkomst' },
      { level: 1, label: 'SEAL-1', description: 'Basisovereenkomst, niet AVG-conform' },
      { level: 2, label: 'SEAL-2', description: 'AVG-conform maar onvolledig' },
      { level: 3, label: 'SEAL-3', description: 'Volledig AVG-conform' },
      { level: 4, label: 'SEAL-4', description: 'AVG-conform + aanvullende NL-waarborgen' },
    ],
  },
  {
    id: 'sov2_q4',
    category: 'sov2',
    question: 'Wordt u geïnformeerd bij dataverzoeken van buitenlandse overheden?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen notificatieplicht' },
      { level: 1, label: 'SEAL-1', description: 'Best-effort notificatie' },
      { level: 2, label: 'SEAL-2', description: 'Contractuele notificatieplicht' },
      { level: 3, label: 'SEAL-3', description: 'Notificatie + juridisch verweer' },
      { level: 4, label: 'SEAL-4', description: 'Technisch onmogelijk (encryptie) + notificatie' },
    ],
  },

  // SOV-3: Data & AI Soevereiniteit (10%)
  {
    id: 'sov3_q1',
    category: 'sov3',
    question: 'Waar worden uw data opgeslagen en verwerkt?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Onbekend / buiten EU' },
      { level: 1, label: 'SEAL-1', description: 'Deels EU, deels niet-EU' },
      { level: 2, label: 'SEAL-2', description: 'EU-opslag, verwerking soms buiten EU' },
      { level: 3, label: 'SEAL-3', description: 'Volledig EU, incidenteel niet-EU metadata' },
      { level: 4, label: 'SEAL-4', description: 'Uitsluitend Nederland/EU, contractueel geborgd' },
    ],
  },
  {
    id: 'sov3_q2',
    category: 'sov3',
    question: 'Wie beheert de encryptiesleutels van uw data?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Provider, geen klantcontrole' },
      { level: 1, label: 'SEAL-1', description: 'Provider met klant-audit mogelijkheid' },
      { level: 2, label: 'SEAL-2', description: 'Gedeeld beheer (provider + klant)' },
      { level: 3, label: 'SEAL-3', description: 'Klant beheert, provider kan niet bij plaintext' },
      { level: 4, label: 'SEAL-4', description: 'Klant-exclusief beheer, HSM in eigen datacenter' },
    ],
  },
  {
    id: 'sov3_q3',
    category: 'sov3',
    question: 'Kan de provider uw data gebruiken voor AI-training of analytics?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Ja, standaard in voorwaarden' },
      { level: 1, label: 'SEAL-1', description: 'Opt-out mogelijk maar niet standaard' },
      { level: 2, label: 'SEAL-2', description: 'Contractueel uitgesloten' },
      { level: 3, label: 'SEAL-3', description: 'Technisch afgedwongen scheiding' },
      { level: 4, label: 'SEAL-4', description: 'Onmogelijk door architectuur + contract' },
    ],
  },
  {
    id: 'sov3_q4',
    category: 'sov3',
    question: 'Kunt u al uw data exporteren in open standaard formaten?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen export mogelijk' },
      { level: 1, label: 'SEAL-1', description: 'Export in propriëtair formaat' },
      { level: 2, label: 'SEAL-2', description: 'Export mogelijk maar beperkt' },
      { level: 3, label: 'SEAL-3', description: 'Volledige export in open formaten' },
      { level: 4, label: 'SEAL-4', description: 'Realtime sync + export in open formaten' },
    ],
  },

  // SOV-4: Operationele Soevereiniteit (15%)
  {
    id: 'sov4_q1',
    category: 'sov4',
    question: 'Kunt u de dienst zelfstandig beheren zonder de provider?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Volledig afhankelijk' },
      { level: 1, label: 'SEAL-1', description: 'Beperkt zelfbeheer, kritieke afhankelijkheid' },
      { level: 2, label: 'SEAL-2', description: 'Gedeeld beheer, provider voor complexe taken' },
      { level: 3, label: 'SEAL-3', description: 'Grotendeels zelfstandig, provider voor updates' },
      { level: 4, label: 'SEAL-4', description: 'Volledig zelfstandig te beheren' },
    ],
  },
  {
    id: 'sov4_q2',
    category: 'sov4',
    question: 'Is er een geteste exitstrategie om van provider te wisselen?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen exitstrategie' },
      { level: 1, label: 'SEAL-1', description: 'Exitstrategie op papier, niet getest' },
      { level: 2, label: 'SEAL-2', description: 'Exitplan met tijdlijn, niet getest' },
      { level: 3, label: 'SEAL-3', description: 'Getest exitplan met bewezen migratieprocedure' },
      { level: 4, label: 'SEAL-4', description: 'Regelmatig getest, migratie binnen weken mogelijk' },
    ],
  },
  {
    id: 'sov4_q3',
    category: 'sov4',
    question: 'Is support en onderhoud beschikbaar binnen EU/Nederland?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen lokale support' },
      { level: 1, label: 'SEAL-1', description: 'Basis support (email/chat) in EU' },
      { level: 2, label: 'SEAL-2', description: 'Telefonische support in EU-tijdzones' },
      { level: 3, label: 'SEAL-3', description: 'Dedicated EU-team, 24/7 beschikbaar' },
      { level: 4, label: 'SEAL-4', description: 'NL-gebaseerd team met security clearance' },
    ],
  },
  {
    id: 'sov4_q4',
    category: 'sov4',
    question: 'Kunt u zelfstandig reageren op beveiligingsincidenten?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen eigen incident response capability' },
      { level: 1, label: 'SEAL-1', description: 'Basis monitoring, afhankelijk van provider' },
      { level: 2, label: 'SEAL-2', description: 'Eigen SOC, provider voor remediatie' },
      { level: 3, label: 'SEAL-3', description: 'Eigen SOC + remediatie, provider als escalatie' },
      { level: 4, label: 'SEAL-4', description: 'Volledig eigen incident response, onafhankelijk' },
    ],
  },

  // SOV-5: Supply Chain Soevereiniteit (20%)
  {
    id: 'sov5_q1',
    category: 'sov5',
    question: 'Is de herkomst van hardware (servers, netwerk) transparant en gedocumenteerd?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Onbekend' },
      { level: 1, label: 'SEAL-1', description: 'Globaal bekend (land van herkomst)' },
      { level: 2, label: 'SEAL-2', description: 'Gedocumenteerd per componenttype' },
      { level: 3, label: 'SEAL-3', description: 'Volledige supply chain audit beschikbaar' },
      { level: 4, label: 'SEAL-4', description: 'EU-gesourcede hardware met certificering' },
    ],
  },
  {
    id: 'sov5_q2',
    category: 'sov5',
    question: 'Zijn softwarecomponenten en dependencies gedocumenteerd (SBOM)?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen inzicht' },
      { level: 1, label: 'SEAL-1', description: 'Globaal overzicht beschikbaar' },
      { level: 2, label: 'SEAL-2', description: 'SBOM beschikbaar voor kerncomponenten' },
      { level: 3, label: 'SEAL-3', description: 'Volledige SBOM met vulnerability tracking' },
      { level: 4, label: 'SEAL-4', description: 'Volledige SBOM + open source, auditeerbaar' },
    ],
  },
  {
    id: 'sov5_q3',
    category: 'sov5',
    question: 'Wie zijn de kritieke toeleveranciers en in welke jurisdicties opereren zij?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Onbekend' },
      { level: 1, label: 'SEAL-1', description: 'Eerste laag bekend' },
      { level: 2, label: 'SEAL-2', description: 'Eerste + tweede laag in kaart' },
      { level: 3, label: 'SEAL-3', description: 'Volledige keten in kaart, risico-analyse gedaan' },
      { level: 4, label: 'SEAL-4', description: 'Volledige keten EU-gebaseerd of geauditeerd' },
    ],
  },
  {
    id: 'sov5_q4',
    category: 'sov5',
    question: 'Hoe worden kwetsbaarheden in de supply chain geïdentificeerd en gepatcht?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen proces' },
      { level: 1, label: 'SEAL-1', description: 'Ad-hoc, reactief' },
      { level: 2, label: 'SEAL-2', description: 'Periodieke vulnerability scans' },
      { level: 3, label: 'SEAL-3', description: 'Continu monitoren + gedefinieerd patchbeleid' },
      { level: 4, label: 'SEAL-4', description: 'Geautomatiseerd, SLA op patchtijd, audit trail' },
    ],
  },

  // SOV-6: Technologie & Openheid (15%)
  {
    id: 'sov6_q1',
    category: 'sov6',
    question: 'Gebruikt uw oplossing open standaarden (APIs, dataformaten)?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Volledig propriëtair' },
      { level: 1, label: 'SEAL-1', description: 'Beperkt open standaarden' },
      { level: 2, label: 'SEAL-2', description: 'Mix van open en propriëtair' },
      { level: 3, label: 'SEAL-3', description: 'Overwegend open standaarden' },
      { level: 4, label: 'SEAL-4', description: 'Uitsluitend open standaarden' },
    ],
  },
  {
    id: 'sov6_q2',
    category: 'sov6',
    question: 'Is de oplossing porteerbaar naar een andere provider/platform?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Volledige vendor lock-in' },
      { level: 1, label: 'SEAL-1', description: 'Theoretisch porteerbaar, hoge kosten' },
      { level: 2, label: 'SEAL-2', description: 'Porteerbaar met significant effort' },
      { level: 3, label: 'SEAL-3', description: 'Porteerbaar met beperkt effort' },
      { level: 4, label: 'SEAL-4', description: 'Direct porteerbaar (containers, IaC)' },
    ],
  },
  {
    id: 'sov6_q3',
    category: 'sov6',
    question: 'In hoeverre is de stack gebaseerd op open source?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Volledig closed source' },
      { level: 1, label: 'SEAL-1', description: 'Beperkt open source componenten' },
      { level: 2, label: 'SEAL-2', description: 'Kerncomponenten open source' },
      { level: 3, label: 'SEAL-3', description: 'Overwegend open source' },
      { level: 4, label: 'SEAL-4', description: 'Volledig open source stack' },
    ],
  },
  {
    id: 'sov6_q4',
    category: 'sov6',
    question: 'Zijn APIs volledig gedocumenteerd en stabiel?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen documentatie' },
      { level: 1, label: 'SEAL-1', description: 'Basisdocumentatie, instabiele APIs' },
      { level: 2, label: 'SEAL-2', description: 'Gedocumenteerd, periodieke breaking changes' },
      { level: 3, label: 'SEAL-3', description: 'Volledig gedocumenteerd, versiebeheer' },
      { level: 4, label: 'SEAL-4', description: 'OpenAPI spec, SLA op stabiliteit' },
    ],
  },

  // SOV-7: Security & Compliance (10%)
  {
    id: 'sov7_q1',
    category: 'sov7',
    question: 'Voldoet de oplossing aan BIO2 / NIS2 vereisten?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Niet beoordeeld' },
      { level: 1, label: 'SEAL-1', description: 'Gedeeltelijk, grote gaps' },
      { level: 2, label: 'SEAL-2', description: 'Grotendeels, enkele open punten' },
      { level: 3, label: 'SEAL-3', description: 'Volledig compliant, jaarlijkse audit' },
      { level: 4, label: 'SEAL-4', description: 'Compliant + onafhankelijke certificering' },
    ],
  },
  {
    id: 'sov7_q2',
    category: 'sov7',
    question: 'Worden onafhankelijke security audits en pentests uitgevoerd?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Nooit' },
      { level: 1, label: 'SEAL-1', description: 'Incidenteel, niet structureel' },
      { level: 2, label: 'SEAL-2', description: 'Jaarlijks door provider zelf' },
      { level: 3, label: 'SEAL-3', description: 'Jaarlijks door onafhankelijke partij' },
      { level: 4, label: 'SEAL-4', description: 'Continu + ad-hoc door onafhankelijke partij' },
    ],
  },
  {
    id: 'sov7_q3',
    category: 'sov7',
    question: 'Heeft u auditrechten op de infrastructuur van de provider?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen auditrechten' },
      { level: 1, label: 'SEAL-1', description: 'Beperkt (rapporten opvragen)' },
      { level: 2, label: 'SEAL-2', description: 'Contractueel auditrecht, beperkte scope' },
      { level: 3, label: 'SEAL-3', description: 'Volledig auditrecht, inclusief on-site' },
      { level: 4, label: 'SEAL-4', description: 'Volledig + eigen security tooling inzetbaar' },
    ],
  },
  {
    id: 'sov7_q4',
    category: 'sov7',
    question: 'Worden beveiligingsincidenten direct gemeld en transparant afgehandeld?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen meldplicht' },
      { level: 1, label: 'SEAL-1', description: 'Best-effort melding' },
      { level: 2, label: 'SEAL-2', description: 'Contractuele meldplicht (72 uur)' },
      { level: 3, label: 'SEAL-3', description: 'Melding binnen 24 uur + root cause analysis' },
      { level: 4, label: 'SEAL-4', description: 'Realtime melding + gezamenlijke response' },
    ],
  },

  // SOV-8: Duurzaamheid (5%)
  {
    id: 'sov8_q1',
    category: 'sov8',
    question: 'Welk percentage van de infrastructuur draait op hernieuwbare energie?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Onbekend / <25%' },
      { level: 1, label: 'SEAL-1', description: '25-50% hernieuwbaar' },
      { level: 2, label: 'SEAL-2', description: '50-75% hernieuwbaar' },
      { level: 3, label: 'SEAL-3', description: '75-100% hernieuwbaar' },
      { level: 4, label: 'SEAL-4', description: '100% hernieuwbaar + certificering' },
    ],
  },
  {
    id: 'sov8_q2',
    category: 'sov8',
    question: 'Is de CO2-voetafdruk van de dienst inzichtelijk?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Niet gemeten' },
      { level: 1, label: 'SEAL-1', description: 'Globale schatting beschikbaar' },
      { level: 2, label: 'SEAL-2', description: 'Per dienst meetbaar' },
      { level: 3, label: 'SEAL-3', description: 'Transparant gerapporteerd per klant' },
      { level: 4, label: 'SEAL-4', description: 'Realtime dashboard + compensatieprogramma' },
    ],
  },
  {
    id: 'sov8_q3',
    category: 'sov8',
    question: 'Heeft de provider een duurzaamheidsstrategie?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen strategie' },
      { level: 1, label: 'SEAL-1', description: 'Intentie uitgesproken' },
      { level: 2, label: 'SEAL-2', description: 'Strategie gedocumenteerd' },
      { level: 3, label: 'SEAL-3', description: 'Strategie met meetbare doelen en voortgang' },
      { level: 4, label: 'SEAL-4', description: 'ISO 14001 gecertificeerd + EU Taxonomy aligned' },
    ],
  },
  {
    id: 'sov8_q4',
    category: 'sov8',
    question: 'Worden duurzaamheidsmetrieken transparant gerapporteerd?',
    levels: [
      { level: 0, label: 'SEAL-0', description: 'Geen rapportage' },
      { level: 1, label: 'SEAL-1', description: 'Jaarlijks globaal rapport' },
      { level: 2, label: 'SEAL-2', description: 'Gedetailleerd jaarrapport' },
      { level: 3, label: 'SEAL-3', description: 'Kwartaalrapportage met KPIs' },
      { level: 4, label: 'SEAL-4', description: 'Realtime inzicht voor klanten' },
    ],
  },
];

/** Get all questions for a specific SOV category */
export function getQuestionsByCategory(category: string): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}

/** Total number of questions */
export const TOTAL_QUESTIONS = QUESTIONS.length;
