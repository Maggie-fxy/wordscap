import { Word } from "@/types";

// 词库 - 200个日常常见名词
// difficulty 1: 简单常见物品
// difficulty 2: 中等难度
// difficulty 3: 较难/不常见
export const WORD_BANK: Word[] = [
  // === 难度 1: 简单常见 (80个) ===
  // 食物
  { id: 'w1', word: "APPLE", cn: "苹果", hint: "红色的水果，一天一个医生远离我", hintEn: "A red fruit, keeps the doctor away", category: "food", difficulty: 1 },
  { id: 'w2', word: "BANANA", cn: "香蕉", hint: "黄色弯弯的水果，猴子最爱", hintEn: "A yellow curved fruit, monkeys love it", category: "food", difficulty: 1 },
  { id: 'w3', word: "ORANGE", cn: "橙子", hint: "圆圆的橙色水果，富含维C", hintEn: "A round citrus fruit, rich in vitamin C", category: "food", difficulty: 1 },
  { id: 'w4', word: "BREAD", cn: "面包", hint: "早餐常吃的食物，软软的", hintEn: "Soft food often eaten for breakfast", category: "food", difficulty: 1 },
  { id: 'w5', word: "EGG", cn: "鸡蛋", hint: "母鸡下的，椭圆形", hintEn: "Oval shaped, laid by a hen", category: "food", difficulty: 1 },
  { id: 'w6', word: "MILK", cn: "牛奶", hint: "白色的饮料，补钙", hintEn: "White drink from cows, good for bones", category: "food", difficulty: 1 },
  { id: 'w7', word: "RICE", cn: "米饭", hint: "中国人的主食", hintEn: "White grains, staple food in Asia", category: "food", difficulty: 1 },
  { id: 'w8', word: "CAKE", cn: "蛋糕", hint: "生日时吃的甜点", hintEn: "Sweet dessert for birthdays", category: "food", difficulty: 1 },
  { id: 'w9', word: "CANDY", cn: "糖果", hint: "甜甜的小零食", hintEn: "Small sweet treats for kids", category: "food", difficulty: 1 },
  { id: 'w10', word: "WATER", cn: "水", hint: "透明的液体，生命之源", hintEn: "Clear liquid, essential for life", category: "food", difficulty: 1 },
  { id: 'w204', word: "COFFEE", cn: "咖啡", hint: "提神的饮料，办公室常见", category: "food", difficulty: 1 },
  { id: 'w205', word: "TEA", cn: "茶", hint: "热饮，很多人爱喝", category: "food", difficulty: 1 },
  
  // 日用品
  { id: 'w11', word: "CUP", cn: "杯子", hint: "喝水用的容器", hintEn: "A container for drinking", category: "daily", difficulty: 1 },
  { id: 'w12', word: "BOTTLE", cn: "瓶子", hint: "装水或饮料的容器", hintEn: "A container for water or drinks", category: "daily", difficulty: 1 },
  { id: 'w13', word: "BAG", cn: "包", hint: "装东西的袋子", hintEn: "Used to carry things", category: "daily", difficulty: 1 },
  { id: 'w14', word: "BOX", cn: "盒子", hint: "方方正正装东西的", hintEn: "A square container for storage", category: "daily", difficulty: 1 },
  { id: 'w15', word: "KEY", cn: "钥匙", hint: "开门用的金属物品", hintEn: "Metal object to open doors", category: "daily", difficulty: 1 },
  { id: 'w16', word: "CLOCK", cn: "时钟", hint: "告诉我们时间的", hintEn: "Shows us the time", category: "daily", difficulty: 1 },
  { id: 'w17', word: "SOAP", cn: "肥皂", hint: "洗手用的", hintEn: "Used for washing hands", category: "daily", difficulty: 1 },
  { id: 'w18', word: "TOWEL", cn: "毛巾", hint: "擦手擦脸用的布", hintEn: "Cloth for drying hands and face", category: "daily", difficulty: 1 },
  { id: 'w19', word: "BRUSH", cn: "刷子", hint: "刷东西用的工具", hintEn: "Tool with bristles for cleaning", category: "daily", difficulty: 1 },
  { id: 'w20', word: "COMB", cn: "梳子", hint: "梳头发用的", hintEn: "Used to style your hair", category: "daily", difficulty: 1 },
  
  // 学习用品
  { id: 'w21', word: "BOOK", cn: "书", hint: "读书学习用的", hintEn: "Pages with words for reading", category: "study", difficulty: 1 },
  { id: 'w22', word: "PEN", cn: "钢笔", hint: "写字用的工具", hintEn: "Writing tool with ink", category: "study", difficulty: 1 },
  { id: 'w23', word: "PENCIL", cn: "铅笔", hint: "可以擦掉的笔", hintEn: "Writing tool that can be erased", category: "study", difficulty: 1 },
  { id: 'w24', word: "PAPER", cn: "纸", hint: "写字画画用的", hintEn: "Thin material for writing or drawing", category: "study", difficulty: 1 },
  { id: 'w25', word: "RULER", cn: "尺子", hint: "量长度画直线用的", hintEn: "Tool for measuring and drawing lines", category: "study", difficulty: 1 },
  { id: 'w26', word: "ERASER", cn: "橡皮", hint: "擦铅笔字用的", hintEn: "Removes pencil marks", category: "study", difficulty: 1 },
  { id: 'w27', word: "DESK", cn: "书桌", hint: "学习写作业的桌子", hintEn: "Table for studying and homework", category: "study", difficulty: 1 },
  { id: 'w28', word: "BAG", cn: "书包", hint: "装书本的包", hintEn: "Carries books to school", category: "study", difficulty: 1 },
  
  // 家具
  { id: 'w29', word: "CHAIR", cn: "椅子", hint: "坐的家具", category: "furniture", difficulty: 1 },
  { id: 'w30', word: "TABLE", cn: "桌子", hint: "吃饭或放东西的家具", category: "furniture", difficulty: 1 },
  { id: 'w31', word: "BED", cn: "床", hint: "睡觉的家具", category: "furniture", difficulty: 1 },
  { id: 'w32', word: "SOFA", cn: "沙发", hint: "软软的坐具", category: "furniture", difficulty: 1 },
  { id: 'w33', word: "DOOR", cn: "门", hint: "进出房间的", category: "furniture", difficulty: 1 },
  { id: 'w34', word: "WINDOW", cn: "窗户", hint: "看外面风景的", category: "furniture", difficulty: 1 },
  { id: 'w35', word: "LAMP", cn: "灯", hint: "照明用的", category: "furniture", difficulty: 1 },
  { id: 'w36', word: "FAN", cn: "风扇", hint: "吹风凉快的", category: "furniture", difficulty: 1 },
  
  // 衣物
  { id: 'w37', word: "SHOE", cn: "鞋子", hint: "穿在脚上的", category: "clothing", difficulty: 1 },
  { id: 'w38', word: "SOCK", cn: "袜子", hint: "穿在鞋里的", category: "clothing", difficulty: 1 },
  { id: 'w39', word: "HAT", cn: "帽子", hint: "戴在头上的", category: "clothing", difficulty: 1 },
  { id: 'w40', word: "COAT", cn: "外套", hint: "穿在外面的衣服", category: "clothing", difficulty: 1 },
  { id: 'w41', word: "SHIRT", cn: "衬衫", hint: "有领子的上衣", category: "clothing", difficulty: 1 },
  { id: 'w42', word: "PANTS", cn: "裤子", hint: "穿在腿上的", category: "clothing", difficulty: 1 },
  { id: 'w43', word: "DRESS", cn: "连衣裙", hint: "女孩穿的裙子", category: "clothing", difficulty: 1 },
  { id: 'w44', word: "GLOVE", cn: "手套", hint: "戴在手上保暖的", category: "clothing", difficulty: 1 },
  
  // 电子产品
  { id: 'w45', word: "PHONE", cn: "手机", hint: "打电话发消息的", category: "tech", difficulty: 1 },
  { id: 'w46', word: "TV", cn: "电视", hint: "看节目的大屏幕", category: "tech", difficulty: 1 },
  { id: 'w47', word: "COMPUTER", cn: "电脑", hint: "上网学习用的", category: "tech", difficulty: 1 },
  { id: 'w48', word: "CAMERA", cn: "相机", hint: "拍照用的", category: "tech", difficulty: 1 },
  { id: 'w49', word: "WATCH", cn: "手表", hint: "戴在手腕看时间的", category: "tech", difficulty: 1 },
  { id: 'w50', word: "RADIO", cn: "收音机", hint: "听广播的", category: "tech", difficulty: 1 },
  
  // 动物
  { id: 'w51', word: "CAT", cn: "猫", hint: "喵喵叫的宠物", category: "animal", difficulty: 1 },
  { id: 'w52', word: "DOG", cn: "狗", hint: "汪汪叫的宠物", category: "animal", difficulty: 1 },
  { id: 'w53', word: "FISH", cn: "鱼", hint: "在水里游的", category: "animal", difficulty: 1 },
  { id: 'w54', word: "BIRD", cn: "鸟", hint: "在天上飞的", category: "animal", difficulty: 1 },
  { id: 'w55', word: "DUCK", cn: "鸭子", hint: "嘎嘎叫会游泳的", category: "animal", difficulty: 1 },
  
  // 自然
  { id: 'w56', word: "TREE", cn: "树", hint: "高高的绿色植物", category: "nature", difficulty: 1 },
  { id: 'w57', word: "FLOWER", cn: "花", hint: "漂亮的植物", category: "nature", difficulty: 1 },
  { id: 'w58', word: "GRASS", cn: "草", hint: "绿色的地面植物", category: "nature", difficulty: 1 },
  { id: 'w59', word: "LEAF", cn: "叶子", hint: "树上的绿色部分", category: "nature", difficulty: 1 },
  { id: 'w60', word: "STONE", cn: "石头", hint: "硬硬的自然物", category: "nature", difficulty: 1 },
  
  // 玩具
  { id: 'w61', word: "BALL", cn: "球", hint: "圆圆的可以玩的", category: "toy", difficulty: 1 },
  { id: 'w62', word: "DOLL", cn: "娃娃", hint: "像人一样的玩具", category: "toy", difficulty: 1 },
  { id: 'w63', word: "CAR", cn: "玩具车", hint: "小汽车玩具", category: "toy", difficulty: 1 },
  { id: 'w64', word: "KITE", cn: "风筝", hint: "在天上飞的玩具", category: "toy", difficulty: 1 },
  { id: 'w65', word: "BLOCK", cn: "积木", hint: "搭建用的玩具", category: "toy", difficulty: 1 },
  
  // 身体部位相关物品
  { id: 'w66', word: "GLASSES", cn: "眼镜", hint: "戴在眼睛上看清楚的", category: "daily", difficulty: 1 },
  { id: 'w67', word: "RING", cn: "戒指", hint: "戴在手指上的", category: "daily", difficulty: 1 },
  { id: 'w68', word: "BELT", cn: "皮带", hint: "系在腰上的", category: "clothing", difficulty: 1 },
  { id: 'w69', word: "SCARF", cn: "围巾", hint: "围在脖子上的", category: "clothing", difficulty: 1 },
  { id: 'w70', word: "MASK", cn: "口罩", hint: "戴在嘴上的", category: "daily", difficulty: 1 },
  
  // 厨房用品
  { id: 'w71', word: "BOWL", cn: "碗", hint: "盛饭盛汤的", category: "kitchen", difficulty: 1 },
  { id: 'w72', word: "PLATE", cn: "盘子", hint: "装菜的圆盘", category: "kitchen", difficulty: 1 },
  { id: 'w73', word: "SPOON", cn: "勺子", hint: "舀东西吃的", category: "kitchen", difficulty: 1 },
  { id: 'w74', word: "FORK", cn: "叉子", hint: "叉东西吃的", category: "kitchen", difficulty: 1 },
  { id: 'w75', word: "KNIFE", cn: "刀", hint: "切东西的", category: "kitchen", difficulty: 1 },
  { id: 'w76', word: "POT", cn: "锅", hint: "煮东西的", category: "kitchen", difficulty: 1 },
  { id: 'w77', word: "PAN", cn: "平底锅", hint: "煎东西的", category: "kitchen", difficulty: 1 },
  { id: 'w78', word: "STOVE", cn: "炉子", hint: "做饭用的", category: "kitchen", difficulty: 1 },
  { id: 'w79', word: "FRIDGE", cn: "冰箱", hint: "保鲜食物的", category: "kitchen", difficulty: 1 },
  { id: 'w80', word: "OVEN", cn: "烤箱", hint: "烤东西的", category: "kitchen", difficulty: 1 },
  
  // === 难度 2: 中等难度 (70个) ===
  { id: 'w81', word: "KEYBOARD", cn: "键盘", hint: "打字用的输入设备", category: "tech", difficulty: 2 },
  { id: 'w82', word: "MOUSE", cn: "鼠标", hint: "控制电脑光标的", category: "tech", difficulty: 2 },
  { id: 'w83', word: "SCREEN", cn: "屏幕", hint: "显示画面的", category: "tech", difficulty: 2 },
  { id: 'w84', word: "SPEAKER", cn: "音箱", hint: "放音乐的", category: "tech", difficulty: 2 },
  { id: 'w85', word: "HEADPHONE", cn: "耳机", hint: "戴在耳朵上听音乐的", category: "tech", difficulty: 2 },
  { id: 'w86', word: "CHARGER", cn: "充电器", hint: "给手机充电的", category: "tech", difficulty: 2 },
  { id: 'w87', word: "CABLE", cn: "数据线", hint: "连接设备的线", category: "tech", difficulty: 2 },
  { id: 'w88', word: "BATTERY", cn: "电池", hint: "提供电力的", category: "tech", difficulty: 2 },
  { id: 'w89', word: "REMOTE", cn: "遥控器", hint: "远程控制电视的", category: "tech", difficulty: 2 },
  { id: 'w90', word: "TABLET", cn: "平板电脑", hint: "触屏的便携电脑", category: "tech", difficulty: 2 },
  
  { id: 'w91', word: "PILLOW", cn: "枕头", hint: "睡觉垫头的", category: "furniture", difficulty: 2 },
  { id: 'w92', word: "BLANKET", cn: "毯子", hint: "盖在身上保暖的", category: "furniture", difficulty: 2 },
  { id: 'w93', word: "CURTAIN", cn: "窗帘", hint: "挡住窗户的布", category: "furniture", difficulty: 2 },
  { id: 'w94', word: "CARPET", cn: "地毯", hint: "铺在地上的", category: "furniture", difficulty: 2 },
  { id: 'w95', word: "MIRROR", cn: "镜子", hint: "照自己的", category: "furniture", difficulty: 2 },
  { id: 'w96', word: "SHELF", cn: "架子", hint: "放东西的横板", category: "furniture", difficulty: 2 },
  { id: 'w97', word: "DRAWER", cn: "抽屉", hint: "拉出来放东西的", category: "furniture", difficulty: 2 },
  { id: 'w98', word: "CLOSET", cn: "衣柜", hint: "放衣服的柜子", category: "furniture", difficulty: 2 },
  { id: 'w99', word: "HANGER", cn: "衣架", hint: "挂衣服的", category: "furniture", difficulty: 2 },
  { id: 'w100', word: "VASE", cn: "花瓶", hint: "插花的容器", category: "furniture", difficulty: 2 },
  
  { id: 'w101', word: "WALLET", cn: "钱包", hint: "装钱和卡的", category: "daily", difficulty: 2 },
  { id: 'w102', word: "UMBRELLA", cn: "雨伞", hint: "下雨时撑的", category: "daily", difficulty: 2 },
  { id: 'w103', word: "BACKPACK", cn: "双肩包", hint: "背在背上的包", category: "daily", difficulty: 2 },
  { id: 'w104', word: "SUITCASE", cn: "行李箱", hint: "旅行装东西的箱子", category: "daily", difficulty: 2 },
  { id: 'w105', word: "BASKET", cn: "篮子", hint: "编织的容器", category: "daily", difficulty: 2 },
  { id: 'w106', word: "BUCKET", cn: "桶", hint: "装水的容器", category: "daily", difficulty: 2 },
  { id: 'w107', word: "CANDLE", cn: "蜡烛", hint: "点燃照明的", category: "daily", difficulty: 2 },
  { id: 'w108', word: "LIGHTER", cn: "打火机", hint: "点火用的", category: "daily", difficulty: 2 },
  { id: 'w109', word: "TISSUE", cn: "纸巾", hint: "擦东西的纸", category: "daily", difficulty: 2 },
  { id: 'w110', word: "TRASH", cn: "垃圾桶", hint: "扔垃圾的", category: "daily", difficulty: 2 },
  
  { id: 'w111', word: "SCISSORS", cn: "剪刀", hint: "剪东西的工具", category: "tool", difficulty: 2 },
  { id: 'w112', word: "TAPE", cn: "胶带", hint: "粘东西的", category: "tool", difficulty: 2 },
  { id: 'w113', word: "GLUE", cn: "胶水", hint: "粘合用的液体", category: "tool", difficulty: 2 },
  { id: 'w114', word: "STAPLER", cn: "订书机", hint: "订纸的工具", category: "tool", difficulty: 2 },
  { id: 'w115', word: "HAMMER", cn: "锤子", hint: "敲钉子的", category: "tool", difficulty: 2 },
  { id: 'w116', word: "NAIL", cn: "钉子", hint: "固定东西的金属", category: "tool", difficulty: 2 },
  { id: 'w117', word: "ROPE", cn: "绳子", hint: "绑东西的", category: "tool", difficulty: 2 },
  { id: 'w118', word: "LADDER", cn: "梯子", hint: "爬高用的", category: "tool", difficulty: 2 },
  { id: 'w119', word: "BROOM", cn: "扫帚", hint: "扫地的", category: "tool", difficulty: 2 },
  { id: 'w120', word: "MOP", cn: "拖把", hint: "拖地的", category: "tool", difficulty: 2 },
  
  { id: 'w121', word: "NOTEBOOK", cn: "笔记本", hint: "记笔记的本子", category: "study", difficulty: 2 },
  { id: 'w122', word: "DICTIONARY", cn: "词典", hint: "查单词的书", category: "study", difficulty: 2 },
  { id: 'w123', word: "CALENDAR", cn: "日历", hint: "看日期的", category: "study", difficulty: 2 },
  { id: 'w124', word: "CALCULATOR", cn: "计算器", hint: "算数用的", category: "study", difficulty: 2 },
  { id: 'w125', word: "GLOBE", cn: "地球仪", hint: "圆形的地球模型", category: "study", difficulty: 2 },
  { id: 'w126', word: "MAP", cn: "地图", hint: "看位置的图", category: "study", difficulty: 2 },
  { id: 'w127', word: "MARKER", cn: "马克笔", hint: "彩色的粗笔", category: "study", difficulty: 2 },
  { id: 'w128', word: "CRAYON", cn: "蜡笔", hint: "画画的彩色笔", category: "study", difficulty: 2 },
  { id: 'w129', word: "FOLDER", cn: "文件夹", hint: "装文件的", category: "study", difficulty: 2 },
  { id: 'w130', word: "ENVELOPE", cn: "信封", hint: "装信的", category: "study", difficulty: 2 },
  
  { id: 'w131', word: "SWEATER", cn: "毛衣", hint: "保暖的针织衣", category: "clothing", difficulty: 2 },
  { id: 'w132', word: "JACKET", cn: "夹克", hint: "短款外套", category: "clothing", difficulty: 2 },
  { id: 'w133', word: "JEANS", cn: "牛仔裤", hint: "蓝色的布裤子", category: "clothing", difficulty: 2 },
  { id: 'w134', word: "SHORTS", cn: "短裤", hint: "短的裤子", category: "clothing", difficulty: 2 },
  { id: 'w135', word: "SKIRT", cn: "裙子", hint: "女孩穿的下装", category: "clothing", difficulty: 2 },
  { id: 'w136', word: "BOOTS", cn: "靴子", hint: "高帮的鞋", category: "clothing", difficulty: 2 },
  { id: 'w137', word: "SANDALS", cn: "凉鞋", hint: "夏天穿的鞋", category: "clothing", difficulty: 2 },
  { id: 'w138', word: "SLIPPERS", cn: "拖鞋", hint: "在家穿的鞋", category: "clothing", difficulty: 2 },
  { id: 'w139', word: "TIE", cn: "领带", hint: "系在脖子上的", category: "clothing", difficulty: 2 },
  { id: 'w140', word: "BUTTON", cn: "纽扣", hint: "扣衣服的", category: "clothing", difficulty: 2 },
  
  { id: 'w141', word: "RABBIT", cn: "兔子", hint: "长耳朵的小动物", category: "animal", difficulty: 2 },
  { id: 'w142', word: "TURTLE", cn: "乌龟", hint: "背着壳的动物", category: "animal", difficulty: 2 },
  { id: 'w143', word: "FROG", cn: "青蛙", hint: "呱呱叫的绿色动物", category: "animal", difficulty: 2 },
  { id: 'w144', word: "BUTTERFLY", cn: "蝴蝶", hint: "漂亮翅膀的昆虫", category: "animal", difficulty: 2 },
  { id: 'w145', word: "ANT", cn: "蚂蚁", hint: "很小的昆虫", category: "animal", difficulty: 2 },
  { id: 'w146', word: "BEE", cn: "蜜蜂", hint: "采蜜的昆虫", category: "animal", difficulty: 2 },
  { id: 'w147', word: "SPIDER", cn: "蜘蛛", hint: "织网的八脚虫", category: "animal", difficulty: 2 },
  { id: 'w148', word: "SNAIL", cn: "蜗牛", hint: "背着壳慢慢爬的", category: "animal", difficulty: 2 },
  { id: 'w149', word: "GOLDFISH", cn: "金鱼", hint: "金色的观赏鱼", category: "animal", difficulty: 2 },
  { id: 'w150', word: "PARROT", cn: "鹦鹉", hint: "会学说话的鸟", category: "animal", difficulty: 2 },
  
  // === 难度 3: 较难 (50个) ===
  { id: 'w151', word: "THERMOMETER", cn: "温度计", hint: "测量温度的仪器", category: "tool", difficulty: 3 },
  { id: 'w152', word: "MICROSCOPE", cn: "显微镜", hint: "看很小东西的仪器", category: "tool", difficulty: 3 },
  { id: 'w153', word: "TELESCOPE", cn: "望远镜", hint: "看很远东西的仪器", category: "tool", difficulty: 3 },
  { id: 'w154', word: "COMPASS", cn: "指南针", hint: "指方向的工具", category: "tool", difficulty: 3 },
  { id: 'w155', word: "FLASHLIGHT", cn: "手电筒", hint: "照亮黑暗的", category: "tool", difficulty: 3 },
  { id: 'w156', word: "SCREWDRIVER", cn: "螺丝刀", hint: "拧螺丝的工具", category: "tool", difficulty: 3 },
  { id: 'w157', word: "WRENCH", cn: "扳手", hint: "拧螺母的工具", category: "tool", difficulty: 3 },
  { id: 'w158', word: "PLIERS", cn: "钳子", hint: "夹东西的工具", category: "tool", difficulty: 3 },
  { id: 'w159', word: "MAGNIFIER", cn: "放大镜", hint: "放大看东西的", category: "tool", difficulty: 3 },
  { id: 'w160', word: "SCALE", cn: "秤", hint: "称重量的", category: "tool", difficulty: 3 },
  
  { id: 'w161', word: "TOOTHBRUSH", cn: "牙刷", hint: "刷牙用的", category: "daily", difficulty: 3 },
  { id: 'w162', word: "TOOTHPASTE", cn: "牙膏", hint: "刷牙用的膏", category: "daily", difficulty: 3 },
  { id: 'w163', word: "SHAMPOO", cn: "洗发水", hint: "洗头发的", category: "daily", difficulty: 3 },
  { id: 'w164', word: "SUNGLASSES", cn: "太阳镜", hint: "遮阳的眼镜", category: "daily", difficulty: 3 },
  { id: 'w165', word: "NECKLACE", cn: "项链", hint: "戴在脖子上的饰品", category: "daily", difficulty: 3 },
  { id: 'w166', word: "BRACELET", cn: "手链", hint: "戴在手腕的饰品", category: "daily", difficulty: 3 },
  { id: 'w167', word: "EARRING", cn: "耳环", hint: "戴在耳朵上的", category: "daily", difficulty: 3 },
  { id: 'w168', word: "PERFUME", cn: "香水", hint: "喷香味的", category: "daily", difficulty: 3 },
  { id: 'w169', word: "LIPSTICK", cn: "口红", hint: "涂嘴唇的", category: "daily", difficulty: 3 },
  { id: 'w170', word: "HAIRDRYER", cn: "吹风机", hint: "吹干头发的", category: "daily", difficulty: 3 },
  
  { id: 'w171', word: "MICROWAVE", cn: "微波炉", hint: "快速加热食物的", category: "kitchen", difficulty: 3 },
  { id: 'w172', word: "BLENDER", cn: "搅拌机", hint: "打果汁的", category: "kitchen", difficulty: 3 },
  { id: 'w173', word: "TOASTER", cn: "烤面包机", hint: "烤面包片的", category: "kitchen", difficulty: 3 },
  { id: 'w174', word: "KETTLE", cn: "水壶", hint: "烧水的", category: "kitchen", difficulty: 3 },
  { id: 'w175', word: "CHOPSTICKS", cn: "筷子", hint: "中国人吃饭用的", category: "kitchen", difficulty: 3 },
  { id: 'w176', word: "LADLE", cn: "汤勺", hint: "舀汤的大勺", category: "kitchen", difficulty: 3 },
  { id: 'w177', word: "SPATULA", cn: "锅铲", hint: "炒菜用的", category: "kitchen", difficulty: 3 },
  { id: 'w178', word: "CUTTING BOARD", cn: "砧板", hint: "切菜的板", category: "kitchen", difficulty: 3 },
  { id: 'w179', word: "APRON", cn: "围裙", hint: "做饭时围的", category: "kitchen", difficulty: 3 },
  { id: 'w180', word: "DISHWASHER", cn: "洗碗机", hint: "自动洗碗的", category: "kitchen", difficulty: 3 },
  
  { id: 'w181', word: "PRINTER", cn: "打印机", hint: "打印文件的", category: "tech", difficulty: 3 },
  { id: 'w182', word: "SCANNER", cn: "扫描仪", hint: "扫描文件的", category: "tech", difficulty: 3 },
  { id: 'w183', word: "PROJECTOR", cn: "投影仪", hint: "投射画面的", category: "tech", difficulty: 3 },
  { id: 'w184', word: "ROUTER", cn: "路由器", hint: "提供WiFi的", category: "tech", difficulty: 3 },
  { id: 'w185', word: "WEBCAM", cn: "摄像头", hint: "视频通话用的", category: "tech", difficulty: 3 },
  { id: 'w186', word: "MICROPHONE", cn: "麦克风", hint: "说话录音的", category: "tech", difficulty: 3 },
  { id: 'w187', word: "USB DRIVE", cn: "U盘", hint: "存储文件的", category: "tech", difficulty: 3 },
  { id: 'w188', word: "HARD DRIVE", cn: "硬盘", hint: "存储大量数据的", category: "tech", difficulty: 3 },
  { id: 'w189', word: "GAMEPAD", cn: "游戏手柄", hint: "玩游戏的控制器", category: "tech", difficulty: 3 },
  { id: 'w190', word: "DRONE", cn: "无人机", hint: "会飞的遥控飞机", category: "tech", difficulty: 3 },
  
  { id: 'w191', word: "PUZZLE", cn: "拼图", hint: "拼起来的游戏", category: "toy", difficulty: 3 },
  { id: 'w192', word: "ROBOT", cn: "机器人", hint: "会动的机械玩具", category: "toy", difficulty: 3 },
  { id: 'w193', word: "SKATEBOARD", cn: "滑板", hint: "滑行的板", category: "toy", difficulty: 3 },
  { id: 'w194', word: "BICYCLE", cn: "自行车", hint: "两个轮子的车", category: "toy", difficulty: 3 },
  { id: 'w195', word: "SCOOTER", cn: "滑板车", hint: "站着滑的车", category: "toy", difficulty: 3 },
  { id: 'w196', word: "TRAMPOLINE", cn: "蹦床", hint: "跳跳的床", category: "toy", difficulty: 3 },
  { id: 'w197', word: "SWING", cn: "秋千", hint: "荡来荡去的", category: "toy", difficulty: 3 },
  { id: 'w198', word: "SLIDE", cn: "滑梯", hint: "滑下来的", category: "toy", difficulty: 3 },
  { id: 'w199', word: "SANDBOX", cn: "沙坑", hint: "玩沙子的地方", category: "toy", difficulty: 3 },
  { id: 'w200', word: "SEESAW", cn: "跷跷板", hint: "两人一起玩的板", category: "toy", difficulty: 3 },
  { id: 'w201', word: "HAND", cn: "手", hint: "身体的一部分，用来拿东西", category: "daily", difficulty: 1 },
  { id: 'w202', word: "POWER BANK", cn: "充电宝", hint: "给手机应急充电的", category: "tech", difficulty: 2 },
  { id: 'w203', word: "DOWN JACKET", cn: "羽绒服", hint: "很保暖的冬季外套", category: "clothing", difficulty: 2 },
  { id: 'w206', word: "LAPTOP", cn: "笔记本电脑", hint: "便携式电脑，办公常见", category: "tech", difficulty: 2 },
  { id: 'w207', word: "LIGHT", cn: "灯", hint: "照明用的（也可以说 lamp）", category: "furniture", difficulty: 1 },
  { id: 'w208', word: "SHOES", cn: "鞋子", hint: "穿在脚上的（复数）", category: "clothing", difficulty: 1 },
  { id: 'w209', word: "MINERAL WATER", cn: "矿泉水", hint: "瓶装的饮用水", category: "food", difficulty: 1 },
  { id: 'w210', word: "HAND CREAM", cn: "护手霜", hint: "涂在手上的保湿霜", category: "daily", difficulty: 2 },
  { id: 'w211', word: "ID CARD", cn: "身份证", hint: "证明身份的卡片", category: "daily", difficulty: 2 },
  { id: 'w212', word: "CHAOTIC", cn: "混乱的", hint: "乱糟糟的，不有序", category: "daily", difficulty: 3 },
  { id: 'w213', word: "COCONUT WATER", cn: "椰子水", hint: "椰子里的清甜饮料", category: "food", difficulty: 2 },
];

