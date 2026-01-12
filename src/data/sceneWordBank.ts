import { Word } from "@/types";

// 按场景分类的扩展词库
// 每个场景至少30个词，适合3-12岁儿童

// ===== 🏠 家庭场景 (35个) =====
export const HOME_WORDS: Word[] = [
  // 食物
  { id: 'h1', word: "APPLE", cn: "苹果", hint: "红色的水果", category: "home", difficulty: 1 },
  { id: 'h2', word: "BANANA", cn: "香蕉", hint: "黄色弯弯的水果", category: "home", difficulty: 1 },
  { id: 'h3', word: "BREAD", cn: "面包", hint: "早餐常吃的", category: "home", difficulty: 1 },
  { id: 'h4', word: "MILK", cn: "牛奶", hint: "白色的饮料", category: "home", difficulty: 1 },
  { id: 'h5', word: "EGG", cn: "鸡蛋", hint: "椭圆形的食物", category: "home", difficulty: 1 },
  { id: 'h6', word: "RICE", cn: "米饭", hint: "中国人的主食", category: "home", difficulty: 1 },
  { id: 'h7', word: "COOKIE", cn: "饼干", hint: "甜甜的小点心", category: "home", difficulty: 1 },
  // 日用品
  { id: 'h8', word: "CUP", cn: "杯子", hint: "喝水用的", category: "home", difficulty: 1 },
  { id: 'h9', word: "TOWEL", cn: "毛巾", hint: "擦手擦脸的", category: "home", difficulty: 1 },
  { id: 'h10', word: "SOAP", cn: "肥皂", hint: "洗手用的", category: "home", difficulty: 1 },
  { id: 'h11', word: "TOOTHBRUSH", cn: "牙刷", hint: "刷牙用的", category: "home", difficulty: 2 },
  { id: 'h12', word: "COMB", cn: "梳子", hint: "梳头发用的", category: "home", difficulty: 1 },
  { id: 'h13', word: "CLOCK", cn: "时钟", hint: "看时间的", category: "home", difficulty: 1 },
  { id: 'h14', word: "KEY", cn: "钥匙", hint: "开门用的", category: "home", difficulty: 1 },
  // 家具
  { id: 'h15', word: "BED", cn: "床", hint: "睡觉的地方", category: "home", difficulty: 1 },
  { id: 'h16', word: "CHAIR", cn: "椅子", hint: "坐的家具", category: "home", difficulty: 1 },
  { id: 'h17', word: "TABLE", cn: "桌子", hint: "吃饭放东西的", category: "home", difficulty: 1 },
  { id: 'h18', word: "SOFA", cn: "沙发", hint: "软软的坐具", category: "home", difficulty: 1 },
  { id: 'h19', word: "LAMP", cn: "灯", hint: "照明用的", category: "home", difficulty: 1 },
  { id: 'h20', word: "DOOR", cn: "门", hint: "进出房间的", category: "home", difficulty: 1 },
  { id: 'h21', word: "WINDOW", cn: "窗户", hint: "看外面的", category: "home", difficulty: 1 },
  { id: 'h22', word: "PILLOW", cn: "枕头", hint: "睡觉垫头的", category: "home", difficulty: 2 },
  { id: 'h23', word: "BLANKET", cn: "毯子", hint: "盖身上保暖的", category: "home", difficulty: 2 },
  // 电子产品
  { id: 'h24', word: "TV", cn: "电视", hint: "看节目的", category: "home", difficulty: 1 },
  { id: 'h25', word: "PHONE", cn: "手机", hint: "打电话的", category: "home", difficulty: 1 },
  { id: 'h26', word: "REMOTE", cn: "遥控器", hint: "控制电视的", category: "home", difficulty: 2 },
  { id: 'h27', word: "FAN", cn: "风扇", hint: "吹风凉快的", category: "home", difficulty: 1 },
  // 衣物
  { id: 'h28', word: "SHOE", cn: "鞋子", hint: "穿在脚上的", category: "home", difficulty: 1 },
  { id: 'h29', word: "SOCK", cn: "袜子", hint: "穿在鞋里的", category: "home", difficulty: 1 },
  { id: 'h30', word: "HAT", cn: "帽子", hint: "戴在头上的", category: "home", difficulty: 1 },
  { id: 'h31', word: "COAT", cn: "外套", hint: "穿在外面的衣服", category: "home", difficulty: 1 },
  { id: 'h32', word: "SLIPPERS", cn: "拖鞋", hint: "在家穿的鞋", category: "home", difficulty: 2 },
  // 厨房
  { id: 'h33', word: "BOWL", cn: "碗", hint: "盛饭盛汤的", category: "home", difficulty: 1 },
  { id: 'h34', word: "SPOON", cn: "勺子", hint: "舀东西吃的", category: "home", difficulty: 1 },
  { id: 'h35', word: "FRIDGE", cn: "冰箱", hint: "保鲜食物的", category: "home", difficulty: 1 },
];

