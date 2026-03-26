import ExcelJS from 'exceljs';
import { QUESTIONS, getQuestionsByCategory } from '@/lib/seal/questions';
import { SOV_CATEGORIES, SOV_WEIGHTS } from '@/lib/seal/weights';
import { SRA_QUESTIONS, getSraQuestionsByTheme } from '@/lib/sra/questions';
import { SRA_THEMES, SRA_WEIGHTS } from '@/lib/sra/weights';

// ── MXI brand colours ──
const MXI_PURPLE = 'FF883486';
const MXI_BLUE   = 'FF4EA7F9';
const WHITE      = 'FFFFFFFF';

// Level colours (light tints for column headers)
const LEVEL_TINTS: string[] = [
  'FFFEE2E2', // level 0 — red-100
  'FFFFEDD5', // level 1 — orange-100
  'FFFEF9C3', // level 2 — yellow-100
  'FFDBEAFE', // level 3 — blue-100
  'FFDCFCE7', // level 4 — green-100
];

// ── Shared helpers ──

function setHeaderStyle(
  row: ExcelJS.Row,
  accentColor: string,
  columnCount: number,
) {
  row.font = { bold: true, color: { argb: WHITE }, size: 11 };
  row.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  for (let i = 1; i <= columnCount; i++) {
    const cell = row.getCell(i);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: accentColor },
    };
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
}

function setCategoryHeaderStyle(
  row: ExcelJS.Row,
  accentColor: string,
  columnCount: number,
) {
  row.font = { bold: true, color: { argb: accentColor }, size: 11 };
  row.alignment = { vertical: 'middle', wrapText: true };
  for (let i = 1; i <= columnCount; i++) {
    const cell = row.getCell(i);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' }, // gray-100
    };
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
}

function setDataRowStyle(row: ExcelJS.Row, columnCount: number) {
  row.alignment = { vertical: 'top', wrapText: true };
  for (let i = 1; i <= columnCount; i++) {
    const cell = row.getCell(i);
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    };
    // Tint level columns (columns 4-8)
    if (i >= 4 && i <= 8) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: LEVEL_TINTS[i - 4] },
      };
    }
  }
}

// ════════════════════════════════════════════════════════════
// SEAL Workbook
// ════════════════════════════════════════════════════════════

