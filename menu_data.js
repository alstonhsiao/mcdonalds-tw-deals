// =====================================================
// 麥當勞台灣 菜單價格資料庫
// 最後更新：2026-02-23
// 資料來源：門市 App 實際截圖 OCR（menu_Photo_20260223）
// 注意：標記 [未驗證] 的品項尚未以截圖確認，請以官方 App 為準
// =====================================================

const menuData = {
    // ─── 主餐（以下標記「未驗證」者尚無截圖，以官方 App 確認為準）───
    mains: [
        // === 全日好食 ===
        { id: 'm01', name: '麥香雞',          category: '全日好食', single: 48,  combo: 90,  cal: null, source: 'ocr', hot: true },
        { id: 'm02', name: '麥香魚',          category: '全日好食', single: 52,  combo: 94,  cal: null, source: 'ocr' },
        { id: 'm03', name: '麥克雞塊（6塊）', category: '全日好食', single: 68,  combo: 110, cal: null, source: 'ocr' },
        { id: 'm04', name: '麥克雞塊（10塊）',category: '全日好食', single: 109, combo: 151, cal: null, source: 'ocr' },

        // === 陽光蛋堡（早餐）===
        { id: 'b01', name: '吉事蛋堡',        category: '陽光蛋堡', single: 34,  combo: 76,  cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'b02', name: '火腿蛋堡',        category: '陽光蛋堡', single: 52,  combo: 94,  cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'b03', name: '豬肉蛋堡',        category: '陽光蛋堡', single: 64,  combo: 106, cal: null, source: 'ocr', note: '早餐時段' },

        // === 豐盛鬆餅（早餐）===
        { id: 'k01', name: '鬆餅（3片）',       category: '豐盛鬆餅', single: 57,  combo: 99,  cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'k02', name: '豬肉鬆餅',          category: '豐盛鬆餅', single: 71,  combo: 113, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'k03', name: '雞塊鬆餅大早餐',    category: '豐盛鬆餅', single: 111, combo: 153, cal: null, source: 'ocr', note: '早餐時段' },

        // === 經典滿福（早餐）===
        { id: 'mf01', name: '滿福堡',                   category: '經典滿福', single: 52,  combo: 94,  cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf02', name: '青蔬滿福堡',               category: '經典滿福', single: 60,  combo: 102, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf03', name: '豬肉滿福堡',               category: '經典滿福', single: 50,  combo: 92,  cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf04', name: '豬肉滿福堡加蛋',           category: '經典滿福', single: 60,  combo: 102, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf05', name: '無敵豬肉滿福堡加蛋',       category: '經典滿福', single: 80,  combo: 122, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf06', name: '蕈菇滿福堡',               category: '經典滿福', single: 72,  combo: 114, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf07', name: '蕈菇青蔬滿福堡',           category: '經典滿福', single: 80,  combo: 122, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf08', name: '蕈菇豬肉滿福堡',           category: '經典滿福', single: 70,  combo: 112, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf09', name: '蕈菇豬肉滿福堡加蛋',       category: '經典滿福', single: 80,  combo: 122, cal: null, source: 'ocr', note: '早餐時段' },
        { id: 'mf10', name: '蕈菇無敵豬肉滿福堡加蛋',   category: '經典滿福', single: 100, combo: 142, cal: null, source: 'ocr', note: '早餐時段' },

        // === 以下為尚未截圖驗證的品項 ===
        { id: 'u01', name: '大麥克',             category: '經典牛肉【未驗證】', single: null, combo: null, cal: 550, source: 'unverified', hot: true },
        { id: 'u02', name: '雙層牛肉吉事堡',     category: '經典牛肉【未驗證】', single: null, combo: null, cal: 450, source: 'unverified' },
        { id: 'u03', name: '吉事漢堡',           category: '經典牛肉【未驗證】', single: null, combo: null, cal: 301, source: 'unverified' },
        { id: 'u04', name: '麥克雙牛堡',         category: '經典牛肉【未驗證】', single: null, combo: null, cal: 590, source: 'unverified' },
        { id: 'u05', name: '大麥克BLT',          category: '經典牛肉【未驗證】', single: null, combo: null, cal: 610, source: 'unverified', hot: true },
        { id: 'u06', name: '安格斯黑牛堡',       category: '安格斯【未驗證】',   single: null, combo: null, cal: 620, source: 'unverified' },
        { id: 'u07', name: '蕈菇安格斯黑牛堡',   category: '安格斯【未驗證】',   single: null, combo: null, cal: 650, source: 'unverified' },
        { id: 'u08', name: '培根安格斯黑牛堡',   category: '安格斯【未驗證】',   single: null, combo: null, cal: 670, source: 'unverified' },
        { id: 'u09', name: '勁辣雞腿堡',         category: '雞肉堡【未驗證】',   single: null, combo: null, cal: 510, source: 'unverified' },
        { id: 'u10', name: '嫩煎雞腿堡',         category: '雞肉堡【未驗證】',   single: null, combo: null, cal: 490, source: 'unverified' },
        { id: 'u11', name: 'BLT辣脆雞腿堡',     category: '雞肉堡【未驗證】',   single: null, combo: null, cal: 570, source: 'unverified' },
        { id: 'u12', name: 'BLT嫩煎雞腿堡',     category: '雞肉堡【未驗證】',   single: null, combo: null, cal: 550, source: 'unverified' },
        { id: 'u13', name: '麥脆雞腿（2塊）',   category: '麥脆雞【未驗證】',   single: null, combo: null, cal: 420, source: 'unverified' },
        { id: 'u14', name: '勁辣香雞翅（2塊）', category: '麥脆雞【未驗證】',   single: null, combo: null, cal: 290, source: 'unverified' },
        { id: 'u15', name: '麥脆雞翅（2塊）',   category: '麥脆雞【未驗證】',   single: null, combo: null, cal: 270, source: 'unverified' },
    ],

    // ─── 配餐 ───
    sides: [
        { id: 's01', name: '薯餅',            category: '點心',   price: 37,  cal: null, source: 'ocr' },
        { id: 's02', name: '麥克雞塊（4塊）', category: '點心',   price: 48,  cal: null, source: 'ocr' },
        { id: 's03', name: '水果袋（蘋果）',  category: '輕食',   price: 42,  cal: null, source: 'ocr' },
        { id: 's04', name: '水果袋（番茄）',  category: '輕食',   price: 42,  cal: null, source: 'ocr', note: '現無供應' },
        { id: 's05', name: '水果袋（芭樂）',  category: '輕食',   price: 42,  cal: null, source: 'ocr', note: '現無供應' },
        // 以下未截圖驗證
        { id: 's10', name: '小薯條',          category: '薯條【未驗證】', price: null, cal: 230, size: 'S', source: 'unverified' },
        { id: 's11', name: '中薯條',          category: '薯條【未驗證】', price: null, cal: 340, size: 'M', source: 'unverified' },
        { id: 's12', name: '大薯條',          category: '薯條【未驗證】', price: null, cal: 490, size: 'L', source: 'unverified' },
    ],

    // ─── 甜品 ───
    desserts: [
        { id: 'x01', name: '蛋捲冰淇淋',         category: '冰品', price: 18,  cal: null, source: 'ocr' },
        { id: 'x02', name: '大蛋捲冰淇淋',        category: '冰品', price: 32,  cal: null, source: 'ocr' },
        { id: 'x03', name: 'OREO 冰炫風',        category: '冰品', price: 59,  cal: null, source: 'ocr', note: '現無供應' },
        { id: 'x04', name: '雙倍OREO冰炫風',     category: '冰品', price: 65,  cal: null, source: 'ocr', note: '現無供應' },
        { id: 'x05', name: '蘋果派',              category: '點心', price: 40,  cal: null, source: 'ocr' },
        { id: 'x06', name: '紅豆派',              category: '點心', price: 40,  cal: null, source: 'ocr', note: '現無供應' },
    ],

    // ─── 飲品 ───
    drinks: [
        // 碳酸飲料
        { id: 'd01', name: '可口可樂',            category: '碳酸飲料', price: 33, cal: null, source: 'ocr' },
        { id: 'd02', name: '可口可樂Zero',        category: '碳酸飲料', price: 33, cal: null, source: 'ocr' },
        { id: 'd03', name: '雪碧',                category: '碳酸飲料', price: 33, cal: null, source: 'ocr' },
        { id: 'd04', name: '檸檬風味紅茶（冰）',  category: '茶飲',     price: 33, cal: null, source: 'ocr' },
        { id: 'd05', name: '無糖紅茶（冰）',      category: '茶飲',     price: 35, cal: null, source: 'ocr' },
        { id: 'd06', name: '無糖綠茶（冰）',      category: '茶飲',     price: 35, cal: null, source: 'ocr' },
        { id: 'd07', name: '紅茶（熱）',          category: '茶飲',     price: 38, cal: null, source: 'ocr' },
        { id: 'd08', name: '蜂蜜紅茶（冰）',      category: '茶飲',     price: 58, cal: null, source: 'ocr' },
        { id: 'd09', name: '奶茶（冰）',          category: '奶茶',     price: 50, cal: null, source: 'ocr' },
        { id: 'd10', name: '奶茶（熱）',          category: '奶茶',     price: 50, cal: null, source: 'ocr' },
        { id: 'd11', name: '蜂蜜奶茶（冰）',      category: '奶茶',     price: 68, cal: null, source: 'ocr' },
        { id: 'd12', name: '蜂蜜奶茶（熱）',      category: '奶茶',     price: 68, cal: null, source: 'ocr' },
        { id: 'd13', name: '焦糖奶茶（冰）',      category: '奶茶',     price: 68, cal: null, source: 'ocr' },
        // McCafe 咖啡
        { id: 'd20', name: '義式濃縮',            category: 'McCafe咖啡', price: 58, cal: null, source: 'ocr' },
        { id: 'd21', name: '經典美式咖啡（熱）',  category: 'McCafe咖啡', price: 50, cal: null, source: 'ocr' },
        { id: 'd22', name: '經典美式咖啡（冰）',  category: 'McCafe咖啡', price: 50, cal: null, source: 'ocr' },
        { id: 'd23', name: '金選美式咖啡（熱）',  category: 'McCafe咖啡', price: 60, cal: null, source: 'ocr' },
        { id: 'd24', name: '金選美式咖啡（冰）',  category: 'McCafe咖啡', price: 60, cal: null, source: 'ocr' },
        { id: 'd25', name: '經典卡布奇諾（熱）',  category: 'McCafe咖啡', price: 58, cal: null, source: 'ocr' },
        { id: 'd26', name: '經典卡布奇諾（冰）',  category: 'McCafe咖啡', price: 77, cal: null, source: 'ocr' },
        { id: 'd27', name: '經典那堤（熱）',      category: 'McCafe咖啡', price: 77, cal: null, source: 'ocr' },
        { id: 'd28', name: '經典那堤（冰）',      category: 'McCafe咖啡', price: 77, cal: null, source: 'ocr' },
        { id: 'd29', name: '金選那堤（熱）',      category: 'McCafe咖啡', price: 87, cal: null, source: 'ocr' },
        { id: 'd30', name: '金選那堤（冰）',      category: 'McCafe咖啡', price: 87, cal: null, source: 'ocr' },
        // 其他飲品
        { id: 'd40', name: '玉米湯',              category: '湯品',   price: 45, cal: null, source: 'ocr' },
        { id: 'd41', name: '台灣鮮榨柳丁汁',      category: '果汁',   price: 68, cal: null, source: 'ocr' },
        { id: 'd42', name: '鮮乳',                category: '乳品',   price: 33, cal: null, source: 'ocr' },
        { id: 'd43', name: 'Evian 礦泉水',        category: '礦泉水', price: 50, cal: null, source: 'ocr' },
        { id: 'd44', name: '沛綠雅',              category: '礦泉水', price: 68, cal: null, source: 'ocr', note: '現無供應' },
    ]
};

