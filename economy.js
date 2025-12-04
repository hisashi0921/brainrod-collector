// 経済システム - お金とブレインロッド管理
class EconomySystem {
    constructor() {
        this.coins = 100; // 初期資金
        this.brainRods = []; // 配置されたブレインロッド
        this.totalEarned = 0; // 累計収入
        this.lastUpdateTime = Date.now();

        // ブレインロッドのタイプと性能
        this.brainRodTypes = {
            // ═══════════════════════════════════════
            // 低価格帯（100-750円）
            // ═══════════════════════════════════════
            basic: {
                name: 'ブレインロッド',
                price: 100,
                income: 1, // 1円/秒
                color: 0x9932CC,
                icon: '🧠'
            },
            bronze: {
                name: 'ブロンズブレインロッド',
                price: 200,
                income: 2, // 2円/秒
                color: 0xCD7F32,
                icon: '🧠🥉'
            },
            copper: {
                name: '銅ブレインロッド',
                price: 300,
                income: 3, // 3円/秒
                color: 0xB87333,
                icon: '🧠🔶'
            },
            silver: {
                name: 'シルバーブレインロッド',
                price: 500,
                income: 6, // 6円/秒
                color: 0xC0C0C0,
                icon: '🧠✨'
            },
            emerald: {
                name: 'エメラルドブレインロッド',
                price: 750,
                income: 8, // 8円/秒
                color: 0x50C878,
                icon: '🧠💚'
            },

            // ═══════════════════════════════════════
            // 中価格帯（1000-3000円）
            // ═══════════════════════════════════════
            ruby: {
                name: 'ルビーブレインロッド',
                price: 1000,
                income: 12, // 12円/秒
                color: 0xE0115F,
                icon: '🧠❤️'
            },
            sapphire: {
                name: 'サファイアブレインロッド',
                price: 1500,
                income: 18, // 18円/秒
                color: 0x0F52BA,
                icon: '🧠💙'
            },
            gold: {
                name: 'ゴールドブレインロッド',
                price: 2000,
                income: 25, // 25円/秒
                color: 0xFFD700,
                icon: '🧠💛'
            },
            platinum: {
                name: 'プラチナブレインロッド',
                price: 2500,
                income: 32, // 32円/秒
                color: 0xE5E4E2,
                icon: '🧠⚪'
            },
            amethyst: {
                name: 'アメジストブレインロッド',
                price: 3000,
                income: 40, // 40円/秒
                color: 0x9966CC,
                icon: '🧠💜'
            },

            // ═══════════════════════════════════════
            // 高価格帯（5000-15000円）
            // ═══════════════════════════════════════
            crystal: {
                name: 'クリスタルブレインロッド',
                price: 5000,
                income: 70, // 70円/秒
                color: 0xA7D8DE,
                icon: '🧠🔮'
            },
            opal: {
                name: 'オパールブレインロッド',
                price: 7500,
                income: 110, // 110円/秒
                color: 0xA8C3BC,
                icon: '🧠🌈'
            },
            diamond: {
                name: 'ダイヤブレインロッド',
                price: 10000,
                income: 150, // 150円/秒
                color: 0x00FFFF,
                icon: '🧠💎'
            },
            neon: {
                name: 'ネオンブレインロッド',
                price: 12500,
                income: 200, // 200円/秒
                color: 0xFF1493,
                icon: '🧠⚡'
            },
            rainbow: {
                name: '虹ブレインロッド',
                price: 15000,
                income: 260, // 260円/秒
                color: 0xFF00FF,
                icon: '🧠🌈'
            },

            // ═══════════════════════════════════════
            // プレミアム帯（20000-75000円）
            // ═══════════════════════════════════════
            master: {
                name: 'マスターブレインロッド',
                price: 20000,
                income: 350, // 350円/秒
                color: 0x4B0082,
                icon: '🧠👑'
            },
            legend: {
                name: 'レジェンドブレインロッド',
                price: 30000,
                income: 550, // 550円/秒
                color: 0x8B0000,
                icon: '🧠🔥'
            },
            galaxy: {
                name: 'ギャラクシーブレインロッド',
                price: 40000,
                income: 750, // 750円/秒
                color: 0x191970,
                icon: '🧠🌌'
            },
            cosmic: {
                name: 'コズミックブレインロッド',
                price: 50000,
                income: 1000, // 1000円/秒
                color: 0x2F0059,
                icon: '🧠✨'
            },
            infinity: {
                name: 'インフィニティブレインロッド',
                price: 75000,
                income: 1500, // 1500円/秒
                color: 0x7B68EE,
                icon: '🧠♾️'
            },

            // ═══════════════════════════════════════
            // 超レア帯（100000円以上）⭐
            // ═══════════════════════════════════════
            mythical: {
                name: 'ミシカルブレインロッド',
                price: 100000,
                income: 2200, // 2200円/秒
                color: 0xFFD700,
                icon: '🧠🏆'
            },
            eternal: {
                name: 'エターナルブレインロッド',
                price: 250000,
                income: 6000, // 6000円/秒
                color: 0x00FF00,
                icon: '🧠🌟'
            },
            god: {
                name: 'ゴッドブレインロッド',
                price: 500000,
                income: 15000, // 15000円/秒
                color: 0xFFFFFF,
                icon: '🧠⭐'
            },
            omega: {
                name: 'オメガブレインロッド',
                price: 1000000,
                income: 35000, // 35000円/秒
                color: 0x000000,
                icon: '🧠Ω'
            },
            ultimate: {
                name: 'アルティメットブレインロッド',
                price: 5000000,
                income: 200000, // 200000円/秒
                color: 0xFFD700,
                icon: '🧠🌞'
            }
        };

        // 町の建物
        this.buildings = {
            house: {
                name: '家',
                price: 500,
                icon: '🏠',
                description: '住民が住める家'
            },
            shop: {
                name: 'お店',
                price: 1000,
                icon: '🏪',
                description: '商品を売るお店'
            },
            factory: {
                name: '工場',
                price: 3000,
                icon: '🏭',
                description: 'アイテムを作る工場'
            },
            tower: {
                name: 'タワー',
                price: 5000,
                icon: '🗼',
                description: '高いタワー'
            },
            castle: {
                name: '城',
                price: 20000,
                icon: '🏰',
                description: '立派なお城'
            },
            school: {
                name: '学校',
                price: 8000,
                icon: '🏫',
                description: 'みんなが学ぶ学校'
            },
            hospital: {
                name: '病院',
                price: 10000,
                icon: '🏥',
                description: '人を治す病院'
            },
            park: {
                name: '公園',
                price: 2000,
                icon: '🏞️',
                description: '遊べる公園'
            }
        };

        // 所有している建物数
        this.ownedBuildings = {};
        for (const key in this.buildings) {
            this.ownedBuildings[key] = 0;
        }
    }

