import { Workbook, Worksheet } from 'exceljs';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { blankKeywords, extractText, normalizeIban, parseNumericValue, sumFields } from '../../utils';
import { join } from 'path';
import { Model111Input, ModelOptions } from '../../types';

function pageOneIteration(worksheet: Worksheet, fromRow: number, toRow: number, row: number, data: Model111Input) {
  let output = '';
  for (let index = fromRow; index < toRow; index++) {
    const id = Number(worksheet.getCell(`A${row}`).text);
    const lon = Number(worksheet.getCell(`C${row}`).text);
    const content = extractText(worksheet.getCell(`G${row}`).text);
    switch (id) {
      case 4:
        output += data.exercise;
        row++;
        continue;
      case 5:
        output += data.period.padStart(2,'0');
        row++;
        continue;
      case 9:
        output += data.version;
        row++;
        continue;
      case 11:
        output += data.devCompanyNIF;
        row++;
        continue;
    }
    if (blankKeywords.includes(content)) {
      output += ''.padEnd(lon, ' ');
    } else {
      output += content;
    }
    row++;
  }
  return output;
}

function pageTwoIteration(worksheet: Worksheet, fromRow: number, toRow: number, row: number, data: Model111Input) {
  let output = '';
  for (let index = fromRow; index < toRow; index++) {
    const id = Number(worksheet.getCell(`A${row}`).text);
    const lon = Number(worksheet.getCell(`C${row}`).text);
    const type = worksheet.getCell(`D${row}`).text;
    const content = extractText(worksheet.getCell(`F${row}`).text);
    switch (id) {
      case 6:
        output += data.declarationType;
        row++;
        continue;
      case 7:
        output += data.declarant.nif;
        row++;
        continue;
      case 8:
        output += data.declarant.lastname.padEnd(lon, ' ');
        row++;
        continue;
      case 9:
        output += data.declarant.name.padEnd(lon, ' ');
        row++;
        continue;
      case 10:
        output += data.exercise;
        row++;
        continue;
      case 11:
        output += data.period.padStart(2,'0');
        row++;
        continue;
      case 12:
        output += parseNumericValue(data.fields.field01, lon);
        row++;
        continue;
      case 13:
        output += parseNumericValue(data.fields.field02, lon);
        row++;
        continue;
      case 14:
        output += parseNumericValue(data.fields.field03, lon);
        row++;
        continue;
      case 18:
        output += parseNumericValue(data.fields.field07, lon);
        row++;
        continue;
      case 19:
        output += parseNumericValue(data.fields.field08, lon);
        row++;
        continue;
      case 20:
        output += parseNumericValue(data.fields.field09, lon);
        row++;
        continue;
      case 39:
      case 41: {
        const field28 = sumFields(data.fields.field03, data.fields.field09);
        output += parseNumericValue(field28.toString(), lon);
        row++;
        continue;
      }
      case 45:
        output += normalizeIban(data.declarant.iban).padEnd(lon, ' ');
        row++;
        continue;
      case 48:
        output += '</T11101000>'.padEnd(lon, ' ');
        row++;
        continue;
    }
    if (blankKeywords.includes(content)) {
      output += ''.padEnd(lon, ' ');
    } else if (type === 'Num' || type === 'N') {
      output += '0'.padStart(lon, '0');
    }
    if (row > 46 && content === '') {
      output += ''.padEnd(lon, ' ');
    }
    row++;
  }
  return output;
}

export async function model111(input: Model111Input, options: ModelOptions) {
  const specsDir = join(__dirname, '../../specs');
  const file111 = `${specsDir}/dr111e16v18.xlsx`;
  const workbook = new Workbook();
  let output = '';
  await workbook.xlsx
    .readFile(file111)
    .then(async (wb: Workbook) => {
      // BEGIN PAGE 1
      const page1 = wb.getWorksheet(1);
      let row = 6;
      const page1FinalRow = 20;
      output += pageOneIteration(page1, 0, 14, row, input);
      // END PAGE 1
      // BEGIN PAGE 2
      const page2 = wb.getWorksheet(2);
      const page2Constant = '<T11101000>';
      output += page2Constant;
      row = 10;
      output += pageTwoIteration(page2, 0, 44, row, input);
      // END PAGE 2
      let finalConstant = extractText(page1.getCell(`G${page1FinalRow}`).text);
      finalConstant = finalConstant.replace('AAAA', input.exercise).replace('PP', input.period.padStart(2,'0'));
      output += finalConstant;
      if (options.asBuffer) {
        return Buffer.from(output);
      } else {
        const outputDir = `${process.cwd()}/${options.destinationPath}`;
        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }
        return writeFile(`${outputDir}/111.txt`, output);
      }
    })
    .catch((err: Error) => {
      throw new Error(err.stack);
    });
}
