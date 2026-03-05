import type { SraQuestion } from './types';

/**
 * SRA — Soevereiniteits Gereedheids Assessment
 * 36 vragen over 9 thema's (4 per thema).
 *
 * Gebaseerd op bevindingen uit:
 * - Rekenkamer "Het Rijk in de Cloud" (jan 2025)
 * - Kyndryl/Solvinity Tweede Kamer-debat (feb 2025)
 * - SIDN .nl-domein AWS-migratie (jan 2025)
 * - Belastingdienst M365-migratie (2025-2026)
 * - BIO2, NIS2/Cbw, NEN 7510, Rijksbreed Cloudbeleid
 * - VNG Position Paper Digitale Autonomie (okt 2025)
 * - Gemeente Amsterdam "Autonoom, Tenzij" (jan 2026)
 *
 * Doel: inzicht en richting geven — niet oordelen.
 * Een bewuste keuze met goede mitigaties is beter dan
 * onbewust afhankelijk zijn.
 */
export const SRA_QUESTIONS: SraQuestion[] = [
  // ═══════════════════════════════════════════════════
  // BEWUSTZIJN & STRATEGIE (12%)
  // ═══════════════════════════════════════════════════
  {
    id: 'bewustzijn_q1',
    theme: 'bewustzijn',
    question: 'In hoeverre is digitale soevereiniteit als concept bekend bij het bestuur en management?',
    context: 'De Rekenkamer concludeerde dat het Rijk "zonder afwegingen de cloud in is gegaan". Zonder bestuurlijk bewustzijn worden cruciale IT-beslissingen genomen zonder soevereiniteitsafweging.',
    levels: [
      { level: 0, description: 'Digitale soevereiniteit is geen bekend begrip bij bestuur en management.' },
      { level: 1, description: 'Het begrip is incidenteel besproken na mediaberichten (bijv. Solvinity), maar niet structureel geagendeerd.' },
      { level: 2, description: 'Staat op de bestuurlijke agenda. Er is een interne definitie vastgesteld en meegenomen in de IT-visie.' },
      { level: 3, description: 'Bestuur neemt soevereiniteit mee als criterium bij strategische IT-beslissingen. Er zijn doelstellingen geformuleerd.' },
      { level: 4, description: 'Verankerd in de organisatiestrategie met bestuurlijke eigenaarschap, jaarlijkse rapportage, en actieve deelname aan VNG/landelijke initiatieven.' },
    ],
  },
  {
    id: 'bewustzijn_q2',
    theme: 'bewustzijn',
    question: 'Heeft uw organisatie een vastgestelde strategie of roadmap voor digitale soevereiniteit?',
    context: 'Amsterdam hanteert een 10-jarenplan ("Autonoom, Tenzij" — 30% in 2031, volledig in 2035). Haarlem beantwoordde raadsvragen met "we zijn bezig, het duurt nog even". Een roadmap maakt de ambitie concreet en stuurbaar.',
    levels: [
      { level: 0, description: 'Geen strategie, visie of roadmap.' },
      { level: 1, description: 'Er zijn interne voornemens, maar geen vastgesteld plan met tijdlijn.' },
      { level: 2, description: 'Er is een vastgestelde strategie met ambities en een globale tijdlijn.' },
      { level: 3, description: 'De strategie is vertaald naar een concreet uitvoeringsplan met mijlpalen, verantwoordelijken, budget, en periodieke rapportage.' },
      { level: 4, description: 'De roadmap is geïntegreerd in het organisatiebrede informatiebeleid, wordt jaarlijks geëvalueerd, en is afgestemd op VNG/Rijksbreed beleid.' },
    ],
  },
  {
    id: 'bewustzijn_q3',
    theme: 'bewustzijn',
    question: 'Is er een actueel en volledig overzicht van alle clouddiensten die de organisatie gebruikt?',
    context: 'De Rekenkamer vond 1.588 rijksbrede clouddiensten zonder coördinatie, waarvan 26% een onbekend cloudtype had. Zonder overzicht is soevereiniteitsbeleid onmogelijk.',
    levels: [
      { level: 0, description: 'Geen overzicht. Afdelingen schaffen zelfstandig diensten aan (shadow IT).' },
      { level: 1, description: 'Globaal overzicht maar incompleet — mist cloudtype, jurisdictie, of schaduw-IT.' },
      { level: 2, description: 'Compleet register met cloudtype (SaaS/PaaS/IaaS), leverancier, en land van vestiging. Minimaal jaarlijks bijgewerkt.' },
      { level: 3, description: 'Register bevat ook jurisdictie, dataclassificatie, en contractlooptijden. Gekoppeld aan risicoadministratie.' },
      { level: 4, description: 'Realtime bijgehouden via geautomatiseerde discovery, geïntegreerd met inkoop en contractmanagement.' },
    ],
  },
  {
    id: 'bewustzijn_q4',
    theme: 'bewustzijn',
    question: 'Worden medewerkers structureel opgeleid over digitale soevereiniteit en de bijbehorende risico\'s?',
    context: 'Bij de Belastingdienst werden EU-alternatieven afgewezen zonder individuele beoordeling — mede door gebrek aan kennis. Bewustwording is een voorwaarde voor verantwoorde besluitvorming.',
    levels: [
      { level: 0, description: 'Geen opleidings- of bewustwordingsactiviteiten.' },
      { level: 1, description: 'Incidenteel informatie gedeeld na een incident, maar geen structureel programma.' },
      { level: 2, description: 'Periodiek bewustwordingsprogramma gericht op IT-management en inkopers.' },
      { level: 3, description: 'Structureel onderdeel van awareness-programma voor alle relevante rollen (bestuur, IT, inkoop, informatiemanagement).' },
      { level: 4, description: 'Doorlopend competentieprogramma, actieve kennisdeling met peers, bestuurders opgeleid conform NIS2/Cbw-zorgplicht.' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // BELEIDSKADER & GOVERNANCE (14%)
  // ═══════════════════════════════════════════════════
  {
    id: 'governance_q1',
    theme: 'governance',
    question: 'Is er een formeel vastgesteld beleidskader voor het gebruik van clouddiensten, inclusief soevereiniteitscriteria?',
    context: 'Het Rijksbreed Cloudbeleid (2022) verplicht organisaties tot eigen cloudbeleid. De Rekenkamer constateerde dat dit bij veel organisaties ontbreekt of onvoldoende concreet is.',
    levels: [
      { level: 0, description: 'Geen cloudbeleid of beleidskader.' },
      { level: 1, description: 'Informele richtlijnen, maar geen formeel vastgesteld document.' },
      { level: 2, description: 'Formeel vastgesteld cloudbeleid met selectiecriteria waaronder soevereiniteitsoverwegingen.' },
      { level: 3, description: 'Geïntegreerd in informatiebeveiligingsbeleid met besliscriteria per dataclassificatie. Wordt actief gehandhaafd.' },
      { level: 4, description: 'Periodiek geëvalueerd op basis van nieuwe regelgeving (NIS2, BIO2), technologische ontwikkelingen, en geopolitieke veranderingen.' },
    ],
  },
  {
    id: 'governance_q2',
    theme: 'governance',
    question: 'Is er een aangewezen functionaris met eindverantwoordelijkheid voor digitale soevereiniteit?',
    context: 'Bij Solvinity was onduidelijk wie verantwoordelijk was voor het monitoren van leveranciersovernames. De NIS2/Cbw legt bestuurdersverantwoordelijkheid op. Zonder eigenaarschap gebeurt er niets.',
    levels: [
      { level: 0, description: 'Niemand is verantwoordelijk. Het onderwerp is niet belegd.' },
      { level: 1, description: 'Wordt ad-hoc opgepakt door CISO of IT-manager, maar niet formeel belegd.' },
      { level: 2, description: 'Formeel verantwoordelijke functionaris met duidelijke taakomschrijving.' },
      { level: 3, description: 'Rapporteert periodiek aan bestuur, heeft mandaat voor interventies, werkt samen met inkoop en juridische zaken.' },
      { level: 4, description: 'Verankerd in governance-structuur met multidisciplinair team, escalatierechten naar bestuursniveau, gekoppeld aan ENSIA-verantwoording.' },
    ],
  },
  {
    id: 'governance_q3',
    theme: 'governance',
    question: 'Worden soevereiniteitsoverwegingen meegenomen in inkoopprocessen en aanbestedingen?',
    context: 'Amsterdam is de eerste gemeente met "autonoom, tenzij" als inkoopcriterium. De Belastingdienst koos M365 zonder EU-alternatieven individueel te beoordelen. Inkoop is het moment waarop keuzes worden gemaakt of gemist.',
    levels: [
      { level: 0, description: 'Soevereiniteit speelt geen rol bij inkoop. Selectie op prijs en functionaliteit.' },
      { level: 1, description: 'Incidenteel besproken bij grote aanbestedingen, maar geen formele criteria.' },
      { level: 2, description: 'Opgenomen als criterium: jurisdictie, datalocatie en exit-mogelijkheden worden beoordeeld.' },
      { level: 3, description: 'Afwegingskader per dataclassificatie. EU-alternatieven worden structureel meegenomen in marktverkenningen.' },
      { level: 4, description: '"Autonoom, tenzij"-principe, gestandaardiseerd scoringskader (bijv. SEAL), ervaringsdeling met peers.' },
    ],
  },
  {
    id: 'governance_q4',
    theme: 'governance',
    question: 'Wordt naleving van het soevereiniteitsbeleid structureel getoetst en gehandhaafd?',
    context: 'De Rekenkamer constateerde dat het Rijksbreed Cloudbeleid 2022 niet wordt gehandhaafd — er is "visie zonder uitvoering". Beleid dat niet wordt getoetst is papier zonder waarde.',
    levels: [
      { level: 0, description: 'Geen toetsing of handhaving.' },
      { level: 1, description: 'Incidenteel gecontroleerd, bijvoorbeeld bij audits of na incidenten.' },
      { level: 2, description: 'Periodiek toetsingsproces (bijv. jaarlijks) of cloudgebruik in lijn is met beleid.' },
      { level: 3, description: 'Geïntegreerd in interne auditcyclus en ENSIA-verantwoording. Afwijkingen worden gerapporteerd met verbeterplannen.' },
      { level: 4, description: 'Continue monitoring via geautomatiseerde tooling, gekoppeld aan cloudregister. Automatische escalatie bij afwijkingen.' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // RISICOANALYSE & AFWEGINGSKADER (18%) — zwaarste thema
  // ═══════════════════════════════════════════════════
  {
    id: 'risicoanalyse_q1',
    theme: 'risicoanalyse',
    question: 'Wordt voor elke clouddienst een risicoanalyse uitgevoerd die soevereiniteitsrisico\'s expliciet adresseert?',
    context: 'De Rekenkamer vond dat 67% van 126 kritieke rijksdiensten ZONDER risicoanalyse werd ingezet. Het Implementatiekader Risicoafweging Cloudgebruik (CIO Rijk) schrijft dit wel voor.',
    levels: [
      { level: 0, description: 'Geen risicoanalyses voor clouddiensten. Soevereiniteitsrisico\'s niet in scope.' },
      { level: 1, description: 'Ad-hoc voor sommige diensten, niet structureel. Soevereiniteitsrisico\'s worden niet expliciet geadresseerd.' },
      { level: 2, description: 'Gedefinieerd proces bij nieuwe clouddiensten met soevereiniteitscriteria (jurisdictie, datalocatie, leveranciersafhankelijkheid).' },
      { level: 3, description: 'Voor alle diensten (nieuw en bestaand), inclusief geopolitieke scenario-analyses. Resultaten worden meegewogen in besluitvorming.' },
      { level: 4, description: 'Gestandaardiseerd kader (conform Implementatiekader CIO Rijk), periodiek herhaald, kwantitatieve impactschattingen, automatische hertriggering bij geopolitieke wijzigingen.' },
    ],
  },
  {
    id: 'risicoanalyse_q2',
    theme: 'risicoanalyse',
    question: 'Wordt bij IT-beslissingen een afwegingskader gehanteerd dat politieke, juridische, financiële en organisatorische belangen integraal weegt?',
    context: 'Dit was het KERNPROBLEEM bij alle casussen. Bij Solvinity was er geen mechanisme. Bij de Belastingdienst werd de CLOUD Act erkend maar afgewogen tegen €144M reeds geïnvesteerd — een sunk-cost redenering die een integraal kader had moeten voorkomen.',
    levels: [
      { level: 0, description: 'Geen afwegingskader. IT-beslissingen op basis van prijs en functionaliteit zonder soevereiniteitsafweging.' },
      { level: 1, description: 'Incidenteel en informeel, afhankelijk van individueel bewustzijn van betrokken medewerkers.' },
      { level: 2, description: 'Gedocumenteerd kader dat bij significante IT-beslissingen wordt toegepast. Adresseert minimaal jurisdictie, lock-in, en continuïteit.' },
      { level: 3, description: 'Consequent toegepast, integreert politieke, juridische, financiële en operationele dimensies. Leidt tot gedocumenteerde, bestuurlijk geaccordeerde besluiten.' },
      { level: 4, description: 'Formeel geïntegreerd in alle IT-governance processen, extern getoetst, afgestemd op landelijk beleid, inclusief scenarioplanning voor geopolitieke verschuivingen.' },
    ],
  },
  {
    id: 'risicoanalyse_q3',
    theme: 'risicoanalyse',
    question: 'Wordt het concentratierisico bij leveranciers geanalyseerd en beheerst?',
    context: 'De Rekenkamer signaleerde dat 700 van 1.588 clouddiensten bij drie Amerikaanse hyperscalers draaien. Bij sancties of conflict zou een groot deel van de overheids-IT gelijktijdig geraakt worden.',
    levels: [
      { level: 0, description: 'Geen inzicht in concentratierisico.' },
      { level: 1, description: 'Globaal bewustzijn van grote leveranciers, maar geen formele analyse.' },
      { level: 2, description: 'In kaart gebracht: per leverancier is bekend welke diensten en data afhankelijk zijn. Beleid om overconcentratie te voorkomen.' },
      { level: 3, description: 'Multisourcing-strategie met maximum-afhankelijkheidsdrempels. Alternatieve scenario\'s uitgewerkt voor top-3 leveranciers.' },
      { level: 4, description: 'Continu gemonitord, gekoppeld aan cloudregister, automatische hertriggering bij drempeloverschrijding. Geteste uitwijkscenario\'s.' },
    ],
  },
  {
    id: 'risicoanalyse_q4',
    theme: 'risicoanalyse',
    question: 'Worden DPIA\'s structureel uitgevoerd voor clouddiensten met aandacht voor internationale doorgifte en buitenlandse overheidstoegang?',
    context: 'Bij SIDN identificeerde de AIVD dat AWS data van .nl-domeineigenaren zou kunnen inzien. De Belastingdienst achtte de CLOUD Act-risico\'s "aanvaardbaar" ondanks erkenning.',
    levels: [
      { level: 0, description: 'Geen DPIA\'s voor clouddiensten.' },
      { level: 1, description: 'Incidenteel bij grote projecten, niet structureel.' },
      { level: 2, description: 'Beleid verplicht DPIA\'s voor alle clouddiensten met persoonsgegevens. Adresseert doorgifte-risico\'s.' },
      { level: 3, description: 'Consequent uitgevoerd met expliciete analyse van jurisdictierisico\'s (CLOUD Act, FISA 702). Periodiek herhaald bij wijzigingen.' },
      { level: 4, description: 'Geïntegreerd in lifecycle management, kwantitatieve risicoschattingen, getoetst door FG/DPO, afgestemd op Schrems II-jurisprudentie.' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // AFHANKELIJKHEIDSLANDSCHAP (14%) — NIEUW thema
  // Blootleggen van verborgen dependencies
  // ═══════════════════════════════════════════════════
  {
    id: 'afhankelijkheden_q1',
    theme: 'afhankelijkheden',
    question: 'Heeft u een compleet beeld van uw identiteits- en toegangsbeheer-afhankelijkheden (bijv. Entra ID/Azure AD, Active Directory, ADFS)?',
    context: 'Organisaties denken vaak aan Microsoft 365 (Office), maar vergeten dat hun hele identiteitsinfrastructuur (Entra ID, Conditional Access, InTune MDM) op hetzelfde platform draait. Als Microsoft wegvalt, kan niemand meer inloggen — niet alleen Office is weg, maar de hele IT.',
    levels: [
      { level: 0, description: 'Geen inzicht in identiteits-afhankelijkheden. Onbekend welke systemen afhankelijk zijn van Entra ID / Azure AD.' },
      { level: 1, description: 'Globaal bewustzijn dat identiteitsbeheer via een externe provider loopt, maar geen analyse van de afhankelijkheidsketen.' },
      { level: 2, description: 'In kaart welke applicaties en diensten afhankelijk zijn van de identity provider. Impact bij uitval is geanalyseerd.' },
      { level: 3, description: 'Volledige dependency mapping inclusief Conditional Access, MFA, MDM, SSO-koppelingen. Alternatief scenario uitgewerkt.' },
      { level: 4, description: 'Hybride of multi-identity strategie geïmplementeerd. Lokale fallback voor kritieke authenticatie. Periodiek getest.' },
    ],
  },
  {
    id: 'afhankelijkheden_q2',
    theme: 'afhankelijkheden',
    question: 'Zijn de niet-zichtbare infrastructuurafhankelijkheden in kaart gebracht (DNS, certificaten/PKI, e-mail routing, backup)?',
    context: 'Bij SIDN ging het om DNS — de onzichtbare basis van het hele internet. Veel organisaties beseffen niet dat hun e-mailrouting via Exchange Online loopt, hun certificaten via een niet-EU CA komen, of hun backups bij een Amerikaanse provider staan. Deze "onzichtbare" lagen zijn vaak het meest kritiek.',
    levels: [
      { level: 0, description: 'Geen inzicht in infrastructuurafhankelijkheden buiten de voor de hand liggende applicaties.' },
      { level: 1, description: 'Globaal bewustzijn van e-mail en DNS, maar geen systematische inventarisatie van alle infra-lagen.' },
      { level: 2, description: 'Inventarisatie van DNS-providers, CA/PKI, e-mailrouting, backup-locaties, en hun jurisdicties.' },
      { level: 3, description: 'Volledige dependency mapping inclusief sub-services en cascaderisico\'s. Per laag is de soevereiniteitsstatus beoordeeld.' },
      { level: 4, description: 'Geautomatiseerde monitoring van alle infra-lagen. Wijzigingen triggeren soevereiniteitsheranalyse. Alternatieve providers geïdentificeerd per laag.' },
    ],
  },
  {
    id: 'afhankelijkheden_q3',
    theme: 'afhankelijkheden',
    question: 'Weet u welke data en functionaliteit u verliest als uw primaire cloudleverancier morgen onbereikbaar wordt?',
    context: 'Denk niet alleen aan "Office is weg" maar ook: geen e-mail meer, geen Teams, geen SharePoint-documenten, geen InTune devicemanagement, geen Conditional Access, geen SSO voor gekoppelde applicaties. De cascade-effecten zijn vaak veel groter dan verwacht.',
    levels: [
      { level: 0, description: 'Geen inzicht in cascade-effecten. Nooit geanalyseerd wat er uitvalt als de primaire provider wegvalt.' },
      { level: 1, description: 'Globaal idee ("we verliezen e-mail en Office") maar geen gedetailleerde impactanalyse.' },
      { level: 2, description: 'Impactanalyse uitgevoerd: per dienst is bekend wat uitvalt, inclusief afhankelijke systemen en processen.' },
      { level: 3, description: 'Volledige Business Impact Analysis met RTO/RPO per dienst. Cascade-effecten op gekoppelde systemen zijn gemodelleerd.' },
      { level: 4, description: 'BIA wordt periodiek herhaald. Continuïteitsplannen zijn uitgewerkt en getest voor alle kritieke scenario\'s inclusief cascade-uitval.' },
    ],
  },
  {
    id: 'afhankelijkheden_q4',
    theme: 'afhankelijkheden',
    question: 'Heeft uw organisatie een realistische roadmap om kritieke afhankelijkheden te verminderen, rekening houdend met complexiteit en doorlooptijd?',
    context: 'Amsterdam neemt 10 jaar. Haarlem zegt "we zijn bezig, het duurt nog even". Dat is realistisch — migreren van Entra ID of Exchange Online is enorm complex. Het gaat niet om morgen soeverein zijn, maar om een bewust plan met haalbare stappen.',
    levels: [
      { level: 0, description: 'Geen plan om afhankelijkheden te verminderen. Het onderwerp is niet geagendeerd.' },
      { level: 1, description: 'Bewustzijn dat afhankelijkheden een risico vormen, maar geen concreet plan.' },
      { level: 2, description: 'Roadmap opgesteld met prioritering van kritieke afhankelijkheden en een globale tijdlijn (bijv. 3-5 jaar).' },
      { level: 3, description: 'Roadmap met concrete mijlpalen, budget, verantwoordelijken. Houdt rekening met migratie-complexiteit en organisatorische capaciteit.' },
      { level: 4, description: 'Roadmap wordt actief uitgevoerd, voortgang wordt gerapporteerd, en is afgestemd op landelijke initiatieven (VNG collectivisering, Haven+).' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAKEHOLDER COMMUNICATIE (8%)
  // ═══════════════════════════════════════════════════
  {
    id: 'communicatie_q1',
    theme: 'communicatie',
    question: 'Kan uw organisatie aan de gemeenteraad of raad van toezicht uitleggen welke soevereiniteitsafwegingen zijn gemaakt bij IT-keuzes?',
    context: 'De Tweede Kamer stond bij Solvinity "met lege handen" omdat er geen afwegingskader was. De Rekenkamer eist dat besluitvorming "toetsbaar en auditeerbaar" is.',
    levels: [
      { level: 0, description: 'Kan niet uitleggen welke afwegingen zijn gemaakt. Geen documentatie.' },
      { level: 1, description: 'Kan achteraf een toelichting geven, maar niet onderbouwd met formeel kader.' },
      { level: 2, description: 'IT-beslissingen met soevereiniteitsimplicaties worden gedocumenteerd en zijn achteraf controleerbaar.' },
      { level: 3, description: 'Gestandaardiseerd rapportageformat. Raad/toezicht wordt proactief geïnformeerd bij significante keuzes.' },
      { level: 4, description: 'Onderdeel van reguliere P&C-cyclus. Transparante publicatie over IT-leverancierslandschap en afwegingen.' },
    ],
  },
  {
    id: 'communicatie_q2',
    theme: 'communicatie',
    question: 'Worden burgers of patiënten geïnformeerd over waar hun gegevens worden opgeslagen en onder welke jurisdictie?',
    context: 'Bij SIDN uitte de Kamer zorgen over toegankelijkheid van .nl-gegevens voor de VS. Transparantie richting betrokkenen is een AVG-verplichting en vertrouwensfundament.',
    levels: [
      { level: 0, description: 'Niet geïnformeerd over waar gegevens worden opgeslagen of verwerkt.' },
      { level: 1, description: 'Generieke privacyverklaring zonder specifieke leverancier- of jurisdictie-informatie.' },
      { level: 2, description: 'Privacyverklaring bevat categorieën verwerkers, datalocaties, en jurisdicties.' },
      { level: 3, description: 'Per dienst transparant welke leverancier, waar, en welke waarborgen. Toegankelijk voor niet-technici.' },
      { level: 4, description: 'Proactieve communicatie bij leverancierswissels. Publiek dashboard. Burgers/patiënten worden betrokken bij keuzes.' },
    ],
  },
  {
    id: 'communicatie_q3',
    theme: 'communicatie',
    question: 'Is er een communicatieprotocol voor situaties waarin soevereiniteit in het geding komt (bijv. overname leverancier)?',
    context: 'Bij Solvinity moest het kabinet reageren op mediaberichten zonder voorbereiding. Geen communicatieprotocol, chaotische politieke respons.',
    levels: [
      { level: 0, description: 'Geen protocol. Organisatie zou reactief en ongecoördineerd moeten handelen.' },
      { level: 1, description: 'Generiek crisiscommunicatieplan, maar soevereiniteitsscenario\'s niet opgenomen.' },
      { level: 2, description: 'Specifiek protocol met aangewezen woordvoerders en communicatielijnen naar stakeholders.' },
      { level: 3, description: 'Uitgewerkte scenario\'s (overname, datainbreuk, sancties, uitval), afgestemd met bestuurscommunicatie, periodiek geoefend.' },
      { level: 4, description: 'Geïntegreerd in crisisbeheersing, jaarlijks getest via tabletop-oefening, escalatiepad naar regionale/landelijke coördinatie.' },
    ],
  },
  {
    id: 'communicatie_q4',
    theme: 'communicatie',
    question: 'Kan uw organisatie uitleggen waarom bepaalde niet-soevereine keuzes (nog) zijn gemaakt en wat het plan is?',
    context: 'Het doel is niet per se soevereiniteit maar een goed afwegingskader. Een bewuste keuze voor MS365 met goede mitigaties en een roadmap is beter dan onbewust afhankelijk zijn. De vraag is: kunt u het uitleggen?',
    levels: [
      { level: 0, description: 'Kan niet uitleggen waarom huidige keuzes zijn gemaakt. Er is geen bewust besluit genomen.' },
      { level: 1, description: 'Informeel: "het was de standaardkeuze" of "er was geen alternatief", maar geen onderbouwing.' },
      { level: 2, description: 'Per kritieke dienst is gedocumenteerd waarom deze leverancier is gekozen en welke risico\'s zijn geaccepteerd.' },
      { level: 3, description: 'Documentatie bevat een afweging van alternatieven, geaccepteerde risico\'s, mitigerende maatregelen, en een tijdpad voor herbeoordeling.' },
      { level: 4, description: 'Transparant beleidsdocument dat voor elke kritieke dienst de "waarom"-vraag beantwoordt, met een publieke roadmap naar verbetering.' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // LEVERANCIERSMANAGEMENT (14%)
  // ═══════════════════════════════════════════════════
  {
    id: 'leveranciers_q1',
    theme: 'leveranciers',
    question: 'Is er een actueel overzicht van alle IT-leveranciers met eigendomsstructuur, jurisdictie, en kritikaliteit?',
    context: 'Bij Solvinity werd de organisatie verrast door een overname. De Rekenkamer vond dat ministeries niet wisten welk cloudtype ze gebruikten voor een kwart van hun diensten.',
    levels: [
      { level: 0, description: 'Geen leveranciersoverzicht.' },
      { level: 1, description: 'Globaal overzicht van grote leveranciers, maar eigendomsstructuur en jurisdictie ontbreekt.' },
      { level: 2, description: 'Compleet register met contactgegevens, contractlooptijden, land van vestiging. Kritikaliteit geclassificeerd.' },
      { level: 3, description: 'Bevat eigendomsstructuur (moederbedrijf, investeerders), jurisdictie, en koppelingen naar risicoanalyses. Wijzigingen worden gemonitord.' },
      { level: 4, description: 'Realtime bijgehouden met supply chain diepte-analyse (tier 1-3). Geautomatiseerde monitoring van overnames, sancties, geopolitieke wijzigingen.' },
    ],
  },
  {
    id: 'leveranciers_q2',
    theme: 'leveranciers',
    question: 'Zijn er geteste exit-strategieën voor kritieke clouddiensten?',
    context: 'De Belastingdienst beschreef een exit-strategie voor M365 maar deze was niet getest. Zonder geteste exit is de organisatie bij een crisis afhankelijk van goodwill.',
    levels: [
      { level: 0, description: 'Geen exit-strategieën.' },
      { level: 1, description: 'Bewustzijn dat ze nodig zijn, maar niet uitgewerkt.' },
      { level: 2, description: 'Gedocumenteerde exit-strategieën voor de belangrijkste diensten met datamigratie-procedures en contractuele afspraken.' },
      { level: 3, description: 'Uitgewerkt voor alle kritieke diensten, zowel coöperatieve als vijandige scenario\'s. Gevalideerd door technische haalbaarheidsanalyse.' },
      { level: 4, description: 'Periodiek getest via dry-runs. Organisatie kan aantonen dat migratie haalbaar is binnen gedefinieerde termijn.' },
    ],
  },
  {
    id: 'leveranciers_q3',
    theme: 'leveranciers',
    question: 'Bevatten contracten clausules over soevereiniteitsgebeurtenissen (overname, sancties, jurisdictiewijziging)?',
    context: 'Bij Solvinity had het contract geen clausule voor eigenaarswisseling — het kabinet stond machteloos. De Kamer constateerde dat er "geen instrumenten" zijn om overnames te voorkomen.',
    levels: [
      { level: 0, description: 'Geen clausules over soevereiniteitsgebeurtenissen. Alleen standaard SLA.' },
      { level: 1, description: 'Generieke change-of-control clausules, niet specifiek gericht op soevereiniteitsrisico\'s.' },
      { level: 2, description: 'Standaardclausules over datalocatie, verwerkingsbeperkingen, notificatieplicht bij eigenaarswisselingen.' },
      { level: 3, description: 'Specifieke soevereiniteitsclausules: change-of-control met opzegrecht, datagaranties, audit-rechten, escrow-afspraken.' },
      { level: 4, description: 'Uitgebreide waarborgen inclusief sanctiescenario\'s, boeteclausules, juridisch getoetst op handhaafbaarheid in meerdere jurisdicties.' },
    ],
  },
  {
    id: 'leveranciers_q4',
    theme: 'leveranciers',
    question: 'Wordt de markt actief gevolgd op EU/NL-alternatieven voor kritieke diensten?',
    context: 'De Belastingdienst concludeerde dat er "geen volwaardig EU-alternatief" is voor M365 maar beoordeelde alternatieven niet individueel. Initiatieven als Nextcloud, sovereign clouds en VNG Haven+ worden onvoldoende gevolgd.',
    levels: [
      { level: 0, description: 'Markt wordt niet gevolgd. Geen zicht op alternatieven.' },
      { level: 1, description: 'Globaal bewustzijn van initiatieven (Gaia-X, sovereign clouds), maar geen actieve verkenning.' },
      { level: 2, description: 'Periodieke marktverkenning bij contractverlenging of nieuwe aanschaf van kritieke diensten.' },
      { level: 3, description: 'Structureel programma om alternatieven te evalueren. Participatie in pilots. Ervaringsdeling met peers.' },
      { level: 4, description: 'Actieve investering in EU-alternatieven (via VNG-collectivisering, Haven+). Migratieroadmap. Bijdrage aan open standaarden.' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // INCIDENT PREPAREDNESS (8%)
  // ═══════════════════════════════════════════════════
  {
    id: 'incident_q1',
    theme: 'incident',
    question: 'Zijn er scenario\'s uitgewerkt voor soevereiniteitsincidenten (overname, buitenlandse toegang, sancties, geopolitieke uitval)?',
    context: 'Bij Solvinity was er geen scenario voor overname door niet-EU partij. Bij SIDN moest de AIVD achteraf een analyse maken. Zonder voorbereide scenario\'s reageert een organisatie chaotisch.',
    levels: [
      { level: 0, description: 'Geen scenario\'s uitgewerkt.' },
      { level: 1, description: 'Bewustzijn dat scenario\'s kunnen optreden, maar geen uitgewerkte plannen.' },
      { level: 2, description: 'Basis-scenario\'s voor meest waarschijnlijke incidenten (leveranciersovername, datalek naar buitenland).' },
      { level: 3, description: 'Gedetailleerde draaiboeken met escalatieprocedures, juridische stappen, communicatieplannen. Afgestemd met adviseurs.' },
      { level: 4, description: 'Jaarlijks getest via tabletop-oefeningen, geëvalueerd en verbeterd. Participatie in landelijke oefeningen.' },
    ],
  },
  {
    id: 'incident_q2',
    theme: 'incident',
    question: 'Worden wijzigingen bij leveranciers (overnames, fusies, jurisdictiewijzigingen) actief gemonitord?',
    context: 'De Solvinity-overname werd pas via de media gesignaleerd. Er was geen monitoringsmechanisme.',
    levels: [
      { level: 0, description: 'Niet gemonitord. Verneemt dit via media of ad-hoc.' },
      { level: 1, description: 'Volgt nieuwsberichten, maar geen structureel proces.' },
      { level: 2, description: 'Periodiek reviewproces (kwartaal) met controle eigendomsstructuur en financiële gezondheid.' },
      { level: 3, description: 'Continu monitoring via meerdere bronnen (KvK, SEC, nieuwsalerts). Signalen triggeren heranalyse.' },
      { level: 4, description: 'Geautomatiseerd, geïntegreerd met leveranciersregister. Wijzigingen boven drempel triggeren automatisch escalatie.' },
    ],
  },
  {
    id: 'incident_q3',
    theme: 'incident',
    question: 'Kan de organisatie bij een acuut incident binnen een gedefinieerde termijn overstappen op een alternatief?',
    context: 'De Belastingdienst beschreef een terugval op on-premises. Maar de meeste organisaties hebben geen operationele fallback en zouden bij uitval langdurig stilvallen.',
    levels: [
      { level: 0, description: 'Geen fallback. Bij uitval van kritieke provider valt dienstverlening volledig stil.' },
      { level: 1, description: 'Theoretische fallback ("terug naar on-premises") maar niet voorbereid, niet getest, niet gebudgetteerd.' },
      { level: 2, description: 'Gedocumenteerd fallback-plan voor belangrijkste diensten met indicatieve termijn en middelen.' },
      { level: 3, description: 'Uitgewerkt en gevalideerd voor alle kritieke diensten. Infra, licenties en kennis zijn beschikbaar of geborgd.' },
      { level: 4, description: 'Periodiek getest via failover-oefeningen. Kan aantonen dat kritieke diensten binnen RTO operationeel zijn op alternatief platform.' },
    ],
  },
  {
    id: 'incident_q4',
    theme: 'incident',
    question: 'Heeft uw organisatie een escalatiepad naar landelijke of regionale coördinatiestructuren bij soevereiniteitsincidenten?',
    context: 'Bij Solvinity moest de nationale overheid reageren, maar er was geen gestructureerd escalatiepad van individuele organisaties naar rijksniveau. NIS2/Cbw introduceert formele meldplichten.',
    levels: [
      { level: 0, description: 'Geen escalatiepad. Onbekend bij wie je moet zijn bij een soevereiniteitsincident.' },
      { level: 1, description: 'Globaal bekend (NCSC, IBD, CERT), maar geen formele afspraken of procedures.' },
      { level: 2, description: 'Contactpersonen en meldprocedures zijn bekend. Afspraken met NCSC/IBD zijn formeel vastgelegd.' },
      { level: 3, description: 'Escalatiepad is geïntegreerd in incidentmanagement. Oefening in samenwerking met regionale/landelijke partners.' },
      { level: 4, description: 'Actieve participatie in landelijke coördinatie. Bijdrage aan early warning systemen. Structurele informatiedeling met peers.' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // WET- & REGELGEVING COMPLIANCE (8%)
  // ═══════════════════════════════════════════════════
  {
    id: 'compliance_q1',
    theme: 'compliance',
    question: 'Is uw organisatie voorbereid op de Cyberbeveiligingswet (NIS2) inclusief bestuurdersverantwoordelijkheid?',
    context: 'De Cbw treedt naar verwachting Q2 2026 in werking. Bestuurders worden persoonlijk verantwoordelijk. Gemeenten en zorginstellingen vallen onder "essentiële entiteiten" met strengere verplichtingen.',
    levels: [
      { level: 0, description: 'Niet op de hoogte van de Cyberbeveiligingswet of de implicaties.' },
      { level: 1, description: 'Bewustzijn van komende wetgeving, maar nog geen voorbereidingen.' },
      { level: 2, description: 'Gap-analyse uitgevoerd. Verbeterplan opgesteld.' },
      { level: 3, description: 'Verbeterplan in uitvoering. Bestuurdersverantwoordelijkheid belegd, meldprocedures ingericht, BIO2-compliance grotendeels gerealiseerd.' },
      { level: 4, description: 'Voldoet volledig, extern getoetst, anticipeert op aanscherpingen. Bestuurders persoonlijk opgeleid en gecommitteerd.' },
    ],
  },
  {
    id: 'compliance_q2',
    theme: 'compliance',
    question: 'Is er een actueel overzicht van alle wet- en regelgeving die van toepassing is op uw cloudgebruik?',
    context: 'Organisaties moeten voldoen aan AVG, Cbw/NIS2, BIO2, NEN 7510 (zorg), Woo, Archiefwet, en sectorspecifieke regels. Zonder overzicht worden verplichtingen gemist.',
    levels: [
      { level: 0, description: 'Geen overzicht van relevante regelgeving.' },
      { level: 1, description: 'Globaal bewustzijn van AVG en BIO, maar compleet overzicht ontbreekt.' },
      { level: 2, description: 'Register met relevante regelgeving en per regeling de implicaties voor cloudgebruik.' },
      { level: 3, description: 'Actief bijgehouden. Per clouddienst gedocumenteerd welke regelgeving geldt en wat de compliancestatus is.' },
      { level: 4, description: 'Continue monitoring, geïntegreerd in cloudregister. Juridisch adviesproces vertaalt wijzigingen naar concrete acties.' },
    ],
  },
  {
    id: 'compliance_q3',
    theme: 'compliance',
    question: 'Worden leveranciers contractueel verplicht tot medewerking aan uw compliance-eisen?',
    context: 'BIO2 en NIS2/Cbw leggen verplichtingen op die doorwerken in de keten. NEN 7510 eist dat ICT-leveranciers in de zorg aan de norm voldoen.',
    levels: [
      { level: 0, description: 'Geen contractuele compliance-eisen richting leveranciers.' },
      { level: 1, description: 'Generieke compliance-verwijzingen, niet specifiek genoeg om afdwingbaar te zijn.' },
      { level: 2, description: 'Specifieke clausules over auditrechten, meldplichten, bewaartermijnen, datadeletie.' },
      { level: 3, description: 'Per leverancier afgestemd op specifieke regelgeving. Periodieke toetsing van naleving.' },
      { level: 4, description: 'Continue monitoring inclusief sub-verwerkers. Escalatieprocedures bij non-compliance. Sector-brede programma\'s.' },
    ],
  },
  {
    id: 'compliance_q4',
    theme: 'compliance',
    question: 'Is de verantwoording over soevereiniteit geïntegreerd in bestaande rapportagecycli (ENSIA, jaarrekening, IGJ)?',
    context: 'Soevereiniteit hoeft geen apart rapportageproces te zijn. Door integratie in ENSIA (gemeenten) of IGJ-verantwoording (zorg) wordt het onderdeel van de reguliere governance.',
    levels: [
      { level: 0, description: 'Soevereiniteit komt in geen enkele rapportagecyclus voor.' },
      { level: 1, description: 'Incidenteel aangekaart, maar niet structureel opgenomen.' },
      { level: 2, description: 'Opgenomen als aandachtspunt in ENSIA/jaarlijkse informatiebeveiliging-rapportage.' },
      { level: 3, description: 'Integraal onderdeel van rapportage met concrete KPI\'s en voortgangsrapportage.' },
      { level: 4, description: 'Geïntegreerd in P&C-cyclus, extern getoetst, en gebenchmarkt tegen peers.' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // MONITORING & CONTINUE VERBETERING (4%)
  // ═══════════════════════════════════════════════════
  {
    id: 'monitoring_q1',
    theme: 'monitoring',
    question: 'Wordt de soevereiniteitsstatus van uw IT-landschap periodiek herbeoordeeld?',
    context: 'De geopolitieke context verandert continu. De Solvinity-casus kan bij elke leverancier optreden. Zonder periodieke herbeoordeling veroudert een eenmalige analyse snel.',
    levels: [
      { level: 0, description: 'Geen herbeoordeling. Eenmaal genomen beslissingen worden niet opnieuw geëvalueerd.' },
      { level: 1, description: 'Alleen na incidenten of externe signalen.' },
      { level: 2, description: 'Jaarlijks reviewproces voor kritieke diensten.' },
      { level: 3, description: 'Geïntegreerd in ISMS-review en ENSIA-cyclus. Geopolitieke ontwikkelingen worden actief gevolgd.' },
      { level: 4, description: 'Continue monitoring via dashboard. Wijzigingen triggeren automatisch heranalyse.' },
    ],
  },
  {
    id: 'monitoring_q2',
    theme: 'monitoring',
    question: 'Worden lessen uit interne en externe soevereiniteitsincidenten structureel verwerkt?',
    context: 'Solvinity, SIDN, en Belastingdienst bieden lessen voor elke organisatie. De vraag is of u deze vertaalt naar verbeteringen in eigen beleid.',
    levels: [
      { level: 0, description: 'Geen lessen getrokken. Dezelfde risico\'s kunnen zich herhalen.' },
      { level: 1, description: 'Incidenteel besproken, maar leiden niet tot beleidswijzigingen.' },
      { level: 2, description: 'Formeel evaluatieproces voor interne incidenten en relevante externe casussen.' },
      { level: 3, description: 'Lessen worden vertaald naar concrete verbeteracties. Voortgang wordt gerapporteerd aan bestuur.' },
      { level: 4, description: 'Volwassen PDCA-cyclus. Actieve kennisdeling met peers en bijdrage aan landelijke kennisopbouw.' },
    ],
  },
  {
    id: 'monitoring_q3',
    theme: 'monitoring',
    question: 'Worden meetbare doelstellingen gehanteerd voor de verbetering van digitale soevereiniteit?',
    context: 'Amsterdam hanteert concrete doelstellingen: 30% autonome cloudopslag in 2031, volledig in 2035. Dit maakt voortgang meetbaar en bestuurlijk stuurbaar.',
    levels: [
      { level: 0, description: 'Geen KPI\'s of meetbare doelstellingen.' },
      { level: 1, description: 'Globale ambities ("minder afhankelijk worden") maar niet meetbaar.' },
      { level: 2, description: 'Meetbare doelstellingen gedefinieerd (% diensten met risicoanalyse, % contracten met exitstrategie).' },
      { level: 3, description: 'KPI\'s worden periodiek gemeten en gerapporteerd. Afwijkingen leiden tot bijsturing.' },
      { level: 4, description: 'Geïntegreerd in P&C-cyclus, gebenchmarkt tegen peers, afgestemd op landelijke doelstellingen.' },
    ],
  },
  {
    id: 'monitoring_q4',
    theme: 'monitoring',
    question: 'Deelt uw organisatie ervaringen en best practices over soevereiniteit met andere organisaties?',
    context: 'De VNG roept op tot gezamenlijke aanpak. Kennisdeling versnelt de voortgang voor iedereen. Organisaties die vooroplopen (Amsterdam, enkele zorginstellingen) kunnen anderen helpen.',
    levels: [
      { level: 0, description: 'Geen kennisdeling met andere organisaties.' },
      { level: 1, description: 'Incidenteel contact met peers over soevereiniteitsvraagstukken.' },
      { level: 2, description: 'Actieve deelname aan VNG-werkgroepen of sectorale overleggen over soevereiniteit.' },
      { level: 3, description: 'Structurele kennisdeling: publicatie van ervaringen, deelname aan pilotprogramma\'s, mentoring van peers.' },
      { level: 4, description: 'Voortrekkersrol in landelijke initiatieven. Bijdrage aan standaarden, tooling en beleidsontwikkeling.' },
    ],
  },
];

/** Get all questions for a specific SRA theme */
export function getSraQuestionsByTheme(theme: string): SraQuestion[] {
  return SRA_QUESTIONS.filter((q) => q.theme === theme);
}

/** Total number of SRA questions */
export const SRA_TOTAL_QUESTIONS = SRA_QUESTIONS.length;
