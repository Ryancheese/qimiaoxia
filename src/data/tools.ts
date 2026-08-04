export type CategoryId =
  | 'all'
  | 'core'
  | 'office'
  | 'dev'
  | 'life'
  | 'fun'
  | 'focus'

export interface Category {
  id: CategoryId
  label: string
  hint: string
}

export type ToolId =
  | 'json-format'
  | 'regex-test'
  | 'base64'
  | 'timestamp'
  | 'uuid'
  | 'password'
  | 'linux-cmd'
  | 'text-diff'
  | 'word-count'
  | 'pomodoro'
  | 'todo'
  | 'white-noise'
  | 'led-banner'
  | 'scoreboard'
  | 'ruler'
  | 'calendar'
  | 'bmi'
  | 'anniversary'
  | 'trash-sort'
  | 'ip-lookup'
  | 'color-picker'
  | 'morse'
  | 'acrostic'
  | 'rainbow-fart'
  | 'book-answers'
  | 'crazy-thursday'
  | 'scumbag'
  | 'simp-diary'
  | 'random-q'
  | 'call-sim'
  | 'ocr'
  | 'image-compress'
  | 'translate'
  | 'pdf-tools'
  | 'qr-generate'
  | 'qr-parse'
  | 'url-codec'
  | 'hash'
  | 'jwt-decode'
  | 'websocket-debug'
  | 'weather-rank'
  | 'hitokoto'
  | 'history-today'
  | 'bing-wallpaper'
  | 'box-office'
  | 'couplet'
  | 'riddle'
  | 'joke'
  | 'horoscope'

export interface ToolMeta {
  id: ToolId
  name: string
  desc: string
  category: Exclude<CategoryId, 'all'>
  tags: string[]
  hot?: boolean
  new?: boolean
}

export const categories: Category[] = [
  { id: 'all', label: '全部', hint: '纯净无广告，一触即达' },
  { id: 'core', label: '日常', hint: '日常必备小工具' },
  { id: 'office', label: '办公', hint: '文本与效率处理' },
  { id: 'dev', label: '开发', hint: '调试与开发辅助' },
  { id: 'life', label: '生活', hint: '生活查询与助手' },
  { id: 'focus', label: '专注', hint: '番茄钟、白噪声与待办' },
  { id: 'fun', label: '趣味', hint: '灵感与社交玩法' },
]

