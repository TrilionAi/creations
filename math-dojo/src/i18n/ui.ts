import type { Locale } from "../types";
import type { Grade } from "../engine/grading";

interface UiStrings {
  tagline: string;
  comingSoon: string;
  stripeLabel: string;
  degreeLabel: string;
  backToMap: string;
  startPractice: string;
  lessonMeta: (pagesToMaster: number, problemsPerPage: number, pct: number, sec: number) => string;
  pageLabel: (page: number, totalPages: number) => string;
  pageComplete: (page: number, totalPages: number) => string;
  correctAnswerReveal: (answer: number) => string;
  correctAnswerRevealWithRemainder: (quotient: number, remainder: number) => string;
  correctAnswerRevealFraction: (numerator: number, denominator: number) => string;
  correctAnswerRevealDecimal: (whole: number, tenths: number) => string;
  correctAnswerRevealPair: (a: number, b: number) => string;
  correctAnswerRevealRadical: (coefficient: number, inside: number) => string;
  remainderLabel: string;
  exitDrillAria: string;
  resultsPassHeadline: string;
  resultsFailHeadline: string;
  resultsPassSub: (title: string) => string;
  resultsFailSub: (title: string) => string;
  accuracy: string;
  avgTime: string;
  beltEarned: (beltName: string) => string;
  continue: string;
  tryAgain: string;
  muteAria: string;
  unmuteAria: string;
  gradeTitle: (grade: Grade) => string;
  gradeEarned: (grade: Grade) => string;
  statsNav: string;
  statsTitle: string;
  statBeltsEarned: string;
  statStripesMastered: string;
  statDayStreak: string;
  statSessions: string;
  statGradeHint: string;
}

const en: UiStrings = {
  tagline: "Earn your belt, one small step at a time.",
  comingSoon: "Coming soon",
  stripeLabel: "Stripe",
  degreeLabel: "Degree",
  backToMap: "Back to map",
  startPractice: "I've got it — start practice",
  lessonMeta: (pagesToMaster, problemsPerPage, pct, sec) =>
    `${pagesToMaster} pages of ${problemsPerPage} problems · pass with ${pct}%+ accuracy, averaging under ${sec}s each`,
  pageLabel: (page, totalPages) => `Page ${page}/${totalPages}`,
  pageComplete: (page, totalPages) => `Page ${page} of ${totalPages} done!`,
  correctAnswerReveal: (answer) => `Correct answer: ${answer} — try it again`,
  correctAnswerRevealWithRemainder: (q, r) => `Correct answer: ${q} R ${r} — try it again`,
  correctAnswerRevealFraction: (n, d) => `Correct answer: ${n}/${d} — try it again`,
  correctAnswerRevealDecimal: (w, t) => `Correct answer: ${w}.${t} — try it again`,
  correctAnswerRevealPair: (a, b) => `Correct answer: ${a}, ${b} — try it again`,
  correctAnswerRevealRadical: (c, i) => `Correct answer: ${c}√${i} — try it again`,
  remainderLabel: "R",
  exitDrillAria: "Exit drill",
  resultsPassHeadline: "Stripe earned!",
  resultsFailHeadline: "So close — one more round",
  resultsPassSub: (title) => `You've mastered "${title}".`,
  resultsFailSub: (title) => `"${title}" needs a bit more practice before it sticks.`,
  accuracy: "Accuracy",
  avgTime: "Avg. time",
  beltEarned: (beltName) => `🏆 ${beltName} earned! On to the next belt.`,
  continue: "Continue",
  tryAgain: "Try again",
  muteAria: "Mute sound",
  unmuteAria: "Unmute sound",
  gradeTitle: (grade) =>
    grade === "S"
      ? "S rank — blazing fast and accurate"
      : grade === "A"
        ? "A rank — strong pace"
        : "B rank — passed",
  gradeEarned: (grade) => `${grade} Rank earned!`,
  statsNav: "Stats",
  statsTitle: "Hall of Fame",
  statBeltsEarned: "Belts earned",
  statStripesMastered: "Stripes mastered",
  statDayStreak: "Day streak",
  statSessions: "Practice sessions",
  statGradeHint: "S = blazing fast · A = strong pace · B = passed",
};