// ===== 🏫 学校场景 (35个) =====
export const SCHOOL_WORDS: Word[] = [
  // 学习用品
  { id: 's1', word: "BOOK", cn: "书", hint: "读书学习用的", category: "school", difficulty: 1 },
  { id: 's2', word: "PEN", cn: "钢笔", hint: "写字用的", category: "school", difficulty: 1 },
  { id: 's3', word: "PENCIL", cn: "铅笔", hint: "可以擦掉的笔", category: "school", difficulty: 1 },
  { id: 's4', word: "ERASER", cn: "橡皮", hint: "擦铅笔字的", category: "school", difficulty: 1 },
  { id: 's5', word: "RULER", cn: "尺子", hint: "量长度画线的", category: "school", difficulty: 1 },
  { id: 's6', word: "PAPER", cn: "纸", hint: "写字画画用的", category: "school", difficulty: 1 },
  { id: 's7', word: "DESK", cn: "书桌", hint: "学习的桌子", category: "school", difficulty: 1 },
  { id: 's8', word: "NOTEBOOK", cn: "笔记本", hint: "记笔记的本子", category: "school", difficulty: 1 },
  { id: 's9', word: "BACKPACK", cn: "书包", hint: "背在背上的包", category: "school", difficulty: 1 },
  { id: 's10', word: "SCISSORS", cn: "剪刀", hint: "剪东西的工具", category: "school", difficulty: 2 },
  { id: 's11', word: "GLUE", cn: "胶水", hint: "粘东西的", category: "school", difficulty: 2 },
  { id: 's12', word: "CRAYON", cn: "蜡笔", hint: "画画的彩色笔", category: "school", difficulty: 1 },
  { id: 's13', word: "MARKER", cn: "马克笔", hint: "彩色的粗笔", category: "school", difficulty: 2 },
  { id: 's14', word: "FOLDER", cn: "文件夹", hint: "装文件的", category: "school", difficulty: 2 },
  { id: 's15', word: "TAPE", cn: "胶带", hint: "粘东西的带子", category: "school", difficulty: 2 },
  { id: 's16', word: "STAPLER", cn: "订书机", hint: "订纸的工具", category: "school", difficulty: 2 },
  { id: 's17', word: "CALCULATOR", cn: "计算器", hint: "算数用的", category: "school", difficulty: 2 },
  { id: 's18', word: "GLOBE", cn: "地球仪", hint: "圆形的地球模型", category: "school", difficulty: 2 },
  { id: 's19', word: "MAP", cn: "地图", hint: "看位置的图", category: "school", difficulty: 2 },
  { id: 's20', word: "DICTIONARY", cn: "词典", hint: "查单词的书", category: "school", difficulty: 2 },
  // 教室设施
  { id: 's21', word: "CHAIR", cn: "椅子", hint: "坐的家具", category: "school", difficulty: 1 },
  { id: 's22', word: "BLACKBOARD", cn: "黑板", hint: "老师写字的", category: "school", difficulty: 2 },
  { id: 's23', word: "CHALK", cn: "粉笔", hint: "在黑板上写字的", category: "school", difficulty: 2 },
  { id: 's24', word: "CLOCK", cn: "时钟", hint: "看时间的", category: "school", difficulty: 1 },
  { id: 's25', word: "FLAG", cn: "旗子", hint: "飘扬的布", category: "school", difficulty: 1 },
  // 食物（学校午餐）
  { id: 's26', word: "APPLE", cn: "苹果", hint: "红色的水果", category: "school", difficulty: 1 },
  { id: 's27', word: "SANDWICH", cn: "三明治", hint: "两片面包夹东西", category: "school", difficulty: 2 },
  { id: 's28', word: "JUICE", cn: "果汁", hint: "水果做的饮料", category: "school", difficulty: 1 },
  { id: 's29', word: "WATER", cn: "水", hint: "透明的液体", category: "school", difficulty: 1 },
  { id: 's30', word: "LUNCH BOX", cn: "午餐盒", hint: "装午餐的盒子", category: "school", difficulty: 2 },
  // 衣物
  { id: 's31', word: "UNIFORM", cn: "校服", hint: "学校穿的衣服", category: "school", difficulty: 2 },
  { id: 's32', word: "SHOE", cn: "鞋子", hint: "穿在脚上的", category: "school", difficulty: 1 },
  { id: 's33', word: "BAG", cn: "包", hint: "装东西的", category: "school", difficulty: 1 },
  { id: 's34', word: "BADGE", cn: "徽章", hint: "别在衣服上的", category: "school", difficulty: 2 },
  { id: 's35', word: "GLASSES", cn: "眼镜", hint: "戴在眼睛上的", category: "school", difficulty: 1 },
];

