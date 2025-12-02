// 構造物生成システム
// ブロックを設置すると自動的に建物や公園が生成される

class StructureGenerator {
    constructor(world) {
        this.world = world;
    }

    // 構造物ブロックかどうかをチェック
    isStructureBlock(blockType) {
        return [
            ItemType.BUILDING_HOUSE,
            ItemType.BUILDING_SHOP,
            ItemType.BUILDING_FACTORY,
            ItemType.BUILDING_TOWER,
            ItemType.BUILDING_CASTLE,
            ItemType.BUILDING_SCHOOL,
            ItemType.BUILDING_HOSPITAL,
            ItemType.BUILDING_PARK
        ].includes(blockType);
    }

    // 構造物を生成
    generateStructure(blockType, x, y, z) {
        switch (blockType) {
            case ItemType.BUILDING_PARK:
                this.generatePark(x, y, z);
                break;
            case ItemType.BUILDING_HOUSE:
                this.generateHouse(x, y, z);
                break;
            case ItemType.BUILDING_SHOP:
                this.generateShop(x, y, z);
                break;
            case ItemType.BUILDING_FACTORY:
                this.generateFactory(x, y, z);
                break;
            case ItemType.BUILDING_TOWER:
                this.generateTower(x, y, z);
                break;
            case ItemType.BUILDING_CASTLE:
                this.generateCastle(x, y, z);
                break;
            case ItemType.BUILDING_SCHOOL:
                this.generateSchool(x, y, z);
                break;
            case ItemType.BUILDING_HOSPITAL:
                this.generateHospital(x, y, z);
                break;
        }
    }

    // 公園を生成
    generatePark(x, y, z) {
        // 設置されたブロックを削除（構造物に置き換える）
        this.world.setBlockType(x, y, z, ItemType.AIR);

        // 草地の基盤（9x9）
        for (let dx = -4; dx <= 4; dx++) {
            for (let dz = -4; dz <= 4; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.GRASS);
                this.world.setBlockType(x + dx, y - 2, z + dz, ItemType.DIRT);
            }
        }

        // 中央に大きな木
        this.generateTree(x, y, z);

        // 四隅に小さな木
        this.generateSmallTree(x - 3, y, z - 3);
        this.generateSmallTree(x + 3, y, z - 3);
        this.generateSmallTree(x - 3, y, z + 3);
        this.generateSmallTree(x + 3, y, z + 3);

        // 花を散りばめる
        const flowerPositions = [
            [-2, 0], [2, 0], [0, -2], [0, 2],
            [-1, -1], [1, -1], [-1, 1], [1, 1],
            [-2, -2], [2, 2], [2, -2], [-2, 2]
        ];
        for (const [dx, dz] of flowerPositions) {
            const flowerType = Math.random() < 0.5 ? ItemType.FLOWER_RED : ItemType.FLOWER_YELLOW;
            this.world.setBlockType(x + dx, y, z + dz, flowerType);
        }

        // ベンチ（木の板）
        this.world.setBlockType(x - 4, y, z, ItemType.PLANKS);
        this.world.setBlockType(x + 4, y, z, ItemType.PLANKS);

