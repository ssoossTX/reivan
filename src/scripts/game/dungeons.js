import { gameState, saveState } from '../core/state.js';
import { monsterRanks, towerMonsters } from '../core/config.js';
import { getPlayerDmg, getPlayerMaxDungeonHp } from '../core/abilities.js';

export function startDungeon(towerIdx) {
    if (gameState.dungeonActive) {
        showToast('Вы уже находитесь в подземелье!', 'error');
        return;
    }
    
    gameState.dungeonActive = true;
    gameState.dungeonState = {
        tower: towerIdx,
        floor: 1,
        playerHp: getPlayerMaxDungeonHp(),
        relicDrop: false
    };
    
    nextDungeonFloor();
    renderDungeonUI();
}

export function nextDungeonFloor() {
    const state = gameState.dungeonState;
    const floor = state.floor;
    const isBoss = floor % 10 === 0;
    
    // Выбор монстра
    let monsterPool = towerMonsters[state.tower];
    let monster = { ...monsterPool[Math.floor(Math.random()*monsterPool.length)] };
    
    // Рандомный ранг
    let rankIdx = Math.floor(Math.random()*monsterRanks.length);
    let rank = monsterRanks[rankIdx];
    
    // Усиление характеристик
    let rankMult = 1 + (monsterRanks.length-rankIdx-1)*0.15 + (isBoss?1:0);
    monster.rank = rank;
    monster.hp = Math.round(monster.baseHp * rankMult * (isBoss?2:1) * (1+floor/20));
    monster.atk = Math.round(monster.baseAtk * rankMult * (isBoss?2:1) * (1+floor/20));
    monster.isBoss = isBoss;
    monster.name = (isBoss?'Босс ':'') + monster.name;
    
    state.monster = monster;
    state.monsterHp = monster.hp;
    state.isBoss = isBoss;
    state.relicDrop = isBoss && Math.random()<0.25;
    
    saveState();
}

export function dungeonAttack() {
    const state = gameState.dungeonState;
    const monster = state.monster;
    let playerDmg = getPlayerDmg();
    
    state.monsterHp -= playerDmg;
    
    if (state.monsterHp <= 0) {
        handleMonsterDefeat(monster);
    } else {
        // Монстр контратакует
        state.playerHp -= monster.atk;
        if (state.playerHp <= 0) {
            handlePlayerDefeat();
        }
    }
    
    saveState();
}

function handleMonsterDefeat(monster) {
    const state = gameState.dungeonState;
    let expGain = Math.round(monster.baseHp * (monster.isBoss ? 2 : 1));
    let diamondGain = Math.round(monster.baseAtk * (monster.isBoss ? 3 : 1));
    
    addExp(expGain);
    gameState.diamonds += diamondGain;
    
    if (state.relicDrop) {
        addToInventory('Легендарный артефакт');
        showToast('Получен легендарный артефакт!', 'success');
    }
    
    for (let drop of monster.drops) {
        if (Math.random() < 0.3) {
            addToInventory(drop);
        }
    }
    
    state.floor++;
    nextDungeonFloor();
    saveState();
}

function handlePlayerDefeat() {
    showToast('Вы погибли! Подземелье завершено.', 'error');
    gameState.dungeonState = null;
    gameState.dungeonActive = false;
    saveState();
}