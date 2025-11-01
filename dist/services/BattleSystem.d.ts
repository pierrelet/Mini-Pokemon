import { Trainer } from '../models/Trainer';
import { BattleResult } from '../types';
export declare class BattleSystem {
    static randomChallenge(trainer1: Trainer, trainer2: Trainer): BattleResult;
    static arena1(trainer1: Trainer, trainer2: Trainer): BattleResult;
    static deterministicChallenge(trainer1: Trainer, trainer2: Trainer): BattleResult;
    static arena2(trainer1: Trainer, trainer2: Trainer): BattleResult;
}
//# sourceMappingURL=BattleSystem.d.ts.map