export async function generateSealWorkbook(): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MXI Soevereiniteits Checklist';
  wb.created = new Date();

  // ── Sheet 1: Overzicht ──
  const overview = wb.addWorksheet('Overzicht');
  overview.columns = [
    { width: 5 },
    { width: 35 },
    { width: 15 },
    { width: 15 },
  ];

  overview.addRow([]);
  const titleRow = overview.addRow(['', 'SEAL Soevereiniteits Assessment']);
  titleRow.getCell(2).font = { bold: true, size: 16, color: { argb: MXI_PURPLE } };
  overview.addRow([]);
  overview.addRow(['', 'Het EU SEAL Framework beoordeelt de digitale soevereiniteit van']);
  overview.addRow(['', 'cloudproviders en applicaties op een schaal van SEAL-0 (geen) tot SEAL-4 (volledig).']);
  overview.addRow(['', `Totaal: ${QUESTIONS.length} vragen verdeeld over ${SOV_CATEGORIES.length} categorieën.`]);
  overview.addRow([]);

  // Category overview table
  const catHeader = overview.addRow(['', 'Categorie', 'Gewicht', 'Vragen']);
  setHeaderStyle(catHeader, MXI_PURPLE, 4);
  catHeader.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MXI_PURPLE } };

  for (const cat of SOV_CATEGORIES) {
    const w = SOV_WEIGHTS[cat];
    const qCount = getQuestionsByCategory(cat).length;
    const row = overview.addRow(['', w.nameNl, `${Math.round(w.weight * 100)}%`, qCount]);
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(4).alignment = { horizontal: 'center' };
    for (let i = 1; i <= 4; i++) {
      row.getCell(i).border = {
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    }
  }

  // ── Sheet 2: Vragenlijst ──
  const ql = wb.addWorksheet('Vragenlijst');
  const COL_COUNT = 8;

  ql.columns = [
    { width: 5 },   // Nr
    { width: 25 },  // Categorie
    { width: 45 },  // Vraag
    { width: 35 },  // SEAL-0
    { width: 35 },  // SEAL-1
    { width: 35 },  // SEAL-2
    { width: 35 },  // SEAL-3
    { width: 35 },  // SEAL-4
  ];

  // Header row
  const header = ql.addRow([
    'Nr', 'Categorie', 'Vraag',
    'SEAL-0', 'SEAL-1', 'SEAL-2', 'SEAL-3', 'SEAL-4',
  ]);
  setHeaderStyle(header, MXI_PURPLE, COL_COUNT);
  // Tint level columns in header
  for (let i = 4; i <= 8; i++) {
    header.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: MXI_PURPLE },
    };
  }

  ql.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  let qNum = 0;
  for (const cat of SOV_CATEGORIES) {
    const w = SOV_WEIGHTS[cat];
    const questions = getQuestionsByCategory(cat);

    // Category sub-header
    const catRow = ql.addRow([
      '', `${cat.toUpperCase()}: ${w.nameNl} (${Math.round(w.weight * 100)}%)`,
    ]);
    setCategoryHeaderStyle(catRow, MXI_PURPLE, COL_COUNT);

    for (const q of questions) {
      qNum++;
      const levels = q.levels.sort((a, b) => a.level - b.level);
      const row = ql.addRow([
        qNum,
        w.nameNl,
        q.question,
        levels[0]?.description ?? '',
        levels[1]?.description ?? '',
        levels[2]?.description ?? '',
        levels[3]?.description ?? '',
        levels[4]?.description ?? '',
      ]);
      setDataRowStyle(row, COL_COUNT);
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'top' };
    }
  }

  // ── Sheet 3: Scoremethode ──
  const method = wb.addWorksheet('Scoremethode');
  method.columns = [{ width: 5 }, { width: 80 }];

  method.addRow([]);
  const methodTitle = method.addRow(['', 'Scoremethode']);
  methodTitle.getCell(2).font = { bold: true, size: 14, color: { argb: MXI_PURPLE } };
  method.addRow([]);
  method.addRow(['', 'Per categorie wordt het gemiddelde berekend van de 4 vraagscores (0-4).']);
  method.addRow(['', 'De eindscore is het gewogen gemiddelde: Σ (categorie_gemiddelde × gewicht).']);
  method.addRow(['', 'Dit wordt omgerekend naar een percentage (0-100%).']);
  method.addRow([]);
  method.addRow(['', 'SEAL-niveaus:']);
  method.addRow(['', '  SEAL-0: Geen soevereiniteit (0-0.5)']);
  method.addRow(['', '  SEAL-1: Minimale soevereiniteit (0.5-1.5)']);
  method.addRow(['', '  SEAL-2: Gedeeltelijke soevereiniteit (1.5-2.5)']);
  method.addRow(['', '  SEAL-3: Grotendeels soeverein (2.5-3.5) — AANBEVOLEN MINIMUM']);
  method.addRow(['', '  SEAL-4: Volledig soeverein (3.5-4.0)']);
  method.addRow([]);
  const minRow = method.addRow(['', 'Waarom SEAL-3 als minimum?']);
  minRow.getCell(2).font = { bold: true, size: 11 };
  method.addRow(['', 'SEAL-3 is het niveau waarbij een organisatie aantoonbare controle heeft over haar']);
  method.addRow(['', 'digitale infrastructuur binnen EU-jurisdictie. Onder dit niveau bestaan risico\'s op:']);
  method.addRow(['', '  • Extraterritoriale wetgeving (CLOUD Act, FISA 702)']);
  method.addRow(['', '  • Eenzijdige wijzigingen door niet-EU partijen']);
  method.addRow(['', '  • Beperkte portabiliteit (vendor lock-in)']);
  method.addRow(['', '  • Onvoldoende transparantie over dataverwerking']);

  return wb;
}

// ════════════════════════════════════════════════════════════
// SRA Workbook
// ════════════════════════════════════════════════════════════

