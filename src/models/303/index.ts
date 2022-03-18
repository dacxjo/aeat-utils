import { Workbook, Worksheet } from 'exceljs';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { blankKeywords, extractText, normalizeIban, parseNumericValue } from '../../utils';
import { join } from 'path';
import { PersistentField, Model303Input, ModelOptions, SpecsName } from '../../types';

const persistentFields: PersistentField = {};

function pageOneIteration(worksheet: Worksheet, fromRow: number, toRow: number, row: number, data: Model303Input) {
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
        output += data.period;
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

function pageTwoIteration(worksheet: Worksheet, fromRow: number, toRow: number, row: number, data: Model303Input) {
  let output = '';
  const field11 = Number(data.fields.field10) * 0.21;
  const field27 =
    Number(data.fields.field03) +
    Number(data.fields.field06) +
    Number(data.fields.field09) +
    field11 +
    Number(data.fields.field18) +
    Number(data.fields.field21) +
    Number(data.fields.field24);
  const field45 = Number(data.fields.field29) + Number(data.fields.field31) + field11;
  const field46 = field27 - field45;
  persistentFields['field46'] = field46;
  for (let index = fromRow; index < toRow; index++) {
    const id = Number(worksheet.getCell(`A${row}`).text);
    const lon = Number(worksheet.getCell(`C${row}`).text);
    const type = worksheet.getCell(`D${row}`).text;
    const content = extractText(worksheet.getCell(`G${row}`).text);
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
        output += `${data.declarant.lastname} ${data.declarant.name}`.padEnd(lon, ' ');
        row++;
        continue;
      case 9:
        output += data.exercise;
        row++;
        continue;
      case 10:
        output += data.period;
        row++;
        continue;
      case 11:
      case 12:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 22:
        output += parseNumericValue(2, lon);
        row++;
        continue;
      case 20:
      case 21:
        output += ' '.padEnd(lon, ' ');
        row++;
        continue;
      case 23:
      case 24:
        output += parseNumericValue(0, lon);
        row++;
        continue;
      case 13:
        output += parseNumericValue(3, lon);
        row++;
        continue;
      case 25:
        output += parseNumericValue(data.fields.field01, lon);
        row++;
        continue;
      case 26:
        output += parseNumericValue(data.fields.field02, lon);
        row++;
        continue;
      case 27:
        output += parseNumericValue(data.fields.field03, lon);
        row++;
        continue;
      case 28:
        output += parseNumericValue(data.fields.field04, lon);
        row++;
        continue;
      case 29:
        output += parseNumericValue(data.fields.field05, lon);
        row++;
        continue;
      case 30:
        output += parseNumericValue(data.fields.field06, lon);
        row++;
        continue;
      case 31:
        output += parseNumericValue(data.fields.field07, lon);
        row++;
        continue;
      case 32:
        console.log(parseNumericValue(data.fields.field08, lon));
        output += parseNumericValue(data.fields.field08, lon);
        row++;
        continue;
      case 33:
        output += parseNumericValue(data.fields.field09, lon);
        row++;
        continue;
      case 34:
      case 60:
        output += parseNumericValue(data.fields.field10, lon);
        row++;
        continue;
      case 35:
      case 61:
        output += parseNumericValue(field11, lon);
        row++;
        continue;
      case 40:
        output += parseNumericValue(data.fields.field16, lon);
        row++;
        continue;
      case 41:
        output += parseNumericValue(data.fields.field17, lon);
        row++;
        continue;
      case 42:
        output += parseNumericValue(data.fields.field18, lon);
        row++;
        continue;
      case 43:
        output += parseNumericValue(data.fields.field19, lon);
        row++;
        continue;
      case 44:
        output += parseNumericValue(data.fields.field20, lon);
        row++;
        continue;
      case 45:
        output += parseNumericValue(data.fields.field21, lon);
        row++;
        continue;
      case 46:
        output += parseNumericValue(data.fields.field22, lon);
        row++;
        continue;
      case 47:
        output += parseNumericValue(data.fields.field23, lon);
        row++;
        continue;
      case 48:
        output += parseNumericValue(data.fields.field24, lon);
        row++;
        continue;
      case 51:
        output += parseNumericValue(field27, lon);
        row++;
        continue;
      case 52:
        output += parseNumericValue(data.fields.field28, lon);
        row++;
        continue;
      case 53:
        output += parseNumericValue(data.fields.field29, lon);
        row++;
        continue;
      case 54:
        output += parseNumericValue(data.fields.field30, lon);
        row++;
        continue;
      case 55:
        output += parseNumericValue(data.fields.field31, lon);
        row++;
        continue;
      case 69:
        output += parseNumericValue(field45, lon);
        row++;
        continue;
      case 70:
        output += parseNumericValue(field46, lon);
        row++;
        continue;
      case 73:
        output += '</T30301000>'.padEnd(lon, ' ');
        row++;
        continue;
    }
    if (blankKeywords.includes(content.trim())) {
      output += ''.padEnd(lon, ' ');
    } else if (type === 'Num' || type === 'N') {
      output += '0'.padStart(lon, '0');
    }
    if (row > 75 && content === '') {
      output += ''.padEnd(lon, ' ');
    }
    row++;
  }
  return output;
}

