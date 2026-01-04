// 糖尿病食谱系统
class DiabetesRecipeSystem {
    constructor() {
        this.recipes = this.getRecipeDatabase();
        this.selectedRecipes = [];
        this.currentMeal = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateRangeOutputs();
        this.generateInitialRecipes();
        toastr.options = {
            positionClass: 'toast-top-right',
            progressBar: true,
            timeOut: 3000
        };
    }

    setupEventListeners() {
        // 血糖目标滑块
        document.getElementById('targetFasting').addEventListener('input', (e) => {
            document.getElementById('fastingOutput').textContent = e.target.value;
        });

        document.getElementById('targetPostmeal').addEventListener('input', (e) => {
            document.getElementById('postmealOutput').textContent = e.target.value;
        });

        // 餐次过滤按钮
        document.querySelectorAll('.meal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMeal = e.target.dataset.meal;
                this.filterRecipesByMeal();
            });
        });

        // 热量需求变化
        document.getElementById('calorieGoal').addEventListener('change', () => {
            this.updateNutritionGoals();
            this.filterRecipesByCalories();
        });

        // 食物交换份计算器
        document.getElementById('calculateExchange').addEventListener('click', () => {
            this.calculateFoodExchange();
        });

        // 模拟添加食谱到今日计划
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-plan')) {
                const recipeId = parseInt(e.target.dataset.id);
                this.addRecipeToPlan(recipeId);
            }
        });
    }

    updateRangeOutputs() {
        const fastingInput = document.getElementById('targetFasting');
        const postmealInput = document.getElementById('targetPostmeal');
        document.getElementById('fastingOutput').textContent = fastingInput.value;
        document.getElementById('postmealOutput').textContent = postmealInput.value;
    }

    getRecipeDatabase() {
        return [
            {
                id: 1,
                name: "杂粮燕麦粥",
                description: "低GI早餐，富含膳食纤维，缓慢升糖",
                mealType: "breakfast",
                calories: 280,
                carbs: 45,
                protein: 12,
                fiber: 8,
                giLevel: "low",
                ingredients: ["燕麦片50g", "杂粮米30g", "牛奶150ml", "核桃仁2个", "蓝莓少许"],
                tags: ["低GI", "高纤维", "快手早餐"]
            },
            {
                id: 2,
                name: "清蒸鲈鱼配糙米饭",
                description: "优质蛋白搭配复合碳水，营养均衡",
                mealType: "lunch",
                calories: 420,
                carbs: 55,
                protein: 35,
                fiber: 6,
                giLevel: "low",
                ingredients: ["鲈鱼200g", "糙米80g", "西兰花100g", "香菇50g", "姜丝少许"],
                tags: ["优质蛋白", "低脂", "控糖主食"]
            },
            {
                id: 3,
                name: "凉拌鸡丝荞麦面",
                description: "荞麦面GI值低，鸡丝提供优质蛋白",
                mealType: "lunch",
                calories: 380,
                carbs: 50,
                protein: 28,
                fiber: 7,
                giLevel: "low",
                ingredients: ["荞麦面80g", "鸡胸肉150g", "黄瓜丝50g", "胡萝卜丝30g", "芝麻酱1勺"],
                tags: ["低GI主食", "高蛋白", "夏日优选"]
            },
            {
                id: 4,
                name: "豆腐蔬菜汤",
                description: "低卡高蛋白，适合晚餐或加餐",
                mealType: "dinner",
                calories: 180,
                carbs: 12,
                protein: 15,
                fiber: 5,
                giLevel: "low",
                ingredients: ["嫩豆腐150g", "小白菜100g", "香菇3朵", "海带少许", "葱花适量"],
                tags: ["低卡", "高蛋白", "清淡"]
            },
            {
                id: 5,
                name: "希腊酸奶坚果杯",
                description: "优质蛋白和健康脂肪，完美加餐",
                mealType: "snack",
                calories: 220,
                carbs: 18,
                protein: 20,
                fiber: 4,
                giLevel: "low",
                ingredients: ["希腊酸奶150g", "杏仁10颗", "奇亚籽1勺", "草莓3个"],
                tags: ["高蛋白", "健康脂肪", "便捷加餐"]
            },
            {
                id: 6,
                name: "虾仁炒杂蔬",
                description: "高蛋白低脂肪，富含微量元素",
                mealType: "dinner",
                calories: 320,
                carbs: 25,
                protein: 30,
                fiber: 8,
                giLevel: "low",
                ingredients: ["虾仁200g", "彩椒100g", "芦笋80g", "木耳50g", "蒜末少许"],
                tags: ["高蛋白", "低脂", "富含纤维"]
            }
        ];
    }

    generateInitialRecipes() {
        this.selectedRecipes = [...this.recipes];
        this.renderRecipes();
        this.updateNutritionSummary();
    }

    filterRecipesByMeal() {
        if (this.currentMeal === 'all') {
            this.selectedRecipes = [...this.recipes];
        } else {
            this.selectedRecipes = this.recipes.filter(recipe =>
                recipe.mealType === this.currentMeal
            );
        }
        this.renderRecipes();
    }

    filterRecipesByCalories() {
        const calorieGoal = parseInt(document.getElementById('calorieGoal').value);
        // 这里可以根据热量目标进一步筛选食谱
        // 当前版本显示所有食谱
    }

    renderRecipes() {
        const container = document.getElementById('recipesContainer');

        if (this.selectedRecipes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>暂无相关食谱</h3>
                    <p>请调整筛选条件或尝试其他餐次</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.selectedRecipes.map(recipe => `
            <div class="recipe-card">
                <div class="recipe-header">
                    <span class="gi-badge gi-${recipe.giLevel}">
                        <i class="fas fa-seedling"></i>
                        ${recipe.giLevel === 'low' ? '低升糖指数' : '中升糖指数'}
                    </span>
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <p class="recipe-desc">${recipe.description}</p>
                    <div class="recipe-info">
                        <span><i class="fas fa-utensils"></i> ${this.getMealName(recipe.mealType)}</span>
                        <span><i class="fas fa-fire"></i> ${recipe.calories} 大卡</span>
                    </div>
                </div>

                <div class="recipe-body">
                    <div class="ingredients">
                        <h4><i class="fas fa-carrot"></i> 食材清单</h4>
                        <ul>
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="nutrition-facts">
                        <h4><i class="fas fa-chart-bar"></i> 营养信息（每份）</h4>
                        <div class="fact-grid">
                            <div class="fact-item">
                                <div class="fact-label">碳水</div>
                                <div class="fact-value">${recipe.carbs}g</div>
                            </div>
                            <div class="fact-item">
                                <div class="fact-label">蛋白质</div>
                                <div class="fact-value">${recipe.protein}g</div>
                            </div>
                            <div class="fact-item">
                                <div class="fact-label">膳食纤维</div>
                                <div class="fact-value">${recipe.fiber}g</div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button class="add-to-plan btn btn-primary" data-id="${recipe.id}" style="flex: 1;">
                            <i class="fas fa-plus-circle"></i> 加入今日计划
                        </button>
                        <button class="btn" onclick="viewRecipeDetail(${recipe.id})" style="flex: 1;">
                            <i class="fas fa-eye"></i> 查看详情
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getMealName(mealType) {
        const meals = {
            breakfast: '早餐',
            lunch: '午餐',
            dinner: '晚餐',
            snack: '加餐'
        };
        return meals[mealType] || mealType;
    }

    updateNutritionSummary() {
        // 计算所选食谱的总营养
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFiber = 0;

        this.selectedRecipes.forEach(recipe => {
            totalCarbs += recipe.carbs;
            totalProtein += recipe.protein;
            totalFiber += recipe.fiber;
        });

        // 更新显示
        document.getElementById('carbsValue').textContent = `${totalCarbs}g`;
        document.getElementById('proteinValue').textContent = `${totalProtein}g`;
        document.getElementById('fiberValue').textContent = `${totalFiber}g`;

        // 更新进度条
        const carbsPercent = Math.min((totalCarbs / 150) * 100, 100);
        const proteinPercent = Math.min((totalProtein / 80) * 100, 100);
        const fiberPercent = Math.min((totalFiber / 30) * 100, 100);

        document.getElementById('carbsBar').style.width = `${carbsPercent}%`;
        document.getElementById('proteinBar').style.width = `${proteinPercent}%`;
        document.getElementById('fiberBar').style.width = `${fiberPercent}%`;
    }

    calculateFoodExchange() {
        const foodInput = document.getElementById('foodInput').value.trim();
        if (!foodInput) {
            toastr.warning('请输入食物名称');
            return;
        }

        // 模拟食物交换份数据库
        const foodExchangeDB = {
            '米饭': { exchange: 1, unit: '小碗', carbs: 25 },
            '馒头': { exchange: 1, unit: '1个', carbs: 25 },
            '面条': { exchange: 1, unit: '1小碗', carbs: 25 },
            '苹果': { exchange: 0.5, unit: '1个中等大小', carbs: 15 },
            '牛奶': { exchange: 0.5, unit: '250ml', carbs: 12 },
            '鸡蛋': { exchange: 0, unit: '1个', carbs: 0 },
            '瘦肉': { exchange: 0, unit: '50g', carbs: 0 }
        };

        const food = foodExchangeDB[foodInput];
        const resultDiv = document.getElementById('exchangeResult');

        if (food) {
            resultDiv.innerHTML = `
                <strong>${foodInput}</strong> 的食物交换份计算：
                <div style="margin-top: 10px; background: white; padding: 15px; border-radius: 8px;">
                    <div>• 约相当于 <span style="color: #4CAF50; font-weight: bold;">${food.exchange}</span> 个主食交换份</div>
                    <div>• 通常份量：${food.unit}</div>
                    <div>• 约含碳水化合物：${food.carbs}g</div>
                    <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                        <i class="fas fa-lightbulb"></i> 1个主食交换份 ≈ 25g碳水化合物
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                未找到"${foodInput}"的精确数据，参考信息：
                <div style="margin-top: 10px; background: #FFF3E0; padding: 15px; border-radius: 8px;">
                    <div>• 一般谷薯类：1交换份 ≈ 25g碳水化合物</div>
                    <div>• 水果类：1交换份 ≈ 20g碳水化合物</div>
                    <div>• 奶类：1交换份 ≈ 12g碳水化合物</div>
                    <div style="margin-top: 10px; color: #666; font-size: 0.9rem;">
                        建议咨询营养师获取精确数据
                    </div>
                </div>
            `;
        }
    }

    addRecipeToPlan(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (recipe) {
            // 保存到本地存储
            let mealPlan = JSON.parse(localStorage.getItem('diabetes_meal_plan') || '[]');
            mealPlan.push({
                recipeId,
                addedAt: new Date().toISOString(),
                mealType: recipe.mealType
            });
            localStorage.setItem('diabetes_meal_plan', JSON.stringify(mealPlan));

            toastr.success(`"${recipe.name}" 已加入今日计划`);
            this.updateNutritionSummary();
        }
    }

    updateNutritionGoals() {
        const calorieGoal = parseInt(document.getElementById('calorieGoal').value);
        // 根据热量目标更新碳水化合物建议量
        const carbsGoal = Math.round(calorieGoal * 0.5 / 4); // 50%热量来自碳水

        document.querySelectorAll('.nutrition-card small').forEach(card => {
            if (card.textContent.includes('建议')) {
                card.innerHTML = `建议: ${carbsGoal - 20}-${carbsGoal + 20}g`;
            }
        });
    }
}

// 查看食谱详情函数
function viewRecipeDetail(recipeId) {
    const system = window.diabetesSystem;
    const recipe = system.recipes.find(r => r.id === recipeId);

    if (recipe) {
        alert(`
            🍽️ ${recipe.name}

            ${recipe.description}

            📊 营养信息（每份）：
            • 热量：${recipe.calories} 大卡
            • 碳水化合物：${recipe.carbs}g
            • 蛋白质：${recipe.protein}g
            • 膳食纤维：${recipe.fiber}g

            🥗 主要食材：
            ${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}

            💡 控糖小贴士：
            建议搭配适量蔬菜，控制总摄入量，餐后适当活动。
        `);
    }
}

// 页面加载完成后初始化
let diabetesSystem;
document.addEventListener('DOMContentLoaded', () => {
    diabetesSystem = new DiabetesRecipeSystem();
    window.diabetesSystem = diabetesSystem;
});

// 添加食物交换份计算快捷方式
document.getElementById('foodInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        diabetesSystem.calculateFoodExchange();
    }
});