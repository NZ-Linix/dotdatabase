declare class DotDB {
    path: string;
    array: {
        push: (key: string, value: any) => boolean;
        delete: (key: string, value: any) => boolean;
    };
    constructor(path: string);
    validate: () => void;
    set(key: string, value: any): void;
    multiset(pairs: Record<string, any>): void;
    get(key: string): any | undefined;
    delete(key: string): void;
    multidelete(keys: string[]): void;
    clear(confirm: boolean): void;
    all(): Record<any, any> | undefined;
    has(key: string): boolean;
    keys(): string[];
    values(): any[];
}
export default DotDB;
//# sourceMappingURL=dotdb.d.ts.map