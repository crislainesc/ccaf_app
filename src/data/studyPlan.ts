export type CourseStatus = "not-started" | "in-progress" | "completed";

export type Course = {
  id: string;
  name: string;
  description: string;
  importance: number;
  estimatedMinutes: number;
  url: string;
  checklist: string[];
};

export type ScheduleActivity = {
  id: string;
  courseId?: string;
  title: string;
  estimatedMinutes: number;
  url?: string;
  notes: string;
};

export type ScheduleDay = {
  id: string;
  date: string;
  label: string;
  theme: string;
  activities: ScheduleActivity[];
};

export const PLAN_START = "2026-06-16T00:00:00-03:00";
export const EXAM_DATE = "2026-06-29T09:00:00-03:00";

const ANTHROPIC_ACADEMY = "https://anthropic.skilljar.com";

export const courses: Course[] = [
  {
    id: "claude-101",
    name: "Claude 101",
    description: "Fundamentos do Claude, casos de uso, limitações e conceitos iniciais de agentes.",
    importance: 3,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/claude-101`,
    checklist: ["O que é Claude", "Casos de uso", "Limitações dos LLMs", "Context Window", "Conceitos básicos de agentes"],
  },
  {
    id: "ai-fluency",
    name: "AI Fluency: Framework & Foundations",
    description: "Vocabulário e framework mental para trabalhar com IA de forma prática e responsável.",
    importance: 3,
    estimatedMinutes: 75,
    url: `${ANTHROPIC_ACADEMY}/ai-fluency-framework-foundations`,
    checklist: ["Framework de fluência", "Modelos mentais", "Riscos e limites", "Boas práticas", "Aplicações no dia a dia"],
  },
  {
    id: "ai-capabilities",
    name: "AI Capabilities and Limitations",
    description: "Capacidades, limitações, alucinações, segurança e usos inadequados de modelos.",
    importance: 4,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/ai-capabilities-and-limitations`,
    checklist: ["Hallucinations", "Constitutional AI", "Segurança", "Prompt Engineering básico", "Casos de uso inadequados"],
  },
  {
    id: "claude-platform",
    name: "Claude Platform 101",
    description: "Visão da plataforma Claude, ferramentas, console, recursos e padrões de uso.",
    importance: 4,
    estimatedMinutes: 85,
    url: `${ANTHROPIC_ACADEMY}/claude-platform-101`,
    checklist: ["Console", "Projetos", "Artifacts", "Workflows", "Boas práticas de plataforma"],
  },
  {
    id: "building-api",
    name: "Building with the Claude API",
    description: "Curso central para APIs, mensagens, ferramentas, XML, outputs estruturados e contexto.",
    importance: 5,
    estimatedMinutes: 150,
    url: `${ANTHROPIC_ACADEMY}/claude-with-the-anthropic-api`,
    checklist: [
      "Messages API",
      "System Prompts",
      "XML Tags",
      "Tool Use",
      "Structured Output",
      "Prompt Chaining",
      "Context Management",
      "Cost Optimization",
      "Latency",
    ],
  },
  {
    id: "anthropic-api",
    name: "Claude with the Anthropic API",
    description: "Aprofundamento em prompts de sistema, parâmetros, custos, latência e mensagens assíncronas.",
    importance: 5,
    estimatedMinutes: 120,
    url: `${ANTHROPIC_ACADEMY}/claude-with-the-anthropic-api`,
    checklist: ["System Prompts", "XML avançado", "Controle de custos", "Latência", "Parâmetros da API", "Mensagens assíncronas"],
  },
  {
    id: "claude-code-101",
    name: "Claude Code 101",
    description: "Fluxo CLI, contexto de código e integração com repositórios.",
    importance: 4,
    estimatedMinutes: 90,
    url: `${ANTHROPIC_ACADEMY}/claude-code-101`,
    checklist: ["Fluxo CLI", "Contexto de código", "Integração com repositórios", "Comandos essenciais", "Sessões produtivas"],
  },
  {
    id: "claude-code-action",
    name: "Claude Code in Action",
    description: "Refatoração, debug, testes, revisão de código e automação usando Claude Code.",
    importance: 5,
    estimatedMinutes: 120,
    url: `${ANTHROPIC_ACADEMY}/claude-code-in-action`,
    checklist: ["Refatoração", "Debug", "Testes", "Revisão de código", "Automação"],
  },
];

