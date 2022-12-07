import path from "path";
const fs = require('fs');

export const SystemFileUtils = {
    getConfigs: async (fileName: string) => {
        const data = await fs.readFileSync(`src/configs/${fileName}`);
        return JSON.parse(data);
    },
}
