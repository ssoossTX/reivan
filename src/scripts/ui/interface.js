// Toast уведомления
export function showToast(msg, type = 'info', timeout = 3000) {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    
    document.querySelector('.toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, timeout);
}

// Обновление интерфейса
export function updateInterface() {
    updateProfile();
    updateInventory();
    updateHealthBar();
    if (gameState.dungeonActive) {
        renderDungeonUI();
    }
}

function updateProfile() {
    const elements = {
        playerLevel: document.getElementById('playerLevel'),
        playerPoints: document.getElementById('playerPoints'),
        expBar: document.getElementById('expBar'),
        expText: document.getElementById('expText'),
        diamonds: document.getElementById('diamonds'),
        keyCommon: document.getElementById('keyCommon'),
        keyRare: document.getElementById('keyRare'),
        keyEpic: document.getElementById('keyEpic'),
        prestigeMultiplier: document.getElementById('prestigeMultiplier'),
        statDiamonds: document.getElementById('stat-diamonds'),
        statClicks: document.getElementById('stat-clicks'),
        statLevel: document.getElementById('stat-level'),
        statExp: document.getElementById('stat-exp')
    };

    if (elements.playerLevel) elements.playerLevel.textContent = gameState.level;
    if (elements.playerPoints) elements.playerPoints.textContent = gameState.points;
    if (elements.expBar) elements.expBar.style.width = (gameState.exp / gameState.expToNext * 100) + '%';
    if (elements.expText) elements.expText.textContent = `${gameState.exp} / ${gameState.expToNext} опыта`;
    if (elements.diamonds) elements.diamonds.textContent = gameState.diamonds;
    if (elements.keyCommon) elements.keyCommon.textContent = gameState.keys.common;
    if (elements.keyRare) elements.keyRare.textContent = gameState.keys.rare;
    if (elements.keyEpic) elements.keyEpic.textContent = gameState.keys.epic;
    if (elements.prestigeMultiplier) elements.prestigeMultiplier.textContent = gameState.prestigeMultiplier.toFixed(2) + 'x';
    
    // Верхняя панель
    if (elements.statDiamonds) elements.statDiamonds.textContent = `💎 Алмазы: ${gameState.diamonds}`;
    if (elements.statClicks) elements.statClicks.textContent = `🖱️ Клики: ${gameState.clicks}`;
    if (elements.statLevel) elements.statLevel.textContent = `🏅 Уровень: ${gameState.level}`;
    if (elements.statExp) elements.statExp.textContent = `📚 Опыт: ${gameState.exp} / ${gameState.expToNext}`;
}

function updateHealthBar() {
    const inner = document.getElementById('healthInner');
    const label = document.getElementById('healthLabel');
    
    if (inner) {
        inner.style.width = Math.max(0, Math.min(gameState.health, gameState.maxHealth)) / gameState.maxHealth * 100 + '%';
    }
    if (label) {
        label.textContent = `Здоровье: ${gameState.health} / ${gameState.maxHealth}`;
    }
}