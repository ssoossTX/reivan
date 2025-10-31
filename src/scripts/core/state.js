// Глобальное состояние игры
export const gameState = {
    clicks: 0,
    clickPower: 1,
    upgradeCost: 10,
    prestigeCost: 1000,
    level: 1,
    exp: 0,
    expToNext: 20,
    points: 0,
    abilities: [
        { name: 'Сила', value: 0 },
        { name: 'Ловкость', value: 0 },
        { name: 'Интеллект', value: 0 }
    ],
    diamonds: 0,
    keys: { common: 0, rare: 0, epic: 0 },
    health: 100,
    maxHealth: 100,
    clickBonus: 1,
    prestigeMultiplier: 1,
    inventory: [],
    dungeonState: null,
    dungeonActive: false
};

export const saveState = () => {
    localStorage.setItem('rpgSave', JSON.stringify(gameState));
};

export const loadState = () => {
    const data = JSON.parse(localStorage.getItem('rpgSave'));
    if (!data) return;
    Object.assign(gameState, data);
};