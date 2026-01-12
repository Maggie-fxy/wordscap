// 单词库配置 - 场景和年龄分级

// 年龄分级
export type AgeGroup = 'preschool' | 'primary_low' | 'primary_high';

export const AGE_GROUPS = {
  preschool: { label: '学龄前 (3-6岁)', minAge: 3, maxAge: 6 },
  primary_low: { label: '小学低年级 (7-9岁)', minAge: 7, maxAge: 9 },
  primary_high: { label: '小学高年级 (10-12岁)', minAge: 10, maxAge: 12 },
} as const;

// 场景分类
export type SceneType = 
  | 'home'      // 家庭
  | 'school'    // 学校
  | 'outdoor'   // 户外
  | 'market'    // 超市/商店
  | 'park'      // 公园/游乐场
  | 'restaurant'; // 餐厅

export const SCENES = {
  home: { 
    label: '家庭', 
    emoji: '🏠',
    categories: ['food', 'daily', 'furniture', 'clothing', 'electronics', 'kitchen']
  },
  school: { 
    label: '学校', 
    emoji: '🏫',
    categories: ['study', 'clothing', 'food']
  },
  outdoor: { 
    label: '户外', 
    emoji: '🌳',
    categories: ['nature', 'animals', 'tools']
  },
  market: { 
    label: '超市', 
    emoji: '🛒',
    categories: ['food', 'daily', 'toys']
  },
  park: { 
    label: '公园', 
    emoji: '🎢',
    categories: ['toys', 'nature', 'animals']
  },
  restaurant: { 
    label: '餐厅', 
    emoji: '🍽️',
    categories: ['food', 'kitchen', 'daily']
  },
} as const;

// 根据年龄获取推荐难度
export function getDifficultyByAge(age: number): (1 | 2 | 3)[] {
  if (age <= 6) return [1]; // 学龄前只显示简单词
  if (age <= 9) return [1, 2]; // 低年级显示简单和中等
  return [1, 2, 3]; // 高年级显示全部
}

// 扩展词库建议 - 针对12岁以内儿童的高频场景词
export const SUGGESTED_WORDS = {
  // 家庭场景 - 学龄前
  home_preschool: [
    { word: 'TOY', cn: '玩具' },
    { word: 'BALL', cn: '球' },
    { word: 'DOLL', cn: '娃娃' },
    { word: 'CAR', cn: '小汽车' },
    { word: 'BEAR', cn: '小熊' },
    { word: 'BED', cn: '床' },
    { word: 'MILK', cn: '牛奶' },
    { word: 'COOKIE', cn: '饼干' },
  ],
  
  // 学校场景 - 小学低年级
  school_primary_low: [
    { word: 'PENCIL', cn: '铅笔' },
    { word: 'BOOK', cn: '书' },
    { word: 'RULER', cn: '尺子' },
    { word: 'ERASER', cn: '橡皮' },
    { word: 'SCISSORS', cn: '剪刀' },
    { word: 'GLUE', cn: '胶水' },
    { word: 'BACKPACK', cn: '书包' },
    { word: 'CRAYON', cn: '蜡笔' },
  ],
  
  // 超市场景 - 通用
  market_all: [
    { word: 'APPLE', cn: '苹果' },
    { word: 'BANANA', cn: '香蕉' },
    { word: 'CARROT', cn: '胡萝卜' },
    { word: 'TOMATO', cn: '番茄' },
    { word: 'BREAD', cn: '面包' },
    { word: 'CHEESE', cn: '奶酪' },
    { word: 'YOGURT', cn: '酸奶' },
    { word: 'JUICE', cn: '果汁' },
  ],
  
  // 公园/户外 - 通用
  outdoor_all: [
    { word: 'TREE', cn: '树' },
    { word: 'FLOWER', cn: '花' },
    { word: 'GRASS', cn: '草' },
    { word: 'BIRD', cn: '小鸟' },
    { word: 'DOG', cn: '狗' },
    { word: 'CAT', cn: '猫' },
    { word: 'BUTTERFLY', cn: '蝴蝶' },
    { word: 'CLOUD', cn: '云' },
  ],
};

// 获取场景对应的单词分类
export function getCategoriesByScene(scene: SceneType): string[] {
  return [...(SCENES[scene]?.categories || [])];
}