// Demo 优先词池（前30次抽词：100%从该列表中抽）
export const DEMO_WORD_LIST: string[] = [
  'COMPUTER',
  'PHONE',
  'LAPTOP',
  'KEYBOARD',
  'MOUSE',
  'SCREEN',
  'CHAIR',
  'PEN',
  'PENCIL',
  'PAPER',
  'NOTEBOOK',
  'BOOK',
  'BOTTLE',
  'BAG',
  'DOOR',
  'WINDOW',
  'KEY',
  'WALLET',
  'CLOCK',
  'LIGHT',
  'WATER',
  'MINERAL WATER',
  'COFFEE',
  'TEA',
  'CUP',
  'SHOES',
  'HAND',
  'HAND CREAM',
  'DOWN JACKET',
  'POWER BANK',
];

export function getRandomWordFromWordList(wordList: string[], excludeIds: string[] = []): Word {
  const wordSet = new Set(wordList.map(w => w.toUpperCase()));
  const poolAll = WORD_BANK.filter(w => wordSet.has(w.word.toUpperCase()));
  if (poolAll.length === 0) {
    return getRandomWord(excludeIds);
  }
  let pool = poolAll.filter(w => !excludeIds.includes(w.id));
  if (pool.length === 0) {
    pool = poolAll;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// 随机获取一个单词
export function getRandomWord(excludeIds: string[] = []): Word {
  const available = WORD_BANK.filter(w => !excludeIds.includes(w.id));
  if (available.length === 0) {
    return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

// 根据分类获取单词
export function getWordsByCategory(category: string): Word[] {
  return WORD_BANK.filter(w => w.category === category);
}

// 根据难度获取单词
export function getWordsByDifficulty(difficulty: 1 | 2 | 3): Word[] {
  return WORD_BANK.filter(w => w.difficulty === difficulty);
}

// 获取有收集记录的单词（用于复习模式）
export function getWordById(id: string): Word | undefined {
  return WORD_BANK.find(w => w.id === id);
}

// 随机获取选项（用于选择题）
export function getRandomOptions(correctWord: Word, count: number = 4): Word[] {
  const options = [correctWord];
  const others = WORD_BANK.filter(w => w.id !== correctWord.id);
  
  while (options.length < count && others.length > 0) {
    const randomIndex = Math.floor(Math.random() * others.length);
    options.push(others[randomIndex]);
    others.splice(randomIndex, 1);
  }
  
  // 打乱顺序
  return options.sort(() => Math.random() - 0.5);
}
