import * as fs from 'fs';
import { injectable } from "inversify";
import * as path from 'path';

@injectable()
export class Logger {
    public writeJsonToLogs = (fileName: string, data: object, folderName: string): void => {
        const folderPath = path.join("Logs", folderName);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, `${fileName}.json`);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`JSON saved to ${filePath}`);
    }

} 