// ===== 🌳 户外场景 (35个) =====
export const OUTDOOR_WORDS: Word[] = [
  // 自然
  { id: 'o1', word: "TREE", cn: "树", hint: "高高的绿色植物", category: "outdoor", difficulty: 1 },
  { id: 'o2', word: "FLOWER", cn: "花", hint: "漂亮的植物", category: "outdoor", difficulty: 1 },
  { id: 'o3', word: "GRASS", cn: "草", hint: "绿色的地面植物", category: "outdoor", difficulty: 1 },
  { id: 'o4', word: "LEAF", cn: "叶子", hint: "树上的绿色部分", category: "outdoor", difficulty: 1 },
  { id: 'o5', word: "STONE", cn: "石头", hint: "硬硬的自然物", category: "outdoor", difficulty: 1 },
  { id: 'o6', word: "CLOUD", cn: "云", hint: "天上白白的", category: "outdoor", difficulty: 1 },
  { id: 'o7', word: "SUN", cn: "太阳", hint: "天上发光发热的", category: "outdoor", difficulty: 1 },
  { id: 'o8', word: "MOON", cn: "月亮", hint: "晚上出来的", category: "outdoor", difficulty: 1 },
  { id: 'o9', word: "STAR", cn: "星星", hint: "夜晚闪闪的", category: "outdoor", difficulty: 1 },
  { id: 'o10', word: "RAIN", cn: "雨", hint: "从天上落下的水", category: "outdoor", difficulty: 1 },
  { id: 'o11', word: "SNOW", cn: "雪", hint: "白色的冬天飘落物", category: "outdoor", difficulty: 1 },
  { id: 'o12', word: "RIVER", cn: "河", hint: "流动的水", category: "outdoor", difficulty: 2 },
  { id: 'o13', word: "MOUNTAIN", cn: "山", hint: "高高的地形", category: "outdoor", difficulty: 2 },
  // 动物
  { id: 'o14', word: "BIRD", cn: "鸟", hint: "在天上飞的", category: "outdoor", difficulty: 1 },
  { id: 'o15', word: "DOG", cn: "狗", hint: "汪汪叫的", category: "outdoor", difficulty: 1 },
  { id: 'o16', word: "CAT", cn: "猫", hint: "喵喵叫的", category: "outdoor", difficulty: 1 },
  { id: 'o17', word: "BUTTERFLY", cn: "蝴蝶", hint: "漂亮翅膀的昆虫", category: "outdoor", difficulty: 2 },
  { id: 'o18', word: "BEE", cn: "蜜蜂", hint: "采蜜的昆虫", category: "outdoor", difficulty: 2 },
  { id: 'o19', word: "ANT", cn: "蚂蚁", hint: "很小的昆虫", category: "outdoor", difficulty: 1 },
  { id: 'o20', word: "DUCK", cn: "鸭子", hint: "嘎嘎叫会游泳", category: "outdoor", difficulty: 1 },
  { id: 'o21', word: "FROG", cn: "青蛙", hint: "呱呱叫的绿色动物", category: "outdoor", difficulty: 2 },
  { id: 'o22', word: "FISH", cn: "鱼", hint: "在水里游的", category: "outdoor", difficulty: 1 },
  { id: 'o23', word: "SNAIL", cn: "蜗牛", hint: "背着壳慢慢爬", category: "outdoor", difficulty: 2 },
  { id: 'o24', word: "SPIDER", cn: "蜘蛛", hint: "织网的八脚虫", category: "outdoor", difficulty: 2 },
  { id: 'o25', word: "RABBIT", cn: "兔子", hint: "长耳朵的小动物", category: "outdoor", difficulty: 1 },
  // 工具
  { id: 'o26', word: "UMBRELLA", cn: "雨伞", hint: "下雨时撑的", category: "outdoor", difficulty: 1 },
  { id: 'o27', word: "FLASHLIGHT", cn: "手电筒", hint: "照亮黑暗的", category: "outdoor", difficulty: 2 },
  { id: 'o28', word: "ROPE", cn: "绳子", hint: "绑东西的", category: "outdoor", difficulty: 2 },
  { id: 'o29', word: "BUCKET", cn: "桶", hint: "装水的容器", category: "outdoor", difficulty: 2 },
  { id: 'o30', word: "SHOVEL", cn: "铲子", hint: "挖土的工具", category: "outdoor", difficulty: 2 },
  { id: 'o31', word: "NET", cn: "网", hint: "捕东西的", category: "outdoor", difficulty: 2 },
  { id: 'o32', word: "TENT", cn: "帐篷", hint: "野外睡觉的", category: "outdoor", difficulty: 2 },
  { id: 'o33', word: "COMPASS", cn: "指南针", hint: "指方向的", category: "outdoor", difficulty: 3 },
  { id: 'o34', word: "BINOCULARS", cn: "望远镜", hint: "看远处的", category: "outdoor", difficulty: 3 },
  { id: 'o35', word: "CAMERA", cn: "相机", hint: "拍照用的", category: "outdoor", difficulty: 1 },
];

