class UIManager {
    constructor(inventory, craftingSystem, player, dayNightCycle, enemyManager, economySystem) {
        this.inventory = inventory;
        this.craftingSystem = craftingSystem;
        this.player = player;
        this.dayNightCycle = dayNightCycle;
        this.enemyManager = enemyManager;
        this.economySystem = economySystem;

        this.craftingMenuOpen = false;
        this.recipeMenuOpen = false;
        this.shopMenuOpen = false;

        this.setupUI();
    }

    setupUI() {
        // ホットバーの作成
        this.createHotbar();

        // クラフトボタン
        document.getElementById('craft-button').addEventListener('click', () => {
            this.toggleCraftingMenu();
        });

        // レシピボタン
        document.getElementById('recipe-button').addEventListener('click', () => {
            this.toggleRecipeMenu();
        });

        // クラフトメニューを閉じる
        document.getElementById('close-craft').addEventListener('click', () => {
            this.toggleCraftingMenu();
        });

        // レシピメニューを閉じる
        document.getElementById('close-recipe').addEventListener('click', () => {
            this.toggleRecipeMenu();
        });

        // ショップボタン
        const shopButton = document.getElementById('shop-button');
        if (shopButton) {
            shopButton.addEventListener('click', () => {
                this.toggleShopMenu();
            });
        }

        // ショップメニューを閉じる
        const closeShop = document.getElementById('close-shop');
        if (closeShop) {
            closeShop.addEventListener('click', () => {
                this.toggleShopMenu();
            });
        }

        // クラフトグリッドのセットアップ
        this.setupCraftingGrid();

        // レシピリストの作成
        this.createRecipeList();

        // 初期UI更新
        this.updateHotbar();
        this.updateStats();
    }

    createHotbar() {
        const hotbar = document.getElementById('hotbar');
        hotbar.innerHTML = '';

        for (let i = 0; i < this.inventory.slots; i++) {
            const slot = document.createElement('div');
            slot.className = 'hotbar-slot';
            slot.dataset.slot = i;

            if (i === this.inventory.selectedSlot) {
                slot.classList.add('selected');
            }

            slot.addEventListener('click', () => {
                this.inventory.selectedSlot = i;
                this.updateHotbar();
            });

            hotbar.appendChild(slot);
        }
    }

    updateHotbar() {
        const items = this.inventory.getItems();
        const selectedSlot = this.inventory.getSelectedSlot();

        for (let i = 0; i < this.inventory.slots; i++) {
            const slot = document.querySelector(`.hotbar-slot[data-slot="${i}"]`);
            if (!slot) continue;

            const item = items[i];

            if (item.type !== ItemType.AIR && item.count > 0) {
                const info = itemInfo[item.type];
                slot.innerHTML = `
                    <span>${info.icon}</span>
                    <span class="count">${item.count}</span>
                `;
            } else {
                slot.innerHTML = '';
            }

            if (i === selectedSlot) {
                slot.classList.add('selected');
            } else {
                slot.classList.remove('selected');
            }
        }
    }

    setupCraftingGrid() {
        const grid = document.getElementById('crafting-grid');
        const slots = grid.querySelectorAll('.craft-slot:not(#craft-result)');

        slots.forEach((slot, index) => {
            slot.addEventListener('click', () => {
                this.handleCraftingSlotClick(index);
            });
        });

        // クラフト結果スロットのクリック
        document.getElementById('craft-result').addEventListener('click', () => {
            this.executeCraft();
        });
    }

    handleCraftingSlotClick(slotIndex) {
        const selectedItem = this.inventory.getSelectedItem();

        if (selectedItem.type !== ItemType.AIR && selectedItem.count > 0) {
            // アイテムを配置
            const grid = this.craftingSystem.getCraftingGrid();
            grid[slotIndex] = selectedItem.type;
            this.craftingSystem.setCraftingGrid(grid);
            this.inventory.removeItem(selectedItem.type, 1);
        } else {
            // アイテムを取り除く
            const grid = this.craftingSystem.getCraftingGrid();
            if (grid[slotIndex] !== ItemType.AIR) {
                this.inventory.addItem(grid[slotIndex], 1);
                grid[slotIndex] = ItemType.AIR;
                this.craftingSystem.setCraftingGrid(grid);
            }
        }

        this.updateCraftingGrid();
        this.updateHotbar();
    }