export async function generateSraWorkbook(): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MXI Soevereiniteits Checklist';
  wb.created = new Date();

  // ── Sheet 1: Overzicht ──
  const overview = wb.addWorksheet('Overzicht');
  overview.columns = [
    { width: 5 },
    { width: 45 },
    { width: 15 },
    { width: 15 },
  ];

  overview.addRow([]);
  const titleRow = overview.addRow(['', 'SRA — Soevereiniteits Gereedheids Assessment']);
  titleRow.getCell(2).font = { bold: true, size: 16, color: { argb: MXI_BLUE } };
  overview.addRow([]);
  overview.addRow(['', 'De SRA beoordeelt hoe goed uw organisatie is voorbereid op']);
  overview.addRow(['', 'digitale soevereiniteitsvraagstukken. Schaal: Niveau 0 (onvoorbereid) tot Niveau 4 (optimaal).']);
  overview.addRow(['', `Totaal: ${SRA_QUESTIONS.length} vragen verdeeld over ${SRA_THEMES.length} thema's.`]);
  overview.addRow([]);

  // Theme overview table
  const themeHeader = overview.addRow(['', 'Thema', 'Gewicht', 'Vragen']);
  setHeaderStyle(themeHeader, MXI_BLUE, 4);
  themeHeader.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: MXI_BLUE } };

  for (const theme of SRA_THEMES) {
    const w = SRA_WEIGHTS[theme];
    const qCount = getSraQuestionsByTheme(theme).length;
    const row = overview.addRow(['', w.nameNl, `${Math.round(w.weight * 100)}%`, qCount]);
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(4).alignment = { horizontal: 'center' };
    for (let i = 1; i <= 4; i++) {
      row.getCell(i).border = {
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    }
  }

  // ── Sheet 2: Vragenlijst ──
  const ql = wb.addWorksheet('Vragenlijst');
  const COL_COUNT = 9; // extra column for context

  ql.columns = [
    { width: 5 },   // Nr
    { width: 30 },  // Thema
    { width: 45 },  // Vraag
    { width: 50 },  // Context
    { width: 35 },  // Niveau 0
    { width: 35 },  // Niveau 1
    { width: 35 },  // Niveau 2
    { width: 35 },  // Niveau 3
    { width: 35 },  // Niveau 4
  ];

  // Header row
  const header = ql.addRow([
    'Nr', 'Thema', 'Vraag', 'Context / Waarom belangrijk?',
    'Niveau 0', 'Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4',
  ]);
  setHeaderStyle(header, MXI_BLUE, COL_COUNT);

  ql.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  let qNum = 0;
  for (const theme of SRA_THEMES) {
    const w = SRA_WEIGHTS[theme];
    const questions = getSraQuestionsByTheme(theme);

    // Theme sub-header
    const themeRow = ql.addRow([
      '', `${w.nameNl} (${Math.round(w.weight * 100)}%)`,
    ]);
    setCategoryHeaderStyle(themeRow, MXI_BLUE, COL_COUNT);

    for (const q of questions) {
      qNum++;
      const levels = q.levels.sort((a, b) => a.level - b.level);
      const row = ql.addRow([
        qNum,
        w.nameNl,
        q.question,
        q.context,
        levels[0]?.description ?? '',
        levels[1]?.description ?? '',
        levels[2]?.description ?? '',
        levels[3]?.description ?? '',
        levels[4]?.description ?? '',
      ]);
      // Adjust for SRA: level columns start at 5 instead of 4
      row.alignment = { vertical: 'top', wrapText: true };
      for (let i = 1; i <= COL_COUNT; i++) {
        const cell = row.getCell(i);
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };
        if (i >= 5 && i <= 9) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: LEVEL_TINTS[i - 5] },
          };
        }
      }
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'top' };
    }
  }

  // ── Sheet 3: Scoremethode ──
  const method = wb.addWorksheet('Scoremethode');
  method.columns = [{ width: 5 }, { width: 80 }];

  method.addRow([]);
  const methodTitle = method.addRow(['', 'Scoremethode']);
  methodTitle.getCell(2).font = { bold: true, size: 14, color: { argb: MXI_BLUE } };
  method.addRow([]);
  method.addRow(['', 'Per thema wordt het gemiddelde berekend van de 4 vraagscores (0-4).']);
  method.addRow(['', 'De eindscore is het gewogen gemiddelde: Σ (thema_gemiddelde × gewicht).']);
  method.addRow(['', 'Dit wordt omgerekend naar een percentage (0-100%).']);
  method.addRow([]);
  method.addRow(['', 'SRA-niveaus:']);
  method.addRow(['', '  Niveau 0: Onbewust / onvoorbereid (0-0.5)']);
  method.addRow(['', '  Niveau 1: Ad-hoc / reactief (0.5-1.5)']);
  method.addRow(['', '  Niveau 2: Gestructureerd maar beperkt (1.5-2.5)']);
  method.addRow(['', '  Niveau 3: Volwassen en verankerd (2.5-3.5) — AANBEVOLEN MINIMUM']);
  method.addRow(['', '  Niveau 4: Optimaal en leidend (3.5-4.0)']);
  method.addRow([]);
  const minRow = method.addRow(['', 'Waarom Niveau 3 als minimum?']);
  minRow.getCell(2).font = { bold: true, size: 11 };
  method.addRow(['', 'Niveau 3 betekent dat uw organisatie een volwassen en verankerd beleid heeft voor']);
  method.addRow(['', 'digitale soevereiniteit. Onder dit niveau bestaan risico\'s op:']);
  method.addRow(['', '  • Onbewuste afhankelijkheden van niet-EU partijen']);
  method.addRow(['', '  • Ontbreken van exit-strategieën bij leverancierswisselingen']);
  method.addRow(['', '  • Non-compliance met NIS2/Cbw en BIO2 verplichtingen']);
  method.addRow(['', '  • Onvoldoende transparantie naar gemeenteraad of raad van toezicht']);

  return wb;
}