// ===== 🛒 超市场景 (35个) =====
export const MARKET_WORDS: Word[] = [
  // 水果蔬菜
  { id: 'm1', word: "APPLE", cn: "苹果", hint: "红色的水果", category: "market", difficulty: 1 },
  { id: 'm2', word: "BANANA", cn: "香蕉", hint: "黄色弯弯的", category: "market", difficulty: 1 },
  { id: 'm3', word: "ORANGE", cn: "橙子", hint: "圆圆的橙色水果", category: "market", difficulty: 1 },
  { id: 'm4', word: "GRAPE", cn: "葡萄", hint: "一串串的小果子", category: "market", difficulty: 1 },
  { id: 'm5', word: "WATERMELON", cn: "西瓜", hint: "大大圆圆绿色的", category: "market", difficulty: 2 },
  { id: 'm6', word: "STRAWBERRY", cn: "草莓", hint: "红色小巧的水果", category: "market", difficulty: 2 },
  { id: 'm7', word: "CARROT", cn: "胡萝卜", hint: "橙色的蔬菜", category: "market", difficulty: 1 },
  { id: 'm8', word: "TOMATO", cn: "番茄", hint: "红色圆圆的", category: "market", difficulty: 1 },
  { id: 'm9', word: "POTATO", cn: "土豆", hint: "黄色的块茎", category: "market", difficulty: 1 },
  { id: 'm10', word: "CUCUMBER", cn: "黄瓜", hint: "绿色长条的", category: "market", difficulty: 2 },
  { id: 'm11', word: "CORN", cn: "玉米", hint: "黄色的谷物", category: "market", difficulty: 1 },
  { id: 'm12', word: "ONION", cn: "洋葱", hint: "切的时候会流泪", category: "market", difficulty: 2 },
  // 食品饮料
  { id: 'm13', word: "BREAD", cn: "面包", hint: "软软的食物", category: "market", difficulty: 1 },
  { id: 'm14', word: "MILK", cn: "牛奶", hint: "白色的饮料", category: "market", difficulty: 1 },
  { id: 'm15', word: "CHEESE", cn: "奶酪", hint: "牛奶做的", category: "market", difficulty: 2 },
  { id: 'm16', word: "YOGURT", cn: "酸奶", hint: "酸酸的奶制品", category: "market", difficulty: 2 },
  { id: 'm17', word: "JUICE", cn: "果汁", hint: "水果做的饮料", category: "market", difficulty: 1 },
  { id: 'm18', word: "WATER", cn: "水", hint: "透明的饮料", category: "market", difficulty: 1 },
  { id: 'm19', word: "CANDY", cn: "糖果", hint: "甜甜的零食", category: "market", difficulty: 1 },
  { id: 'm20', word: "COOKIE", cn: "饼干", hint: "甜甜的小点心", category: "market", difficulty: 1 },
  { id: 'm21', word: "CAKE", cn: "蛋糕", hint: "生日吃的甜点", category: "market", difficulty: 1 },
  { id: 'm22', word: "ICE CREAM", cn: "冰淇淋", hint: "冰冰凉凉的甜点", category: "market", difficulty: 1 },
  { id: 'm23', word: "CHOCOLATE", cn: "巧克力", hint: "棕色的甜食", category: "market", difficulty: 2 },
  { id: 'm24', word: "NOODLE", cn: "面条", hint: "长长的主食", category: "market", difficulty: 1 },
  { id: 'm25', word: "EGG", cn: "鸡蛋", hint: "椭圆形的食物", category: "market", difficulty: 1 },
  // 日用品
  { id: 'm26', word: "SOAP", cn: "肥皂", hint: "洗手用的", category: "market", difficulty: 1 },
  { id: 'm27', word: "TOOTHPASTE", cn: "牙膏", hint: "刷牙用的膏", category: "market", difficulty: 2 },
  { id: 'm28', word: "TISSUE", cn: "纸巾", hint: "擦东西的纸", category: "market", difficulty: 2 },
  { id: 'm29', word: "BOTTLE", cn: "瓶子", hint: "装东西的容器", category: "market", difficulty: 1 },
  { id: 'm30', word: "BAG", cn: "袋子", hint: "装东西的", category: "market", difficulty: 1 },
  // 玩具
  { id: 'm31', word: "BALL", cn: "球", hint: "圆圆的玩具", category: "market", difficulty: 1 },
  { id: 'm32', word: "DOLL", cn: "娃娃", hint: "像人的玩具", category: "market", difficulty: 1 },
  { id: 'm33', word: "PUZZLE", cn: "拼图", hint: "拼起来的游戏", category: "market", difficulty: 2 },
  { id: 'm34', word: "TOY CAR", cn: "玩具车", hint: "小汽车玩具", category: "market", difficulty: 1 },
  { id: 'm35', word: "BLOCK", cn: "积木", hint: "搭建用的玩具", category: "market", difficulty: 1 },
];

