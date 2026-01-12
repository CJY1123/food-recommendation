// 食谱数据管理
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.userPreferences = {
            dailyCalories: 1500,
            restrictions: ['low-salt', 'low-fat'],
            fastingTarget: 7.0,
            aftermealTarget: 10.0
        };
        this.todayPlan = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
        };

        this.loadRecipes();
        this.loadSavedPlan();
        this.initEventListeners();
        this.updateRecommendations();
        this.updatePlanDisplay();
    }

    // 加载食谱数据
    async loadRecipes() {
        try {
            // 这里可以从外部JSON文件加载，或使用内置数据
            this.recipes = await this.getRecipeData();
        } catch (error) {
            console.error('加载食谱数据失败:', error);
            this.recipes = this.getFallbackRecipes();
        }
    }

    // 获取食谱数据
    async getRecipeData() {
        // 尝试从外部文件加载
        try {
            const response = await fetch('data/recipes.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('使用内置食谱数据');
        }

        // 返回内置数据
        return [
            {
                id: 1,
                name: "杂粮燕麦粥",
                category: "breakfast",
                calories: 280,
                protein: 12,
                carbs: 45,
                fat: 5,
                fiber: 8,
                giLevel: "low",
                description: "低GI早餐，富含膳食纤维，缓慢升糖",
                ingredients: ["燕麦片50g", "小米20g", "核桃10g", "蓝莓30g", "水300ml"],
                instructions: "1. 将燕麦片和小米洗净\n2. 加水煮沸后转小火煮15分钟\n3. 加入核桃和蓝莓再煮5分钟\n4. 可根据口味加入少量代糖",
                tags: ["低盐", "低脂", "高纤维"]
            },
            {
                id: 2,
                name: "清蒸鲈鱼配糙米饭",
                category: "lunch",
                calories: 420,
                protein: 35,
                carbs: 50,
                fat: 10,
                fiber: 6,
                giLevel: "low",
                description: "优质蛋白搭配复合碳水，营养均衡",
                ingredients: ["鲈鱼200g", "糙米80g", "生姜5片", "葱适量", "蒸鱼豉油5ml"],
                instructions: "1. 鲈鱼洗净，放上姜片\n2. 水开后蒸8-10分钟\n3. 糙米提前浸泡，煮熟\n4. 淋上少量蒸鱼豉油，撒葱花",
                tags: ["低盐", "高蛋白", "低脂"]
            },
            {
                id: 3,
                name: "凉拌鸡丝荞麦面",
                category: "lunch",
                calories: 380,
                protein: 28,
                carbs: 45,
                fat: 8,
                fiber: 7,
                giLevel: "low",
                description: "荞麦面GI值低，鸡丝提供优质蛋白",
                ingredients: ["荞麦面80g", "鸡胸肉150g", "黄瓜50g", "胡萝卜30g", "低盐酱油10ml"],
                instructions: "1. 鸡胸肉煮熟撕成丝\n2. 荞麦面煮熟过冷水\n3. 蔬菜切丝\n4. 所有材料拌匀，加调料",
                tags: ["低脂", "低盐", "高蛋白"]
            },
            {
                id: 4,
                name: "豆腐蔬菜汤",
                category: "dinner",
                calories: 250,
                protein: 18,
                carbs: 20,
                fat: 6,
                fiber: 8,
                giLevel: "low",
                description: "低热量高蛋白，适合晚餐",
                ingredients: ["嫩豆腐150g", "菠菜100g", "蘑菇50g", "番茄1个", "蔬菜高汤500ml"],
                instructions: "1. 所有蔬菜洗净切好\n2. 高汤煮沸加入蔬菜\n3. 煮5分钟后加入豆腐\n4. 再煮3分钟调味即可",
                tags: ["低盐", "低脂", "素食", "肾病友好"]
            },
            {
                id: 5,
                name: "希腊酸奶坚果杯",
                category: "snack",
                calories: 180,
                protein: 15,
                carbs: 12,
                fat: 8,
                fiber: 3,
                giLevel: "low",
                description: "高蛋白加餐，稳定血糖",
                ingredients: ["希腊酸奶150g", "核桃10g", "蓝莓30g", "奇亚籽5g"],
                instructions: "1. 希腊酸奶放入杯中\n2. 核桃切碎\n3. 所有材料混合即可",
                tags: ["低盐", "低脂", "高蛋白"]
            },
            {
                id: 6,
                name: "全麦蔬菜三明治",
                category: "breakfast",
                calories: 320,
                protein: 18,
                carbs: 40,
                fat: 9,
                fiber: 10,
                giLevel: "medium",
                description: "全麦面包搭配新鲜蔬菜",
                ingredients: ["全麦面包2片", "生菜2片", "番茄2片", "煮鸡蛋1个", "低脂奶酪1片"],
                instructions: "1. 全麦面包烤至微脆\n2. 铺上所有蔬菜\n3. 加入煮鸡蛋切片和奶酪\n4. 用另一片面包盖上",
                tags: ["低盐", "高纤维"]
            },
            {
                id: 7,
                name: "糙米鸡胸肉沙拉",
                category: "lunch",
                calories: 450,
                protein: 40,
                carbs: 55,
                fat: 12,
                fiber: 9,
                giLevel: "low",
                description: "均衡营养，饱腹感强",
                ingredients: ["糙米100g", "鸡胸肉200g", "混合蔬菜150g", "橄榄油5ml", "柠檬汁10ml"],
                instructions: "1. 糙米煮熟放凉\n2. 鸡胸肉煮熟撕条\n3. 所有材料混合\n4. 用橄榄油和柠檬汁调味",
                tags: ["低盐", "低脂", "高蛋白"]
            },
            {
                id: 8,
                name: "烤三文鱼配西兰花",
                category: "dinner",
                calories: 350,
                protein: 30,
                carbs: 15,
                fat: 18,
                fiber: 6,
                giLevel: "low",
                description: "富含Omega-3，营养丰富",
                ingredients: ["三文鱼150g", "西兰花200g", "大蒜2瓣", "橄榄油5ml"],
                instructions: "1. 三文鱼用少量盐腌制\n2. 西兰花切小朵\n3. 所有材料放烤盘\n4. 200度烤15-20分钟",
                tags: ["低盐", "高蛋白"]
            }
        ];
    }

    // 备用的食谱数据
    getFallbackRecipes() {
        return [
            // 这里放置一些基本食谱数据
        ];
    }

    // 初始化事件监听
    initEventListeners() {
        // 血糖范围滑块
        document.getElementById('fasting-range').addEventListener('input', (e) => {
            document.getElementById('fasting-value').textContent = e.target.value;
            this.userPreferences.fastingTarget = parseFloat(e.target.value);
        });

        document.getElementById('aftermeal-range').addEventListener('input', (e) => {
            document.getElementById('aftermeal-value').textContent = e.target.value;
            this.userPreferences.aftermealTarget = parseFloat(e.target.value);
        });

        // 热量选择
        document.querySelectorAll('.calorie-option:not(.custom)').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.calorie-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');

                const calories = parseInt(option.dataset.calories);
                this.userPreferences.dailyCalories = calories;
                document.getElementById('current-calories').textContent = calories;
                document.getElementById('custom-calories').style.display = 'none';
            });
        });

        // 自定义热量
        document.querySelector('.calorie-option.custom').addEventListener('click', () => {
            document.querySelectorAll('.calorie-option').forEach(o => o.classList.remove('active'));
            const customCalories = document.getElementById('custom-calories');
            customCalories.style.display = 'block';
            customCalories.focus();
        });

        document.getElementById('custom-calories').addEventListener('change', (e) => {
            const calories = parseInt(e.target.value);
            if (calories >= 1000 && calories <= 3000) {
                this.userPreferences.dailyCalories = calories;
                document.getElementById('current-calories').textContent = calories;
            }
        });

        // 饮食限制
        document.querySelectorAll('.restrictions-grid input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRestrictions();
            });
        });

        // 更新推荐按钮
        document.getElementById('update-recommendations').addEventListener('click', () => {
            this.updateRecommendations();
        });

        // 餐次筛选
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterRecommendations(e.target.dataset.meal);
            });
        });

        // 清空计划
        document.getElementById('clear-plan').addEventListener('click', () => {
            if (confirm('确定要清空今日计划吗？')) {
                this.clearTodayPlan();
            }
        });

        // 保存计划
        document.getElementById('save-plan').addEventListener('click', () => {
            this.savePlan();
        });

        // 关闭弹窗
        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('recipe-modal').classList.remove('active');
        });

        // 点击弹窗外部关闭
        document.getElementById('recipe-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('recipe-modal')) {
                document.getElementById('recipe-modal').classList.remove('active');
            }
        });

        // 页面加载时恢复设置
        window.addEventListener('load', () => {
            this.restoreSettings();
        });
    }

    // 更新饮食限制偏好
    updateRestrictions() {
        this.userPreferences.restrictions = [];
        const checkboxes = document.querySelectorAll('.restrictions-grid input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            this.userPreferences.restrictions.push(checkbox.id);
        });
    }

    // 智能推荐算法
    getRecommendedRecipes() {
        const dailyCalories = this.userPreferences.dailyCalories;
        const restrictions = this.userPreferences.restrictions;

        // 计算每餐的热量分配（比例可根据用户目标调整）
        const mealRatios = {
            breakfast: 0.25,  // 早餐25%
            lunch: 0.35,      // 午餐35%
            dinner: 0.30,     // 晚餐30%
            snack: 0.10       // 加餐10%
        };

        const recommendedRecipes = {};

        // 为每个餐次推荐食谱
        Object.keys(mealRatios).forEach(mealType => {
            const targetCalories = dailyCalories * mealRatios[mealType];

            // 过滤符合条件的食谱
            let candidates = this.recipes.filter(recipe => {
                // 餐次匹配
                if (recipe.category !== mealType) return false;

                // 热量匹配（允许±50大卡的误差）
                if (Math.abs(recipe.calories - targetCalories) > 50) return false;

                // 饮食限制匹配
                if (restrictions.length > 0) {
                    const recipeTags = recipe.tags || [];
                    return restrictions.every(restriction => {
                        const restrictionMap = {
                            'low-salt': '低盐',
                            'low-fat': '低脂',
                            'kidney-diet': '肾病友好',
                            'vegetarian': '素食'
                        };
                        return recipeTags.includes(restrictionMap[restriction]);
                    });
                }

                return true;
            });

            // 如果没有完全匹配的，放宽热量限制
            if (candidates.length === 0) {
                candidates = this.recipes.filter(recipe => {
                    if (recipe.category !== mealType) return false;
                    if (restrictions.length > 0) {
                        const recipeTags = recipe.tags || [];
                        return restrictions.every(restriction => {
                            const restrictionMap = {
                                'low-salt': '低盐',
                                'low-fat': '低脂',
                                'kidney-diet': '肾病友好',
                                'vegetarian': '素食'
                            };
                            return recipeTags.includes(restrictionMap[restriction]);
                        });
                    }
                    return true;
                });
            }

            // 按热量接近程度排序
            candidates.sort((a, b) => {
                const diffA = Math.abs(a.calories - targetCalories);
                const diffB = Math.abs(b.calories - targetCalories);
                return diffA - diffB;
            });

            // 每个餐次选择2-3个推荐
            recommendedRecipes[mealType] = candidates.slice(0, 3);
        });

        return recommendedRecipes;
    }

    // 更新推荐显示
    updateRecommendations() {
        const container = document.getElementById('recommendations-container');
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在为您智能推荐...</div>';

        // 模拟加载延迟
        setTimeout(() => {
            const recommendations = this.getRecommendedRecipes();
            this.displayRecommendations(recommendations);
        }, 500);
    }

    // 显示推荐食谱
    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations-container');
        let html = '';

        // 合并所有餐次的推荐
        const allRecipes = [];
        Object.values(recommendations).forEach(recipes => {
            recipes.forEach(recipe => {
                if (!allRecipes.find(r => r.id === recipe.id)) {
                    allRecipes.push(recipe);
                }
            });
        });

        if (allRecipes.length === 0) {
            html = '<div class="no-results">没有找到符合条件的食谱，请调整您的设置。</div>';
        } else {
            allRecipes.forEach(recipe => {
                const isAdded = this.isRecipeInPlan(recipe.id);
                const categoryMap = {
                    'breakfast': '早餐',
                    'lunch': '午餐',
                    'dinner': '晚餐',
                    'snack': '加餐'
                };

                html += `
                    <div class="recipe-card" data-recipe-id="${recipe.id}">
                        <div class="recipe-header">
                            <span class="recipe-badge">低升糖指数</span>
                            <h3 class="recipe-title">${recipe.name}</h3>
                            <p class="recipe-description">${recipe.description}</p>
                            <div class="recipe-meta">
                                <span class="recipe-category">${categoryMap[recipe.category] || recipe.category}</span>
                                <span class="recipe-calories">${recipe.calories} 大卡</span>
                            </div>
                        </div>
                        <div class="recipe-nutrition">
                            <span>蛋白质: ${recipe.protein}g</span>
                            <span>碳水: ${recipe.carbs}g</span>
                            <span>脂肪: ${recipe.fat}g</span>
                        </div>
                        <div class="recipe-actions">
                            <button class="action-btn btn-details" onclick="recipeManager.showRecipeDetails(${recipe.id})">
                                <i class="fas fa-info-circle"></i> 查看详情
                            </button>
                            <button class="action-btn ${isAdded ? 'btn-added' : 'btn-add'}"
                                    onclick="recipeManager.toggleRecipePlan(${recipe.id})"
                                    ${isAdded ? 'disabled' : ''}>
                                <i class="fas ${isAdded ? 'fa-check' : 'fa-plus'}"></i>
                                ${isAdded ? '已添加' : '加入今日计划'}
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    }

    // 筛选推荐
    filterRecommendations(mealType) {
        const recommendations = this.getRecommendedRecipes();
        const container = document.getElementById('recommendations-container');

        if (mealType === 'all') {
            this.displayRecommendations(recommendations);
            return;
        }

        const filteredRecipes = recommendations[mealType] || [];

        if (filteredRecipes.length === 0) {
            container.innerHTML = '<div class="no-results">暂无该餐次的推荐食谱。</div>';
        } else {
            const categoryMap = {
                'breakfast': '早餐',
                'lunch': '午餐',
                'dinner': '晚餐',
                'snack': '加餐'
            };

            let html = '';
            filteredRecipes.forEach(recipe => {
                const isAdded = this.isRecipeInPlan(recipe.id);

                html += `
                    <div class="recipe-card" data-recipe-id="${recipe.id}">
                        <div class="recipe-header">
                            <span class="recipe-badge">低升糖指数</span>
                            <h3 class="recipe-title">${recipe.name}</h3>
                            <p class="recipe-description">${recipe.description}</p>
                            <div class="recipe-meta">
                                <span class="recipe-category">${categoryMap[recipe.category] || recipe.category}</span>
                                <span class="recipe-calories">${recipe.calories} 大卡</span>
                            </div>
                        </div>
                        <div class="recipe-nutrition">
                            <span>蛋白质: ${recipe.protein}g</span>
                            <span>碳水: ${recipe.carbs}g</span>
                            <span>脂肪: ${recipe.fat}g</span>
                        </div>
                        <div class="recipe-actions">
                            <button class="action-btn btn-details" onclick="recipeManager.showRecipeDetails(${recipe.id})">
                                <i class="fas fa-info-circle"></i> 查看详情
                            </button>
                            <button class="action-btn ${isAdded ? 'btn-added' : 'btn-add'}"
                                    onclick="recipeManager.toggleRecipePlan(${recipe.id})"
                                    ${isAdded ? 'disabled' : ''}>
                                <i class="fas ${isAdded ? 'fa-check' : 'fa-plus'}"></i>
                                ${isAdded ? '已添加' : '加入今日计划'}
                            </button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }
    }

    // 显示食谱详情
    showRecipeDetails(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const categoryMap = {
            'breakfast': '早餐',
            'lunch': '午餐',
            'dinner': '晚餐',
            'snack': '加餐'
        };

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="recipe-detail">
                <div class="detail-header">
                    <span class="recipe-badge">低升糖指数</span>
                    <h2>${recipe.name}</h2>
                    <div class="detail-meta">
                        <span><i class="fas fa-utensils"></i> ${categoryMap[recipe.category] || recipe.category}</span>
                        <span><i class="fas fa-fire"></i> ${recipe.calories} 大卡</span>
                        <span><i class="fas fa-clock"></i> 准备时间: 15分钟</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> 食谱描述</h3>
                    <p>${recipe.description}</p>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-chart-pie"></i> 营养成分（每份）</h3>
                    <div class="nutrition-grid">
                        <div class="nutrition-item">
                            <div class="nutrition-label">热量</div>
                            <div class="nutrition-value">${recipe.calories} 大卡</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-label">蛋白质</div>
                            <div class="nutrition-value">${recipe.protein}g</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-label">碳水化合物</div>
                            <div class="nutrition-value">${recipe.carbs}g</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-label">脂肪</div>
                            <div class="nutrition-value">${recipe.fat}g</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-label">膳食纤维</div>
                            <div class="nutrition-value">${recipe.fiber}g</div>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-shopping-basket"></i> 食材清单</h3>
                    <ul class="ingredients-list">
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-list-ol"></i> 制作步骤</h3>
                    <div class="instructions">
                        ${recipe.instructions.split('\n').map(step => `<p>${step}</p>`).join('')}
                    </div>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-tags"></i> 标签</h3>
                    <div class="tag-list">
                        ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>

                <div class="detail-actions">
                    <button class="btn-primary" onclick="recipeManager.addRecipeToPlan(${recipe.id})">
                        <i class="fas fa-plus"></i> 加入今日计划
                    </button>
                </div>
            </div>
        `;

        document.getElementById('recipe-modal').classList.add('active');
    }

    // 检查食谱是否已在计划中
    isRecipeInPlan(recipeId) {
        return Object.values(this.todayPlan).some(mealArray =>
            mealArray.some(item => item.id === recipeId)
        );
    }

    // 添加/移除食谱计划
    toggleRecipePlan(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const isAdded = this.isRecipeInPlan(recipeId);

        if (isAdded) {
            this.removeRecipeFromPlan(recipeId);
        } else {
            this.addRecipeToPlan(recipeId);
        }
    }

    // 添加食谱到计划
    addRecipeToPlan(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe || this.isRecipeInPlan(recipeId)) return;

        this.todayPlan[recipe.category].push({
            id: recipe.id,
            name: recipe.name,
            calories: recipe.calories,
            category: recipe.category
        });

        this.savePlanToLocalStorage();
        this.updatePlanDisplay();
        this.updateRecommendations(); // 更新按钮状态
        this.showNotification('食谱已添加到今日计划');
    }

    // 从计划中移除食谱
    removeRecipeFromPlan(recipeId) {
        Object.keys(this.todayPlan).forEach(mealType => {
            this.todayPlan[mealType] = this.todayPlan[mealType].filter(item => item.id !== recipeId);
        });

        this.savePlanToLocalStorage();
        this.updatePlanDisplay();
        this.updateRecommendations(); // 更新按钮状态
        this.showNotification('食谱已从今日计划移除');
    }

    // 更新计划显示
    updatePlanDisplay() {
        // 更新各餐次计划
        const mealContainers = {
            breakfast: document.getElementById('breakfast-plan'),
            lunch: document.getElementById('lunch-plan'),
            dinner: document.getElementById('dinner-plan'),
            snack: document.getElementById('snack-plan')
        };

        Object.keys(mealContainers).forEach(mealType => {
            const container = mealContainers[mealType];
            const items = this.todayPlan[mealType];

            if (items.length === 0) {
                container.innerHTML = '<div class="empty-plan">暂无计划</div>';
                return;
            }

            let html = '';
            items.forEach(item => {
                html += `
                    <div class="plan-item">
                        <div class="plan-item-header">
                            <span class="plan-item-name">${item.name}</span>
                            <span class="plan-item-calories">${item.calories}大卡</span>
                        </div>
                        <button class="plan-item-remove" onclick="recipeManager.removeRecipeFromPlan(${item.id})">
                            <i class="fas fa-times"></i> 移除
                        </button>
                    </div>
                `;
            });

            container.innerHTML = html;
        });

        // 更新统计数据
        const totalCalories = this.getTotalCalories();
        const totalMeals = this.getTotalMeals();
        const goalProgress = Math.min(Math.round((totalCalories / this.userPreferences.dailyCalories) * 100), 100);

        document.getElementById('total-calories').textContent = totalCalories;
        document.getElementById('total-meals').textContent = totalMeals;
        document.getElementById('goal-progress').textContent = `${goalProgress}%`;
        document.getElementById('goal-bar').style.width = `${goalProgress}%`;
    }

    // 获取总热量
    getTotalCalories() {
        return Object.values(this.todayPlan).reduce((total, mealArray) => {
            return total + mealArray.reduce((mealTotal, item) => mealTotal + item.calories, 0);
        }, 0);
    }

    // 获取总餐次数
    getTotalMeals() {
        return Object.values(this.todayPlan).reduce((total, mealArray) => total + mealArray.length, 0);
    }

    // 清空今日计划
    clearTodayPlan() {
        Object.keys(this.todayPlan).forEach(mealType => {
            this.todayPlan[mealType] = [];
        });

        this.savePlanToLocalStorage();
        this.updatePlanDisplay();
        this.updateRecommendations();
        this.showNotification('今日计划已清空');
    }

    // 保存计划
    savePlan() {
        const planData = {
            date: new Date().toISOString().split('T')[0],
            preferences: this.userPreferences,
            plan: this.todayPlan,
            totalCalories: this.getTotalCalories()
        };

        localStorage.setItem('dietPlan', JSON.stringify(planData));
        this.showNotification('计划已保存！');
    }

    // 保存计划到本地存储
    savePlanToLocalStorage() {
        localStorage.setItem('todayPlan', JSON.stringify(this.todayPlan));
    }

    // 从本地存储加载计划
    loadSavedPlan() {
        const saved = localStorage.getItem('todayPlan');
        if (saved) {
            try {
                this.todayPlan = JSON.parse(saved);
            } catch (error) {
                console.error('加载计划失败:', error);
            }
        }
    }

    // 保存设置
    saveSettings() {
        const settings = {
            preferences: this.userPreferences,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('dietSettings', JSON.stringify(settings));
    }

    // 恢复设置
    restoreSettings() {
        const saved = localStorage.getItem('dietSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.userPreferences = settings.preferences || this.userPreferences;

                // 更新UI
                document.getElementById('fasting-range').value = this.userPreferences.fastingTarget;
                document.getElementById('fasting-value').textContent = this.userPreferences.fastingTarget;
                document.getElementById('aftermeal-range').value = this.userPreferences.aftermealTarget;
                document.getElementById('aftermeal-value').textContent = this.userPreferences.aftermealTarget;
                document.getElementById('current-calories').textContent = this.userPreferences.dailyCalories;

                // 更新热量选择
                document.querySelectorAll('.calorie-option').forEach(option => {
                    if (parseInt(option.dataset.calories) === this.userPreferences.dailyCalories) {
                        option.classList.add('active');
                    }
                });

                // 更新饮食限制
                if (this.userPreferences.restrictions) {
                    this.userPreferences.restrictions.forEach(restriction => {
                        const checkbox = document.getElementById(restriction);
                        if (checkbox) checkbox.checked = true;
                    });
                }
            } catch (error) {
                console.error('恢复设置失败:', error);
            }
        }
    }

    // 显示通知
    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // 3秒后移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 300);
        }, 3000);
    }
}

// 添加CSS样式
const additionalStyles = `
    .recipe-detail {
        padding: 20px 0;
    }

    .detail-header {
        margin-bottom: 30px;
    }

    .detail-header h2 {
        margin: 10px 0;
        text-align: left;
        color: var(--primary-dark);
    }

    .detail-header h2::after {
        display: none;
    }

    .detail-meta {
        display: flex;
        gap: 20px;
        color: var(--gray-dark);
        margin-top: 15px;
    }

    .detail-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .detail-section {
        margin-bottom: 30px;
    }

    .detail-section h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--primary-dark);
        margin-bottom: 15px;
    }

    .nutrition-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }

    .nutrition-item {
        background-color: var(--gray-light);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
    }

    .nutrition-label {
        font-size: 0.9rem;
        color: var(--gray-dark);
        margin-bottom: 5px;
    }

    .nutrition-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-color);
    }

    .ingredients-list {
        list-style-type: none;
        padding-left: 0;
    }

    .ingredients-list li {
        padding: 8px 0;
        border-bottom: 1px solid var(--gray-light);
        position: relative;
        padding-left: 25px;
    }

    .ingredients-list li::before {
        content: "•";
        color: var(--primary-color);
        position: absolute;
        left: 10px;
        font-size: 1.5rem;
    }

    .instructions {
        line-height: 1.8;
    }

    .instructions p {
        margin-bottom: 10px;
    }

    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .tag {
        background-color: var(--primary-light);
        color: var(--primary-dark);
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.85rem;
    }

    .detail-actions {
        margin-top: 30px;
        text-align: center;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

// 将样式添加到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 初始化应用
const recipeManager = new RecipeManager();