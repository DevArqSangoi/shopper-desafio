// server/src/utils/csvLoader.ts - Back-end
import fs from 'fs';
import csv from 'csv-parser';

const loadCsvData = (filename: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (data: any) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error: Error) => reject(error));
  });
};

export default loadCsvData;