// ===== 🎢 公园场景 (35个) =====
export const PARK_WORDS: Word[] = [
  // 游乐设施
  { id: 'p1', word: "SWING", cn: "秋千", hint: "荡来荡去的", category: "park", difficulty: 1 },
  { id: 'p2', word: "SLIDE", cn: "滑梯", hint: "滑下来的", category: "park", difficulty: 1 },
  { id: 'p3', word: "SEESAW", cn: "跷跷板", hint: "两人一起玩的", category: "park", difficulty: 2 },
  { id: 'p4', word: "SANDBOX", cn: "沙坑", hint: "玩沙子的地方", category: "park", difficulty: 2 },
  { id: 'p5', word: "BENCH", cn: "长椅", hint: "坐着休息的", category: "park", difficulty: 1 },
  { id: 'p6', word: "FOUNTAIN", cn: "喷泉", hint: "喷水的", category: "park", difficulty: 2 },
  // 玩具
  { id: 'p7', word: "BALL", cn: "球", hint: "圆圆的玩具", category: "park", difficulty: 1 },
  { id: 'p8', word: "KITE", cn: "风筝", hint: "在天上飞的", category: "park", difficulty: 1 },
  { id: 'p9', word: "FRISBEE", cn: "飞盘", hint: "扔着玩的圆盘", category: "park", difficulty: 2 },
  { id: 'p10', word: "BICYCLE", cn: "自行车", hint: "两个轮子的", category: "park", difficulty: 1 },
  { id: 'p11', word: "SCOOTER", cn: "滑板车", hint: "站着滑的", category: "park", difficulty: 2 },
  { id: 'p12', word: "SKATEBOARD", cn: "滑板", hint: "滑行的板", category: "park", difficulty: 2 },
  { id: 'p13', word: "ROLLER SKATES", cn: "轮滑鞋", hint: "穿着滑的鞋", category: "park", difficulty: 2 },
  { id: 'p14', word: "BALLOON", cn: "气球", hint: "圆圆飘着的", category: "park", difficulty: 1 },
  { id: 'p15', word: "BUBBLES", cn: "泡泡", hint: "吹出来的", category: "park", difficulty: 1 },
  // 自然
  { id: 'p16', word: "TREE", cn: "树", hint: "高高的植物", category: "park", difficulty: 1 },
  { id: 'p17', word: "FLOWER", cn: "花", hint: "漂亮的植物", category: "park", difficulty: 1 },
  { id: 'p18', word: "GRASS", cn: "草", hint: "绿色的地面", category: "park", difficulty: 1 },
  { id: 'p19', word: "LEAF", cn: "叶子", hint: "树上的", category: "park", difficulty: 1 },
  { id: 'p20', word: "POND", cn: "池塘", hint: "小的水域", category: "park", difficulty: 2 },
  { id: 'p21', word: "PATH", cn: "小路", hint: "走的道路", category: "park", difficulty: 2 },
  // 动物
  { id: 'p22', word: "BIRD", cn: "鸟", hint: "飞的动物", category: "park", difficulty: 1 },
  { id: 'p23', word: "DOG", cn: "狗", hint: "汪汪叫的", category: "park", difficulty: 1 },
  { id: 'p24', word: "DUCK", cn: "鸭子", hint: "水里游的", category: "park", difficulty: 1 },
  { id: 'p25', word: "SQUIRREL", cn: "松鼠", hint: "毛茸茸尾巴大", category: "park", difficulty: 2 },
  { id: 'p26', word: "BUTTERFLY", cn: "蝴蝶", hint: "漂亮的昆虫", category: "park", difficulty: 1 },
  { id: 'p27', word: "BEE", cn: "蜜蜂", hint: "采花蜜的", category: "park", difficulty: 2 },
  { id: 'p28', word: "ANT", cn: "蚂蚁", hint: "很小的昆虫", category: "park", difficulty: 1 },
  { id: 'p29', word: "FISH", cn: "鱼", hint: "水里游的", category: "park", difficulty: 1 },
  { id: 'p30', word: "FROG", cn: "青蛙", hint: "呱呱叫的", category: "park", difficulty: 2 },
  // 其他
  { id: 'p31', word: "HAT", cn: "帽子", hint: "戴头上的", category: "park", difficulty: 1 },
  { id: 'p32', word: "SUNGLASSES", cn: "太阳镜", hint: "遮阳的眼镜", category: "park", difficulty: 2 },
  { id: 'p33', word: "WATER BOTTLE", cn: "水壶", hint: "装水喝的", category: "park", difficulty: 1 },
  { id: 'p34', word: "PICNIC", cn: "野餐", hint: "户外吃饭", category: "park", difficulty: 2 },
  { id: 'p35', word: "CAMERA", cn: "相机", hint: "拍照用的", category: "park", difficulty: 1 },
];

