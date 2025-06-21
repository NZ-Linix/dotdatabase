declare class DotDB {
    path: string;
    constructor(path: string);
    validate: () => Promise<void>;
    set(key: string, value: any): Promise<void>;
    multiset(pairs: Record<string, any>): Promise<void>;
    get(key: string): Promise<any | undefined>;
    delete(key: string): Promise<void>;
    multidelete(keys: string[]): Promise<void>;
    clear(confirm: boolean): Promise<void>;
    all(): Promise<Record<any, any> | undefined>;
    has(key: string): Promise<boolean>;
    keys(): Promise<string[]>;
    values(): Promise<any[]>;
}
export { DotDB };
//# sourceMappingURL=dotdb.d.ts.map