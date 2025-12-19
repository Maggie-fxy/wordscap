// 单词数据类型
export interface Word {
  id: string;
  word: string;
  cn: string;
  hint: string; // 提示词
  category: string;
  difficulty: 1 | 2 | 3;
  pronunciation?: string; // 音标
}

// 游戏模式
export type GameMode = 'HUNTER' | 'REVIEW' | 'WORDBOOK';

// 游戏阶段
export type GamePhase = 'IDLE' | 'CAMERA' | 'ANALYZING' | 'SUCCESS' | 'FAILED' | 'COMPLETED';

// 复习模式阶段
export type ReviewPhase = 'CHOICE' | 'SPELLING' | 'RESULT';

// 收集的图片
export interface CollectedImage {
  url: string;
  capturedAt: Date;
  detectedObject: string;
  wordId: string; // 关联的单词ID
}

// 单词学习记录
export interface WordRecord {
  wordId: string;
  images: CollectedImage[]; // 收集的照片
  choiceCorrect: number; // 选择题正确次数
  spellingCorrect: number; // 默写正确次数
  lastReviewAt?: Date;
  mastered: boolean; // 是否已掌握
}

// AI 识别结果
export interface AIRecognitionResult {
  is_match: boolean;
  detected_object_en: string;
  detected_object_cn: string;
  feedback: string;
}

// 用户数据
export interface UserData {
  diamonds: number; // 钻石数量
  wordRecords: Record<string, WordRecord>; // 单词学习记录
  totalCollected: number; // 总收集数
}

// 游戏状态
export interface GameState {
  mode: GameMode;
  phase: GamePhase;
  currentWord: Word | null;
  collectedImages: CollectedImage[]; // 当前单词收集的图片
  isLoading: boolean;
  error: string | null;
  lastResult: AIRecognitionResult | null;
  capturedImageUrl: string | null;
  // 用户数据
  userData: UserData;
  // 复习模式
  reviewPhase: ReviewPhase;
  reviewWord: Word | null;
  reviewOptions: Word[];
  reviewAnswer: string;
  showHint: boolean;
}

// 游戏动作
export type GameAction =
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'SET_WORD'; payload: Word }
  | { type: 'START_CAMERA' }
  | { type: 'STOP_CAMERA' }
  | { type: 'CAPTURE_IMAGE'; payload: string }
  | { type: 'START_ANALYZING' }
  | { type: 'ANALYSIS_SUCCESS'; payload: { result: AIRecognitionResult; imageUrl: string } }
  | { type: 'ANALYSIS_FAILED'; payload: AIRecognitionResult }
  | { type: 'FORCE_SUCCESS'; payload: string }
  | { type: 'RETRY' }
  | { type: 'NEXT_WORD'; payload: Word }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'ADD_DIAMOND' }
  | { type: 'USE_HINT' }
  | { type: 'TOGGLE_HINT' }
  // 复习模式
  | { type: 'START_REVIEW'; payload: { word: Word; options: Word[] } }
  | { type: 'ANSWER_CHOICE'; payload: string }
  | { type: 'ANSWER_SPELLING'; payload: string }
  | { type: 'NEXT_REVIEW' }
  // 数据持久化
  | { type: 'LOAD_USER_DATA'; payload: UserData }
  | { type: 'SAVE_WORD_RECORD'; payload: WordRecord };
