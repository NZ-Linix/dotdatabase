"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class DotDB {
    constructor(path) {
        this.validate = async () => {
            try {
                const data = await fs_1.default.readFileSync(this.path, "utf8");
            }
            catch (error) {
                await fs_1.default.writeFileSync(this.path, JSON.stringify({}));
            }
            try {
                const data = await fs_1.default.readFileSync(this.path, "utf8");
                if (!data.trim()) {
                    await fs_1.default.writeFileSync(this.path, "{}");
                }
            }
            catch (error) {
                throw new Error(`Error setting file up: ${this.path}`);
            }
        };
        this.path = path;
        this.validate();
    }
    async set(key, value) {
        try {
            let data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                data = "{}";
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
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
                await fs_1.default.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            }
            catch (error) {
                throw new Error(`Error writing file: ${this.path}`);
            }
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async multiset(pairs) {
        try {
            let data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                data = "{}";
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
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
                await fs_1.default.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            }
            catch (error) {
                throw new Error(`Error writing file: ${this.path}`);
            }
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async get(key) {
        try {
            let data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                data = "{}";
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
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
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async delete(key) {
        try {
            let data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                data = "{}";
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
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
                await fs_1.default.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            }
            catch (error) {
                throw new Error(`Error writing file: ${this.path}`);
            }
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async multidelete(keys) {
        try {
            let data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                data = "{}";
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
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
                await fs_1.default.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            }
            catch (error) {
                throw new Error(`Error writing file: ${this.path}`);
            }
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async clear(confirm) {
        if (!confirm) {
            throw new Error("Please confirm that you want to clear the database.");
        }
        try {
            await fs_1.default.writeFileSync(this.path, "{}");
        }
        catch (error) {
            throw new Error(`Error writing file: ${this.path}`);
        }
    }
    async all() {
        try {
            let data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim() || data == "{}") {
                return undefined;
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }
            return jsonData;
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async has(key) {
        try {
            let data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                data = "{}";
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
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
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async keys() {
        try {
            const data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                return [];
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }
            const extractKeys = (obj, prefix = "") => {
                return Object.keys(obj).flatMap(key => {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (typeof obj[key] === "object" && obj[key] !== null) {
                        return extractKeys(obj[key], fullKey);
                    }
                    return fullKey;
                });
            };
            return extractKeys(jsonData);
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
    async values() {
        try {
            const data = await fs_1.default.readFileSync(this.path, "utf8");
            if (!data.trim()) {
                await fs_1.default.writeFileSync(this.path, "{}");
                return [];
            }
            let jsonData;
            try {
                jsonData = await JSON.parse(data);
            }
            catch (error) {
                throw new Error(`Error parsing JSON: ${error}`);
            }
            const extractValues = (obj) => {
                return Object.values(obj).flatMap(value => {
                    if (typeof value === "object" && value !== null) {
                        return extractValues(value);
                    }
                    return value;
                });
            };
            return extractValues(jsonData);
        }
        catch (error) {
            throw new Error(`Error reading file: ${this.path}`);
        }
    }
}
exports.default = DotDB;