// =====================================================
// 促銷 / 優惠資料庫
// =====================================================
const promoData = [
    {
        id: 'p01',
        name: '甜心卡 - 買A送B (App限定)',
        type: '甜心卡',
        color: 'bg-red',
        description: '透過麥當勞App甜心卡，指定A區商品搭配B區商品，B區商品享第二件半價或特價優惠。',
        details: [
            'A區：主餐類（麥香雞、滿福堡、麥克雞塊等）',
            'B區：配餐或飲料（冰炫風、薯條、飲料等）',
            '買A區任一商品，B區商品享半價',
            '需使用麥當勞 App 出示甜心卡',
        ],
        savings: '配餐飲料最高省50%'
    },
    {
        id: 'p02',
        name: '1+1=50元',
        type: '超值優惠',
        color: 'bg-yellow',
        description: '指定商品任選2件只要50元！超值省錢首選。',
        details: [
            '可選：蛋捲冰淇淋、蘋果派、小杯飲料等',
            '任選2件只要$50',
            '需確認門市當期活動內容',
            '全天供應',
        ],
        savings: '任選2件$50',
        combo_items: ['蛋捲冰淇淋', '蘋果派', '可口可樂', '無糖紅茶（冰）', '雪碧'],
        combo_price: 50
    },
    {
        id: 'p03',
        name: '超值全餐',
        type: '套餐',
        color: 'bg-green',
        description: '主餐+配餐+飲料，一次搞定。套餐比主餐單點+分開購買配餐/飲料更便宜。',
        details: [
            '套餐包含主餐 + 配餐 + 飲料',
            '早餐套餐最低 $76 起（吉事蛋堡套餐）',
            '全日好食套餐最低 $90 起（麥香雞套餐）',
            '套餐省下金額依品項而定',
        ],
        savings: '套餐比單點省錢'
    },
    {
        id: 'p04',
        name: '歡樂送優惠（外送）',
        type: '外送',
        color: 'bg-blue',
        description: '麥當勞歡樂送專屬優惠，滿額折扣或免外送費。',
        details: [
            '外送低消$70起',
            '不定期推出滿額折扣碼',
            '部分時段免外送費',
            'App下單享專屬優惠',
        ],
        savings: '依活動而定'
    },
    {
        id: 'p05',
        name: '麥當勞 App 隨享券',
        type: 'App優惠',
        color: 'bg-purple',
        description: 'App 內不定期發放電子優惠券，各種組合都有折扣。',
        details: [
            '不定期買一送一活動',
            '套餐折$10~$30 優惠券',
            '限時特價組合',
            '生日當月驚喜優惠',
        ],
        savings: '最高買一送一(省50%)'
    },
    {
        id: 'p06',
        name: '早安優惠（早餐時段）',
        type: '時段優惠',
        color: 'bg-yellow',
        description: '早餐時段限定優惠組合，開啟美好的一天。',
        details: [
            '早餐供應時間：05:00~10:30',
            '豬肉蛋堡套餐 $106',
            '滿福堡套餐 $94',
            '吉事蛋堡套餐 $76',
            '鬆餅套餐 $99',
        ],
        savings: '早餐套餐最低$76起'
    },
    {
        id: 'p07',
        name: '快樂兒童餐',
        type: '兒童優惠',
        color: 'bg-red',
        description: '給小朋友的超值組合，含主餐+配餐+飲料+玩具！',
        details: [
            '主餐(4塊雞塊/漢堡) + 配餐 + 飲料 + 玩具',
            '需確認門市當期售價',
            '附贈當期限定玩具',
        ],
        savings: '含玩具超值'
    },
    {
        id: 'p08',
        name: '振興/行動支付回饋',
        type: '支付優惠',
        color: 'bg-blue',
        description: '使用特定行動支付可享額外回饋。',
        details: [
            'LINE Pay 不定期回饋',
            '街口支付 / Pi錢包優惠',
            '信用卡回饋（依各銀行活動）',
            '最高可達10%回饋',
        ],
        savings: '最高10%回饋'
    }
];

// =====================================================
// 套餐計算用常數（index.html 多處引用，請勿刪除）
// =====================================================
const COMBO_NOTE = '套餐內含物依品項而定（早餐套餐含薯餅或水果袋+飲料）';
const COMBO_SIDE_PRICE  = 37;  // 配餐基準價（薯餅 NT$37，OCR 已驗證）
const COMBO_DRINK_PRICE = 33;  // 飲料基準價（可口可樂 NT$33，OCR 已驗證）

// 1+1=50 可選品項（參考）
const ONEONE_ITEMS = ['蛋捲冰淇淋', '蘋果派', '可口可樂', '雪碧', '無糖紅茶（冰）', '無糖綠茶（冰）'];
