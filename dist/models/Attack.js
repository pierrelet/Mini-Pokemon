"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attack = void 0;
class Attack {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.damage = data.damage;
        this.usageLimit = data.usageLimit;
        this.usageCount = data.usageCount;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getDamage() {
        return this.damage;
    }
    getUsageLimit() {
        return this.usageLimit;
    }
    getUsageCount() {
        return this.usageCount;
    }
    canUse() {
        return this.usageCount < this.usageLimit;
    }
    use() {
        if (this.canUse()) {
            this.usageCount++;
            return true;
        }
        return false;
    }
    resetUsage() {
        this.usageCount = 0;
    }
    getInfo() {
        return `${this.name} - Dégâts: ${this.damage}, Usages: ${this.usageCount}/${this.usageLimit}`;
    }
    toData() {
        return {
            id: this.id,
            name: this.name,
            damage: this.damage,
            usageLimit: this.usageLimit,
            usageCount: this.usageCount
        };
    }
}
exports.Attack = Attack;
//# sourceMappingURL=Attack.js.map