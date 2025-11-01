"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
const Attack_1 = require("./Attack");
class Pokemon {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.lifePoints = data.lifePoints;
        this.maxLifePoints = data.maxLifePoints;
        this.attacks = data.attacks.map(attackData => new Attack_1.Attack(attackData));
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getLifePoints() {
        return this.lifePoints;
    }
    getMaxLifePoints() {
        return this.maxLifePoints;
    }
    getAttacks() {
        return this.attacks;
    }
    isAlive() {
        return this.lifePoints > 0;
    }
    takeDamage(damage) {
        this.lifePoints = Math.max(0, this.lifePoints - damage);
    }
    heal() {
        this.lifePoints = this.maxLifePoints;
        this.attacks.forEach(attack => attack.resetUsage());
    }
    learnAttack(attack) {
        if (this.attacks.length >= 4) {
            return false;
        }
        const existingAttack = this.attacks.find(a => a.getId() === attack.getId());
        if (existingAttack) {
            return false;
        }
        this.attacks.push(attack);
        return true;
    }
    getAvailableAttacks() {
        return this.attacks.filter(attack => attack.canUse());
    }
    attackRandom() {
        const availableAttacks = this.getAvailableAttacks();
        if (availableAttacks.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * availableAttacks.length);
        const selectedAttack = availableAttacks[randomIndex];
        selectedAttack.use();
        return selectedAttack;
    }
    attackTarget(target) {
        const attack = this.attackRandom();
        if (!attack) {
            return false;
        }
        target.takeDamage(attack.getDamage());
        return true;
    }
    getStrongestAttack() {
        if (this.attacks.length === 0) {
            return null;
        }
        return this.attacks.reduce((strongest, current) => current.getDamage() > strongest.getDamage() ? current : strongest);
    }
    toData() {
        return {
            id: this.id,
            name: this.name,
            lifePoints: this.lifePoints,
            maxLifePoints: this.maxLifePoints,
            attacks: this.attacks.map(attack => attack.toData())
        };
    }
}
exports.Pokemon = Pokemon;
//# sourceMappingURL=Pokemon.js.map