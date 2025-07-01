import fs from "fs";

class DotDB {
    path: string;

    constructor(path: string) {
        this.path = path;

        this.validate();
    }

    validate = async () => {
        
        try {
            const data = await fs.readFileSync(this.path, "utf8");
        } catch ( error ) {

            if ( !fs.existsSync(this.path) ) {

                const dir = this.path.substring(0, this.path.lastIndexOf('/'));
                if (dir && !fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                try {
                    await fs.writeFileSync(this.path, "{}");
                } catch ( error ) {
                    throw new Error(`Error creating file: ${this.path}`);
                }
                return;

            }

            await fs.writeFileSync(this.path, JSON.stringify({}));   
        }

        try {
            const data = await fs.readFileSync(this.path, "utf8");
            if ( !data.trim() ) {
                await fs.writeFileSync(this.path, "{}");
            }
        } catch ( error ) {
            throw new Error(`Error setting file up: ${this.path}`);
        }

    }

    async set(key: string, value: any): Promise<void> {
        
        try {

            let data = await fs.readFileSync(this.path, "utf8");

            if ( !data.trim() ) {
                await fs.writeFileSync(this.path, "{}");
                data = "{}"
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch ( error ) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            const keys = key.split(".");
            let current = jsonData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;

            try {
                await fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            } catch ( error ) {
                throw new Error(`Error writing file: ${this.path}`);
            }
            
        } catch ( error ) {
            throw new Error(`Error reading file: ${this.path}`);
        }

    }

    async multiset(pairs: Record<string, any>): Promise<void> {
        try {
            let data = await fs.readFileSync(this.path, "utf8");

            if (!data.trim()) {
                await fs.writeFileSync(this.path, "{}");
                data = "{}";
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            for (const key in pairs) {
                const value = pairs[key];
                const keys = key.split(".");
                let current = jsonData;

                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
                        current[keys[i]] = {};
                    }
                    current = current[keys[i]];
                }

                current[keys[keys.length - 1]] = value;
            }

            try {
                await fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            } catch (error) {
                throw new Error(`Error writing file: ${this.path}`);
            }
        } catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }

    async get(key: string): Promise<any | undefined> {

        try {

            let data = await fs.readFileSync(this.path, "utf8");

            if ( !data.trim() ) {
                await fs.writeFileSync(this.path, "{}");
                data = "{}"
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch ( error ) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            const keys = key.split(".");
            let current = jsonData;

            for (let i = 0; i < keys.length; i++) {
                if (!current || typeof current !== "object") {
                    return undefined;
                }
                current = current[keys[i]];
            }

            return current;

        } catch ( error ) {
            throw new Error(`Error reading file: ${this.path}`);
        }

    }

    async delete(key: string): Promise<void> {

        try {

            let data = await fs.readFileSync(this.path, "utf8");

            if (!data.trim()) {
                await fs.writeFileSync(this.path, "{}");
                data = "{}";
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            const keys = key.split(".");
            let current = jsonData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current || typeof current !== "object") {
                    return;
                }
                current = current[keys[i]];
            }

            delete current[keys[keys.length - 1]];

            try {
                await fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            } catch (error) {
                throw new Error(`Error writing file: ${this.path}`);
            }

        } catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }

    }

    async multidelete(keys: string[]): Promise<void> {
        try {
            let data = await fs.readFileSync(this.path, "utf8");

            if (!data.trim()) {
                await fs.writeFileSync(this.path, "{}");
                data = "{}";
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            for (const key of keys) {
                const keyParts = key.split(".");
                let current = jsonData;

                for (let i = 0; i < keyParts.length - 1; i++) {
                    if (!current || typeof current !== "object") {
                        break;
                    }
                    current = current[keyParts[i]];
                }

                if (current && typeof current === "object") {
                    delete current[keyParts[keyParts.length - 1]];
                }
            }

            try {
                await fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            } catch (error) {
                throw new Error(`Error writing file: ${this.path}`);
            }
        } catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }

    async clear(confirm: boolean): Promise<void> {

        if ( !confirm ) {
            throw new Error("Please confirm that you want to clear the database.");
        }

        try {
            await fs.writeFileSync(this.path, "{}");
        } catch ( error ) {
            throw new Error(`Error writing file: ${this.path}`);
        }

    }

    async all(): Promise<Record<any, any> | undefined> {

        try {
            let data = await fs.readFileSync(this.path, "utf8");

            if ( !data.trim() || data == "{}" ) {
                return undefined;
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch ( error ) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            return jsonData;

        } catch ( error ) {
            throw new Error(`Error reading file: ${this.path}`);
        }

    }

    async has(key: string): Promise<boolean> {
        try {
            let data = await fs.readFileSync(this.path, "utf8");

            if (!data.trim()) {
                await fs.writeFileSync(this.path, "{}");
                data = "{}";
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            const keys = key.split(".");
            let current = jsonData;

            for (let i = 0; i < keys.length; i++) {
                if (!current || typeof current !== "object" || !(keys[i] in current)) {
                    return false;
                }
                current = current[keys[i]];
            }

            return true;

        } catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }

    async keys(): Promise<string[]> {
        try {
            const data = await fs.readFileSync(this.path, "utf8");

            if (!data.trim()) {
                await fs.writeFileSync(this.path, "{}");
                return [];
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            const extractKeys = (obj: any, prefix = ""): string[] => {
                return Object.keys(obj).flatMap(key => {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (typeof obj[key] === "object" && obj[key] !== null) {
                        return extractKeys(obj[key], fullKey);
                    }
                    return fullKey;
                });
            };

            return extractKeys(jsonData);

        } catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }

    async values(): Promise<any[]> {
        try {
            const data = await fs.readFileSync(this.path, "utf8");

            if (!data.trim()) {
                await fs.writeFileSync(this.path, "{}");
                return [];
            }

            let jsonData;

            try {
                jsonData = await JSON.parse(data);
            } catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }

            const extractValues = (obj: any): any[] => {
                return Object.values(obj).flatMap(value => {
                    if (typeof value === "object" && value !== null) {
                        return extractValues(value);
                    }
                    return value;
                });
            };

            return extractValues(jsonData);

        } catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }

}

export default DotDB;
module.exports = DotDB;
module.exports.default = DotDB;