import { Workbook, Worksheet } from 'exceljs';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { blankKeywords, extractText, parseNumericValue, subtractFields } from '../../utils';
import { join } from 'path';
import { Model130Input, ModelOptions, SpecsName } from '../../types';

function pageOneIteration(worksheet: Worksheet, fromRow: number, toRow: number, row: number, data: Model130Input) {
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

function pageTwoIteration(worksheet: Worksheet, fromRow: number, toRow: number, row: number, data: Model130Input) {
  let output = '';
  const field03 = subtractFields(data.fields.field01, data.fields.field02);
  let field04 = field03 * 0.2;
  if (field04 < 0) field04 = 0;
  const field07 = field04 - subtractFields(data.fields.field05, data.fields.field06);
  const field14 = field07 - Number(data.fields.field13);
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
        output += data.period;
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
        output += parseNumericValue(field03, lon);
        row++;
        continue;
      case 15:
        output += parseNumericValue(field04, lon);
        row++;
        continue;
      case 16:
        output += parseNumericValue(data.fields.field05, lon);
        row++;
        continue;
      case 17:
        output += parseNumericValue(data.fields.field06, lon);
        row++;
        continue;
      case 18:
      case 23:
        output += parseNumericValue(field07, lon);
        row++;
        continue;
      case 24:
        output += parseNumericValue(data.fields.field13, lon);
        row++;
        continue;
      case 25:
      case 28:
      case 30:
        output += parseNumericValue(field14, lon);
        row++;
        continue;
      case 33:
        output += data.declarant.iban.padEnd(lon, ' ');
        row++;
        continue;
      case 36:
        output += '</T13001000>'.padEnd(lon, ' ');
        row++;
        continue;
    }
    if (blankKeywords.includes(content)) {
      output += ''.padEnd(lon, ' ');
    } else if (type === 'Num' || type === 'N') {
      output += '0'.padStart(lon, '0');
    }
    if (row > 35 && content === '') {
      output += ''.padEnd(lon, ' ');
    }
    row++;
  }
  return output;
}

export async function model130(input: Model130Input, options: ModelOptions) {
  const specsDir = join(__dirname, '../../specs');
  const file130 = `${specsDir}/${SpecsName.MODEL130}.xlsx`;
  const workbook = new Workbook();
  let output = '';
  await workbook.xlsx
    .readFile(file130)
    .then(async (wb: Workbook) => {
      // BEGIN PAGE 1
      const page1 = wb.getWorksheet(1);
      let row = 7;
      const page1FinalRow = 21;
      output += pageOneIteration(page1, 0, 13, row, input);
      // END PAGE 1
      // BEGIN PAGE 2
      const page2 = wb.getWorksheet(2);
      const page2Constant = '<T13001000>';
      output += page2Constant;
      row = 10;
      output += pageTwoIteration(page2, 0, 32, row, input);
      // END PAGE 2
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
        return writeFile(`${outputDir}/130.txt`, output);
      }
    })
    .catch((error: Error) => {
      throw new Error(error.stack);
    });
}
