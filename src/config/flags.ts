// ==================== 全局标志位配置 ====================
// 这个文件用于统一管理各种功能开关，方便在一个地方修改

// 清除数据开关：1=清除旧数据，0=正常加载
export const CLEAR_DATA_FLAG: number = 0;
// CLEAR_DATA_FLAG = 1 → 清除所有旧数据
// CLEAR_DATA_FLAG = 0 → 正常加载数据（当前状态）

// 抠图模式：0=使用Gemini抠图，1=使用PHOTOROOM抠图，2=不抠图使用原图
export const REMOVE_BG_FLAG: number = 0;
// REMOVE_BG_FLAG = 0 → Gemini抠图(通过OpenRouter)
// REMOVE_BG_FLAG = 1 → PHOTOROOM抠图
// REMOVE_BG_FLAG = 2 → 不抠图使用原图

// 识图API模式：0=豆包API，1=Gemini（通过OpenRouter中转）
export const RECOGNIZE_API_FLAG: number = 1;
// RECOGNIZE_API_FLAG = 0 → 豆包 API (Doubao-Seed-1.6-lite)
// RECOGNIZE_API_FLAG = 1 → Gemini API (通过OpenRouter中转，使用gemini-2.5-flash-lite)

// 每个单词最多保存的图片数量
export const MAX_IMAGES_PER_WORD: number = 6;

// 游客模式下最多收集的图片总数（超过后强制登录）
export const MAX_GUEST_IMAGES: number = 5;