    updateCraftingGrid() {
        const grid = this.craftingSystem.getCraftingGrid();
        const slots = document.querySelectorAll('.craft-slot:not(#craft-result)');

        slots.forEach((slot, index) => {
            const itemType = grid[index];
            if (itemType !== ItemType.AIR) {
                const info = itemInfo[itemType];
                slot.innerHTML = `<span>${info.icon}</span>`;
            } else {
                slot.innerHTML = '';
            }
        });

        // クラフト結果をチェック
        this.craftingSystem.updateCraftingTableStatus();
        const recipe = this.craftingSystem.checkRecipe3x3() || this.craftingSystem.checkRecipe2x2();

        const resultSlot = document.getElementById('craft-result');
        if (recipe) {
            const info = itemInfo[recipe.result];
            resultSlot.innerHTML = `
                <span>${info.icon}</span>
                <span class="count">${recipe.count}</span>
            `;
            resultSlot.style.cursor = 'pointer';
        } else {
            resultSlot.innerHTML = '結果';
            resultSlot.style.cursor = 'default';
        }
    }

    executeCraft() {
        const recipe = this.craftingSystem.craft();
        if (recipe) {
            this.updateCraftingGrid();
            this.updateHotbar();
        }
    }

    toggleCraftingMenu() {
        this.craftingMenuOpen = !this.craftingMenuOpen;
        const menu = document.getElementById('crafting-menu');

        if (this.craftingMenuOpen) {
            menu.style.display = 'block';
            document.exitPointerLock();
            this.updateCraftingGrid();
        } else {
            menu.style.display = 'none';
            // クラフトグリッドに残っているアイテムを返却
            const grid = this.craftingSystem.getCraftingGrid();
            grid.forEach(itemType => {
                if (itemType !== ItemType.AIR) {
                    this.inventory.addItem(itemType, 1);
                }
            });
            this.craftingSystem.setCraftingGrid(new Array(9).fill(ItemType.AIR));
            this.updateHotbar();
        }
    }

    toggleRecipeMenu() {
        this.recipeMenuOpen = !this.recipeMenuOpen;
        const menu = document.getElementById('recipe-menu');

        if (this.recipeMenuOpen) {
            menu.style.display = 'block';
            document.exitPointerLock();
        } else {
            menu.style.display = 'none';
        }
    }

    createRecipeList() {
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '<h3>手でクラフト（2x2）</h3>';

        // 2x2レシピ
        recipes2x2.forEach(recipe => {
            const recipeDiv = this.createRecipeItem(recipe, false);
            recipeList.appendChild(recipeDiv);
        });

        recipeList.innerHTML += '<h3>作業台でクラフト（3x3）</h3>';

        // 3x3レシピ
        recipes3x3.forEach(recipe => {
            const recipeDiv = this.createRecipeItem(recipe, true);
            recipeList.appendChild(recipeDiv);
        });
    }

    createRecipeItem(recipe, is3x3) {
        const div = document.createElement('div');
        div.className = 'recipe-item';

        const resultInfo = itemInfo[recipe.result];
        div.innerHTML = `<h3>${resultInfo.icon} ${resultInfo.name} x${recipe.count}</h3>`;

        const patternDiv = document.createElement('div');
        patternDiv.className = `recipe-pattern ${is3x3 ? 'grid-3x3' : 'grid-2x2'}`;

        recipe.pattern.forEach(itemType => {
            const cell = document.createElement('div');
            cell.className = 'recipe-cell';

            if (itemType !== ItemType.AIR) {
                const info = itemInfo[itemType];
                cell.innerHTML = info.icon;
            }

            patternDiv.appendChild(cell);
        });

        div.appendChild(patternDiv);
        return div;
    }

    updateStats() {
        // 時刻表示
        document.getElementById('time-display').textContent = this.dayNightCycle.getTimeString();

        // 体力バー
        const healthBar = document.getElementById('health-bar');
        healthBar.innerHTML = '';
        const hearts = Math.ceil(this.player.health / 2);
        const maxHearts = Math.ceil(this.player.maxHealth / 2);

        for (let i = 0; i < maxHearts; i++) {
            const heart = document.createElement('span');
            heart.className = 'heart';
            if (i < hearts) {
                if (this.player.health % 2 === 1 && i === hearts - 1) {
                    heart.textContent = '💔'; // 半分のハート
                } else {
                    heart.textContent = '❤️';
                }
            } else {
                heart.textContent = '🖤';
            }
            healthBar.appendChild(heart);
        }

        // 経済システム情報
        if (this.economySystem) {
            document.getElementById('coins-display').textContent = this.economySystem.getCoins().toLocaleString();
            document.getElementById('income-display').textContent = this.economySystem.calculateIncome();
            document.getElementById('brainrod-count').textContent = this.economySystem.getBrainRodCount();
        }
    }

