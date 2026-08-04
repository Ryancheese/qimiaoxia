import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { ToolId } from '../data/tools'
import { JsonFormatter } from './JsonFormatter'
import { RegexTester } from './RegexTester'
import { Base64Tool } from './Base64Tool'
import { TimestampTool } from './TimestampTool'
import { UuidTool } from './UuidTool'
import { PasswordTool } from './PasswordTool'
import { LinuxCmd } from './LinuxCmd'
import { TextDiff } from './TextDiff'
import { WordCount } from './WordCount'
import { Pomodoro } from './Pomodoro'
import { TodoTool } from './TodoTool'
import { WhiteNoise } from './WhiteNoise'
import { LedBanner } from './LedBanner'
import { Scoreboard } from './Scoreboard'
import { Ruler } from './Ruler'
import { CalendarTool } from './CalendarTool'
import { BmiTool } from './BmiTool'
import { Anniversary } from './Anniversary'
import { TrashSort } from './TrashSort'
import { IpLookup } from './IpLookup'
import { ColorPicker } from './ColorPicker'
import { MorseTool } from './MorseTool'
import { Acrostic } from './Acrostic'
import {
  BookOfAnswers,
  CrazyThursday,
  RainbowFart,
  RandomQ,
  ScumbagQuotes,
  SimpDiary,
} from './FunGenerators'
import { CallSimulator } from './CallSimulator'

type AnyTool = ComponentType | LazyExoticComponent<ComponentType>

export const toolComponents: Record<ToolId, AnyTool> = {
  ocr: lazy(() => import('./OcrTool').then((m) => ({ default: m.OcrTool }))),
  'image-compress': lazy(() =>
    import('./ImageCompress').then((m) => ({ default: m.ImageCompress })),
  ),
  translate: lazy(() => import('./TranslateTool').then((m) => ({ default: m.TranslateTool }))),
  'pdf-tools': lazy(() => import('./PdfTools').then((m) => ({ default: m.PdfTools }))),
  'qr-generate': lazy(() =>
    import('./QrGenerateTool').then((m) => ({ default: m.QrGenerateTool })),
  ),
  'qr-parse': lazy(() => import('./QrParseTool').then((m) => ({ default: m.QrParseTool }))),
  'url-codec': lazy(() => import('./UrlCodecTool').then((m) => ({ default: m.UrlCodecTool }))),
  hash: lazy(() => import('./HashTool').then((m) => ({ default: m.HashTool }))),
  'jwt-decode': lazy(() => import('./JwtDecodeTool').then((m) => ({ default: m.JwtDecodeTool }))),
  'websocket-debug': lazy(() =>
    import('./WebsocketDebugTool').then((m) => ({ default: m.WebsocketDebugTool })),
  ),
  'weather-rank': lazy(() =>
    import('./WeatherRankTool').then((m) => ({ default: m.WeatherRankTool })),
  ),
  'json-format': JsonFormatter,
  'regex-test': RegexTester,
  base64: Base64Tool,
  timestamp: TimestampTool,
  uuid: UuidTool,
  password: PasswordTool,
  'linux-cmd': LinuxCmd,
  'text-diff': TextDiff,
  'word-count': WordCount,
  pomodoro: Pomodoro,
  todo: TodoTool,
  'white-noise': WhiteNoise,
  'led-banner': LedBanner,
  scoreboard: Scoreboard,
  ruler: Ruler,
  calendar: CalendarTool,
  bmi: BmiTool,
  anniversary: Anniversary,
  'trash-sort': TrashSort,
  'ip-lookup': IpLookup,
  'color-picker': ColorPicker,
  morse: MorseTool,
  acrostic: Acrostic,
  'rainbow-fart': RainbowFart,
  'book-answers': BookOfAnswers,
  'crazy-thursday': CrazyThursday,
  scumbag: ScumbagQuotes,
  'simp-diary': SimpDiary,
  'random-q': RandomQ,
  'call-sim': CallSimulator,
}