// ===== 🍽️ 餐厅场景 (35个) =====
export const RESTAURANT_WORDS: Word[] = [
  // 食物
  { id: 'r1', word: "RICE", cn: "米饭", hint: "白色的主食", category: "restaurant", difficulty: 1 },
  { id: 'r2', word: "NOODLE", cn: "面条", hint: "长长的主食", category: "restaurant", difficulty: 1 },
  { id: 'r3', word: "SOUP", cn: "汤", hint: "热热的液体食物", category: "restaurant", difficulty: 1 },
  { id: 'r4', word: "SALAD", cn: "沙拉", hint: "蔬菜拌的", category: "restaurant", difficulty: 2 },
  { id: 'r5', word: "SANDWICH", cn: "三明治", hint: "面包夹东西", category: "restaurant", difficulty: 2 },
  { id: 'r6', word: "HAMBURGER", cn: "汉堡", hint: "快餐常见的", category: "restaurant", difficulty: 2 },
  { id: 'r7', word: "PIZZA", cn: "披萨", hint: "圆形有芝士的", category: "restaurant", difficulty: 1 },
  { id: 'r8', word: "FRENCH FRIES", cn: "薯条", hint: "炸的土豆条", category: "restaurant", difficulty: 2 },
  { id: 'r9', word: "CHICKEN", cn: "鸡肉", hint: "鸡做的菜", category: "restaurant", difficulty: 1 },
  { id: 'r10', word: "FISH", cn: "鱼", hint: "水里游的做的菜", category: "restaurant", difficulty: 1 },
  { id: 'r11', word: "STEAK", cn: "牛排", hint: "煎的牛肉", category: "restaurant", difficulty: 2 },
  { id: 'r12', word: "BREAD", cn: "面包", hint: "软软的", category: "restaurant", difficulty: 1 },
  { id: 'r13', word: "CAKE", cn: "蛋糕", hint: "甜甜的点心", category: "restaurant", difficulty: 1 },
  { id: 'r14', word: "ICE CREAM", cn: "冰淇淋", hint: "冰冰凉的甜点", category: "restaurant", difficulty: 1 },
  { id: 'r15', word: "FRUIT", cn: "水果", hint: "甜甜的自然食物", category: "restaurant", difficulty: 1 },
  // 饮料
  { id: 'r16', word: "WATER", cn: "水", hint: "透明的饮料", category: "restaurant", difficulty: 1 },
  { id: 'r17', word: "JUICE", cn: "果汁", hint: "水果做的", category: "restaurant", difficulty: 1 },
  { id: 'r18', word: "MILK", cn: "牛奶", hint: "白色的饮料", category: "restaurant", difficulty: 1 },
  { id: 'r19', word: "TEA", cn: "茶", hint: "热的饮料", category: "restaurant", difficulty: 1 },
  { id: 'r20', word: "COFFEE", cn: "咖啡", hint: "提神的饮料", category: "restaurant", difficulty: 1 },
  // 餐具
  { id: 'r21', word: "PLATE", cn: "盘子", hint: "装菜的", category: "restaurant", difficulty: 1 },
  { id: 'r22', word: "BOWL", cn: "碗", hint: "盛汤的", category: "restaurant", difficulty: 1 },
  { id: 'r23', word: "CUP", cn: "杯子", hint: "喝水的", category: "restaurant", difficulty: 1 },
  { id: 'r24', word: "GLASS", cn: "玻璃杯", hint: "透明的杯子", category: "restaurant", difficulty: 1 },
  { id: 'r25', word: "SPOON", cn: "勺子", hint: "舀东西的", category: "restaurant", difficulty: 1 },
  { id: 'r26', word: "FORK", cn: "叉子", hint: "叉东西的", category: "restaurant", difficulty: 1 },
  { id: 'r27', word: "KNIFE", cn: "刀", hint: "切东西的", category: "restaurant", difficulty: 1 },
  { id: 'r28', word: "CHOPSTICKS", cn: "筷子", hint: "中国人吃饭用", category: "restaurant", difficulty: 2 },
  { id: 'r29', word: "NAPKIN", cn: "餐巾", hint: "擦嘴的纸", category: "restaurant", difficulty: 2 },
  { id: 'r30', word: "STRAW", cn: "吸管", hint: "喝饮料用的", category: "restaurant", difficulty: 1 },
  // 其他
  { id: 'r31', word: "MENU", cn: "菜单", hint: "点菜看的", category: "restaurant", difficulty: 2 },
  { id: 'r32', word: "TABLE", cn: "桌子", hint: "吃饭的地方", category: "restaurant", difficulty: 1 },
  { id: 'r33', word: "CHAIR", cn: "椅子", hint: "坐的家具", category: "restaurant", difficulty: 1 },
  { id: 'r34', word: "TRAY", cn: "托盘", hint: "端东西的盘子", category: "restaurant", difficulty: 2 },
  { id: 'r35', word: "BILL", cn: "账单", hint: "付钱看的", category: "restaurant", difficulty: 2 },
];