    toggleShopMenu() {
        this.shopMenuOpen = !this.shopMenuOpen;
        const menu = document.getElementById('shop-menu');

        if (this.shopMenuOpen) {
            menu.style.display = 'block';
            document.exitPointerLock();
            this.updateShopMenu();
        } else {
            menu.style.display = 'none';
        }
    }

    updateShopMenu() {
        const shopList = document.getElementById('shop-list');
        if (!shopList || !this.economySystem) return;

        shopList.innerHTML = '';

        // ブレインロッドセクション
        const brainRodSection = document.createElement('div');
        brainRodSection.innerHTML = '<h3>🧠 ブレインロッド（お金を稼ぐ）</h3>';
        shopList.appendChild(brainRodSection);

        for (const [key, rod] of Object.entries(this.economySystem.brainRodTypes)) {
            const item = document.createElement('div');
            item.className = 'shop-item';
            const owned = this.economySystem.getBrainRodCountByType(key);
            item.innerHTML = `
                <div class="shop-item-info">
                    <span class="shop-icon">${rod.icon}</span>
                    <span class="shop-name">${rod.name}</span>
                    <span class="shop-desc">毎秒 ${rod.income}円</span>
                    <span class="shop-owned">所有: ${owned}個</span>
                </div>
                <button class="shop-buy-btn" data-type="brainrod" data-key="${key}">${rod.price.toLocaleString()}円で購入</button>
            `;
            shopList.appendChild(item);
        }

        // 建物セクション
        const buildingSection = document.createElement('div');
        buildingSection.innerHTML = '<h3>🏠 町の建物</h3>';
        shopList.appendChild(buildingSection);

        for (const [key, building] of Object.entries(this.economySystem.buildings)) {
            const item = document.createElement('div');
            item.className = 'shop-item';
            const owned = this.economySystem.ownedBuildings[key] || 0;
            item.innerHTML = `
                <div class="shop-item-info">
                    <span class="shop-icon">${building.icon}</span>
                    <span class="shop-name">${building.name}</span>
                    <span class="shop-desc">${building.description}</span>
                    <span class="shop-owned">所有: ${owned}個</span>
                </div>
                <button class="shop-buy-btn" data-type="building" data-key="${key}">${building.price.toLocaleString()}円で購入</button>
            `;
            shopList.appendChild(item);
        }

        // 購入ボタンにイベントリスナーを追加
        const buyButtons = shopList.querySelectorAll('.shop-buy-btn');
        buyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const key = e.target.dataset.key;

                let result;
                if (type === 'brainrod') {
                    result = this.economySystem.buyBrainRod(key);
                    if (result.success) {
                        // インベントリにブレインロッドを追加
                        const itemTypeMap = {
                            basic: ItemType.BRAIN_ROD,
                            silver: ItemType.SILVER_BRAIN_ROD,
                            gold: ItemType.GOLD_BRAIN_ROD,
                            diamond: ItemType.DIAMOND_BRAIN_ROD
                        };
                        window.inventory.addItem(itemTypeMap[key], 1);
                        this.updateHotbar();
                    }
                } else if (type === 'building') {
                    result = this.economySystem.buyBuilding(key);
                    if (result.success) {
                        // インベントリに建物を追加
                        const itemTypeMap = {
                            house: ItemType.BUILDING_HOUSE,
                            shop: ItemType.BUILDING_SHOP,
                            factory: ItemType.BUILDING_FACTORY,
                            tower: ItemType.BUILDING_TOWER,
                            castle: ItemType.BUILDING_CASTLE,
                            school: ItemType.BUILDING_SCHOOL,
                            hospital: ItemType.BUILDING_HOSPITAL,
                            park: ItemType.BUILDING_PARK
                        };
                        window.inventory.addItem(itemTypeMap[key], 1);
                        this.updateHotbar();
                    }
                }

                if (result) {
                    alert(result.message);
                    this.updateShopMenu();
                }
            });
        });
    }

    isCraftingMenuOpen() {
        return this.craftingMenuOpen;
    }

    isRecipeMenuOpen() {
        return this.recipeMenuOpen;
    }

    isAnyMenuOpen() {
        return this.craftingMenuOpen || this.recipeMenuOpen || this.shopMenuOpen;
    }

    isShopMenuOpen() {
        return this.shopMenuOpen;
    }
}

// グローバル関数
window.updateHotbar = function() {
    if (window.uiManager) {
        window.uiManager.updateHotbar();
    }
};

window.UIManager = UIManager;