    // 毎フレーム更新 - 収入を計算
    update(deltaTime) {
        const now = Date.now();
        const elapsedSeconds = (now - this.lastUpdateTime) / 1000;

        // 1秒以上経過した場合のみ収入を加算
        if (elapsedSeconds >= 1) {
            const income = this.calculateIncome();
            const earnedCoins = Math.floor(income * elapsedSeconds);
            this.coins += earnedCoins;
            this.totalEarned += earnedCoins;
            this.lastUpdateTime = now;
        }
    }

    // 毎秒の収入を計算
    calculateIncome() {
        let income = 0;
        this.brainRods.forEach(rod => {
            const type = this.brainRodTypes[rod.type];
            if (type) {
                income += type.income;
            }
        });
        return income;
    }

    // ブレインロッドを購入
    buyBrainRod(type, position) {
        const rodType = this.brainRodTypes[type];
        if (!rodType) return { success: false, message: '不明なタイプです' };

        if (this.coins < rodType.price) {
            return { success: false, message: 'お金が足りません！' };
        }

        this.coins -= rodType.price;
        const rod = {
            id: Date.now(),
            type: type,
            position: position || { x: 0, y: 0, z: 0 },
            createdAt: Date.now()
        };
        this.brainRods.push(rod);

        return { success: true, message: `${rodType.name}を購入しました！`, rod: rod };
    }

    // 建物を購入
    buyBuilding(type) {
        const building = this.buildings[type];
        if (!building) return { success: false, message: '不明な建物です' };

        if (this.coins < building.price) {
            return { success: false, message: 'お金が足りません！' };
        }

        this.coins -= building.price;
        this.ownedBuildings[type]++;

        return { success: true, message: `${building.name}を購入しました！` };
    }

    // コインを取得
    getCoins() {
        return this.coins;
    }

    // ブレインロッドの数を取得
    getBrainRodCount() {
        return this.brainRods.length;
    }

    // タイプ別のブレインロッド数を取得
    getBrainRodCountByType(type) {
        return this.brainRods.filter(rod => rod.type === type).length;
    }

    // セーブデータを取得
    serialize() {
        return {
            coins: this.coins,
            brainRods: this.brainRods,
            totalEarned: this.totalEarned,
            ownedBuildings: this.ownedBuildings
        };
    }

    // セーブデータから復元
    deserialize(data) {
        if (data.coins !== undefined) this.coins = data.coins;
        if (data.brainRods) this.brainRods = data.brainRods;
        if (data.totalEarned !== undefined) this.totalEarned = data.totalEarned;
        if (data.ownedBuildings) this.ownedBuildings = data.ownedBuildings;
        this.lastUpdateTime = Date.now();
    }

    // コインを追加（デバッグ用）
    addCoins(amount) {
        this.coins += amount;
    }
}

// グローバルに公開
window.EconomySystem = EconomySystem;
