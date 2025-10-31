import { gameState, saveState } from '../core/state.js';
import { caseTypes } from '../core/config.js';

export function addToInventory(itemName) {
    let found = gameState.inventory.find(obj => obj.name === itemName);
    if (found) {
        found.count++;
    } else {
        gameState.inventory.push({ name: itemName, count: 1 });
    }
    return true;
}

export function useItem(itemName) {
    let item = gameState.inventory.find(obj => obj.name === itemName);
    if (!item) return false;
    
    // Поиск эффекта предмета
    let itemEffect = getItemEffect(itemName);
    if (!itemEffect) return false;

    // Применение эффекта
    applyItemEffect(itemEffect);

    // Уменьшение количества
    item.count--;
    if (item.count <= 0) {
        gameState.inventory = gameState.inventory.filter(obj => obj.name !== itemName);
    }

    saveState();
    return true;
}

function getItemEffect(itemName) {
    for (let caseType of caseTypes) {
        let item = caseType.loot.find(i => i.name === itemName);
        if (item) return item.effect;
    }
    return null;
}

function applyItemEffect(effect) {
    if (effect.includes('Восстанавливает')) {
        if (effect.includes('Большое')) {
            gameState.health = Math.min(gameState.maxHealth, gameState.health + 50);
        } else if (effect.includes('Эпическое')) {
            gameState.health = gameState.maxHealth;
        } else {
            gameState.health = Math.min(gameState.maxHealth, gameState.health + 30);
        }
    } else if (effect.includes('клик-бонус')) {
        let amount = effect.includes('200') ? 200 : effect.includes('50') ? 50 : 10;
        gameState.clicks += amount;
    }
}