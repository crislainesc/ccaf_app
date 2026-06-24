export type CourseStatus = 'not-started' | 'in-progress' | 'completed'

export type Course = {
  id: string
  name: string
  description: string
  /** 1–5 importance used for scheduling weight. */
  importance: number
  /** Recommended study order (1 = first). Used by the schedule generator. */
  sortOrder: number
  estimatedMinutes: number
  url: string
  checklist: string[]
}

export type ScheduleActivity = {
  id: string
  courseId?: string
  title: string
  estimatedMinutes: number
  url?: string
  notes: string
}

export type ScheduleDay = {
  id: string
  date: string
  label: string
  theme: string
  activities: ScheduleActivity[]
}

const ANTHROPIC_ACADEMY = 'https://anthropic.skilljar.com'

/**
 * Full course list in the recommended study order.
 * This is the single source of truth — the schedule generator reads from here.
 */
export const courses: Course[] = [
  {
    id: 'claude-101',
    name: 'Claude 101',
    description:
      'Fundamentos do Claude, casos de uso, limitações e conceitos iniciais de agentes.',
    importance: 3,
    sortOrder: 1,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/claude-101`,
    checklist: [
      'O que é Claude',
      'Casos de uso',
      'Limitações dos LLMs',
      'Context Window',
      'Conceitos básicos de agentes',
    ],
  },
  {
    id: 'ai-fluency',
    name: 'AI Fluency: Framework & Foundations',
    description:
      'Vocabulário e framework mental para trabalhar com IA de forma prática e responsável.',
    importance: 3,
    sortOrder: 2,
    estimatedMinutes: 75,
    url: `${ANTHROPIC_ACADEMY}/ai-fluency-framework-foundations`,
    checklist: [
      'Framework de fluência',
      'Modelos mentais',
      'Riscos e limites',
      'Boas práticas',
      'Aplicações no dia a dia',
    ],
  },
  {
    id: 'ai-capabilities',
    name: 'AI Capabilities and Limitations',
    description:
      'Capacidades, limitações, alucinações, segurança e usos inadequados de modelos.',
    importance: 4,
    sortOrder: 3,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/ai-capabilities-and-limitations`,
    checklist: [
      'Hallucinations',
      'Constitutional AI',
      'Segurança',
      'Prompt Engineering básico',
      'Casos de uso inadequados',
    ],
  },
  {
    id: 'claude-platform',
    name: 'Claude Platform 101',
    description:
      'Visão da plataforma Claude, ferramentas, console, recursos e padrões de uso.',
    importance: 4,
    sortOrder: 4,
    estimatedMinutes: 85,
    url: `${ANTHROPIC_ACADEMY}/claude-platform-101`,
    checklist: [
      'Console',
      'Projetos',
      'Artifacts',
      'Workflows',
      'Boas práticas de plataforma',
    ],
  },
  {
    id: 'building-api',
    name: 'Building with the Claude API',
    description:
      'Curso central: Messages API, system prompts, XML tags, tool use, outputs estruturados, prompt chaining e gestão de contexto.',
    importance: 5,
    sortOrder: 5,
    estimatedMinutes: 150,
    url: `${ANTHROPIC_ACADEMY}/building-with-the-claude-api`,
    checklist: [
      'Messages API',
      'System Prompts',
      'XML Tags',
      'Tool Use',
      'Structured Output',
      'Prompt Chaining',
      'Context Management',
      'Cost Optimization',
      'Latency',
    ],
  },
  {
    id: 'claude-code-101',
    name: 'Claude Code 101',
    description:
      'Fluxo CLI, contexto de código e integração com repositórios usando Claude Code.',
    importance: 4,
    sortOrder: 6,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/claude-code-101`,
    checklist: [
      'Fluxo CLI',
      'Contexto de código',
      'Integração com repositórios',
      'Comandos essenciais',
      'Sessões produtivas',
    ],
  },
  {
    id: 'claude-code-action',
    name: 'Claude Code in Action',
    description:
      'Refatoração, debug, testes, revisão de código e automação usando Claude Code.',
    importance: 5,
    sortOrder: 7,
    estimatedMinutes: 120,
    url: `${ANTHROPIC_ACADEMY}/claude-code-in-action`,
    checklist: [
      'Refatoração',
      'Debug',
      'Testes',
      'Revisão de código',
      'Automação',
    ],
  },
  {
    id: 'mcp-intro',
    name: 'Introduction to MCP',
    description:
      'Model Context Protocol: arquitetura cliente-servidor, resources, tools, prompts e segurança.',
    importance: 4,
    sortOrder: 8,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/introduction-to-mcp`,
    checklist: [
      'Arquitetura MCP',
      'Cliente e servidor',
      'Resources',
      'Tools MCP',
      'Prompts MCP',
      'Segurança',
    ],
  },
  {
    id: 'agent-skills',
    name: 'Introduction to Agent Skills',
    description:
      'Agent loop, planejamento, tool use e construção de habilidades de agentes.',
    importance: 4,
    sortOrder: 9,
    estimatedMinutes: 75,
    url: `${ANTHROPIC_ACADEMY}/introduction-to-agent-skills`,
    checklist: [
      'Agent loop',
      'Planejamento',
      'Tool use em agentes',
      'Construção de skills',
      'Avaliação de agentes',
    ],
  },
  {
    id: 'subagents',
    name: 'Introduction to Subagents',
    description:
      'Delegação, coordenação e orquestração de subagentes em sistemas multi-agente.',
    importance: 4,
    sortOrder: 10,
    estimatedMinutes: 75,
    url: `${ANTHROPIC_ACADEMY}/introduction-to-subagents`,
    checklist: [
      'Arquitetura multi-agente',
      'Delegação de tarefas',
      'Coordenação',
      'Orquestração',
      'Segurança em multi-agente',
    ],
  },
  {
    id: 'mcp-advanced',
    name: 'MCP: Advanced Topics',
    description:
      'Tópicos avançados de MCP: autenticação, transporte, debugging e padrões de produção.',
    importance: 3,
    sortOrder: 11,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/mcp-advanced-topics`,
    checklist: [
      'Autenticação MCP',
      'Transporte HTTP e SSE',
      'Debugging',
      'Padrões de produção',
      'Integração avançada',
    ],
  },
]