const pt: UiStrings = {
  tagline: "Conquiste sua faixa, um passo de cada vez.",
  comingSoon: "Em breve",
  stripeLabel: "Grau",
  degreeLabel: "Nível",
  backToMap: "Voltar ao mapa",
  startPractice: "Entendi — começar a praticar",
  lessonMeta: (pagesToMaster, problemsPerPage, pct, sec) =>
    `${pagesToMaster} páginas de ${problemsPerPage} contas · passe com ${pct}%+ de acerto, média abaixo de ${sec}s cada`,
  pageLabel: (page, totalPages) => `Página ${page}/${totalPages}`,
  pageComplete: (page, totalPages) => `Página ${page} de ${totalPages} concluída!`,
  correctAnswerReveal: (answer) => `Resposta certa: ${answer} — tente de novo`,
  correctAnswerRevealWithRemainder: (q, r) => `Resposta certa: ${q} R ${r} — tente de novo`,
  correctAnswerRevealFraction: (n, d) => `Resposta certa: ${n}/${d} — tente de novo`,
  correctAnswerRevealDecimal: (w, t) => `Resposta certa: ${w}.${t} — tente de novo`,
  correctAnswerRevealPair: (a, b) => `Resposta certa: ${a}, ${b} — tente de novo`,
  correctAnswerRevealRadical: (c, i) => `Resposta certa: ${c}√${i} — tente de novo`,
  remainderLabel: "R",
  exitDrillAria: "Sair do treino",
  resultsPassHeadline: "Grau conquistado!",
  resultsFailHeadline: "Quase lá — mais uma rodada",
  resultsPassSub: (title) => `Você dominou "${title}".`,
  resultsFailSub: (title) => `"${title}" ainda precisa de um pouco mais de prática.`,
  accuracy: "Acerto",
  avgTime: "Tempo médio",
  beltEarned: (beltName) => `🏆 ${beltName} conquistada! Hora da próxima faixa.`,
  continue: "Continuar",
  tryAgain: "Tentar de novo",
  muteAria: "Silenciar som",
  unmuteAria: "Ativar som",
  gradeTitle: (grade) =>
    grade === "S"
      ? "Rank S — muito rápido e preciso"
      : grade === "A"
        ? "Rank A — bom ritmo"
        : "Rank B — aprovado",
  gradeEarned: (grade) => `Rank ${grade} conquistado!`,
  statsNav: "Estatísticas",
  statsTitle: "Hall da Fama",
  statBeltsEarned: "Faixas conquistadas",
  statStripesMastered: "Graus dominados",
  statDayStreak: "Sequência de dias",
  statSessions: "Sessões de prática",
  statGradeHint: "S = muito rápido · A = bom ritmo · B = aprovado",
};

const es: UiStrings = {
  tagline: "Gana tu cinturón, un paso a la vez.",
  comingSoon: "Próximamente",
  stripeLabel: "Grado",
  degreeLabel: "Nivel",
  backToMap: "Volver al mapa",
  startPractice: "Entendido — empezar a practicar",
  lessonMeta: (pagesToMaster, problemsPerPage, pct, sec) =>
    `${pagesToMaster} páginas de ${problemsPerPage} problemas · aprueba con ${pct}%+ de precisión, promediando menos de ${sec}s cada uno`,
  pageLabel: (page, totalPages) => `Página ${page}/${totalPages}`,
  pageComplete: (page, totalPages) => `¡Página ${page} de ${totalPages} lista!`,
  correctAnswerReveal: (answer) => `Respuesta correcta: ${answer} — inténtalo de nuevo`,
  correctAnswerRevealWithRemainder: (q, r) => `Respuesta correcta: ${q} R ${r} — inténtalo de nuevo`,
  correctAnswerRevealFraction: (n, d) => `Respuesta correcta: ${n}/${d} — inténtalo de nuevo`,
  correctAnswerRevealDecimal: (w, t) => `Respuesta correcta: ${w}.${t} — inténtalo de nuevo`,
  correctAnswerRevealPair: (a, b) => `Respuesta correcta: ${a}, ${b} — inténtalo de nuevo`,
  correctAnswerRevealRadical: (c, i) => `Respuesta correcta: ${c}√${i} — inténtalo de nuevo`,
  remainderLabel: "R",
  exitDrillAria: "Salir del ejercicio",
  resultsPassHeadline: "¡Grado conseguido!",
  resultsFailHeadline: "Casi — una ronda más",
  resultsPassSub: (title) => `Dominaste "${title}".`,
  resultsFailSub: (title) => `"${title}" todavía necesita un poco más de práctica.`,
  accuracy: "Precisión",
  avgTime: "Tiempo prom.",
  beltEarned: (beltName) => `🏆 ¡${beltName} conseguido! A por el siguiente cinturón.`,
  continue: "Continuar",
  tryAgain: "Intentar de nuevo",
  muteAria: "Silenciar sonido",
  unmuteAria: "Activar sonido",
  gradeTitle: (grade) =>
    grade === "S"
      ? "Rango S — muy rápido y preciso"
      : grade === "A"
        ? "Rango A — buen ritmo"
        : "Rango B — aprobado",
  gradeEarned: (grade) => `¡Rango ${grade} conseguido!`,
  statsNav: "Estadísticas",
  statsTitle: "Salón de la Fama",
  statBeltsEarned: "Cinturones conseguidos",
  statStripesMastered: "Grados dominados",
  statDayStreak: "Racha de días",
  statSessions: "Sesiones de práctica",
  statGradeHint: "S = muy rápido · A = buen ritmo · B = aprobado",
};

export const UI_STRINGS: Record<Locale, UiStrings> = { en, pt, es };