        console.log('🏞️ 公園が完成しました！');
    }

    // 木を生成
    generateTree(x, y, z) {
        // 幹（4ブロック）
        for (let dy = 0; dy < 4; dy++) {
            this.world.setBlockType(x, y + dy, z, ItemType.WOOD);
        }

        // 葉（球状）
        const leafY = y + 4;
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = 0; dy <= 2; dy++) {
                for (let dz = -2; dz <= 2; dz++) {
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist <= 2.5 && !(dx === 0 && dy === 0 && dz === 0)) {
                        this.world.setBlockType(x + dx, leafY + dy, z + dz, ItemType.LEAVES);
                    }
                }
            }
        }
    }

    // 小さな木を生成
    generateSmallTree(x, y, z) {
        // 幹（2ブロック）
        for (let dy = 0; dy < 2; dy++) {
            this.world.setBlockType(x, y + dy, z, ItemType.WOOD);
        }

        // 葉
        const leafY = y + 2;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                this.world.setBlockType(x + dx, leafY, z + dz, ItemType.LEAVES);
            }
        }
        this.world.setBlockType(x, leafY + 1, z, ItemType.LEAVES);
    }

    // 家を生成
    generateHouse(x, y, z) {
        // 設置されたブロックを削除
        this.world.setBlockType(x, y, z, ItemType.AIR);

        const width = 5;  // 幅
        const depth = 6;  // 奥行き
        const height = 4; // 高さ

        // 床（木の板）
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.PLANKS);
            }
        }

        // 壁（レンガ）
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                for (let dz = 0; dz < depth; dz++) {
                    // 外壁のみ
                    if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
                        this.world.setBlockType(x + dx, y + dy, z + dz, ItemType.BRICK);
                    }
                }
            }
        }

        // ドア（前面中央）
        this.world.setBlockType(x + 2, y, z, ItemType.DOOR);
        this.world.setBlockType(x + 2, y + 1, z, ItemType.DOOR);

        // 窓（ガラス）- 横面
        this.world.setBlockType(x, y + 1, z + 2, ItemType.GLASS);
        this.world.setBlockType(x, y + 1, z + 3, ItemType.GLASS);
        this.world.setBlockType(x + width - 1, y + 1, z + 2, ItemType.GLASS);
        this.world.setBlockType(x + width - 1, y + 1, z + 3, ItemType.GLASS);

        // 窓（後面）
        this.world.setBlockType(x + 1, y + 1, z + depth - 1, ItemType.GLASS);
        this.world.setBlockType(x + 3, y + 1, z + depth - 1, ItemType.GLASS);

        // 屋根（木の板、三角形）
        for (let row = 0; row <= 2; row++) {
            for (let dx = row; dx < width - row; dx++) {
                this.world.setBlockType(x + dx, y + height + row, z - 1, ItemType.PLANKS);
                this.world.setBlockType(x + dx, y + height + row, z + depth, ItemType.PLANKS);
                for (let dz = 0; dz < depth; dz++) {
                    this.world.setBlockType(x + dx, y + height + row, z + dz, ItemType.PLANKS);
                }
            }
        }

        // たいまつ（玄関横）
        this.world.setBlockType(x + 1, y + 1, z - 1, ItemType.TORCH);
        this.world.setBlockType(x + 3, y + 1, z - 1, ItemType.TORCH);

        console.log('🏠 家が完成しました！');
    }

    // お店を生成
    generateShop(x, y, z) {
        this.world.setBlockType(x, y, z, ItemType.AIR);

        const width = 6;
        const depth = 5;
        const height = 4;

        // 床
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.PLANKS);
            }
        }

        // 壁（レンガ）
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                for (let dz = 0; dz < depth; dz++) {
                    if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
                        this.world.setBlockType(x + dx, y + dy, z + dz, ItemType.BRICK);
                    }
                }
            }
        }

        // 大きなショーウィンドウ（前面）
        for (let dx = 1; dx < width - 1; dx++) {
            this.world.setBlockType(x + dx, y, z, ItemType.AIR); // ドア部分
            this.world.setBlockType(x + dx, y + 1, z, ItemType.GLASS);
            this.world.setBlockType(x + dx, y + 2, z, ItemType.GLASS);
        }

        // 入り口
        this.world.setBlockType(x + 2, y, z, ItemType.DOOR);
        this.world.setBlockType(x + 3, y, z, ItemType.DOOR);

        // 屋根（平屋根）
        for (let dx = -1; dx <= width; dx++) {
            for (let dz = -1; dz <= depth; dz++) {
                this.world.setBlockType(x + dx, y + height, z + dz, ItemType.BRICK);
            }
        }

        // 看板（スマイルブロック）
        this.world.setBlockType(x + 2, y + height + 1, z, ItemType.SMILE_BLOCK);
        this.world.setBlockType(x + 3, y + height + 1, z, ItemType.SMILE_BLOCK);

        // カウンター（チェスト）
        this.world.setBlockType(x + 2, y, z + 3, ItemType.CHEST);
        this.world.setBlockType(x + 3, y, z + 3, ItemType.CHEST);

        console.log('🏪 お店が完成しました！');
    }

    // 工場を生成
    generateFactory(x, y, z) {
        this.world.setBlockType(x, y, z, ItemType.AIR);

        const width = 8;
        const depth = 6;
        const height = 5;

        // 床（石）
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.STONE);
            }
        }

        // 壁（鉄ブロック）
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                for (let dz = 0; dz < depth; dz++) {
                    if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
                        this.world.setBlockType(x + dx, y + dy, z + dz, ItemType.IRON_BLOCK);
                    }
                }
            }
        }

        // 大きな入り口
        this.world.setBlockType(x + 3, y, z, ItemType.AIR);
        this.world.setBlockType(x + 4, y, z, ItemType.AIR);
        this.world.setBlockType(x + 3, y + 1, z, ItemType.AIR);
        this.world.setBlockType(x + 4, y + 1, z, ItemType.AIR);

        // かまど（中に設置）
        this.world.setBlockType(x + 2, y, z + 3, ItemType.FURNACE);
        this.world.setBlockType(x + 5, y, z + 3, ItemType.FURNACE);

        // 煙突
        for (let dy = height; dy < height + 4; dy++) {
            this.world.setBlockType(x + 1, y + dy, z + 2, ItemType.BRICK);
        }
        for (let dy = height; dy < height + 4; dy++) {
            this.world.setBlockType(x + 6, y + dy, z + 2, ItemType.BRICK);
        }

        // 屋根
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y + height, z + dz, ItemType.IRON_BLOCK);
            }
        }

        console.log('🏭 工場が完成しました！');
    }

    // タワーを生成
    generateTower(x, y, z) {
        this.world.setBlockType(x, y, z, ItemType.AIR);

        const height = 12;
        const width = 3;

        // 土台
        for (let dx = -1; dx <= width; dx++) {
            for (let dz = -1; dz <= width; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.STONE);
            }
        }

        // タワー本体
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                for (let dz = 0; dz < width; dz++) {
                    if (dx === 0 || dx === width - 1 || dz === 0 || dz === width - 1) {
                        this.world.setBlockType(x + dx, y + dy, z + dz, ItemType.IRON_BLOCK);
                    }
                }
            }
        }

        // 窓（各階に）
        for (let floor = 1; floor < height - 1; floor += 3) {
            this.world.setBlockType(x + 1, y + floor, z, ItemType.GLASS);
            this.world.setBlockType(x + 1, y + floor, z + width - 1, ItemType.GLASS);
        }

        // 展望台（頂上）
        for (let dx = -1; dx <= width; dx++) {
            for (let dz = -1; dz <= width; dz++) {
                this.world.setBlockType(x + dx, y + height, z + dz, ItemType.GLASS);
            }
        }

        // アンテナ
        for (let dy = 1; dy <= 3; dy++) {
            this.world.setBlockType(x + 1, y + height + dy, z + 1, ItemType.IRON_BLOCK);
        }

        // たいまつ（頂上）
        this.world.setBlockType(x, y + height + 1, z, ItemType.TORCH);
        this.world.setBlockType(x + width - 1, y + height + 1, z + width - 1, ItemType.TORCH);

        console.log('🗼 タワーが完成しました！');
    }

    // 城を生成
    generateCastle(x, y, z) {
        this.world.setBlockType(x, y, z, ItemType.AIR);

        const width = 10;
        const depth = 10;
        const height = 8;

        // 土台
        for (let dx = -1; dx <= width; dx++) {
            for (let dz = -1; dz <= depth; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.STONE);
            }
        }

        // 壁（石）
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                for (let dz = 0; dz < depth; dz++) {
                    if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
                        this.world.setBlockType(x + dx, y + dy, z + dz, ItemType.STONE);
                    }
                }
            }
        }

        // 門
        this.world.setBlockType(x + 4, y, z, ItemType.AIR);
        this.world.setBlockType(x + 5, y, z, ItemType.AIR);
        this.world.setBlockType(x + 4, y + 1, z, ItemType.AIR);
        this.world.setBlockType(x + 5, y + 1, z, ItemType.AIR);
        this.world.setBlockType(x + 4, y + 2, z, ItemType.AIR);
        this.world.setBlockType(x + 5, y + 2, z, ItemType.AIR);

        // 四隅の塔
        const towerHeight = 4;
        const towerPositions = [
            [0, 0], [width - 1, 0], [0, depth - 1], [width - 1, depth - 1]
        ];
        for (const [tx, tz] of towerPositions) {
            for (let dy = height; dy < height + towerHeight; dy++) {
                this.world.setBlockType(x + tx, y + dy, z + tz, ItemType.STONE);
            }
            // 塔の頂上に金ブロック
            this.world.setBlockType(x + tx, y + height + towerHeight, z + tz, ItemType.GOLD_BLOCK);
        }

        // 城壁の歯
        for (let dx = 1; dx < width - 1; dx += 2) {
            this.world.setBlockType(x + dx, y + height, z, ItemType.STONE);
            this.world.setBlockType(x + dx, y + height, z + depth - 1, ItemType.STONE);
        }
        for (let dz = 1; dz < depth - 1; dz += 2) {
            this.world.setBlockType(x, y + height, z + dz, ItemType.STONE);
            this.world.setBlockType(x + width - 1, y + height, z + dz, ItemType.STONE);
        }

        // 中央に玉座（ダイヤブロック）
        this.world.setBlockType(x + 4, y, z + 7, ItemType.DIAMOND_BLOCK);
        this.world.setBlockType(x + 5, y, z + 7, ItemType.DIAMOND_BLOCK);
        this.world.setBlockType(x + 4, y + 1, z + 7, ItemType.GOLD_BLOCK);
        this.world.setBlockType(x + 5, y + 1, z + 7, ItemType.GOLD_BLOCK);

        // たいまつ
        this.world.setBlockType(x + 3, y + 2, z + 1, ItemType.TORCH);
        this.world.setBlockType(x + 6, y + 2, z + 1, ItemType.TORCH);

        console.log('🏰 城が完成しました！');
    }

    // 学校を生成
    generateSchool(x, y, z) {
        this.world.setBlockType(x, y, z, ItemType.AIR);

        const width = 12;
        const depth = 8;
        const height = 6;

        // 床
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.PLANKS);
            }
        }

        // 壁（レンガ）
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                for (let dz = 0; dz < depth; dz++) {
                    if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
                        this.world.setBlockType(x + dx, y + dy, z + dz, ItemType.BRICK);
                    }
                }
            }
        }

        // 窓（たくさん）- 1階
        for (let dx = 2; dx < width - 2; dx += 2) {
            this.world.setBlockType(x + dx, y + 1, z, ItemType.GLASS);
            this.world.setBlockType(x + dx, y + 2, z, ItemType.GLASS);
        }
        // 2階
        for (let dx = 2; dx < width - 2; dx += 2) {
            this.world.setBlockType(x + dx, y + 4, z, ItemType.GLASS);
        }

        // 正面玄関
        this.world.setBlockType(x + 5, y, z, ItemType.DOOR);
        this.world.setBlockType(x + 6, y, z, ItemType.DOOR);
        this.world.setBlockType(x + 5, y + 1, z, ItemType.DOOR);
        this.world.setBlockType(x + 6, y + 1, z, ItemType.DOOR);

        // 屋根（平屋根）
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y + height, z + dz, ItemType.BRICK);
            }
        }

        // 時計塔
        for (let dy = 0; dy < 3; dy++) {
            this.world.setBlockType(x + 5, y + height + dy, z + 1, ItemType.BRICK);
            this.world.setBlockType(x + 6, y + height + dy, z + 1, ItemType.BRICK);
        }
        // 時計（金ブロック）
        this.world.setBlockType(x + 5, y + height + 2, z, ItemType.GOLD_BLOCK);
        this.world.setBlockType(x + 6, y + height + 2, z, ItemType.GOLD_BLOCK);

        // 校庭に木
        this.generateSmallTree(x - 2, y, z + 3);
        this.generateSmallTree(x + width + 1, y, z + 3);

        console.log('🏫 学校が完成しました！');
    }

    // 病院を生成
    generateHospital(x, y, z) {
        this.world.setBlockType(x, y, z, ItemType.AIR);

        const width = 8;
        const depth = 6;
        const height = 5;

        // 床
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y - 1, z + dz, ItemType.GLASS); // 白い床の代わり
            }
        }

        // 壁（白 = ガラスで代用）
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                for (let dz = 0; dz < depth; dz++) {
                    if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
                        this.world.setBlockType(x + dx, y + dy, z + dz, ItemType.BRICK);
                    }
                }
            }
        }

        // 入り口
        this.world.setBlockType(x + 3, y, z, ItemType.DOOR);
        this.world.setBlockType(x + 4, y, z, ItemType.DOOR);
        this.world.setBlockType(x + 3, y + 1, z, ItemType.DOOR);
        this.world.setBlockType(x + 4, y + 1, z, ItemType.DOOR);

        // 窓
        this.world.setBlockType(x + 1, y + 2, z, ItemType.GLASS);
        this.world.setBlockType(x + 6, y + 2, z, ItemType.GLASS);

        // 屋根
        for (let dx = 0; dx < width; dx++) {
            for (let dz = 0; dz < depth; dz++) {
                this.world.setBlockType(x + dx, y + height, z + dz, ItemType.BRICK);
            }
        }

        // 赤十字のシンボル（レンガブロックで）
        // 縦線
        this.world.setBlockType(x + 3, y + height + 1, z + 2, ItemType.FLOWER_RED);
        this.world.setBlockType(x + 4, y + height + 1, z + 2, ItemType.FLOWER_RED);
        this.world.setBlockType(x + 3, y + height + 2, z + 2, ItemType.FLOWER_RED);
        this.world.setBlockType(x + 4, y + height + 2, z + 2, ItemType.FLOWER_RED);
        // 横線
        this.world.setBlockType(x + 2, y + height + 1, z + 2, ItemType.FLOWER_RED);
        this.world.setBlockType(x + 5, y + height + 1, z + 2, ItemType.FLOWER_RED);

        // たいまつ（夜間照明）
        this.world.setBlockType(x + 1, y + 1, z - 1, ItemType.TORCH);
        this.world.setBlockType(x + width - 2, y + 1, z - 1, ItemType.TORCH);

        console.log('🏥 病院が完成しました！');
    }

    // 即座にチャンクを更新
    refreshChunks(x, z) {
        const chunkX = Math.floor(x / this.world.chunkSize);
        const chunkZ = Math.floor(z / this.world.chunkSize);

        // 周囲のチャンクも更新
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                this.world.markChunkForRebuild(chunkX + dx, chunkZ + dz);
            }
        }
    }
}

// グローバルに公開
window.StructureGenerator = StructureGenerator;
