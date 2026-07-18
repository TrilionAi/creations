import type { Locale } from "../types";

interface UiStrings {
  tagline: string;
  comingSoon: string;
  stripeLabel: string;
  backToMap: string;
  startPractice: string;
  lessonMeta: (pagesToMaster: number, problemsPerPage: number, pct: number, sec: number) => string;
  pageLabel: (page: number, totalPages: number) => string;
  pageComplete: (page: number, totalPages: number) => string;
  correctAnswerReveal: (answer: number) => string;
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
}

const en: UiStrings = {
  tagline: "Earn your belt, one small step at a time.",
  comingSoon: "Coming soon",
  stripeLabel: "Stripe",
  backToMap: "Back to map",
  startPractice: "I've got it — start practice",
  lessonMeta: (pagesToMaster, problemsPerPage, pct, sec) =>
    `${pagesToMaster} pages of ${problemsPerPage} problems · pass with ${pct}%+ accuracy, averaging under ${sec}s each`,
  pageLabel: (page, totalPages) => `Page ${page}/${totalPages}`,
  pageComplete: (page, totalPages) => `Page ${page} of ${totalPages} done!`,
  correctAnswerReveal: (answer) => `Correct answer: ${answer} — try it again`,
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
};

const pt: UiStrings = {
  tagline: "Conquiste sua faixa, um passo de cada vez.",
  comingSoon: "Em breve",
  stripeLabel: "Grau",
  backToMap: "Voltar ao mapa",
  startPractice: "Entendi — começar a praticar",
  lessonMeta: (pagesToMaster, problemsPerPage, pct, sec) =>
    `${pagesToMaster} páginas de ${problemsPerPage} contas · passe com ${pct}%+ de acerto, média abaixo de ${sec}s cada`,
  pageLabel: (page, totalPages) => `Página ${page}/${totalPages}`,
  pageComplete: (page, totalPages) => `Página ${page} de ${totalPages} concluída!`,
  correctAnswerReveal: (answer) => `Resposta certa: ${answer} — tente de novo`,
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
};

const es: UiStrings = {
  tagline: "Gana tu cinturón, un paso a la vez.",
  comingSoon: "Próximamente",
  stripeLabel: "Grado",
  backToMap: "Volver al mapa",
  startPractice: "Entendido — empezar a practicar",
  lessonMeta: (pagesToMaster, problemsPerPage, pct, sec) =>
    `${pagesToMaster} páginas de ${problemsPerPage} problemas · aprueba con ${pct}%+ de precisión, promediando menos de ${sec}s cada uno`,
  pageLabel: (page, totalPages) => `Página ${page}/${totalPages}`,
  pageComplete: (page, totalPages) => `¡Página ${page} de ${totalPages} lista!`,
  correctAnswerReveal: (answer) => `Respuesta correcta: ${answer} — inténtalo de nuevo`,
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
};

export const UI_STRINGS: Record<Locale, UiStrings> = { en, pt, es };