// 所有场景词汇合并
export const ALL_SCENE_WORDS: Word[] = [
  ...HOME_WORDS,
  ...SCHOOL_WORDS,
  ...OUTDOOR_WORDS,
  ...MARKET_WORDS,
  ...PARK_WORDS,
  ...RESTAURANT_WORDS,
];

// 根据场景获取词汇
export function getWordsByScene(scene: 'home' | 'school' | 'outdoor' | 'market' | 'park' | 'restaurant'): Word[] {
  switch (scene) {
    case 'home': return HOME_WORDS;
    case 'school': return SCHOOL_WORDS;
    case 'outdoor': return OUTDOOR_WORDS;
    case 'market': return MARKET_WORDS;
    case 'park': return PARK_WORDS;
    case 'restaurant': return RESTAURANT_WORDS;
    default: return [];
  }
}

// 根据场景随机获取单词
export function getRandomWordByScene(scene: 'home' | 'school' | 'outdoor' | 'market' | 'park' | 'restaurant', excludeIds: string[] = []): Word | null {
  const words = getWordsByScene(scene);
  const available = words.filter(w => !excludeIds.includes(w.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// 场景信息
export const SCENE_INFO = {
  home: { name: '家庭', emoji: '🏠', description: '在家里能找到的物品' },
  school: { name: '学校', emoji: '🏫', description: '学校里常见的物品' },
  outdoor: { name: '户外', emoji: '🌳', description: '户外自然和动物' },
  market: { name: '超市', emoji: '🛒', description: '超市里的商品' },
  park: { name: '公园', emoji: '🎢', description: '公园游乐场的东西' },
  restaurant: { name: '餐厅', emoji: '🍽️', description: '餐厅吃饭的东西' },
} as const;
