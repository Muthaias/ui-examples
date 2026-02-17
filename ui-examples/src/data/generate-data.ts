import fs from "node:fs";
import { getGenerator as getBirdRinging } from "./bird-ringing";
import { getGenerator as getHealtCare } from "./health-care";
import { getGenerator as getLegacyBirdRinging } from "./legacy-data";
import { DataGenerator } from "./common";


function toCSV(data: {[x: string]: unknown}[]) {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const sep = ",";
    return [
        headers.join(sep) + sep,
        data.map(d => headers.map(h => h in d ? d[h] : "NULL").join(sep) + sep).join("\n")
    ].join("\n")
}


function main(rootPath: string = "public/data") {
    const generators: Record<string, DataGenerator<object>> = {
        "bird-ringing": getBirdRinging(),
        "health-care": getHealtCare(),
    }

    for (const key in generators) {
        const dirPath = `${rootPath}/${key}`;
        fs.mkdirSync(dirPath, {recursive: true});

        const generator = generators[key];
        const content = generator.createData();
        Object.entries(content).forEach(([contentKey, value]) => {
            const data = JSON.stringify(value, undefined, "  ");
            const outputFile = `${dirPath}/${contentKey}.json`
            console.log(key, outputFile);
            fs.writeFileSync(outputFile, data);
        })
    }

    const csvGenerators: Record<string, DataGenerator<object>> = {
        "bird-ringing/legacy": getLegacyBirdRinging(),
    }

    for (const key in csvGenerators) {
        const dirPath = `${rootPath}/${key}`;
        fs.mkdirSync(dirPath, {recursive: true});

        const generator = csvGenerators[key];
        const content = generator.createData();
        Object.entries(content).forEach(([contentKey, value]) => {
            const data = toCSV(value);
            const outputFile = `${dirPath}/${contentKey}.csv`
            console.log(key, outputFile);
            fs.writeFileSync(outputFile, data);
        })
    }
}

main()