function pageThreeIteration(worksheet: Worksheet, fromRow: number, toRow: number, row: number, data: Model303Input) {
  let output = '';
  const field87 = Number(data.fields.field110) - Number(data.fields.field78);
  const field69 = Number(persistentFields['field46']) - Number(data.fields.field78);
  for (let index = fromRow; index < toRow; index++) {
    const id = Number(worksheet.getCell(`A${row}`).text);
    const lon = Number(worksheet.getCell(`C${row}`).text);
    const type = worksheet.getCell(`D${row}`).text;
    const content = extractText(worksheet.getCell(`G${row}`).text);
    switch (id) {
      case 5:
        output += parseNumericValue(data.fields.field59, lon);
        row++;
        continue;
      case 6:
        output += parseNumericValue(data.fields.field60, lon);
        row++;
        continue;
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 21:
      case 25:
      case 27:
        output += '0'.padStart(lon, '0');
        row++;
        continue;
      case 18:
      case 20:
        console.log(persistentFields['field46']);
        output += parseNumericValue(persistentFields['field46'], lon);
        row++;
        continue;
      case 19:
        output += parseNumericValue(100, lon);
        row++;
        continue;
      case 22:
        output += parseNumericValue(data.fields.field110, lon);
        row++;
        continue;
      case 23:
        output += parseNumericValue(data.fields.field78, lon);
        row++;
        continue;
      case 24:
        output += parseNumericValue(field87, lon);
        row++;
        continue;
      case 26:
      case 28:
        output += parseNumericValue(field69, lon);
        row++;
        continue;
      case 33:
        output += normalizeIban(data.declarant.iban).padEnd(lon, ' ');
        row++;
        continue;
      case 39:
        output += ''.padStart(lon, ' ');
        row++;
        continue;
      case 41:
        output += '</T30303000>'.padEnd(lon, ' ');
        row++;
        continue;
    }
    if (blankKeywords.includes(content.trim())) {
      output += ''.padEnd(lon, ' ');
    } else if (type === 'Num' || type === 'N') {
      output += '0'.padStart(lon, '0');
    }
    if (row > 33 && content === '') {
      output += ''.padEnd(lon, ' ');
    }
    row++;
  }
  return output;
}

export async function model303(input: Model303Input, options: ModelOptions) {
  const specsDir = join(__dirname, '../../specs');
  const file303 = `${specsDir}/${SpecsName.MODEL303}.xlsx`;
  const workbook = new Workbook();
  let output = '';
  await workbook.xlsx
    .readFile(file303)
    .then(async (wb: Workbook) => {
      // BEGIN PAGE 1
      const page1 = wb.getWorksheet('DP30300');
      let row = 6;
      const page1FinalRow = 20;
      output += pageOneIteration(page1, 0, 13, row, input);
      // END PAGE 1
      // BEGIN PAGE 2
      const page2 = wb.getWorksheet('DP30301');
      const page2Constant = '<T30301000>';
      output += page2Constant;
      row = 10;
      output += pageTwoIteration(page2, 0, 69, row, input);
      // END PAGE 2
      // BEGIN PAGE 3
      const page3 = wb.getWorksheet('DP30303');
      const page3Constant = '<T30303000>';
      output += page3Constant;
      row = 10;
      output += pageThreeIteration(page3, 0, 37, row, input);
      // END PAGE 3
      let finalConstant = extractText(page1.getCell(`G${page1FinalRow}`).text);
      finalConstant = finalConstant.replace('AAAA', input.exercise).replace('PP', input.period);
      output += finalConstant;
      if (options.asBuffer) {
        return Promise.resolve(Buffer.from(output));
      } else {
        const outputDir = `${process.cwd()}/${options.destinationPath}`;
        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }
        return writeFile(`${outputDir}/303.txt`, output);
      }
    })
    .catch((error: Error) => {
      throw new Error(error.stack);
    });
}
