import { gameState } from '../core/state.js';

export const getStrengthBonus = () => gameState.abilities[0]?.value || 0;
export const getAgilityBonus = () => gameState.abilities[1]?.value || 0;
export const getIntellectBonus = () => gameState.abilities[2]?.value || 0;

export const getPlayerDmg = () => {
    return Math.floor(8 + (gameState.level * 1.5) + getStrengthBonus() * 3);
};

export const getPlayerMaxDungeonHp = () => {
    return gameState.maxHealth + getAgilityBonus() * 15;
};

export function addExp(amount) {
    let intBonus = getIntellectBonus();
    let mult = 1 + intBonus * 0.07; // +7% опыта за 1 интеллект
    let realAmount = Math.round(amount * mult);
    gameState.exp += realAmount;
    
    while (gameState.exp >= gameState.expToNext) {
        gameState.exp -= gameState.expToNext;
        levelUp();
    }
    
    return realAmount;
}

export function levelUp() {
    gameState.level++;
    gameState.points += 3;
    const diamondReward = 5 + Math.floor(gameState.level * 1.5);
    gameState.diamonds += diamondReward;
    showToast(`Поздравляем! Вы достигли ${gameState.level} уровня!\nВы получили 3 поинта и ${diamondReward} алмазиков!`, 'info', 4000);
    gameState.expToNext = Math.floor(gameState.expToNext * 1.2 + 5);
}