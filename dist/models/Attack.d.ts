import { AttackData } from '../types';
export declare class Attack {
    private id;
    private name;
    private damage;
    private usageLimit;
    private usageCount;
    constructor(data: AttackData);
    getId(): number;
    getName(): string;
    getDamage(): number;
    getUsageLimit(): number;
    getUsageCount(): number;
    canUse(): boolean;
    use(): boolean;
    resetUsage(): void;
    getInfo(): string;
    toData(): AttackData;
}
//# sourceMappingURL=Attack.d.ts.map