export const tools: ToolMeta[] = [
  {
    id: 'ocr',
    name: 'OCR 识字',
    desc: '上传图片，识别中英文文字',
    category: 'office',
    tags: ['OCR', '识字'],
    hot: true,
    new: true,
  },
  {
    id: 'image-compress',
    name: '图片压缩',
    desc: '缩小体积，可调质量与尺寸',
    category: 'office',
    tags: ['压缩', '图片'],
    hot: true,
    new: true,
  },
  {
    id: 'translate',
    name: '简易翻译',
    desc: '中英互译，一键复制结果',
    category: 'office',
    tags: ['翻译', '中英'],
    hot: true,
    new: true,
  },
  {
    id: 'pdf-tools',
    name: 'PDF 工具',
    desc: '合并 PDF，或图片转成 PDF',
    category: 'office',
    tags: ['PDF', '合并'],
    hot: true,
    new: true,
  },
  {
    id: 'qr-generate',
    name: '二维码生成',
    desc: '文本/链接生成二维码，可调尺寸下载',
    category: 'dev',
    tags: ['二维码', 'QR', '生成'],
    hot: true,
    new: true,
  },
  {
    id: 'qr-parse',
    name: '二维码解析',
    desc: '上传图片识别二维码内容',
    category: 'dev',
    tags: ['二维码', 'QR', '识别'],
    hot: true,
    new: true,
  },
  {
    id: 'json-format',
    name: 'JSON 格式化',
    desc: '美化、压缩、校验 JSON，一键复制',
    category: 'dev',
    tags: ['JSON', '格式化'],
    hot: true,
  },
  {
    id: 'regex-test',
    name: '正则测试',
    desc: '实时匹配、分组捕获与常用模板',
    category: 'dev',
    tags: ['正则', '调试'],
    hot: true,
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    desc: '文本 Base64 编码与解码',
    category: 'dev',
    tags: ['编码', 'Base64'],
  },
  {
    id: 'url-codec',
    name: 'URL 编解码',
    desc: 'URL 编码与解码，处理特殊字符',
    category: 'dev',
    tags: ['URL', '编码'],
    new: true,
  },
  {
    id: 'hash',
    name: '哈希计算',
    desc: 'SHA-1/256/384/512 文本哈希',
    category: 'dev',
    tags: ['Hash', 'SHA'],
    new: true,
  },
  {
    id: 'jwt-decode',
    name: 'JWT 解析',
    desc: '本地解码 JWT Header 与 Payload',
    category: 'dev',
    tags: ['JWT', 'Token'],
    new: true,
  },
  {
    id: 'websocket-debug',
    name: 'WebSocket 调试',
    desc: '连接 ws/wss，收发消息查看日志',
    category: 'dev',
    tags: ['WebSocket', '调试', 'WS'],
    hot: true,
    new: true,
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    desc: '秒/毫秒时间戳与日期互转',
    category: 'dev',
    tags: ['时间', '转换'],
  },
  {
    id: 'uuid',
    name: 'UUID 生成',
    desc: '批量生成 UUID v4',
    category: 'dev',
    tags: ['UUID', '生成'],
  },
  {
    id: 'password',
    name: '密码生成器',
    desc: '可配置强度的安全随机密码',
    category: 'core',
    tags: ['密码', '安全'],
    hot: true,
  },
  {
    id: 'weather-rank',
    name: '天气排行榜',
    desc: '全国主要城市实时气温高低排行',
    category: 'core',
    tags: ['天气', '排行', '气温'],
    hot: true,
    new: true,
  },
  {
    id: 'hitokoto',
    name: '每日一言',
    desc: '随机一句短句，可一键复制',
    category: 'core',
    tags: ['一言', '句子'],
    new: true,
  },
  {
    id: 'bing-wallpaper',
    name: '必应壁纸',
    desc: '查看今日 Bing 壁纸并打开原图',
    category: 'core',
    tags: ['壁纸', 'Bing'],
    new: true,
  },
  {
    id: 'history-today',
    name: '历史今日',
    desc: '看看历史上的今天发生了什么',
    category: 'life',
    tags: ['历史', '今天'],
    new: true,
  },
  {
    id: 'box-office',
    name: '电影票房排行',
    desc: '猫眼影史票房榜速览',
    category: 'life',
    tags: ['电影', '票房', '排行'],
    new: true,
  },
  {
    id: 'horoscope',
    name: '星座运势',
    desc: '十二星座今日趣味运势',
    category: 'life',
    tags: ['星座', '运势'],
    new: true,
  },
  {
    id: 'linux-cmd',
    name: 'Linux 命令速查',
    desc: '常用 Linux 命令本地速查手册',
    category: 'dev',
    tags: ['Linux', '命令'],
  },
  {
    id: 'text-diff',
    name: '文本对比',
    desc: '对比两段文本的逐行差异',
    category: 'office',
    tags: ['对比', 'Diff'],
  },
  {
    id: 'word-count',
    name: '字数统计',
    desc: '中英文字数、段落与阅读时长估算',
    category: 'office',
    tags: ['字数', '写作'],
  },
  {
    id: 'pomodoro',
    name: '番茄专注钟',
    desc: '25 分钟专注循环，可自定义时长',
    category: 'focus',
    tags: ['番茄钟', '专注'],
    hot: true,
  },
  {
    id: 'todo',
    name: '待办清单',
    desc: '轻量待办，数据保存在本机',
    category: 'focus',
    tags: ['待办', '清单'],
    hot: true,
  },
  {
    id: 'white-noise',
    name: '白噪声冥想',
    desc: '雨声、海浪、森林等氛围音',
    category: 'focus',
    tags: ['白噪声', '放松'],
    new: true,
  },
  {
    id: 'led-banner',
    name: '手持 LED 弹幕',
    desc: '全屏滚动字幕，聚会应援神器',
    category: 'fun',
    tags: ['LED', '弹幕'],
    hot: true,
  },
  {
    id: 'scoreboard',
    name: '计分板',
    desc: '双人记分，适合比赛与桌游',
    category: 'core',
    tags: ['计分', '比赛'],
  },
  {
    id: 'ruler',
    name: '屏幕尺子',
    desc: '用手机屏幕当尺子量长度',
    category: 'core',
    tags: ['尺子', '测量'],
  },
  {
    id: 'calendar',
    name: '万年历',
    desc: '月历浏览，节假日与星期速览',
    category: 'core',
    tags: ['日历', '日期'],
  },
  {
    id: 'bmi',
    name: 'BMI 计算器',
    desc: '身高体重测算身体质量指数',
    category: 'life',
    tags: ['健康', 'BMI'],
  },
  {
    id: 'anniversary',
    name: '纪念日倒数',
    desc: '记录重要日子，倒数/正数天数',
    category: 'life',
    tags: ['纪念日', '倒数'],
    new: true,
  },
  {
    id: 'trash-sort',
    name: '垃圾分类查询',
    desc: '快速查询常见垃圾属于哪一类',
    category: 'life',
    tags: ['垃圾分类', '生活'],
  },
  {
    id: 'ip-lookup',
    name: '本机网络信息',
    desc: '查看本地时间、时区与网络概况',
    category: 'life',
    tags: ['网络', 'IP'],
  },
  {
    id: 'color-picker',
    name: '颜色工具',
    desc: '取色、HEX/RGB 互转与预览',
    category: 'office',
    tags: ['颜色', '设计'],
  },
  {
    id: 'morse',
    name: '摩斯电码',
    desc: '中文拼音友好的摩斯编解码',
    category: 'fun',
    tags: ['摩斯', '编码'],
  },
  {
    id: 'acrostic',
    name: '藏头诗生成',
    desc: '输入几个字，生成藏头短诗',
    category: 'fun',
    tags: ['诗词', '创意'],
    hot: true,
  },
  {
    id: 'couplet',
    name: '对联生成',
    desc: '一键生成趣味春联上下联',
    category: 'fun',
    tags: ['对联', '春联'],
    new: true,
  },
  {
    id: 'riddle',
    name: '脑筋急转弯',
    desc: '本地题库，猜完再看答案',
    category: 'fun',
    tags: ['谜语', '急转弯'],
    new: true,
  },
  {
    id: 'joke',
    name: '搞笑段子',
    desc: '冷幽默段子随机放送',
    category: 'fun',
    tags: ['段子', '笑话'],
    new: true,
  },
  {
    id: 'rainbow-fart',
    name: '彩虹屁生成器',
    desc: '一键生成夸张夸夸文案',
    category: 'fun',
    tags: ['夸夸', '文案'],
    hot: true,
  },
  {
    id: 'book-answers',
    name: '答案之书',
    desc: '心中默念问题，翻开得到指引',
    category: 'fun',
    tags: ['占卜', '决策'],
    hot: true,
  },
  {
    id: 'crazy-thursday',
    name: '疯狂星期四',
    desc: 'V我50 经典文案随机生成',
    category: 'fun',
    tags: ['星期四', '文案'],
  },
  {
    id: 'scumbag',
    name: '渣男语录',
    desc: '随机生成「渣」味发言（娱乐）',
    category: 'fun',
    tags: ['语录', '娱乐'],
  },
  {
    id: 'simp-diary',
    name: '舔狗日记',
    desc: '随机一篇今日舔狗心情',
    category: 'fun',
    tags: ['日记', '娱乐'],
  },
  {
    id: 'random-q',
    name: '脑洞问题机',
    desc: '随机抛出奇怪问题开启话题',
    category: 'fun',
    tags: ['脑洞', '社交'],
  },
  {
    id: 'call-sim',
    name: '来电模拟器',
    desc: '模拟来电界面，救急挡枪用',
    category: 'core',
    tags: ['来电', '模拟'],
    new: true,
  },
]

export function searchTools(query: string, category: CategoryId): ToolMeta[] {
  const q = query.trim().toLowerCase()
  return tools.filter((tool) => {
    const matchCategory = category === 'all' || tool.category === category
    if (!matchCategory) return false
    if (!q) return true
    const haystack = [tool.name, tool.desc, ...tool.tags].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

export function getTool(id: string): ToolMeta | undefined {
  return tools.find((t) => t.id === id)
}
