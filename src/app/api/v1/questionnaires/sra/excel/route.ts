import { NextResponse } from 'next/server';
import { generateSraWorkbook } from '@/lib/excel/questionnaire-export';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const workbook = await generateSraWorkbook();
    const buffer = await workbook.xlsx.writeBuffer();

    const today = new Date().toISOString().slice(0, 10);
    const filename = `SRA-Vragenlijst-${today}.xlsx`;

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400', // cache 24h — content is static
      },
    });
  } catch (err) {
    console.error('SRA Excel generation error:', err);
    return NextResponse.json(
      { error: 'Kon Excel-bestand niet genereren.' },
      { status: 500 },
    );
  }
}