export const schedule: ScheduleDay[] = [
  {
    id: "2026-06-16",
    date: "2026-06-16",
    label: "16/06",
    theme: "Fundamentos",
    activities: [
      { id: "act-claude-101", courseId: "claude-101", title: "Claude 101", estimatedMinutes: 90, url: courses[0].url, notes: "Fundamentos e visão geral." },
      { id: "act-ai-fluency", courseId: "ai-fluency", title: "AI Fluency", estimatedMinutes: 75, notes: "Framework & Foundations." },
    ],
  },
  {
    id: "2026-06-17",
    date: "2026-06-17",
    label: "17/06",
    theme: "Fundamentos Avançados",
    activities: [
      { id: "act-ai-capabilities", courseId: "ai-capabilities", title: "AI Capabilities", estimatedMinutes: 90, notes: "Limitações, segurança e hallucinations." },
      { id: "act-platform", courseId: "claude-platform", title: "Claude Platform", estimatedMinutes: 85, notes: "Plataforma e recursos principais." },
    ],
  },
  {
    id: "2026-06-18",
    date: "2026-06-18",
    label: "18/06",
    theme: "Curso Mais Importante",
    activities: [{ id: "act-building-api", courseId: "building-api", title: "Building with the Claude API", estimatedMinutes: 150, notes: "Messages, XML, tools e contexto." }],
  },
  {
    id: "2026-06-19",
    date: "2026-06-19",
    label: "19/06",
    theme: "Complemento do PDI",
    activities: [{ id: "act-anthropic-api", courseId: "anthropic-api", title: "Claude with the Anthropic API", estimatedMinutes: 120, notes: "Custos, latência e parâmetros." }],
  },
  {
    id: "2026-06-20",
    date: "2026-06-20",
    label: "20/06",
    theme: "Revisão API",
    activities: [
      { id: "act-review-building", courseId: "building-api", title: "Revisar Building with the Claude API", estimatedMinutes: 60, notes: "Reforçar tópicos fracos." },
      { id: "act-review-anthropic", courseId: "anthropic-api", title: "Revisar Claude with Anthropic API", estimatedMinutes: 60, notes: "Revisar parâmetros e custos." },
      { id: "act-lab-api", title: "Laboratório de API", estimatedMinutes: 90, notes: "Chamada real, prompt estruturado e XML Tags." },
    ],
  },
  {
    id: "2026-06-21",
    date: "2026-06-21",
    label: "21/06",
    theme: "Claude Code",
    activities: [{ id: "act-code-101", courseId: "claude-code-101", title: "Claude Code 101", estimatedMinutes: 90, notes: "CLI, contexto e repositórios." }],
  },
  {
    id: "2026-06-22",
    date: "2026-06-22",
    label: "22/06",
    theme: "Segundo Curso Mais Importante",
    activities: [{ id: "act-code-action", courseId: "claude-code-action", title: "Claude Code in Action", estimatedMinutes: 120, notes: "Refatoração, debug, testes e automação." }],
  },
  {
    id: "2026-06-23",
    date: "2026-06-23",
    label: "23/06",
    theme: "MCP",
    activities: [{ id: "act-mcp-intro", title: "Introduction to MCP", estimatedMinutes: 90, notes: "Cliente, servidor, resources, tools e segurança." }],
  },
  {
    id: "2026-06-24",
    date: "2026-06-24",
    label: "24/06",
    theme: "Agentes",
    activities: [
      { id: "act-agent-skills", title: "Introduction to Agent Skills", estimatedMinutes: 75, notes: "Agent loop, planejamento e tool use." },
      { id: "act-subagents", title: "Introduction to Subagents", estimatedMinutes: 75, notes: "Delegação e coordenação de agentes." },
    ],
  },
  {
    id: "2026-06-25",
    date: "2026-06-25",
    label: "25/06",
    theme: "MCP Avançado",
    activities: [
      { id: "act-mcp-advanced", title: "MCP: Advanced Topics", estimatedMinutes: 90, notes: "Tópicos avançados e segurança." },
      { id: "act-docs-review", title: "Revisão Teórica", estimatedMinutes: 120, notes: "Cookbook, docs, Constitutional AI e guardrails." },
    ],
  },
  {
    id: "2026-06-26",
    date: "2026-06-26",
    label: "26/06",
    theme: "Simulado 1",
    activities: [{ id: "act-mock-1", title: "Simulado completo", estimatedMinutes: 120, notes: "Cronometrar, listar erros e mirar 75%+." }],
  },
  {
    id: "2026-06-27",
    date: "2026-06-27",
    label: "27/06",
    theme: "Correção de Lacunas",
    activities: [{ id: "act-gap-review", title: "Revisar erros do simulado", estimatedMinutes: 150, notes: "Revisitar cursos e mirar 80%+." }],
  },
  {
    id: "2026-06-28",
    date: "2026-06-28",
    label: "28/06",
    theme: "Simulado Final",
    activities: [{ id: "act-final-mock", title: "Simulado final", estimatedMinutes: 150, notes: "Ambiente real de prova e meta 85%+." }],
  },
  {
    id: "2026-06-29",
    date: "2026-06-29",
    label: "29/06",
    theme: "Exame CCAF",
    activities: [
      { id: "act-summary", title: "Revisar resumo pessoal", estimatedMinutes: 45, notes: "Revisão leve antes da prova." },
      { id: "act-exam", title: "Fazer a prova", estimatedMinutes: 120, notes: "Claude Certified Architect Foundation." },
    ],
  },
];
