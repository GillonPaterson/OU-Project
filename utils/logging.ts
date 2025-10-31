import * as fs from 'fs';
import * as path from 'path';

export function writeJsonToPrismic(fileName: string, data: object, folderName: string): void {
    const folderPath = path.join("Logs", folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, `${fileName}.json`);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`JSON saved to ${filePath}`);
}