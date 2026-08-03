export type CategoryId =
  | 'all'
  | 'design'
  | 'dev'
  | 'office'
  | 'image'
  | 'text'
  | 'fun'
  | 'ai'

export interface Category {
  id: CategoryId
  label: string
  hint: string
}

export interface Tool {
  id: string
  name: string
  desc: string
  url: string
  category: Exclude<CategoryId, 'all'>
  tags: string[]
  hot?: boolean
  new?: boolean
}

export const categories: Category[] = [
  { id: 'all', label: '全部', hint: '发现一切' },
  { id: 'design', label: '设计', hint: '灵感与配色' },
  { id: 'dev', label: '开发', hint: '调试与代码' },
  { id: 'office', label: '办公', hint: '效率利器' },
  { id: 'image', label: '图像', hint: '处理与压缩' },
  { id: 'text', label: '文本', hint: '转换与排版' },
  { id: 'fun', label: '趣味', hint: '奇妙发现' },
  { id: 'ai', label: 'AI', hint: '智能助手' },
]

export const tools: Tool[] = [
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    desc: '手绘风白板，快速画流程图与草图',
    url: 'https://excalidraw.com',
    category: 'design',
    tags: ['白板', '流程图', '协作'],
    hot: true,
  },
  {
    id: 'coolors',
    name: 'Coolors',
    desc: '一键生成配色方案，设计师灵感库',
    url: 'https://coolors.co',
    category: 'design',
    tags: ['配色', '灵感'],
  },
  {
    id: 'haikei',
    name: 'Haikei',
    desc: '生成精美 SVG 波浪、斑点与背景图案',
    url: 'https://haikei.app',
    category: 'design',
    tags: ['SVG', '背景', '图案'],
    new: true,
  },
  {
    id: 'figma',
    name: 'Figma',
    desc: '在线协作设计工具，原型与界面一把抓',
    url: 'https://www.figma.com',
    category: 'design',
    tags: ['UI', '原型', '协作'],
    hot: true,
  },
  {
    id: 'remove-bg',
    name: 'remove.bg',
    desc: '一键智能抠图，秒删背景',
    url: 'https://www.remove.bg',
    category: 'image',
    tags: ['抠图', '背景'],
    hot: true,
  },
  {
    id: 'tinypng',
    name: 'TinyPNG',
    desc: '无损压缩 PNG / JPEG，体积大幅缩小',
    url: 'https://tinypng.com',
    category: 'image',
    tags: ['压缩', 'PNG'],
  },
  {
    id: 'photopea',
    name: 'Photopea',
    desc: '浏览器里的 Photoshop，免费在线修图',
    url: 'https://www.photopea.com',
    category: 'image',
    tags: ['修图', 'PSD'],
    hot: true,
  },
  {
    id: 'squoosh',
    name: 'Squoosh',
    desc: 'Google 出品图片压缩与格式转换',
    url: 'https://squoosh.app',
    category: 'image',
    tags: ['压缩', 'WebP'],
  },
  {
    id: 'jsoncrack',
    name: 'JSON Crack',
    desc: '把 JSON 变成可交互的可视化树图',
    url: 'https://jsoncrack.com',
    category: 'dev',
    tags: ['JSON', '可视化'],
    hot: true,
  },
  {
    id: 'regex101',
    name: 'Regex101',
    desc: '正则表达式实时调试与解释',
    url: 'https://regex101.com',
    category: 'dev',
    tags: ['正则', '调试'],
  },
  {
    id: 'caniuse',
    name: 'Can I Use',
    desc: '查前端特性在各浏览器的兼容性',
    url: 'https://caniuse.com',
    category: 'dev',
    tags: ['兼容性', '前端'],
  },
  {
    id: 'carbon',
    name: 'Carbon',
    desc: '把代码片段做成精美分享图',
    url: 'https://carbon.now.sh',
    category: 'dev',
    tags: ['代码', '分享'],
  },
  {
    id: 'jwt-io',
    name: 'jwt.io',
    desc: '在线解码与调试 JWT Token',
    url: 'https://jwt.io',
    category: 'dev',
    tags: ['JWT', '安全'],
  },
  {
    id: 'notion',
    name: 'Notion',
    desc: '笔记、数据库与知识库一站搞定',
    url: 'https://www.notion.so',
    category: 'office',
    tags: ['笔记', '协作'],
    hot: true,
  },
  {
    id: 'diagrams',
    name: 'diagrams.net',
    desc: '免费在线画架构图、流程图、UML',
    url: 'https://app.diagrams.net',
    category: 'office',
    tags: ['流程图', '架构'],
  },
  {
    id: 'smallpdf',
    name: 'Smallpdf',
    desc: 'PDF 压缩、合并、转换全套工具',
    url: 'https://smallpdf.com',
    category: 'office',
    tags: ['PDF', '转换'],
  },
  {
    id: 'wolframalpha',
    name: 'WolframAlpha',
    desc: '计算引擎，从数学到生活问题都能答',
    url: 'https://www.wolframalpha.com',
    category: 'office',
    tags: ['计算', '知识'],
  },
  {
    id: 'mermaid',
    name: 'Mermaid Live',
    desc: '用文字描述自动生成流程图',
    url: 'https://mermaid.live',
    category: 'text',
    tags: ['流程图', 'Markdown'],
  },
  {
    id: 'markdowntable',
    name: 'Tables Generator',
    desc: '可视化生成 Markdown / LaTeX 表格',
    url: 'https://www.tablesgenerator.com',
    category: 'text',
    tags: ['表格', 'Markdown'],
  },
  {
    id: 'diffchecker',
    name: 'Diffchecker',
    desc: '对比两段文本、代码或图片差异',
    url: 'https://www.diffchecker.com',
    category: 'text',
    tags: ['对比', 'Diff'],
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    desc: '英文改写、润色与语法检查',
    url: 'https://quillbot.com',
    category: 'text',
    tags: ['写作', '润色'],
  },
  {
    id: 'neal-fun',
    name: 'Neal.fun',
    desc: '各种奇妙互动小实验与趣味网页',
    url: 'https://neal.fun',
    category: 'fun',
    tags: ['互动', '实验'],
    hot: true,
  },
  {
    id: 'window-swap',
    name: 'Window Swap',
    desc: '看看世界各地窗外的风景',
    url: 'https://www.window-swap.com',
    category: 'fun',
    tags: ['风景', '放松'],
  },
  {
    id: 'radio-garden',
    name: 'Radio Garden',
    desc: '在地球仪上收听全球电台',
    url: 'https://radio.garden',
    category: 'fun',
    tags: ['电台', '音乐'],
    new: true,
  },
  {
    id: 'thispersondoesnotexist',
    name: 'This Person Does Not Exist',
    desc: 'AI 生成的虚构人脸，每次刷新都不同',
    url: 'https://thispersondoesnotexist.com',
    category: 'fun',
    tags: ['AI', '人脸'],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    desc: '对话式 AI，写作、编程、头脑风暴',
    url: 'https://chatgpt.com',
    category: 'ai',
    tags: ['对话', '写作'],
    hot: true,
  },
  {
    id: 'claude',
    name: 'Claude',
    desc: '擅长长文理解与严谨分析的 AI 助手',
    url: 'https://claude.ai',
    category: 'ai',
    tags: ['对话', '分析'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    desc: '带引用来源的 AI 搜索引擎',
    url: 'https://www.perplexity.ai',
    category: 'ai',
    tags: ['搜索', '研究'],
    hot: true,
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    desc: '用文字生成高质量艺术图像',
    url: 'https://www.midjourney.com',
    category: 'ai',
    tags: ['绘图', '创意'],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Spaces',
    desc: '海量开源 AI Demo，即开即用',
    url: 'https://huggingface.co/spaces',
    category: 'ai',
    tags: ['开源', 'Demo'],
    new: true,
  },
]

export function searchTools(query: string, category: CategoryId): Tool[] {
  const q = query.trim().toLowerCase()
  return tools.filter((tool) => {
    const matchCategory = category === 'all' || tool.category === category
    if (!matchCategory) return false
    if (!q) return true
    const haystack = [tool.name, tool.desc, ...tool.tags].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}
