import { gameState, saveState, loadState } from './core/state.js';
import { showToast, updateInterface } from './ui/interface.js';
import { addToInventory, useItem } from './game/inventory.js';
import { startDungeon, dungeonAttack } from './game/dungeons.js';
import '../styles/main.css';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка сохранения
    loadState();
    
    // Инициализация интерфейса
    initializeSidebar();
    initializeClicker();
    initializeShop();
    initializeProfile();
    
    // Первое обновление интерфейса
    updateInterface();
});

// Инициализация бокового меню
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const openSidebar = document.getElementById('openSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (openSidebar && sidebar) {
        openSidebar.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }
    
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }
    
    // Переключение вкладок
    const menuItems = document.querySelectorAll('.menu-list li');
    const tabs = document.querySelectorAll('.tab');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById('tab-' + item.dataset.tab).classList.add('active');
            
            sidebar.classList.remove('open');
        });
    });
}

// Инициализация кликера
function initializeClicker() {
    const clickerBtn = document.getElementById('clickerBtn');
    const clicksSpan = document.getElementById('clicks');
    const upgradeBtn = document.querySelector('.upgrade-btn');
    
    if (clickerBtn) {
        clickerBtn.addEventListener('click', () => {
            gameState.clicks += gameState.clickPower;
            if (clicksSpan) clicksSpan.textContent = gameState.clicks;
            updateInterface();
            saveState();
        });
    }
    
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', () => {
            if (gameState.clicks >= gameState.upgradeCost) {
                gameState.clicks -= gameState.upgradeCost;
                gameState.clickPower++;
                gameState.upgradeCost = Math.floor(gameState.upgradeCost * 1.5);
                upgradeBtn.textContent = `Улучшить (+${gameState.clickPower}/клик) — ${gameState.upgradeCost} кликов`;
                updateInterface();
                saveState();
                showToast('Сила клика увеличена!', 'success');
            } else {
                showToast('Недостаточно кликов!', 'error');
            }
        });
    }
}

// Инициализация магазина
function initializeShop() {
    document.querySelectorAll('.case-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            if (gameState.diamonds < caseTypes[i].price && gameState.keys[caseTypes[i].key] <= 0) {
                showToast('Недостаточно алмазов или ключей!', 'error');
                return;
            }

            // Списание ресурсов
            if (gameState.keys[caseTypes[i].key] > 0) {
                gameState.keys[caseTypes[i].key]--;
            } else {
                gameState.diamonds -= caseTypes[i].price;
            }

            // Выпадение предмета
            let rand = Math.random() * 100;
            let sum = 0;
            let selectedItem = null;

            for (let item of caseTypes[i].loot) {
                sum += item.chance;
                if (rand <= sum) {
                    selectedItem = item;
                    break;
                }
            }

            if (selectedItem) {
                addToInventory(selectedItem.name);
                showToast(`Получен предмет: ${selectedItem.name}!`, 'success');
            }

            updateInterface();
            saveState();
        });
    });
}

// Инициализация профиля
function initializeProfile() {
    const abilitiesList = document.getElementById('abilitiesList');
    
    if (abilitiesList) {
        abilitiesList.addEventListener('click', e => {
            if (e.target.classList.contains('ability-up')) {
                const idx = +e.target.dataset.idx;
                if (gameState.points > 0) {
                    gameState.points--;
                    gameState.abilities[idx].value++;
                    updateInterface();
                    saveState();
                    showToast(`${gameState.abilities[idx].name} улучшена!`, 'success');
                }
            }
        });
    }
    
    const inventoryList = document.getElementById('inventoryList');
    
    if (inventoryList) {
        inventoryList.addEventListener('click', e => {
            if (e.target.classList.contains('use-item-btn')) {
                const itemName = e.target.dataset.item;
                if (useItem(itemName)) {
                    updateInterface();
                }
            }
        });
    }
}