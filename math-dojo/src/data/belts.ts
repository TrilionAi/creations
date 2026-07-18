import {
  generateAddWithin10,
  generateAddWithin20,
  generateThreeAddends,
  generateTwoDigitPlusOneNoCarry,
  generateTwoDigitPlusOneWithCarry,
  generateTwoDigitNoCarry,
  generateTwoDigitWithCarry,
  generateThreeDigitNoCarry,
  generateThreeDigitSingleCarry,
  generateThreeDigitDoubleCarry,
  generateSubWithin10,
  generateSubWithin20,
  generateSubThreeNumbers,
  generateTwoDigitMinusOneNoCarry,
  generateTwoDigitMinusOneWithCarry,
  generateTwoDigitMinusTwoDigitNoCarry,
  generateTwoDigitMinusTwoDigitWithCarry,
  generateThreeDigitMinusThreeDigitNoCarry,
  generateThreeDigitMinusThreeDigitSingleCarry,
  generateThreeDigitMinusThreeDigitDoubleCarry,
  generateFriendlyTables,
  generateTables3and4,
  generateHardTables,
  generateAllTablesMixed,
  generateMultiplyBy10And100,
  generateTwoDigitByOneDigitNoCarry,
  generateTwoDigitByOneDigitWithCarry,
  generateTwoDigitByTwoDigit,
  generateThreeDigitByOneDigit,
  generateThreeDigitByTwoDigit,
  generateExactDivision,
  generateDivisionWithRemainder,
  generateDivideBy10And100,
  generateTwoDigitByOneDigitExact,
  generateTwoDigitByOneDigitWithRemainder,
  generateThreeDigitByOneDigitExact,
  generateThreeDigitByOneDigitWithRemainder,
  generateTwoDigitDivisorExact,
  generateThreeDigitByTwoDigitExact,
  generateThreeDigitByTwoDigitWithRemainder,
  generateIdentifyFraction,
  generateEquivalentFraction,
  generateSimplifyFraction,
  generateFractionOfNumber,
  generateAddFractionsSameDenominator,
  generateSubtractFractionsSameDenominator,
  generateAddFractionsDifferentDenominators,
  generateMultiplyFractions,
  generateDivideFractions,
  generateMixedToImproper,
  generateIdentifyDecimalTenths,
  generateFractionTenthsToDecimal,
  generateMixedTenthsToDecimal,
  generateAddDecimalsNoCarry,
  generateAddDecimalsWithCarry,
  generateSubtractDecimalsNoBorrow,
  generateSubtractDecimalsWithBorrow,
  generateMultiplyDecimalBy10Or100,
  generateDivideWholeBy10,
  generateRoundDecimal,
} from "../engine/problemGenerator";
import type { Belt, LocalizedText } from "../types";

const whiteBelt: Belt = {
  id: "white",
  name: { en: "White Belt", pt: "Faixa Branca", es: "Cinturón Blanco" },
  order: 1,
  operationLabel: { en: "Addition", pt: "Soma", es: "Suma" },
  colorVar: "--belt-white",
  tagline: {
    en: "Every dojo journey starts here. Learn to add with confidence.",
    pt: "Toda jornada no dojo começa aqui. Aprenda a somar com confiança.",
    es: "Todo camino en el dojo empieza aquí. Aprende a sumar con confianza.",
  },
  stripes: [
    {
      id: "white-1",
      beltId: "white",
      index: 1,
      title: { en: "Adding within 10", pt: "Somar até 10", es: "Sumar hasta 10" },
      summary: {
        en: "Two small numbers that never add past 10.",
        pt: "Dois números pequenos que nunca passam de 10.",
        es: "Dos números pequeños que nunca superan 10.",
      },
      lesson: {
        intro: {
          en: "When both numbers are small, count on from the bigger one.",
          pt: "Quando os dois números são pequenos, conte a partir do maior.",
          es: "Cuando los dos números son pequeños, cuenta a partir del mayor.",
        },
        example: { id: "ex-white-1", prompt: "6 + 3", answer: 9, operands: [6, 3] },
        diagram: { kind: "numberLine", start: 6, end: 9 },
        steps: [
          {
            text: {
              en: "Start at the bigger number: 6.",
              pt: "Comece pelo número maior: 6.",
              es: "Empieza por el número mayor: 6.",
            },
          },
          {
            text: {
              en: "Count up 3 more: 7, 8, 9.",
              pt: "Conte mais 3: 7, 8, 9.",
              es: "Cuenta 3 más: 7, 8, 9.",
            },
          },
          { text: { en: "6 + 3 = 9.", pt: "6 + 3 = 9.", es: "6 + 3 = 9." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateAddWithin10,
    },
    {
      id: "white-2",
      beltId: "white",
      index: 2,
      title: { en: "Adding within 20", pt: "Somar até 20", es: "Sumar hasta 20" },
      summary: {
        en: "Crossing over 10 using the 'make ten' trick.",
        pt: "Passando de 10 usando o truque de 'completar 10'.",
        es: "Cruzando el 10 con el truco de 'completar 10'.",
      },
      lesson: {
        intro: {
          en: "Break the second number apart to fill the first one up to 10 — that's 'making ten'.",
          pt: "Quebre o segundo número em partes para completar o primeiro até 10 — isso é 'completar 10'.",
          es: "Divide el segundo número en partes para completar el primero hasta 10 — eso es 'completar 10'.",
        },
        example: { id: "ex-white-2", prompt: "8 + 5", answer: 13, operands: [8, 5] },
        steps: [
          {
            text: {
              en: "8 needs {{2}} more to reach 10.",
              pt: "O 8 precisa de mais {{2}} para chegar a 10.",
              es: "Al 8 le faltan {{2}} para llegar a 10.",
            },
          },
          {
            text: {
              en: "Split 5 into {{2}} + 3.",
              pt: "Separe o 5 em {{2}} + 3.",
              es: "Separa el 5 en {{2}} + 3.",
            },
          },
          {
            text: {
              en: "8 + {{2}} = 10, then 10 + 3 = 13.",
              pt: "8 + {{2}} = 10, depois 10 + 3 = 13.",
              es: "8 + {{2}} = 10, luego 10 + 3 = 13.",
            },
          },
          { text: { en: "8 + 5 = 13.", pt: "8 + 5 = 13.", es: "8 + 5 = 13." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateAddWithin20,
    },
    {
      id: "white-3",
      beltId: "white",
      index: 3,
      title: { en: "Adding three numbers", pt: "Somar três números", es: "Sumar tres números" },
      summary: {
        en: "Chain two additions together to combine three numbers.",
        pt: "Encadeie duas somas para juntar três números.",
        es: "Encadena dos sumas para juntar tres números.",
      },
      lesson: {
        intro: {
          en: "Add the first two numbers, then add the third to that total.",
          pt: "Some os dois primeiros números, depois some o terceiro a esse total.",
          es: "Suma los dos primeros números, luego suma el tercero a ese total.",
        },
        example: { id: "ex-white-3", prompt: "3 + 4 + 2", answer: 9, operands: [3, 4, 2] },
        steps: [
          {
            text: {
              en: "Add the first two: 3 + 4 = 7.",
              pt: "Some os dois primeiros: 3 + 4 = 7.",
              es: "Suma los dos primeros: 3 + 4 = 7.",
            },
          },
          {
            text: {
              en: "Add the third to that: 7 + 2 = 9.",
              pt: "Some o terceiro a esse total: 7 + 2 = 9.",
              es: "Suma el tercero a ese total: 7 + 2 = 9.",
            },
          },
          { text: { en: "3 + 4 + 2 = 9.", pt: "3 + 4 + 2 = 9.", es: "3 + 4 + 2 = 9." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 5, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateThreeAddends,
    },
    {
      id: "white-4",
      beltId: "white",
      index: 4,
      title: {
        en: "Two-digit + one-digit, no carrying",
        pt: "Dois dígitos + um dígito, sem 'vai um'",
        es: "Dos dígitos + un dígito, sin llevar",
      },
      summary: {
        en: "Add the single digit straight onto the units — the tens don't move.",
        pt: "Some o dígito único direto nas unidades — a dezena não muda.",
        es: "Suma el dígito único directo en las unidades — la decena no cambia.",
      },
      lesson: {
        intro: {
          en: "Only the units column changes. Add the small number there and keep the tens digit the same.",
          pt: "Só a coluna das unidades muda. Some o número pequeno ali e mantenha a dezena igual.",
          es: "Solo la columna de las unidades cambia. Suma el número pequeño ahí y mantén la decena igual.",
        },
        example: { id: "ex-white-4", prompt: "34 + 5", answer: 39, operands: [34, 5] },
        steps: [
          {
            text: {
              en: "Add to the units: 4 + 5 = 9.",
              pt: "Some nas unidades: 4 + 5 = 9.",
              es: "Suma en las unidades: 4 + 5 = 9.",
            },
          },
          {
            text: {
              en: "The tens digit stays: 3.",
              pt: "A dezena continua: 3.",
              es: "La decena se mantiene: 3.",
            },
          },
          { text: { en: "34 + 5 = 39.", pt: "34 + 5 = 39.", es: "34 + 5 = 39." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 5, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateTwoDigitPlusOneNoCarry,
    },
    {
      id: "white-5",
      beltId: "white",
      index: 5,
      title: {
        en: "Two-digit + one-digit, with carrying",
        pt: "Dois dígitos + um dígito, com 'vai um'",
        es: "Dos dígitos + un dígito, llevando",
      },
      summary: {
        en: "When the units overflow 9, carry the 1 into the tens.",
        pt: "Quando as unidades passam de 9, o 1 vai para a dezena.",
        es: "Cuando las unidades pasan de 9, el 1 se lleva a la decena.",
      },
      lesson: {
        intro: {
          en: "Add the units first. If it's 10 or more, carry the 1 into the tens digit.",
          pt: "Some as unidades primeiro. Se der 10 ou mais, leve o 1 para a dezena.",
          es: "Suma las unidades primero. Si da 10 o más, lleva el 1 a la decena.",
        },
        example: { id: "ex-white-5", prompt: "38 + 5", answer: 43, operands: [38, 5] },
        steps: [
          {
            text: {
              en: "Add the units: 8 + 5 = 13. Write the 3, carry the {{1}}.",
              pt: "Some as unidades: 8 + 5 = 13. Escreva o 3 e leve o {{1}}.",
              es: "Suma las unidades: 8 + 5 = 13. Escribe el 3 y lleva el {{1}}.",
            },
          },
          {
            text: {
              en: "Add the carried {{1}} to the tens: 3 + {{1}} = 4.",
              pt: "Some o {{1}} que veio à dezena: 3 + {{1}} = 4.",
              es: "Suma el {{1}} que llevaste a la decena: 3 + {{1}} = 4.",
            },
          },
          { text: { en: "38 + 5 = 43.", pt: "38 + 5 = 43.", es: "38 + 5 = 43." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateTwoDigitPlusOneWithCarry,
    },
    {
      id: "white-6",
      beltId: "white",
      index: 6,
      title: {
        en: "Two digits, no carrying",
        pt: "Dois dígitos, sem 'vai um'",
        es: "Dos dígitos, sin llevar",
      },
      summary: {
        en: "Line up the columns, add units and tens separately.",
        pt: "Alinhe as colunas e some unidades e dezenas separadamente.",
        es: "Alinea las columnas y suma unidades y decenas por separado.",
      },
      lesson: {
        intro: {
          en: "Line up the tens and units, then add each column on its own.",
          pt: "Alinhe as dezenas e unidades, depois some cada coluna separadamente.",
          es: "Alinea las decenas y unidades, luego suma cada columna por separado.",
        },
        example: { id: "ex-white-6", prompt: "34 + 25", answer: 59, operands: [34, 25] },
        steps: [
          {
            text: {
              en: "Add the units column: 4 + 5 = 9.",
              pt: "Some a coluna das unidades: 4 + 5 = 9.",
              es: "Suma la columna de las unidades: 4 + 5 = 9.",
            },
          },
          {
            text: {
              en: "Add the tens column: 3 + 2 = 5.",
              pt: "Some a coluna das dezenas: 3 + 2 = 5.",
              es: "Suma la columna de las decenas: 3 + 2 = 5.",
            },
          },
          {
            text: {
              en: "Put them together: 59.",
              pt: "Junte tudo: 59.",
              es: "Únelo todo: 59.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateTwoDigitNoCarry,
    },
    {
      id: "white-7",
      beltId: "white",
      index: 7,
      title: {
        en: "Two digits, with carrying",
        pt: "Dois dígitos, com 'vai um'",
        es: "Dos dígitos, llevando",
      },
      summary: {
        en: "When a column overflows 9, carry the 1.",
        pt: "Quando uma coluna passa de 9, o 1 'vai' para a próxima.",
        es: "Cuando una columna pasa de 9, el 1 'se lleva' a la siguiente.",
      },
      lesson: {
        intro: {
          en: "When the units add up to 10 or more, carry the extra 1 into the tens column.",
          pt: "Quando as unidades somam 10 ou mais, leve o 1 extra para a coluna das dezenas.",
          es: "Cuando las unidades suman 10 o más, lleva el 1 extra a la columna de las decenas.",
        },
        example: { id: "ex-white-7", prompt: "27 + 46", answer: 73, operands: [27, 46] },
        steps: [
          {
            text: {
              en: "Add the units column: 7 + 6 = 13. Write the 3, carry the {{1}}.",
              pt: "Some a coluna das unidades: 7 + 6 = 13. Escreva o 3 e leve o {{1}}.",
              es: "Suma la columna de las unidades: 7 + 6 = 13. Escribe el 3 y lleva el {{1}}.",
            },
          },
          {
            text: {
              en: "Add the tens column: 2 + 4 + {{1}} (carried) = 7.",
              pt: "Some a coluna das dezenas: 2 + 4 + {{1}} (que veio) = 7.",
              es: "Suma la columna de las decenas: 2 + 4 + {{1}} (que llevaste) = 7.",
            },
          },
          { text: { en: "27 + 46 = 73.", pt: "27 + 46 = 73.", es: "27 + 46 = 73." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 15 },
      generate: generateTwoDigitWithCarry,
    },
    {
      id: "white-8",
      beltId: "white",
      index: 8,
      title: {
        en: "Three digits, no carrying",
        pt: "Três dígitos, sem 'vai um'",
        es: "Tres dígitos, sin llevar",
      },
      summary: {
        en: "Same column method, one more column: hundreds, tens, units.",
        pt: "Mesmo método das colunas, só mais uma: centena, dezena, unidade.",
        es: "Mismo método de columnas, una más: centena, decena, unidad.",
      },
      lesson: {
        intro: {
          en: "Line up hundreds, tens and units, then add each column on its own — just like before, with one extra column.",
          pt: "Alinhe centenas, dezenas e unidades, depois some cada coluna separadamente — igual antes, com mais uma coluna.",
          es: "Alinea centenas, decenas y unidades, luego suma cada columna por separado — igual que antes, con una columna más.",
        },
        example: { id: "ex-white-8", prompt: "213 + 154", answer: 367, operands: [213, 154] },
        steps: [
          {
            text: {
              en: "Add the units: 3 + 4 = 7.",
              pt: "Some as unidades: 3 + 4 = 7.",
              es: "Suma las unidades: 3 + 4 = 7.",
            },
          },
          {
            text: {
              en: "Add the tens: 1 + 5 = 6.",
              pt: "Some as dezenas: 1 + 5 = 6.",
              es: "Suma las decenas: 1 + 5 = 6.",
            },
          },
          {
            text: {
              en: "Add the hundreds: 2 + 1 = 3.",
              pt: "Some as centenas: 2 + 1 = 3.",
              es: "Suma las centenas: 2 + 1 = 3.",
            },
          },
          { text: { en: "213 + 154 = 367.", pt: "213 + 154 = 367.", es: "213 + 154 = 367." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateThreeDigitNoCarry,
    },
    {
      id: "white-9",
      beltId: "white",
      index: 9,
      title: { en: "Three digits, one carry", pt: "Três dígitos, um 'vai um'", es: "Tres dígitos, un acarreo" },
      summary: {
        en: "The carry moves one column over, same as always.",
        pt: "O 'vai um' passa para a próxima coluna, como sempre.",
        es: "El acarreo pasa a la siguiente columna, como siempre.",
      },
      lesson: {
        intro: {
          en: "Work column by column. If units carry into tens, add that 1 in before moving to hundreds.",
          pt: "Trabalhe coluna por coluna. Se as unidades gerarem 'vai um', some esse 1 antes de ir para as centenas.",
          es: "Trabaja columna por columna. Si las unidades generan acarreo, súmalo antes de pasar a las centenas.",
        },
        example: { id: "ex-white-9", prompt: "217 + 156", answer: 373, operands: [217, 156] },
        steps: [
          {
            text: {
              en: "Add the units: 7 + 6 = 13. Write the 3, carry the {{1}}.",
              pt: "Some as unidades: 7 + 6 = 13. Escreva o 3 e leve o {{1}}.",
              es: "Suma las unidades: 7 + 6 = 13. Escribe el 3 y lleva el {{1}}.",
            },
          },
          {
            text: {
              en: "Add the tens plus the carry: 1 + 5 + {{1}} = 7.",
              pt: "Some as dezenas mais o que veio: 1 + 5 + {{1}} = 7.",
              es: "Suma las decenas más el acarreo: 1 + 5 + {{1}} = 7.",
            },
          },
          {
            text: {
              en: "Add the hundreds: 2 + 1 = 3.",
              pt: "Some as centenas: 2 + 1 = 3.",
              es: "Suma las centenas: 2 + 1 = 3.",
            },
          },
          { text: { en: "217 + 156 = 373.", pt: "217 + 156 = 373.", es: "217 + 156 = 373." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateThreeDigitSingleCarry,
    },
    {
      id: "white-10",
      beltId: "white",
      index: 10,
      title: {
        en: "Three digits, double carry",
        pt: "Três dígitos, 'vai um' duplo",
        es: "Tres dígitos, doble acarreo",
      },
      summary: {
        en: "The carry can cascade — units into tens, and tens into hundreds.",
        pt: "O 'vai um' pode se repetir — das unidades pra dezena, e da dezena pra centena.",
        es: "El acarreo puede repetirse — de las unidades a las decenas, y de las decenas a las centenas.",
      },
      lesson: {
        intro: {
          en: "Sometimes one carry triggers another. Work column by column and carry every time a column passes 9.",
          pt: "Às vezes um 'vai um' gera outro. Trabalhe coluna por coluna e leve o 1 sempre que uma coluna passar de 9.",
          es: "A veces un acarreo genera otro. Trabaja columna por columna y lleva el 1 cada vez que una columna pase de 9.",
        },
        example: { id: "ex-white-10", prompt: "587 + 368", answer: 955, operands: [587, 368] },
        steps: [
          {
            text: {
              en: "Add the units: 7 + 8 = 15. Write the 5, carry the {{1}}.",
              pt: "Some as unidades: 7 + 8 = 15. Escreva o 5 e leve o {{1}}.",
              es: "Suma las unidades: 7 + 8 = 15. Escribe el 5 y lleva el {{1}}.",
            },
          },
          {
            text: {
              en: "Add the tens plus the carry: 8 + 6 + {{1}} = 15. Write the 5, carry the {{1}} again.",
              pt: "Some as dezenas mais o que veio: 8 + 6 + {{1}} = 15. Escreva o 5 e leve o {{1}} de novo.",
              es: "Suma las decenas más el acarreo: 8 + 6 + {{1}} = 15. Escribe el 5 y lleva el {{1}} de nuevo.",
            },
          },
          {
            text: {
              en: "Add the hundreds plus the carry: 5 + 3 + {{1}} = 9.",
              pt: "Some as centenas mais o que veio: 5 + 3 + {{1}} = 9.",
              es: "Suma las centenas más el acarreo: 5 + 3 + {{1}} = 9.",
            },
          },
          { text: { en: "587 + 368 = 955.", pt: "587 + 368 = 955.", es: "587 + 368 = 955." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 24 },
      generate: generateThreeDigitDoubleCarry,
    },
  ],
};

const blueBelt: Belt = {
  id: "blue",
  name: { en: "Blue Belt", pt: "Faixa Azul", es: "Cinturón Azul" },
  order: 2,
  operationLabel: { en: "Subtraction", pt: "Subtração", es: "Resta" },
  colorVar: "--belt-blue",
  tagline: {
    en: "Take away with the same small-step precision.",
    pt: "Subtraia com a mesma precisão passo a passo.",
    es: "Resta con la misma precisión paso a paso.",
  },
  stripes: [
    {
      id: "blue-1",
      beltId: "blue",
      index: 1,
      title: { en: "Subtracting within 10", pt: "Subtrair até 10", es: "Restar hasta 10" },
      summary: {
        en: "Take a small number away without ever going below zero.",
        pt: "Tire um número pequeno sem nunca passar de zero.",
        es: "Resta un número pequeño sin nunca pasar de cero.",
      },
      lesson: {
        intro: {
          en: "Count backwards from the bigger number.",
          pt: "Conte para trás a partir do número maior.",
          es: "Cuenta hacia atrás desde el número mayor.",
        },
        example: { id: "ex-blue-1", prompt: "9 - 3", answer: 6, operands: [9, 3] },
        diagram: { kind: "numberLine", start: 9, end: 6 },
        steps: [
          { text: { en: "Start at 9.", pt: "Comece no 9.", es: "Empieza en el 9." } },
          {
            text: {
              en: "Count back 3: 8, 7, 6.",
              pt: "Conte 3 para trás: 8, 7, 6.",
              es: "Cuenta 3 hacia atrás: 8, 7, 6.",
            },
          },
          { text: { en: "9 - 3 = 6.", pt: "9 - 3 = 6.", es: "9 - 3 = 6." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateSubWithin10,
    },
    {
      id: "blue-2",
      beltId: "blue",
      index: 2,
      title: { en: "Subtracting within 20", pt: "Subtrair até 20", es: "Restar hasta 20" },
      summary: {
        en: "Bridge back through 10 the same way you bridged forward.",
        pt: "Volte pelo 10 do mesmo jeito que você foi para frente.",
        es: "Cruza de vuelta por el 10 igual que cruzaste hacia adelante.",
      },
      lesson: {
        intro: {
          en: "Break the number you're subtracting into two parts: enough to bring the first number down to 10, then the rest.",
          pt: "Quebre o número que você está subtraindo em duas partes: o suficiente para levar o primeiro número até 10, depois o resto.",
          es: "Divide el número que restas en dos partes: lo suficiente para bajar el primer número hasta 10, y luego el resto.",
        },
        example: { id: "ex-blue-2", prompt: "15 - 8", answer: 7, operands: [15, 8] },
        steps: [
          {
            text: {
              en: "15 needs to lose {{5}} to reach 10.",
              pt: "O 15 precisa perder {{5}} para chegar a 10.",
              es: "Al 15 le hace falta perder {{5}} para llegar a 10.",
            },
          },
          {
            text: {
              en: "Split 8 into {{5}} + 3.",
              pt: "Separe o 8 em {{5}} + 3.",
              es: "Separa el 8 en {{5}} + 3.",
            },
          },
          {
            text: {
              en: "15 - {{5}} = 10, then 10 - 3 = 7.",
              pt: "15 - {{5}} = 10, depois 10 - 3 = 7.",
              es: "15 - {{5}} = 10, luego 10 - 3 = 7.",
            },
          },
          { text: { en: "15 - 8 = 7.", pt: "15 - 8 = 7.", es: "15 - 8 = 7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateSubWithin20,
    },
    {
      id: "blue-3",
      beltId: "blue",
      index: 3,
      title: { en: "Subtracting three numbers", pt: "Subtrair três números", es: "Restar tres números" },
      summary: {
        en: "Chain two subtractions together.",
        pt: "Encadeie duas subtrações.",
        es: "Encadena dos restas.",
      },
      lesson: {
        intro: {
          en: "Subtract the second number first, then subtract the third from what's left.",
          pt: "Subtraia o segundo número primeiro, depois subtraia o terceiro do que sobrou.",
          es: "Resta el segundo número primero, luego resta el tercero de lo que queda.",
        },
        example: { id: "ex-blue-3", prompt: "15 - 4 - 3", answer: 8, operands: [15, 4, 3] },
        steps: [
          {
            text: {
              en: "Subtract the first two: 15 - 4 = 11.",
              pt: "Subtraia os dois primeiros: 15 - 4 = 11.",
              es: "Resta los dos primeros: 15 - 4 = 11.",
            },
          },
          {
            text: {
              en: "Subtract the third from that: 11 - 3 = 8.",
              pt: "Subtraia o terceiro disso: 11 - 3 = 8.",
              es: "Resta el tercero de eso: 11 - 3 = 8.",
            },
          },
          { text: { en: "15 - 4 - 3 = 8.", pt: "15 - 4 - 3 = 8.", es: "15 - 4 - 3 = 8." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 5, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateSubThreeNumbers,
    },
    {
      id: "blue-4",
      beltId: "blue",
      index: 4,
      title: {
        en: "Two-digit − one-digit, no borrowing",
        pt: "Dois dígitos − um dígito, sem 'emprestar'",
        es: "Dos dígitos − un dígito, sin prestar",
      },
      summary: {
        en: "The units digit is big enough — just subtract it directly.",
        pt: "A unidade já é grande o suficiente — só subtraia direto.",
        es: "La unidad ya es suficiente — solo réstala directo.",
      },
      lesson: {
        intro: {
          en: "If the units digit is bigger than what you're subtracting, just take it away — the tens digit doesn't change.",
          pt: "Se a unidade for maior que o que você vai subtrair, é só tirar — a dezena não muda.",
          es: "Si la unidad es mayor que lo que vas a restar, solo quítalo — la decena no cambia.",
        },
        example: { id: "ex-blue-4", prompt: "47 - 5", answer: 42, operands: [47, 5] },
        steps: [
          {
            text: {
              en: "Subtract from the units: 7 - 5 = 2.",
              pt: "Subtraia nas unidades: 7 - 5 = 2.",
              es: "Resta en las unidades: 7 - 5 = 2.",
            },
          },
          {
            text: {
              en: "The tens digit stays: 4.",
              pt: "A dezena continua: 4.",
              es: "La decena se mantiene: 4.",
            },
          },
          { text: { en: "47 - 5 = 42.", pt: "47 - 5 = 42.", es: "47 - 5 = 42." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 5, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateTwoDigitMinusOneNoCarry,
    },
    {
      id: "blue-5",
      beltId: "blue",
      index: 5,
      title: {
        en: "Two-digit − one-digit, with borrowing",
        pt: "Dois dígitos − um dígito, com 'emprestar'",
        es: "Dos dígitos − un dígito, prestando",
      },
      summary: {
        en: "When the units digit is too small, borrow 10 from the tens.",
        pt: "Quando a unidade é pequena demais, empreste 10 da dezena.",
        es: "Cuando la unidad es muy pequeña, presta 10 de la decena.",
      },
      lesson: {
        intro: {
          en: "If you can't subtract the units directly, borrow 1 ten (10) from the tens digit and add it to the units.",
          pt: "Se não der pra subtrair a unidade direto, empreste 1 dezena (10) e some com a unidade.",
          es: "Si no puedes restar la unidad directo, presta 1 decena (10) y súmala a la unidad.",
        },
        example: { id: "ex-blue-5", prompt: "42 - 7", answer: 35, operands: [42, 7] },
        steps: [
          {
            text: {
              en: "2 is smaller than 7, so borrow {{1}} ten: 12 - 7 = 5.",
              pt: "2 é menor que 7, então empreste {{1}} dezena: 12 - 7 = 5.",
              es: "2 es menor que 7, así que presta {{1}} decena: 12 - 7 = 5.",
            },
          },
          {
            text: {
              en: "The tens digit loses {{1}}: 4 becomes 3.",
              pt: "A dezena perde {{1}}: 4 vira 3.",
              es: "La decena pierde {{1}}: 4 se convierte en 3.",
            },
          },
          { text: { en: "42 - 7 = 35.", pt: "42 - 7 = 35.", es: "42 - 7 = 35." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateTwoDigitMinusOneWithCarry,
    },
    {
      id: "blue-6",
      beltId: "blue",
      index: 6,
      title: { en: "Two digits, no borrowing", pt: "Dois dígitos, sem 'emprestar'", es: "Dos dígitos, sin prestar" },
      summary: {
        en: "Subtract each column on its own, top digit always bigger.",
        pt: "Subtraia cada coluna separadamente, o de cima sempre maior.",
        es: "Resta cada columna por separado, el de arriba siempre mayor.",
      },
      lesson: {
        intro: {
          en: "Line up the tens and units, then subtract each column on its own.",
          pt: "Alinhe as dezenas e unidades, depois subtraia cada coluna separadamente.",
          es: "Alinea las decenas y unidades, luego resta cada columna por separado.",
        },
        example: { id: "ex-blue-6", prompt: "58 - 23", answer: 35, operands: [58, 23] },
        steps: [
          {
            text: {
              en: "Subtract the units: 8 - 3 = 5.",
              pt: "Subtraia as unidades: 8 - 3 = 5.",
              es: "Resta las unidades: 8 - 3 = 5.",
            },
          },
          {
            text: {
              en: "Subtract the tens: 5 - 2 = 3.",
              pt: "Subtraia as dezenas: 5 - 2 = 3.",
              es: "Resta las decenas: 5 - 2 = 3.",
            },
          },
          { text: { en: "58 - 23 = 35.", pt: "58 - 23 = 35.", es: "58 - 23 = 35." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateTwoDigitMinusTwoDigitNoCarry,
    },
    {
      id: "blue-7",
      beltId: "blue",
      index: 7,
      title: { en: "Two digits, with borrowing", pt: "Dois dígitos, com 'emprestar'", es: "Dos dígitos, prestando" },
      summary: {
        en: "When the top units digit is smaller, borrow from the tens.",
        pt: "Quando a unidade de cima é menor, empreste da dezena.",
        es: "Cuando la unidad de arriba es menor, presta de la decena.",
      },
      lesson: {
        intro: {
          en: "If the units on top are smaller than the units on the bottom, borrow 1 ten before subtracting.",
          pt: "Se a unidade de cima for menor que a de baixo, empreste 1 dezena antes de subtrair.",
          es: "Si la unidad de arriba es menor que la de abajo, presta 1 decena antes de restar.",
        },
        example: { id: "ex-blue-7", prompt: "52 - 27", answer: 25, operands: [52, 27] },
        steps: [
          {
            text: {
              en: "2 is smaller than 7, so borrow {{1}} ten: 12 - 7 = 5.",
              pt: "2 é menor que 7, então empreste {{1}} dezena: 12 - 7 = 5.",
              es: "2 es menor que 7, así que presta {{1}} decena: 12 - 7 = 5.",
            },
          },
          {
            text: {
              en: "The tens digit loses {{1}}: 5 - {{1}} = 4, then 4 - 2 = 2.",
              pt: "A dezena perde {{1}}: 5 - {{1}} = 4, depois 4 - 2 = 2.",
              es: "La decena pierde {{1}}: 5 - {{1}} = 4, luego 4 - 2 = 2.",
            },
          },
          { text: { en: "52 - 27 = 25.", pt: "52 - 27 = 25.", es: "52 - 27 = 25." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 15 },
      generate: generateTwoDigitMinusTwoDigitWithCarry,
    },
    {
      id: "blue-8",
      beltId: "blue",
      index: 8,
      title: {
        en: "Three digits, no borrowing",
        pt: "Três dígitos, sem 'emprestar'",
        es: "Tres dígitos, sin prestar",
      },
      summary: {
        en: "Same column method, one more column: hundreds, tens, units.",
        pt: "Mesmo método das colunas, só mais uma: centena, dezena, unidade.",
        es: "Mismo método de columnas, una más: centena, decena, unidad.",
      },
      lesson: {
        intro: {
          en: "Line up hundreds, tens and units, then subtract each column on its own.",
          pt: "Alinhe centenas, dezenas e unidades, depois subtraia cada coluna separadamente.",
          es: "Alinea centenas, decenas y unidades, luego resta cada columna por separado.",
        },
        example: { id: "ex-blue-8", prompt: "468 - 235", answer: 233, operands: [468, 235] },
        steps: [
          {
            text: {
              en: "Subtract the units: 8 - 5 = 3.",
              pt: "Subtraia as unidades: 8 - 5 = 3.",
              es: "Resta las unidades: 8 - 5 = 3.",
            },
          },
          {
            text: {
              en: "Subtract the tens: 6 - 3 = 3.",
              pt: "Subtraia as dezenas: 6 - 3 = 3.",
              es: "Resta las decenas: 6 - 3 = 3.",
            },
          },
          {
            text: {
              en: "Subtract the hundreds: 4 - 2 = 2.",
              pt: "Subtraia as centenas: 4 - 2 = 2.",
              es: "Resta las centenas: 4 - 2 = 2.",
            },
          },
          { text: { en: "468 - 235 = 233.", pt: "468 - 235 = 233.", es: "468 - 235 = 233." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateThreeDigitMinusThreeDigitNoCarry,
    },
    {
      id: "blue-9",
      beltId: "blue",
      index: 9,
      title: { en: "Three digits, one borrow", pt: "Três dígitos, um 'emprestar'", es: "Tres dígitos, un préstamo" },
      summary: {
        en: "The borrow moves one column over, same as always.",
        pt: "O empréstimo passa para a próxima coluna, como sempre.",
        es: "El préstamo pasa a la siguiente columna, como siempre.",
      },
      lesson: {
        intro: {
          en: "Work column by column. If the units need to borrow, take 1 ten from the tens digit before moving to hundreds.",
          pt: "Trabalhe coluna por coluna. Se a unidade precisar emprestar, tire 1 dezena antes de ir para as centenas.",
          es: "Trabaja columna por columna. Si la unidad necesita prestar, quita 1 decena antes de pasar a las centenas.",
        },
        example: { id: "ex-blue-9", prompt: "342 - 128", answer: 214, operands: [342, 128] },
        steps: [
          {
            text: {
              en: "2 is smaller than 8, so borrow {{1}} ten: 12 - 8 = 4.",
              pt: "2 é menor que 8, então empreste {{1}} dezena: 12 - 8 = 4.",
              es: "2 es menor que 8, así que presta {{1}} decena: 12 - 8 = 4.",
            },
          },
          {
            text: {
              en: "The tens digit loses {{1}}: 4 - {{1}} = 3, then 3 - 2 = 1.",
              pt: "A dezena perde {{1}}: 4 - {{1}} = 3, depois 3 - 2 = 1.",
              es: "La decena pierde {{1}}: 4 - {{1}} = 3, luego 3 - 2 = 1.",
            },
          },
          {
            text: {
              en: "Subtract the hundreds: 3 - 1 = 2.",
              pt: "Subtraia as centenas: 3 - 1 = 2.",
              es: "Resta las centenas: 3 - 1 = 2.",
            },
          },
          { text: { en: "342 - 128 = 214.", pt: "342 - 128 = 214.", es: "342 - 128 = 214." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateThreeDigitMinusThreeDigitSingleCarry,
    },
    {
      id: "blue-10",
      beltId: "blue",
      index: 10,
      title: {
        en: "Three digits, double borrow",
        pt: "Três dígitos, 'emprestar' duplo",
        es: "Tres dígitos, doble préstamo",
      },
      summary: {
        en: "The borrow can cascade — units from tens, and tens from hundreds.",
        pt: "O empréstimo pode se repetir — das dezenas pras unidades, e das centenas pras dezenas.",
        es: "El préstamo puede repetirse — de las decenas a las unidades, y de las centenas a las decenas.",
      },
      lesson: {
        intro: {
          en: "Sometimes one borrow triggers another. Work column by column and borrow every time the top digit is too small.",
          pt: "Às vezes um empréstimo gera outro. Trabalhe coluna por coluna e empreste sempre que o dígito de cima for pequeno demais.",
          es: "A veces un préstamo genera otro. Trabaja columna por columna y presta cada vez que el dígito de arriba sea muy pequeño.",
        },
        example: { id: "ex-blue-10", prompt: "523 - 357", answer: 166, operands: [523, 357] },
        steps: [
          {
            text: {
              en: "3 is smaller than 7, so borrow {{1}} ten: 13 - 7 = 6.",
              pt: "3 é menor que 7, então empreste {{1}} dezena: 13 - 7 = 6.",
              es: "3 es menor que 7, así que presta {{1}} decena: 13 - 7 = 6.",
            },
          },
          {
            text: {
              en: "The tens digit loses {{1}}, becoming 1, which is smaller than 5 — borrow again: 11 - 5 = 6.",
              pt: "A dezena perde {{1}}, vira 1, que é menor que 5 — empreste de novo: 11 - 5 = 6.",
              es: "La decena pierde {{1}}, queda en 1, que es menor que 5 — presta de nuevo: 11 - 5 = 6.",
            },
          },
          {
            text: {
              en: "The hundreds digit loses {{1}}: 5 - {{1}} = 4, then 4 - 3 = 1.",
              pt: "A centena perde {{1}}: 5 - {{1}} = 4, depois 4 - 3 = 1.",
              es: "La centena pierde {{1}}: 5 - {{1}} = 4, luego 4 - 3 = 1.",
            },
          },
          { text: { en: "523 - 357 = 166.", pt: "523 - 357 = 166.", es: "523 - 357 = 166." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 24 },
      generate: generateThreeDigitMinusThreeDigitDoubleCarry,
    },
  ],
};

const purpleBelt: Belt = {
  id: "purple",
  name: { en: "Purple Belt", pt: "Faixa Roxa", es: "Cinturón Morado" },
  order: 3,
  operationLabel: { en: "Multiplication", pt: "Multiplicação", es: "Multiplicación" },
  colorVar: "--belt-purple",
  tagline: {
    en: "Times tables until they're pure instinct.",
    pt: "Tabuada até virar puro instinto.",
    es: "Tablas de multiplicar hasta que sean puro instinto.",
  },
  stripes: [
    {
      id: "purple-1",
      beltId: "purple",
      index: 1,
      title: { en: "What multiplication means", pt: "O que significa multiplicar", es: "Qué significa multiplicar" },
      summary: {
        en: "Equal groups added together — see it, then say it as a multiplication.",
        pt: "Grupos iguais somados juntos — veja, depois diga como uma multiplicação.",
        es: "Grupos iguales sumados juntos — mira, y luego dilo como una multiplicación.",
      },
      lesson: {
        intro: {
          en: "Multiplication means adding equal groups together. Picture the groups below, then add them all up.",
          pt: "Multiplicação significa somar grupos iguais. Veja os grupos abaixo, depois some tudo.",
          es: "La multiplicación significa sumar grupos iguales. Mira los grupos abajo, luego suma todo.",
        },
        example: { id: "ex-purple-1", prompt: "4 × 3", answer: 12, operands: [4, 3] },
        diagram: { kind: "groups", groups: 3, perGroup: 4 },
        steps: [
          {
            text: {
              en: "Picture 3 equal groups of 4, like above.",
              pt: "Veja 3 grupos iguais de 4, como acima.",
              es: "Mira 3 grupos iguales de 4, como arriba.",
            },
          },
          {
            text: {
              en: "Add the groups together: 4 + 4 + 4 = 12.",
              pt: "Some os grupos: 4 + 4 + 4 = 12.",
              es: "Suma los grupos: 4 + 4 + 4 = 12.",
            },
          },
          {
            text: {
              en: "That's what 4 × 3 means: 3 groups of 4.",
              pt: "É isso que 4 × 3 significa: 3 grupos de 4.",
              es: "Eso es lo que significa 4 × 3: 3 grupos de 4.",
            },
          },
          { text: { en: "4 × 3 = 12.", pt: "4 × 3 = 12.", es: "4 × 3 = 12." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateTables3and4,
    },
    {
      id: "purple-2",
      beltId: "purple",
      index: 2,
      title: {
        en: "The friendly tables: ×2, ×5, ×10",
        pt: "As tabuadas fáceis: ×2, ×5, ×10",
        es: "Las tablas fáciles: ×2, ×5, ×10",
      },
      summary: {
        en: "Three tables that share an easy pattern.",
        pt: "Três tabuadas que compartilham um padrão fácil.",
        es: "Tres tablas que comparten un patrón fácil.",
      },
      lesson: {
        intro: {
          en: "×10 just adds a zero. ×5 is always half of that. ×2 is always double the number itself.",
          pt: "×10 só adiciona um zero. ×5 é sempre a metade disso. ×2 é sempre o dobro do próprio número.",
          es: "×10 solo agrega un cero. ×5 es siempre la mitad de eso. ×2 es siempre el doble del propio número.",
        },
        example: { id: "ex-purple-2", prompt: "8 × 10", answer: 80, operands: [8, 10] },
        steps: [
          {
            text: {
              en: "×10: add a zero. 8 becomes 80.",
              pt: "×10: adicione um zero. 8 vira 80.",
              es: "×10: agrega un cero. 8 se convierte en 80.",
            },
          },
          {
            text: {
              en: "×5 is always half of ×10: 8 × 5 = 40.",
              pt: "×5 é sempre a metade de ×10: 8 × 5 = 40.",
              es: "×5 es siempre la mitad de ×10: 8 × 5 = 40.",
            },
          },
          {
            text: {
              en: "×2 is always double the number: 8 × 2 = 16.",
              pt: "×2 é sempre o dobro do número: 8 × 2 = 16.",
              es: "×2 es siempre el doble del número: 8 × 2 = 16.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 5 },
      generate: generateFriendlyTables,
    },
    {
      id: "purple-3",
      beltId: "purple",
      index: 3,
      title: { en: "Times tables 6, 7, 8, 9", pt: "Tabuada do 6, 7, 8 e 9", es: "Tablas del 6, 7, 8 y 9" },
      summary: {
        en: "Break a hard fact into two easier ones.",
        pt: "Quebre uma conta difícil em duas mais fáceis.",
        es: "Divide una cuenta difícil en dos más fáciles.",
      },
      lesson: {
        intro: {
          en: "Split the harder number into a 5 plus the rest, solve both, then add.",
          pt: "Separe o número mais difícil em 5 mais o resto, resolva os dois e some.",
          es: "Separa el número más difícil en 5 más el resto, resuelve ambos y suma.",
        },
        example: { id: "ex-purple-3", prompt: "7 × 8", answer: 56, operands: [7, 8] },
        steps: [
          {
            text: {
              en: "Break 8 into {{5}} + {{3}}.",
              pt: "Separe o 8 em {{5}} + {{3}}.",
              es: "Separa el 8 en {{5}} + {{3}}.",
            },
          },
          {
            text: {
              en: "7 × {{5}} = 35 and 7 × {{3}} = 21.",
              pt: "7 × {{5}} = 35 e 7 × {{3}} = 21.",
              es: "7 × {{5}} = 35 y 7 × {{3}} = 21.",
            },
          },
          { text: { en: "35 + 21 = 56.", pt: "35 + 21 = 56.", es: "35 + 21 = 56." } },
          { text: { en: "7 × 8 = 56.", pt: "7 × 8 = 56.", es: "7 × 8 = 56." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 7 },
      generate: generateHardTables,
    },
    {
      id: "purple-4",
      beltId: "purple",
      index: 4,
      title: {
        en: "All single-digit tables, mixed",
        pt: "Todas as tabuadas, misturadas",
        es: "Todas las tablas, mezcladas",
      },
      summary: {
        en: "Every fact from 2 to 9, no more sorting by table.",
        pt: "Todas as contas de 2 a 9, sem separar por tabuada.",
        es: "Todas las cuentas del 2 al 9, sin separar por tabla.",
      },
      lesson: {
        intro: {
          en: "Try to recall the fact directly. If you get stuck, use the ×9 trick: multiply by 10, then subtract the number.",
          pt: "Tente lembrar a conta direto. Se travar, use o truque do ×9: multiplique por 10 e depois subtraia o número.",
          es: "Intenta recordar la cuenta directo. Si te trabas, usa el truco del ×9: multiplica por 10 y luego resta el número.",
        },
        example: { id: "ex-purple-4", prompt: "6 × 9", answer: 54, operands: [6, 9] },
        steps: [
          {
            text: {
              en: "Stuck on ×9? Multiply by 10 first: 6 × 10 = {{60}}.",
              pt: "Travou no ×9? Multiplique por 10 primeiro: 6 × 10 = {{60}}.",
              es: "¿Te trabaste en el ×9? Multiplica por 10 primero: 6 × 10 = {{60}}.",
            },
          },
          {
            text: {
              en: "Then subtract the number once: {{60}} - 6 = 54.",
              pt: "Depois subtraia o número uma vez: {{60}} - 6 = 54.",
              es: "Luego resta el número una vez: {{60}} - 6 = 54.",
            },
          },
          { text: { en: "6 × 9 = 54.", pt: "6 × 9 = 54.", es: "6 × 9 = 54." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateAllTablesMixed,
    },
    {
      id: "purple-5",
      beltId: "purple",
      index: 5,
      title: {
        en: "Multiplying by 10 and 100",
        pt: "Multiplicar por 10 e por 100",
        es: "Multiplicar por 10 y por 100",
      },
      summary: {
        en: "The zero trick works on any number, not just single digits.",
        pt: "O truque do zero funciona em qualquer número, não só nos de um dígito.",
        es: "El truco del cero funciona con cualquier número, no solo con los de un dígito.",
      },
      lesson: {
        intro: {
          en: "Multiplying by 10 adds one zero. Multiplying by 100 adds two zeros — for any number.",
          pt: "Multiplicar por 10 adiciona um zero. Multiplicar por 100 adiciona dois zeros — para qualquer número.",
          es: "Multiplicar por 10 agrega un cero. Multiplicar por 100 agrega dos ceros — para cualquier número.",
        },
        example: { id: "ex-purple-5", prompt: "23 × 100", answer: 2300, operands: [23, 100] },
        steps: [
          { text: { en: "×100 adds two zeros.", pt: "×100 adiciona dois zeros.", es: "×100 agrega dos ceros." } },
          { text: { en: "23 becomes 2300.", pt: "23 vira 2300.", es: "23 se convierte en 2300." } },
          { text: { en: "23 × 100 = 2300.", pt: "23 × 100 = 2300.", es: "23 × 100 = 2300." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 5, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateMultiplyBy10And100,
    },
    {
      id: "purple-6",
      beltId: "purple",
      index: 6,
      title: {
        en: "Two-digit × one-digit, no carrying",
        pt: "Dois dígitos × um dígito, sem 'vai um'",
        es: "Dos dígitos × un dígito, sin llevar",
      },
      summary: {
        en: "Multiply the units and tens separately, then add.",
        pt: "Multiplique unidade e dezena separadamente, depois some.",
        es: "Multiplica unidad y decena por separado, luego suma.",
      },
      lesson: {
        intro: {
          en: "Multiply the units digit first, then the tens digit, then combine — no carrying needed yet.",
          pt: "Multiplique a unidade primeiro, depois a dezena, e junte — ainda sem precisar de 'vai um'.",
          es: "Multiplica la unidad primero, luego la decena, y júntalas — todavía sin necesitar acarreo.",
        },
        example: { id: "ex-purple-6", prompt: "21 × 4", answer: 84, operands: [21, 4] },
        steps: [
          {
            text: {
              en: "Multiply the units: 1 × 4 = 4.",
              pt: "Multiplique a unidade: 1 × 4 = 4.",
              es: "Multiplica la unidad: 1 × 4 = 4.",
            },
          },
          {
            text: {
              en: "Multiply the tens: 2 × 4 = 8, meaning 80.",
              pt: "Multiplique a dezena: 2 × 4 = 8, ou seja, 80.",
              es: "Multiplica la decena: 2 × 4 = 8, o sea, 80.",
            },
          },
          {
            text: {
              en: "Add them: 80 + 4 = 84.",
              pt: "Some: 80 + 4 = 84.",
              es: "Suma: 80 + 4 = 84.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateTwoDigitByOneDigitNoCarry,
    },
    {
      id: "purple-7",
      beltId: "purple",
      index: 7,
      title: {
        en: "Two-digit × one-digit, with carrying",
        pt: "Dois dígitos × um dígito, com 'vai um'",
        es: "Dos dígitos × un dígito, llevando",
      },
      summary: {
        en: "When the units product hits double digits, carry into the tens.",
        pt: "Quando a multiplicação das unidades passa de 9, leve para a dezena.",
        es: "Cuando la multiplicación de las unidades pasa de 9, lleva a la decena.",
      },
      lesson: {
        intro: {
          en: "Multiply the units first. If the result is 10 or more, carry the extra into the tens multiplication.",
          pt: "Multiplique a unidade primeiro. Se der 10 ou mais, leve o extra para a multiplicação da dezena.",
          es: "Multiplica la unidad primero. Si da 10 o más, lleva el extra a la multiplicación de la decena.",
        },
        example: { id: "ex-purple-7", prompt: "24 × 3", answer: 72, operands: [24, 3] },
        steps: [
          {
            text: {
              en: "Multiply the units: 4 × 3 = 12. Write the 2, carry the {{1}}.",
              pt: "Multiplique a unidade: 4 × 3 = 12. Escreva o 2 e leve o {{1}}.",
              es: "Multiplica la unidad: 4 × 3 = 12. Escribe el 2 y lleva el {{1}}.",
            },
          },
          {
            text: {
              en: "Multiply the tens: 2 × 3 = 6, plus the carried {{1}} = 7.",
              pt: "Multiplique a dezena: 2 × 3 = 6, mais o {{1}} que veio = 7.",
              es: "Multiplica la decena: 2 × 3 = 6, más el {{1}} que llevaste = 7.",
            },
          },
          { text: { en: "24 × 3 = 72.", pt: "24 × 3 = 72.", es: "24 × 3 = 72." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateTwoDigitByOneDigitWithCarry,
    },
    {
      id: "purple-8",
      beltId: "purple",
      index: 8,
      title: { en: "Two-digit × two-digit", pt: "Dois dígitos × dois dígitos", es: "Dos dígitos × dos dígitos" },
      summary: {
        en: "Break the second number into tens and units, multiply each, then add.",
        pt: "Separe o segundo número em dezena e unidade, multiplique cada um e some.",
        es: "Separa el segundo número en decena y unidad, multiplica cada uno y suma.",
      },
      lesson: {
        intro: {
          en: "Split the second number into tens plus units. Multiply the first number by each part, then add the results.",
          pt: "Separe o segundo número em dezena mais unidade. Multiplique o primeiro número por cada parte e some os resultados.",
          es: "Divide el segundo número en decena más unidad. Multiplica el primer número por cada parte y suma los resultados.",
        },
        example: { id: "ex-purple-8", prompt: "23 × 12", answer: 276, operands: [23, 12] },
        steps: [
          {
            text: {
              en: "Break 12 into {{10}} + {{2}}.",
              pt: "Separe o 12 em {{10}} + {{2}}.",
              es: "Separa el 12 en {{10}} + {{2}}.",
            },
          },
          { text: { en: "23 × {{10}} = 230.", pt: "23 × {{10}} = 230.", es: "23 × {{10}} = 230." } },
          { text: { en: "23 × {{2}} = 46.", pt: "23 × {{2}} = 46.", es: "23 × {{2}} = 46." } },
          { text: { en: "230 + 46 = 276.", pt: "230 + 46 = 276.", es: "230 + 46 = 276." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateTwoDigitByTwoDigit,
    },
    {
      id: "purple-9",
      beltId: "purple",
      index: 9,
      title: { en: "Three-digit × one-digit", pt: "Três dígitos × um dígito", es: "Tres dígitos × un dígito" },
      summary: {
        en: "Same carrying method, one more column.",
        pt: "Mesmo método do 'vai um', só mais uma coluna.",
        es: "Mismo método del acarreo, una columna más.",
      },
      lesson: {
        intro: {
          en: "Multiply units, then tens, then hundreds — carrying into the next column whenever a product hits double digits.",
          pt: "Multiplique unidade, depois dezena, depois centena — levando para a próxima coluna sempre que der 10 ou mais.",
          es: "Multiplica unidad, luego decena, luego centena — llevando a la siguiente columna cada vez que dé 10 o más.",
        },
        example: { id: "ex-purple-9", prompt: "213 × 4", answer: 852, operands: [213, 4] },
        steps: [
          {
            text: {
              en: "Multiply the units: 3 × 4 = 12. Write the 2, carry the {{1}}.",
              pt: "Multiplique a unidade: 3 × 4 = 12. Escreva o 2 e leve o {{1}}.",
              es: "Multiplica la unidad: 3 × 4 = 12. Escribe el 2 y lleva el {{1}}.",
            },
          },
          {
            text: {
              en: "Multiply the tens: 1 × 4 = 4, plus the carried {{1}} = 5.",
              pt: "Multiplique a dezena: 1 × 4 = 4, mais o {{1}} que veio = 5.",
              es: "Multiplica la decena: 1 × 4 = 4, más el {{1}} que llevaste = 5.",
            },
          },
          {
            text: {
              en: "Multiply the hundreds: 2 × 4 = 8.",
              pt: "Multiplique a centena: 2 × 4 = 8.",
              es: "Multiplica la centena: 2 × 4 = 8.",
            },
          },
          { text: { en: "213 × 4 = 852.", pt: "213 × 4 = 852.", es: "213 × 4 = 852." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateThreeDigitByOneDigit,
    },
    {
      id: "purple-10",
      beltId: "purple",
      index: 10,
      title: { en: "Three-digit × two-digit", pt: "Três dígitos × dois dígitos", es: "Tres dígitos × dos dígitos" },
      summary: {
        en: "The same split-and-add trick, at full size.",
        pt: "O mesmo truque de separar e somar, em tamanho grande.",
        es: "El mismo truco de separar y sumar, a tamaño completo.",
      },
      lesson: {
        intro: {
          en: "Split the two-digit number into tens plus units. Multiply the three-digit number by each part, then add.",
          pt: "Separe o número de dois dígitos em dezena mais unidade. Multiplique o número de três dígitos por cada parte e some.",
          es: "Divide el número de dos dígitos en decena más unidad. Multiplica el número de tres dígitos por cada parte y suma.",
        },
        example: { id: "ex-purple-10", prompt: "213 × 24", answer: 5112, operands: [213, 24] },
        steps: [
          {
            text: {
              en: "Break 24 into {{20}} + {{4}}.",
              pt: "Separe o 24 em {{20}} + {{4}}.",
              es: "Separa el 24 en {{20}} + {{4}}.",
            },
          },
          { text: { en: "213 × {{20}} = 4260.", pt: "213 × {{20}} = 4260.", es: "213 × {{20}} = 4260." } },
          { text: { en: "213 × {{4}} = 852.", pt: "213 × {{4}} = 852.", es: "213 × {{4}} = 852." } },
          { text: { en: "4260 + 852 = 5112.", pt: "4260 + 852 = 5112.", es: "4260 + 852 = 5112." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 30 },
      generate: generateThreeDigitByTwoDigit,
    },
  ],
};

const brownBelt: Belt = {
  id: "brown",
  name: { en: "Brown Belt", pt: "Faixa Marrom", es: "Cinturón Marrón" },
  order: 4,
  operationLabel: { en: "Division", pt: "Divisão", es: "División" },
  colorVar: "--belt-brown",
  tagline: {
    en: "Split numbers apart cleanly, remainders and all.",
    pt: "Divida números com precisão, restos e tudo.",
    es: "Divide números con precisión, restos incluidos.",
  },
  stripes: [
    {
      id: "brown-1",
      beltId: "brown",
      index: 1,
      title: { en: "Exact division", pt: "Divisão exata", es: "División exacta" },
      summary: {
        en: "Split a number into equal groups — it's multiplication in reverse.",
        pt: "Separe um número em grupos iguais — é a multiplicação ao contrário.",
        es: "Separa un número en grupos iguales — es la multiplicación al revés.",
      },
      lesson: {
        intro: {
          en: "Division splits a number into equal groups. Picture it below, then notice it matches a multiplication fact you already know.",
          pt: "A divisão separa um número em grupos iguais. Veja abaixo, e repare que combina com uma conta de multiplicação que você já sabe.",
          es: "La división separa un número en grupos iguales. Míralo abajo, y fíjate que coincide con una multiplicación que ya sabes.",
        },
        example: { id: "ex-brown-1", prompt: "42 ÷ 6", answer: 7, operands: [42, 6] },
        diagram: { kind: "groups", groups: 6, perGroup: 7 },
        steps: [
          {
            text: {
              en: "Picture 42 things split into 6 equal groups, like above.",
              pt: "Imagine 42 coisas separadas em 6 grupos iguais, como acima.",
              es: "Imagina 42 cosas separadas en 6 grupos iguales, como arriba.",
            },
          },
          {
            text: {
              en: "Count how many end up in each group: 7.",
              pt: "Conte quantos ficam em cada grupo: 7.",
              es: "Cuenta cuántos quedan en cada grupo: 7.",
            },
          },
          {
            text: {
              en: "That matches a multiplication fact you already know: 6 × 7 = 42 — division is just multiplication in reverse.",
              pt: "Isso combina com uma multiplicação que você já sabe: 6 × 7 = 42 — a divisão é só a multiplicação ao contrário.",
              es: "Eso coincide con una multiplicación que ya sabes: 6 × 7 = 42 — la división es solo la multiplicación al revés.",
            },
          },
          { text: { en: "42 ÷ 6 = 7.", pt: "42 ÷ 6 = 7.", es: "42 ÷ 6 = 7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateExactDivision,
    },
    {
      id: "brown-2",
      beltId: "brown",
      index: 2,
      title: { en: "Dividing with a remainder", pt: "Dividir com resto", es: "Dividir con resto" },
      summary: {
        en: "Find the closest multiple you can reach without going over.",
        pt: "Ache o múltiplo mais próximo sem passar do número.",
        es: "Encuentra el múltiplo más cercano sin pasarte del número.",
      },
      lesson: {
        intro: {
          en: "Find the biggest multiple of the divisor that still fits, then see what's left over.",
          pt: "Ache o maior múltiplo do divisor que ainda cabe, depois veja o que sobra.",
          es: "Encuentra el múltiplo más grande del divisor que todavía cabe, luego mira qué sobra.",
        },
        example: { id: "ex-brown-2", prompt: "23 ÷ 5", answer: 4, secondaryAnswer: 3, secondaryFormat: "remainder", operands: [23, 5] },
        steps: [
          {
            text: {
              en: "The biggest multiple of 5 that fits in 23 is {{20}} (5 × 4).",
              pt: "O maior múltiplo de 5 que cabe em 23 é {{20}} (5 × 4).",
              es: "El múltiplo más grande de 5 que cabe en 23 es {{20}} (5 × 4).",
            },
          },
          {
            text: {
              en: "23 − {{20}} = 3 left over.",
              pt: "23 − {{20}} = 3 que sobra.",
              es: "23 − {{20}} = 3 que sobra.",
            },
          },
          { text: { en: "23 ÷ 5 = 4 R 3.", pt: "23 ÷ 5 = 4 R 3.", es: "23 ÷ 5 = 4 R 3." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateDivisionWithRemainder,
    },
    {
      id: "brown-3",
      beltId: "brown",
      index: 3,
      title: { en: "Dividing by 10 and 100", pt: "Dividir por 10 e por 100", es: "Dividir por 10 y por 100" },
      summary: {
        en: "The zero trick works in reverse too.",
        pt: "O truque do zero funciona ao contrário também.",
        es: "El truco del cero también funciona al revés.",
      },
      lesson: {
        intro: {
          en: "Dividing by 10 removes one zero. Dividing by 100 removes two zeros.",
          pt: "Dividir por 10 remove um zero. Dividir por 100 remove dois zeros.",
          es: "Dividir por 10 quita un cero. Dividir por 100 quita dos ceros.",
        },
        example: { id: "ex-brown-3", prompt: "700 ÷ 100", answer: 7, operands: [700, 100] },
        steps: [
          { text: { en: "÷100 removes two zeros.", pt: "÷100 remove dois zeros.", es: "÷100 quita dos ceros." } },
          { text: { en: "700 becomes 7.", pt: "700 vira 7.", es: "700 se convierte en 7." } },
          { text: { en: "700 ÷ 100 = 7.", pt: "700 ÷ 100 = 7.", es: "700 ÷ 100 = 7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 5, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateDivideBy10And100,
    },
    {
      id: "brown-4",
      beltId: "brown",
      index: 4,
      title: {
        en: "Two-digit ÷ one-digit, no remainder",
        pt: "Dois dígitos ÷ um dígito, sem resto",
        es: "Dos dígitos ÷ un dígito, sin resto",
      },
      summary: {
        en: "Divide the tens, then the units, separately.",
        pt: "Divida a dezena, depois a unidade, separadamente.",
        es: "Divide la decena, luego la unidad, por separado.",
      },
      lesson: {
        intro: {
          en: "Divide the tens digit by the divisor, then the units digit, then combine.",
          pt: "Divida o dígito da dezena pelo divisor, depois o da unidade, e junte.",
          es: "Divide el dígito de la decena entre el divisor, luego el de la unidad, y júntalos.",
        },
        example: { id: "ex-brown-4", prompt: "84 ÷ 4", answer: 21, operands: [84, 4] },
        steps: [
          {
            text: { en: "Divide the tens: 8 ÷ 4 = 2.", pt: "Divida a dezena: 8 ÷ 4 = 2.", es: "Divide la decena: 8 ÷ 4 = 2." },
          },
          {
            text: {
              en: "Divide the units: 4 ÷ 4 = 1.",
              pt: "Divida a unidade: 4 ÷ 4 = 1.",
              es: "Divide la unidad: 4 ÷ 4 = 1.",
            },
          },
          { text: { en: "84 ÷ 4 = 21.", pt: "84 ÷ 4 = 21.", es: "84 ÷ 4 = 21." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateTwoDigitByOneDigitExact,
    },
    {
      id: "brown-5",
      beltId: "brown",
      index: 5,
      title: {
        en: "Two-digit ÷ one-digit, with remainder",
        pt: "Dois dígitos ÷ um dígito, com resto",
        es: "Dos dígitos ÷ un dígito, con resto",
      },
      summary: {
        en: "Divide the tens, bring down the units, divide again.",
        pt: "Divida a dezena, desça a unidade, divida de novo.",
        es: "Divide la decena, baja la unidad, divide de nuevo.",
      },
      lesson: {
        intro: {
          en: "Divide the tens first. Whatever's left over joins the units — then divide that combined number.",
          pt: "Divida a dezena primeiro. O que sobrar se junta à unidade — depois divida esse número combinado.",
          es: "Divide la decena primero. Lo que sobre se junta a la unidad — luego divide ese número combinado.",
        },
        example: { id: "ex-brown-5", prompt: "47 ÷ 3", answer: 15, secondaryAnswer: 2, secondaryFormat: "remainder", operands: [47, 3] },
        steps: [
          {
            text: {
              en: "Divide the tens: 4 ÷ 3 = 1, remainder {{1}}.",
              pt: "Divida a dezena: 4 ÷ 3 = 1, resto {{1}}.",
              es: "Divide la decena: 4 ÷ 3 = 1, resto {{1}}.",
            },
          },
          {
            text: {
              en: "Bring down the units: {{1}} and 7 make 17.",
              pt: "Desça a unidade: {{1}} e 7 formam 17.",
              es: "Baja la unidad: {{1}} y 7 forman 17.",
            },
          },
          {
            text: {
              en: "Divide again: 17 ÷ 3 = 5, remainder 2.",
              pt: "Divida de novo: 17 ÷ 3 = 5, resto 2.",
              es: "Divide de nuevo: 17 ÷ 3 = 5, resto 2.",
            },
          },
          { text: { en: "47 ÷ 3 = 15 R 2.", pt: "47 ÷ 3 = 15 R 2.", es: "47 ÷ 3 = 15 R 2." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateTwoDigitByOneDigitWithRemainder,
    },
    {
      id: "brown-6",
      beltId: "brown",
      index: 6,
      title: {
        en: "Three-digit ÷ one-digit, no remainder",
        pt: "Três dígitos ÷ um dígito, sem resto",
        es: "Tres dígitos ÷ un dígito, sin resto",
      },
      summary: {
        en: "Same column method, one more digit: hundreds, tens, units.",
        pt: "Mesmo método das colunas, mais um dígito: centena, dezena, unidade.",
        es: "Mismo método de columnas, un dígito más: centena, decena, unidad.",
      },
      lesson: {
        intro: {
          en: "Divide the hundreds, then the tens, then the units — each on its own.",
          pt: "Divida a centena, depois a dezena, depois a unidade — cada uma separadamente.",
          es: "Divide la centena, luego la decena, luego la unidad — cada una por separado.",
        },
        example: { id: "ex-brown-6", prompt: "936 ÷ 3", answer: 312, operands: [936, 3] },
        steps: [
          {
            text: {
              en: "Divide the hundreds: 9 ÷ 3 = 3.",
              pt: "Divida a centena: 9 ÷ 3 = 3.",
              es: "Divide la centena: 9 ÷ 3 = 3.",
            },
          },
          {
            text: { en: "Divide the tens: 3 ÷ 3 = 1.", pt: "Divida a dezena: 3 ÷ 3 = 1.", es: "Divide la decena: 3 ÷ 3 = 1." },
          },
          {
            text: {
              en: "Divide the units: 6 ÷ 3 = 2.",
              pt: "Divida a unidade: 6 ÷ 3 = 2.",
              es: "Divide la unidad: 6 ÷ 3 = 2.",
            },
          },
          { text: { en: "936 ÷ 3 = 312.", pt: "936 ÷ 3 = 312.", es: "936 ÷ 3 = 312." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateThreeDigitByOneDigitExact,
    },
    {
      id: "brown-7",
      beltId: "brown",
      index: 7,
      title: {
        en: "Three-digit ÷ one-digit, with remainder",
        pt: "Três dígitos ÷ um dígito, com resto",
        es: "Tres dígitos ÷ un dígito, con resto",
      },
      summary: {
        en: "Long division: divide, multiply, subtract, bring down, repeat.",
        pt: "Divisão longa: divida, multiplique, subtraia, desça o próximo, repita.",
        es: "División larga: divide, multiplica, resta, baja el siguiente, repite.",
      },
      lesson: {
        intro: {
          en: "Work left to right. After each division, subtract to find what's left, then bring down the next digit.",
          pt: "Trabalhe da esquerda para a direita. Depois de cada divisão, subtraia para achar o que sobra, depois desça o próximo dígito.",
          es: "Trabaja de izquierda a derecha. Después de cada división, resta para ver qué sobra, luego baja el siguiente dígito.",
        },
        example: { id: "ex-brown-7", prompt: "137 ÷ 4", answer: 34, secondaryAnswer: 1, secondaryFormat: "remainder", operands: [137, 4] },
        steps: [
          {
            text: {
              en: "Divide 13 by 4: 3 times (4 × 3 = 12), remainder {{1}}.",
              pt: "Divida 13 por 4: 3 vezes (4 × 3 = 12), resto {{1}}.",
              es: "Divide 13 entre 4: 3 veces (4 × 3 = 12), resto {{1}}.",
            },
          },
          {
            text: {
              en: "Bring down the 7: {{1}} and 7 make 17.",
              pt: "Desça o 7: {{1}} e 7 formam 17.",
              es: "Baja el 7: {{1}} y 7 forman 17.",
            },
          },
          {
            text: {
              en: "Divide 17 by 4: 4 times (4 × 4 = 16), remainder 1.",
              pt: "Divida 17 por 4: 4 vezes (4 × 4 = 16), resto 1.",
              es: "Divide 17 entre 4: 4 veces (4 × 4 = 16), resto 1.",
            },
          },
          { text: { en: "137 ÷ 4 = 34 R 1.", pt: "137 ÷ 4 = 34 R 1.", es: "137 ÷ 4 = 34 R 1." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateThreeDigitByOneDigitWithRemainder,
    },
    {
      id: "brown-8",
      beltId: "brown",
      index: 8,
      title: {
        en: "Dividing by a two-digit number",
        pt: "Dividir por um número de dois dígitos",
        es: "Dividir entre un número de dos dígitos",
      },
      summary: {
        en: "Estimate using a nearby friendly multiple.",
        pt: "Estime usando um múltiplo redondo próximo.",
        es: "Estima usando un múltiplo redondo cercano.",
      },
      lesson: {
        intro: {
          en: "Round the divisor to a friendly multiple of 10 to guess how many times it fits, then check by multiplying.",
          pt: "Arredonde o divisor para um múltiplo de 10 próximo para estimar quantas vezes ele cabe, depois confira multiplicando.",
          es: "Redondea el divisor a un múltiplo de 10 cercano para estimar cuántas veces cabe, luego comprueba multiplicando.",
        },
        example: { id: "ex-brown-8", prompt: "84 ÷ 21", answer: 4, operands: [84, 21] },
        steps: [
          {
            text: {
              en: "21 is close to 20. About how many 20s fit in 84? Around {{4}}.",
              pt: "21 é próximo de 20. Quantos 20 cabem em 84, aproximadamente? Uns {{4}}.",
              es: "21 está cerca de 20. ¿Cuántos 20 caben en 84, aproximadamente? Unos {{4}}.",
            },
          },
          {
            text: {
              en: "Check: 21 × {{4}} = 84. Exact!",
              pt: "Confira: 21 × {{4}} = 84. Exato!",
              es: "Comprueba: 21 × {{4}} = 84. ¡Exacto!",
            },
          },
          { text: { en: "84 ÷ 21 = 4.", pt: "84 ÷ 21 = 4.", es: "84 ÷ 21 = 4." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateTwoDigitDivisorExact,
    },
    {
      id: "brown-9",
      beltId: "brown",
      index: 9,
      title: {
        en: "Three-digit ÷ two-digit, no remainder",
        pt: "Três dígitos ÷ dois dígitos, sem resto",
        es: "Tres dígitos ÷ dos dígitos, sin resto",
      },
      summary: {
        en: "The full long-division process, one more digit.",
        pt: "O processo completo da divisão longa, mais um dígito.",
        es: "El proceso completo de la división larga, un dígito más.",
      },
      lesson: {
        intro: {
          en: "Estimate how many times the divisor fits into the first digits, multiply, subtract, then bring down the last digit and repeat.",
          pt: "Estime quantas vezes o divisor cabe nos primeiros dígitos, multiplique, subtraia, depois desça o último dígito e repita.",
          es: "Estima cuántas veces cabe el divisor en las primeras cifras, multiplica, resta, luego baja la última cifra y repite.",
        },
        example: { id: "ex-brown-9", prompt: "276 ÷ 23", answer: 12, operands: [276, 23] },
        steps: [
          {
            text: {
              en: "How many times does 23 fit into 27? Once: 23 × 1 = 23.",
              pt: "Quantas vezes o 23 cabe em 27? Uma vez: 23 × 1 = 23.",
              es: "¿Cuántas veces cabe 23 en 27? Una vez: 23 × 1 = 23.",
            },
          },
          {
            text: {
              en: "27 − 23 = {{4}}. Bring down the 6: {{4}}6.",
              pt: "27 − 23 = {{4}}. Desça o 6: {{4}}6.",
              es: "27 − 23 = {{4}}. Baja el 6: {{4}}6.",
            },
          },
          {
            text: {
              en: "How many times does 23 fit into 46? Twice: 23 × 2 = 46.",
              pt: "Quantas vezes o 23 cabe em 46? Duas vezes: 23 × 2 = 46.",
              es: "¿Cuántas veces cabe 23 en 46? Dos veces: 23 × 2 = 46.",
            },
          },
          { text: { en: "276 ÷ 23 = 12.", pt: "276 ÷ 23 = 12.", es: "276 ÷ 23 = 12." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 26 },
      generate: generateThreeDigitByTwoDigitExact,
    },
    {
      id: "brown-10",
      beltId: "brown",
      index: 10,
      title: {
        en: "Three-digit ÷ two-digit, with remainder",
        pt: "Três dígitos ÷ dois dígitos, com resto",
        es: "Tres dígitos ÷ dos dígitos, con resto",
      },
      summary: {
        en: "The complete long-division process, remainder and all.",
        pt: "O processo completo da divisão longa, com resto e tudo.",
        es: "El proceso completo de la división larga, con resto incluido.",
      },
      lesson: {
        intro: {
          en: "Same process as before — estimate, multiply, subtract, bring down — but this time it won't divide evenly, so end with what's left over.",
          pt: "Mesmo processo de antes — estime, multiplique, subtraia, desça — mas dessa vez não vai dividir certinho, então termine com o que sobrar.",
          es: "Mismo proceso de antes — estima, multiplica, resta, baja — pero esta vez no dividirá exacto, así que termina con lo que sobre.",
        },
        example: { id: "ex-brown-10", prompt: "287 ÷ 23", answer: 12, secondaryAnswer: 11, secondaryFormat: "remainder", operands: [287, 23] },
        steps: [
          {
            text: {
              en: "How many times does 23 fit into 28? Once: 23 × 1 = 23.",
              pt: "Quantas vezes o 23 cabe em 28? Uma vez: 23 × 1 = 23.",
              es: "¿Cuántas veces cabe 23 en 28? Una vez: 23 × 1 = 23.",
            },
          },
          {
            text: {
              en: "28 − 23 = {{5}}. Bring down the 7: {{5}}7.",
              pt: "28 − 23 = {{5}}. Desça o 7: {{5}}7.",
              es: "28 − 23 = {{5}}. Baja el 7: {{5}}7.",
            },
          },
          {
            text: {
              en: "How many times does 23 fit into 57? Twice: 23 × 2 = 46. That leaves 57 − 46 = 11.",
              pt: "Quantas vezes o 23 cabe em 57? Duas vezes: 23 × 2 = 46. Sobra 57 − 46 = 11.",
              es: "¿Cuántas veces cabe 23 en 57? Dos veces: 23 × 2 = 46. Sobra 57 − 46 = 11.",
            },
          },
          { text: { en: "287 ÷ 23 = 12 R 11.", pt: "287 ÷ 23 = 12 R 11.", es: "287 ÷ 23 = 12 R 11." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 32 },
      generate: generateThreeDigitByTwoDigitWithRemainder,
    },
  ],
};

const fractionsDegree = {
  index: 1,
  name: { en: "Fractions", pt: "Frações", es: "Fracciones" } as LocalizedText,
};

const decimalsDegree = {
  index: 2,
  name: { en: "Decimals", pt: "Decimais", es: "Decimales" } as LocalizedText,
};

const blackBelt: Belt = {
  id: "black",
  name: { en: "Black Belt", pt: "Faixa Preta", es: "Cinturón Negro" },
  order: 5,
  operationLabel: {
    en: "Fractions · Decimals · Algebra · Equations · Functions",
    pt: "Frações · Decimais · Álgebra · Equações · Funções",
    es: "Fracciones · Decimales · Álgebra · Ecuaciones · Funciones",
  },
  colorVar: "--belt-black",
  tagline: {
    en: "Six degrees, one for each pillar of pre-university math.",
    pt: "Seis graus, um para cada pilar da matemática pré-universitária.",
    es: "Seis grados, uno por cada pilar de la matemática preuniversitaria.",
  },
  stripes: [
    {
      id: "black-1",
      beltId: "black",
      index: 1,
      degree: fractionsDegree,
      title: { en: "What a fraction means", pt: "O que significa uma fração", es: "Qué significa una fracción" },
      summary: {
        en: "A fraction is parts of a whole — see it, then name it.",
        pt: "Uma fração é partes de um todo — veja, depois nomeie.",
        es: "Una fracción es partes de un todo — mira, y luego nómbrala.",
      },
      lesson: {
        intro: {
          en: "The bottom number is how many equal parts the whole is split into. The top number is how many of those parts you have.",
          pt: "O número de baixo é em quantas partes iguais o todo foi dividido. O número de cima é quantas dessas partes você tem.",
          es: "El número de abajo es en cuántas partes iguales se dividió el todo. El número de arriba es cuántas de esas partes tienes.",
        },
        example: {
          id: "ex-black-1",
          prompt: "",
          answer: 3,
          secondaryAnswer: 8,
          secondaryFormat: "fraction",
          operands: [3, 8],
        },
        diagram: { kind: "fraction", total: 8, shaded: 3 },
        steps: [
          {
            text: {
              en: "The bar is split into 8 equal parts — that's the bottom number.",
              pt: "A barra está dividida em 8 partes iguais — esse é o número de baixo.",
              es: "La barra está dividida en 8 partes iguales — ese es el número de abajo.",
            },
          },
          {
            text: {
              en: "3 of those parts are shaded — that's the top number.",
              pt: "3 dessas partes estão pintadas — esse é o número de cima.",
              es: "3 de esas partes están sombreadas — ese es el número de arriba.",
            },
          },
          {
            text: {
              en: "Written as a fraction: 3/8.",
              pt: "Escrito como fração: 3/8.",
              es: "Escrito como fracción: 3/8.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateIdentifyFraction,
    },
    {
      id: "black-2",
      beltId: "black",
      index: 2,
      degree: fractionsDegree,
      title: { en: "Equivalent fractions", pt: "Frações equivalentes", es: "Fracciones equivalentes" },
      summary: {
        en: "The same amount, written with different numbers.",
        pt: "A mesma quantidade, escrita com números diferentes.",
        es: "La misma cantidad, escrita con números diferentes.",
      },
      lesson: {
        intro: {
          en: "Multiply the top and bottom by the same number and the fraction's value doesn't change.",
          pt: "Multiplique o de cima e o de baixo pelo mesmo número e o valor da fração não muda.",
          es: "Multiplica el de arriba y el de abajo por el mismo número y el valor de la fracción no cambia.",
        },
        example: { id: "ex-black-2", prompt: "1/2 = ?/6", answer: 3, operands: [1, 2, 6] },
        steps: [
          {
            text: {
              en: "To turn halves into sixths, multiply the bottom by 3 (2 × 3 = 6).",
              pt: "Para transformar meios em sextos, multiplique o de baixo por 3 (2 × 3 = 6).",
              es: "Para convertir medios en sextos, multiplica el de abajo por 3 (2 × 3 = 6).",
            },
          },
          {
            text: {
              en: "Do the same to the top: 1 × 3 = 3.",
              pt: "Faça o mesmo com o de cima: 1 × 3 = 3.",
              es: "Haz lo mismo con el de arriba: 1 × 3 = 3.",
            },
          },
          { text: { en: "1/2 = 3/6.", pt: "1/2 = 3/6.", es: "1/2 = 3/6." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateEquivalentFraction,
    },
    {
      id: "black-3",
      beltId: "black",
      index: 3,
      degree: fractionsDegree,
      title: { en: "Simplifying fractions", pt: "Simplificar frações", es: "Simplificar fracciones" },
      summary: {
        en: "Shrink a fraction to its smallest matching numbers.",
        pt: "Reduza uma fração para os menores números equivalentes.",
        es: "Reduce una fracción a los números equivalentes más pequeños.",
      },
      lesson: {
        intro: {
          en: "Find a number that divides evenly into both the top and bottom, then divide both by it.",
          pt: "Ache um número que divide certinho o de cima e o de baixo, depois divida os dois por ele.",
          es: "Encuentra un número que divida exacto al de arriba y al de abajo, luego divide ambos entre él.",
        },
        example: { id: "ex-black-3", prompt: "8/12", answer: 2, secondaryAnswer: 3, secondaryFormat: "fraction", operands: [8, 12] },
        steps: [
          {
            text: {
              en: "4 divides evenly into both 8 and 12.",
              pt: "O 4 divide certinho o 8 e o 12.",
              es: "El 4 divide exacto al 8 y al 12.",
            },
          },
          {
            text: {
              en: "Divide both by 4: 8 ÷ 4 = 2, and 12 ÷ 4 = 3.",
              pt: "Divida os dois por 4: 8 ÷ 4 = 2, e 12 ÷ 4 = 3.",
              es: "Divide ambos entre 4: 8 ÷ 4 = 2, y 12 ÷ 4 = 3.",
            },
          },
          { text: { en: "8/12 = 2/3.", pt: "8/12 = 2/3.", es: "8/12 = 2/3." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateSimplifyFraction,
    },
    {
      id: "black-4",
      beltId: "black",
      index: 4,
      degree: fractionsDegree,
      title: { en: "A fraction of a number", pt: "Fração de um número", es: "Fracción de un número" },
      summary: {
        en: "Split a whole number into fractional parts.",
        pt: "Divida um número inteiro em partes fracionárias.",
        es: "Divide un número entero en partes fraccionarias.",
      },
      lesson: {
        intro: {
          en: "Divide the number by the bottom, then multiply by the top.",
          pt: "Divida o número pelo de baixo, depois multiplique pelo de cima.",
          es: "Divide el número entre el de abajo, luego multiplica por el de arriba.",
        },
        example: { id: "ex-black-4", prompt: "3/4 × 20", answer: 15, operands: [3, 4, 20] },
        steps: [
          {
            text: {
              en: "Divide 20 by the bottom number: 20 ÷ 4 = 5.",
              pt: "Divida 20 pelo número de baixo: 20 ÷ 4 = 5.",
              es: "Divide 20 entre el número de abajo: 20 ÷ 4 = 5.",
            },
          },
          {
            text: {
              en: "Multiply by the top number: 5 × 3 = 15.",
              pt: "Multiplique pelo número de cima: 5 × 3 = 15.",
              es: "Multiplica por el número de arriba: 5 × 3 = 15.",
            },
          },
          { text: { en: "3/4 × 20 = 15.", pt: "3/4 × 20 = 15.", es: "3/4 × 20 = 15." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateFractionOfNumber,
    },
    {
      id: "black-5",
      beltId: "black",
      index: 5,
      degree: fractionsDegree,
      title: {
        en: "Adding fractions, same denominator",
        pt: "Somar frações, mesmo denominador",
        es: "Sumar fracciones, mismo denominador",
      },
      summary: {
        en: "When the bottoms match, just add the tops.",
        pt: "Quando os de baixo são iguais, só some os de cima.",
        es: "Cuando los de abajo son iguales, solo suma los de arriba.",
      },
      lesson: {
        intro: {
          en: "If two fractions have the same bottom number, add the top numbers and keep the bottom the same.",
          pt: "Se duas frações têm o mesmo número de baixo, some os números de cima e mantenha o de baixo igual.",
          es: "Si dos fracciones tienen el mismo número de abajo, suma los números de arriba y mantén el de abajo igual.",
        },
        example: { id: "ex-black-5", prompt: "2/7 + 3/7", answer: 5, secondaryAnswer: 7, secondaryFormat: "fraction", operands: [2, 3, 7] },
        steps: [
          { text: { en: "The bottoms already match: 7.", pt: "Os de baixo já são iguais: 7.", es: "Los de abajo ya son iguales: 7." } },
          {
            text: { en: "Add the tops: 2 + 3 = 5.", pt: "Some os de cima: 2 + 3 = 5.", es: "Suma los de arriba: 2 + 3 = 5." },
          },
          { text: { en: "2/7 + 3/7 = 5/7.", pt: "2/7 + 3/7 = 5/7.", es: "2/7 + 3/7 = 5/7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateAddFractionsSameDenominator,
    },
    {
      id: "black-6",
      beltId: "black",
      index: 6,
      degree: fractionsDegree,
      title: {
        en: "Subtracting fractions, same denominator",
        pt: "Subtrair frações, mesmo denominador",
        es: "Restar fracciones, mismo denominador",
      },
      summary: {
        en: "Same idea, subtract the tops instead.",
        pt: "Mesma ideia, só que subtraindo os de cima.",
        es: "Misma idea, pero restando los de arriba.",
      },
      lesson: {
        intro: {
          en: "If two fractions have the same bottom number, subtract the top numbers and keep the bottom the same.",
          pt: "Se duas frações têm o mesmo número de baixo, subtraia os números de cima e mantenha o de baixo igual.",
          es: "Si dos fracciones tienen el mismo número de abajo, resta los números de arriba y mantén el de abajo igual.",
        },
        example: { id: "ex-black-6", prompt: "5/8 - 2/8", answer: 3, secondaryAnswer: 8, secondaryFormat: "fraction", operands: [5, 2, 8] },
        steps: [
          { text: { en: "The bottoms already match: 8.", pt: "Os de baixo já são iguais: 8.", es: "Los de abajo ya son iguales: 8." } },
          {
            text: { en: "Subtract the tops: 5 - 2 = 3.", pt: "Subtraia os de cima: 5 - 2 = 3.", es: "Resta los de arriba: 5 - 2 = 3." },
          },
          { text: { en: "5/8 - 2/8 = 3/8.", pt: "5/8 - 2/8 = 3/8.", es: "5/8 - 2/8 = 3/8." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateSubtractFractionsSameDenominator,
    },
    {
      id: "black-7",
      beltId: "black",
      index: 7,
      degree: fractionsDegree,
      title: {
        en: "Adding fractions, different denominators",
        pt: "Somar frações, denominadores diferentes",
        es: "Sumar fracciones, denominadores diferentes",
      },
      summary: {
        en: "Make the bottoms match first, then add like before.",
        pt: "Deixe os de baixo iguais primeiro, depois some como antes.",
        es: "Iguala los de abajo primero, luego suma como antes.",
      },
      lesson: {
        intro: {
          en: "Turn one fraction into an equivalent one that shares the other's bottom number, then add the tops.",
          pt: "Transforme uma fração em uma equivalente que tenha o mesmo número de baixo da outra, depois some os de cima.",
          es: "Convierte una fracción en una equivalente que tenga el mismo número de abajo que la otra, luego suma los de arriba.",
        },
        example: { id: "ex-black-7", prompt: "1/2 + 1/4", answer: 3, secondaryAnswer: 4, secondaryFormat: "fraction", operands: [1, 2, 1, 4] },
        steps: [
          {
            text: {
              en: "4 is double 2, so turn 1/2 into fourths: 1 × 2 = 2, so 1/2 = 2/4.",
              pt: "4 é o dobro de 2, então transforme 1/2 em quartos: 1 × 2 = 2, então 1/2 = 2/4.",
              es: "4 es el doble de 2, así que convierte 1/2 en cuartos: 1 × 2 = 2, entonces 1/2 = 2/4.",
            },
          },
          {
            text: {
              en: "Now both bottoms are 4: 2/4 + 1/4.",
              pt: "Agora os dois de baixo são 4: 2/4 + 1/4.",
              es: "Ahora los dos de abajo son 4: 2/4 + 1/4.",
            },
          },
          {
            text: { en: "Add the tops: 2 + 1 = 3.", pt: "Some os de cima: 2 + 1 = 3.", es: "Suma los de arriba: 2 + 1 = 3." },
          },
          { text: { en: "1/2 + 1/4 = 3/4.", pt: "1/2 + 1/4 = 3/4.", es: "1/2 + 1/4 = 3/4." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateAddFractionsDifferentDenominators,
    },
    {
      id: "black-8",
      beltId: "black",
      index: 8,
      degree: fractionsDegree,
      title: { en: "Multiplying fractions", pt: "Multiplicar frações", es: "Multiplicar fracciones" },
      summary: {
        en: "Multiply straight across — top times top, bottom times bottom.",
        pt: "Multiplique direto — cima vezes cima, baixo vezes baixo.",
        es: "Multiplica directo — arriba por arriba, abajo por abajo.",
      },
      lesson: {
        intro: {
          en: "No need to match denominators here — just multiply the top numbers together, then the bottom numbers together.",
          pt: "Aqui não precisa igualar os denominadores — só multiplique os números de cima entre si, depois os de baixo.",
          es: "Aquí no hace falta igualar los denominadores — solo multiplica los números de arriba entre sí, luego los de abajo.",
        },
        example: { id: "ex-black-8", prompt: "2/3 × 3/4", answer: 6, secondaryAnswer: 12, secondaryFormat: "fraction", operands: [2, 3, 3, 4] },
        steps: [
          { text: { en: "Multiply the tops: 2 × 3 = 6.", pt: "Multiplique os de cima: 2 × 3 = 6.", es: "Multiplica los de arriba: 2 × 3 = 6." } },
          {
            text: {
              en: "Multiply the bottoms: 3 × 4 = 12.",
              pt: "Multiplique os de baixo: 3 × 4 = 12.",
              es: "Multiplica los de abajo: 3 × 4 = 12.",
            },
          },
          { text: { en: "2/3 × 3/4 = 6/12.", pt: "2/3 × 3/4 = 6/12.", es: "2/3 × 3/4 = 6/12." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateMultiplyFractions,
    },
    {
      id: "black-9",
      beltId: "black",
      index: 9,
      degree: fractionsDegree,
      title: { en: "Dividing fractions", pt: "Dividir frações", es: "Dividir fracciones" },
      summary: {
        en: "Flip the second fraction, then multiply.",
        pt: "Inverta a segunda fração, depois multiplique.",
        es: "Invierte la segunda fracción, luego multiplica.",
      },
      lesson: {
        intro: {
          en: "Dividing by a fraction is the same as multiplying by it flipped upside down.",
          pt: "Dividir por uma fração é o mesmo que multiplicar por ela de cabeça para baixo.",
          es: "Dividir entre una fracción es lo mismo que multiplicar por ella al revés.",
        },
        example: { id: "ex-black-9", prompt: "1/2 ÷ 1/4", answer: 4, secondaryAnswer: 2, secondaryFormat: "fraction", operands: [1, 2, 1, 4] },
        steps: [
          { text: { en: "Flip 1/4 upside down: 4/1.", pt: "Inverta 1/4 de cabeça para baixo: 4/1.", es: "Invierte 1/4 al revés: 4/1." } },
          { text: { en: "Multiply: 1/2 × 4/1.", pt: "Multiplique: 1/2 × 4/1.", es: "Multiplica: 1/2 × 4/1." } },
          {
            text: {
              en: "Tops: 1 × 4 = 4. Bottoms: 2 × 1 = 2.",
              pt: "De cima: 1 × 4 = 4. De baixo: 2 × 1 = 2.",
              es: "De arriba: 1 × 4 = 4. De abajo: 2 × 1 = 2.",
            },
          },
          { text: { en: "1/2 ÷ 1/4 = 4/2.", pt: "1/2 ÷ 1/4 = 4/2.", es: "1/2 ÷ 1/4 = 4/2." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateDivideFractions,
    },
    {
      id: "black-10",
      beltId: "black",
      index: 10,
      degree: fractionsDegree,
      title: {
        en: "Mixed numbers to improper fractions",
        pt: "Número misto para fração imprópria",
        es: "Número mixto a fracción impropia",
      },
      summary: {
        en: "Turn a whole-plus-fraction into a single fraction.",
        pt: "Transforme um inteiro mais fração em uma única fração.",
        es: "Convierte un entero más fracción en una sola fracción.",
      },
      lesson: {
        intro: {
          en: "Multiply the whole number by the bottom, add the top, and keep the same bottom.",
          pt: "Multiplique o número inteiro pelo de baixo, some o de cima, e mantenha o mesmo de baixo.",
          es: "Multiplica el número entero por el de abajo, suma el de arriba, y mantén el mismo de abajo.",
        },
        example: { id: "ex-black-10", prompt: "2 1/3", answer: 7, secondaryAnswer: 3, secondaryFormat: "fraction", operands: [2, 1, 3] },
        steps: [
          {
            text: {
              en: "Multiply the whole number by the bottom: 2 × 3 = 6.",
              pt: "Multiplique o número inteiro pelo de baixo: 2 × 3 = 6.",
              es: "Multiplica el número entero por el de abajo: 2 × 3 = 6.",
            },
          },
          { text: { en: "Add the top: 6 + 1 = 7.", pt: "Some o de cima: 6 + 1 = 7.", es: "Suma el de arriba: 6 + 1 = 7." } },
          {
            text: {
              en: "Keep the same bottom: 3.",
              pt: "Mantenha o mesmo de baixo: 3.",
              es: "Mantén el mismo de abajo: 3.",
            },
          },
          { text: { en: "2 1/3 = 7/3.", pt: "2 1/3 = 7/3.", es: "2 1/3 = 7/3." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateMixedToImproper,
    },
    {
      id: "black-11",
      beltId: "black",
      index: 1,
      degree: decimalsDegree,
      title: { en: "What a decimal means", pt: "O que significa um decimal", es: "Qué significa un decimal" },
      summary: {
        en: "A decimal is a fraction of ten, written a new way.",
        pt: "Um decimal é uma fração de dez, escrita de um jeito novo.",
        es: "Un decimal es una fracción de diez, escrita de una manera nueva.",
      },
      lesson: {
        intro: {
          en: "The digit after the decimal point counts tenths — how many of 10 equal parts you have.",
          pt: "O dígito depois do ponto decimal conta os décimos — quantas das 10 partes iguais você tem.",
          es: "El dígito después del punto decimal cuenta los décimos — cuántas de las 10 partes iguales tienes.",
        },
        example: { id: "ex-black-11", prompt: "", answer: 0, secondaryAnswer: 3, secondaryFormat: "decimal", operands: [0, 3] },
        diagram: { kind: "fraction", total: 10, shaded: 3 },
        steps: [
          {
            text: {
              en: "The bar is split into 10 equal parts — tenths.",
              pt: "A barra está dividida em 10 partes iguais — décimos.",
              es: "La barra está dividida en 10 partes iguales — décimos.",
            },
          },
          {
            text: {
              en: "3 of those parts are shaded.",
              pt: "3 dessas partes estão pintadas.",
              es: "3 de esas partes están sombreadas.",
            },
          },
          {
            text: {
              en: "Written as a decimal: 0.3.",
              pt: "Escrito como decimal: 0.3.",
              es: "Escrito como decimal: 0.3.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateIdentifyDecimalTenths,
    },
    {
      id: "black-12",
      beltId: "black",
      index: 2,
      degree: decimalsDegree,
      title: {
        en: "Fractions of ten as decimals",
        pt: "Frações de dez como decimais",
        es: "Fracciones de diez como decimales",
      },
      summary: {
        en: "A fraction with 10 on the bottom converts directly.",
        pt: "Uma fração com 10 embaixo se converte direto.",
        es: "Una fracción con 10 abajo se convierte directo.",
      },
      lesson: {
        intro: {
          en: "The top number of a tenths fraction becomes the decimal digit — no calculation needed.",
          pt: "O número de cima de uma fração de décimos vira o dígito decimal — sem precisar calcular.",
          es: "El número de arriba de una fracción de décimos se convierte en el dígito decimal — sin necesidad de calcular.",
        },
        example: { id: "ex-black-12", prompt: "7/10", answer: 0, secondaryAnswer: 7, secondaryFormat: "decimal", operands: [7] },
        steps: [
          { text: { en: "7/10 means 7 tenths.", pt: "7/10 significa 7 décimos.", es: "7/10 significa 7 décimos." } },
          {
            text: {
              en: "Write the 7 right after the decimal point.",
              pt: "Escreva o 7 logo depois do ponto decimal.",
              es: "Escribe el 7 justo después del punto decimal.",
            },
          },
          { text: { en: "7/10 = 0.7.", pt: "7/10 = 0.7.", es: "7/10 = 0.7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateFractionTenthsToDecimal,
    },
    {
      id: "black-13",
      beltId: "black",
      index: 3,
      degree: decimalsDegree,
      title: {
        en: "Mixed numbers with tenths as decimals",
        pt: "Números mistos com décimos como decimais",
        es: "Números mixtos con décimos como decimales",
      },
      summary: {
        en: "The whole number stays, the fraction becomes the decimal part.",
        pt: "O número inteiro fica, a fração vira a parte decimal.",
        es: "El número entero se queda, la fracción se convierte en la parte decimal.",
      },
      lesson: {
        intro: {
          en: "Keep the whole number as is, and turn the tenths fraction into the decimal digit after the point.",
          pt: "Mantenha o número inteiro como está, e transforme a fração de décimos no dígito decimal depois do ponto.",
          es: "Mantén el número entero tal cual, y convierte la fracción de décimos en el dígito decimal después del punto.",
        },
        example: { id: "ex-black-13", prompt: "2 4/10", answer: 2, secondaryAnswer: 4, secondaryFormat: "decimal", operands: [2, 4] },
        steps: [
          {
            text: {
              en: "The whole number 2 stays the same.",
              pt: "O número inteiro 2 fica igual.",
              es: "El número entero 2 se mantiene igual.",
            },
          },
          {
            text: {
              en: "4/10 becomes the decimal digit: .4.",
              pt: "4/10 vira o dígito decimal: .4.",
              es: "4/10 se convierte en el dígito decimal: .4.",
            },
          },
          { text: { en: "2 4/10 = 2.4.", pt: "2 4/10 = 2.4.", es: "2 4/10 = 2.4." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateMixedTenthsToDecimal,
    },
    {
      id: "black-14",
      beltId: "black",
      index: 4,
      degree: decimalsDegree,
      title: { en: "Adding decimals, no carrying", pt: "Somar decimais, sem 'vai um'", es: "Sumar decimales, sin llevar" },
      summary: {
        en: "Add the whole numbers and the tenths separately.",
        pt: "Some os números inteiros e os décimos separadamente.",
        es: "Suma los números enteros y los décimos por separado.",
      },
      lesson: {
        intro: {
          en: "Line up the decimal points, then add the whole numbers and the tenths digits separately.",
          pt: "Alinhe os pontos decimais, depois some os números inteiros e os dígitos dos décimos separadamente.",
          es: "Alinea los puntos decimales, luego suma los números enteros y los dígitos de los décimos por separado.",
        },
        example: { id: "ex-black-14", prompt: "2.3 + 1.4", answer: 3, secondaryAnswer: 7, secondaryFormat: "decimal", operands: [2, 3, 1, 4] },
        steps: [
          {
            text: { en: "Add the whole numbers: 2 + 1 = 3.", pt: "Some os inteiros: 2 + 1 = 3.", es: "Suma los enteros: 2 + 1 = 3." },
          },
          { text: { en: "Add the tenths: 3 + 4 = 7.", pt: "Some os décimos: 3 + 4 = 7.", es: "Suma los décimos: 3 + 4 = 7." } },
          { text: { en: "2.3 + 1.4 = 3.7.", pt: "2.3 + 1.4 = 3.7.", es: "2.3 + 1.4 = 3.7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateAddDecimalsNoCarry,
    },
    {
      id: "black-15",
      beltId: "black",
      index: 5,
      degree: decimalsDegree,
      title: {
        en: "Adding decimals, with carrying",
        pt: "Somar decimais, com 'vai um'",
        es: "Sumar decimales, llevando",
      },
      summary: {
        en: "When the tenths overflow 9, carry the 1 into the whole numbers.",
        pt: "Quando os décimos passam de 9, o 1 vai para os inteiros.",
        es: "Cuando los décimos pasan de 9, el 1 se lleva a los enteros.",
      },
      lesson: {
        intro: {
          en: "Add the tenths first. If it's 10 or more, carry the 1 into the whole-number sum.",
          pt: "Some os décimos primeiro. Se der 10 ou mais, leve o 1 para a soma dos inteiros.",
          es: "Suma los décimos primero. Si da 10 o más, lleva el 1 a la suma de los enteros.",
        },
        example: { id: "ex-black-15", prompt: "2.7 + 1.6", answer: 4, secondaryAnswer: 3, secondaryFormat: "decimal", operands: [2, 7, 1, 6] },
        steps: [
          {
            text: {
              en: "Add the tenths: 7 + 6 = 13. Write the 3, carry the {{1}}.",
              pt: "Some os décimos: 7 + 6 = 13. Escreva o 3 e leve o {{1}}.",
              es: "Suma los décimos: 7 + 6 = 13. Escribe el 3 y lleva el {{1}}.",
            },
          },
          {
            text: {
              en: "Add the whole numbers plus the carry: 2 + 1 + {{1}} = 4.",
              pt: "Some os inteiros mais o que veio: 2 + 1 + {{1}} = 4.",
              es: "Suma los enteros más el acarreo: 2 + 1 + {{1}} = 4.",
            },
          },
          { text: { en: "2.7 + 1.6 = 4.3.", pt: "2.7 + 1.6 = 4.3.", es: "2.7 + 1.6 = 4.3." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateAddDecimalsWithCarry,
    },
    {
      id: "black-16",
      beltId: "black",
      index: 6,
      degree: decimalsDegree,
      title: {
        en: "Subtracting decimals, no borrowing",
        pt: "Subtrair decimais, sem 'emprestar'",
        es: "Restar decimales, sin prestar",
      },
      summary: {
        en: "Subtract the whole numbers and the tenths separately.",
        pt: "Subtraia os números inteiros e os décimos separadamente.",
        es: "Resta los números enteros y los décimos por separado.",
      },
      lesson: {
        intro: {
          en: "Line up the decimal points, then subtract the whole numbers and the tenths digits separately.",
          pt: "Alinhe os pontos decimais, depois subtraia os números inteiros e os dígitos dos décimos separadamente.",
          es: "Alinea los puntos decimales, luego resta los números enteros y los dígitos de los décimos por separado.",
        },
        example: { id: "ex-black-16", prompt: "5.8 - 2.3", answer: 3, secondaryAnswer: 5, secondaryFormat: "decimal", operands: [5, 8, 2, 3] },
        steps: [
          { text: { en: "Subtract the whole numbers: 5 - 2 = 3.", pt: "Subtraia os inteiros: 5 - 2 = 3.", es: "Resta los enteros: 5 - 2 = 3." } },
          { text: { en: "Subtract the tenths: 8 - 3 = 5.", pt: "Subtraia os décimos: 8 - 3 = 5.", es: "Resta los décimos: 8 - 3 = 5." } },
          { text: { en: "5.8 - 2.3 = 3.5.", pt: "5.8 - 2.3 = 3.5.", es: "5.8 - 2.3 = 3.5." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateSubtractDecimalsNoBorrow,
    },
    {
      id: "black-17",
      beltId: "black",
      index: 7,
      degree: decimalsDegree,
      title: {
        en: "Subtracting decimals, with borrowing",
        pt: "Subtrair decimais, com 'emprestar'",
        es: "Restar decimales, prestando",
      },
      summary: {
        en: "When the top tenths digit is smaller, borrow from the whole numbers.",
        pt: "Quando o décimo de cima é menor, empreste dos inteiros.",
        es: "Cuando el décimo de arriba es menor, presta de los enteros.",
      },
      lesson: {
        intro: {
          en: "If the top tenths digit is smaller than the bottom one, borrow 1 whole (worth 10 tenths) before subtracting.",
          pt: "Se o décimo de cima for menor que o de baixo, empreste 1 inteiro (que vale 10 décimos) antes de subtrair.",
          es: "Si el décimo de arriba es menor que el de abajo, presta 1 entero (que vale 10 décimos) antes de restar.",
        },
        example: { id: "ex-black-17", prompt: "5.2 - 2.6", answer: 2, secondaryAnswer: 6, secondaryFormat: "decimal", operands: [5, 2, 2, 6] },
        steps: [
          {
            text: {
              en: "2 is smaller than 6, so borrow {{1}} whole: 12 - 6 = 6 tenths.",
              pt: "2 é menor que 6, então empreste {{1}} inteiro: 12 - 6 = 6 décimos.",
              es: "2 es menor que 6, así que presta {{1}} entero: 12 - 6 = 6 décimos.",
            },
          },
          {
            text: {
              en: "The whole numbers: 5 - {{1}} - 2 = 2.",
              pt: "Os inteiros: 5 - {{1}} - 2 = 2.",
              es: "Los enteros: 5 - {{1}} - 2 = 2.",
            },
          },
          { text: { en: "5.2 - 2.6 = 2.6.", pt: "5.2 - 2.6 = 2.6.", es: "5.2 - 2.6 = 2.6." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateSubtractDecimalsWithBorrow,
    },
    {
      id: "black-18",
      beltId: "black",
      index: 8,
      degree: decimalsDegree,
      title: {
        en: "Multiplying decimals by 10 and 100",
        pt: "Multiplicar decimais por 10 e por 100",
        es: "Multiplicar decimales por 10 y por 100",
      },
      summary: {
        en: "The decimal point shifts to the right.",
        pt: "O ponto decimal se desloca para a direita.",
        es: "El punto decimal se desplaza hacia la derecha.",
      },
      lesson: {
        intro: {
          en: "Multiplying by 10 moves the decimal point one place right. Multiplying by 100 moves it two places right.",
          pt: "Multiplicar por 10 desloca o ponto decimal uma casa para a direita. Multiplicar por 100 desloca duas casas.",
          es: "Multiplicar por 10 desplaza el punto decimal un lugar a la derecha. Multiplicar por 100 desplaza dos lugares.",
        },
        example: { id: "ex-black-18", prompt: "3.4 × 10", answer: 34, operands: [3, 4, 10] },
        steps: [
          {
            text: {
              en: "×10 moves the point one place right.",
              pt: "×10 desloca o ponto uma casa para a direita.",
              es: "×10 desplaza el punto un lugar a la derecha.",
            },
          },
          { text: { en: "3.4 becomes 34.", pt: "3.4 vira 34.", es: "3.4 se convierte en 34." } },
          { text: { en: "3.4 × 10 = 34.", pt: "3.4 × 10 = 34.", es: "3.4 × 10 = 34." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 8 },
      generate: generateMultiplyDecimalBy10Or100,
    },
    {
      id: "black-19",
      beltId: "black",
      index: 9,
      degree: decimalsDegree,
      title: {
        en: "Dividing a whole number by 10",
        pt: "Dividir um número inteiro por 10",
        es: "Dividir un número entero entre 10",
      },
      summary: {
        en: "The decimal point shifts back to the left.",
        pt: "O ponto decimal volta uma casa para a esquerda.",
        es: "El punto decimal vuelve un lugar a la izquierda.",
      },
      lesson: {
        intro: {
          en: "Dividing by 10 moves the decimal point one place left — the last digit becomes the tenths.",
          pt: "Dividir por 10 desloca o ponto decimal uma casa para a esquerda — o último dígito vira o décimo.",
          es: "Dividir entre 10 desplaza el punto decimal un lugar a la izquierda — el último dígito se convierte en el décimo.",
        },
        example: { id: "ex-black-19", prompt: "47 ÷ 10", answer: 4, secondaryAnswer: 7, secondaryFormat: "decimal", operands: [47] },
        steps: [
          {
            text: {
              en: "÷10 moves the point one place left.",
              pt: "÷10 desloca o ponto uma casa para a esquerda.",
              es: "÷10 desplaza el punto un lugar a la izquierda.",
            },
          },
          { text: { en: "47 becomes 4.7.", pt: "47 vira 4.7.", es: "47 se convierte en 4.7." } },
          { text: { en: "47 ÷ 10 = 4.7.", pt: "47 ÷ 10 = 4.7.", es: "47 ÷ 10 = 4.7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateDivideWholeBy10,
    },
    {
      id: "black-20",
      beltId: "black",
      index: 10,
      degree: decimalsDegree,
      title: { en: "Rounding decimals", pt: "Arredondar decimais", es: "Redondear decimales" },
      summary: {
        en: "Round to the nearest whole number using the tenths digit.",
        pt: "Arredonde para o inteiro mais próximo usando o dígito dos décimos.",
        es: "Redondea al número entero más cercano usando el dígito de los décimos.",
      },
      lesson: {
        intro: {
          en: "Look at the tenths digit. If it's 5 or more, round up. If it's less than 5, round down.",
          pt: "Olhe o dígito dos décimos. Se for 5 ou mais, arredonde para cima. Se for menos de 5, arredonde para baixo.",
          es: "Mira el dígito de los décimos. Si es 5 o más, redondea hacia arriba. Si es menos de 5, redondea hacia abajo.",
        },
        example: { id: "ex-black-20", prompt: "3.7", answer: 4, operands: [3, 7] },
        steps: [
          {
            text: {
              en: "The tenths digit is 7, which is 5 or more.",
              pt: "O dígito dos décimos é 7, que é 5 ou mais.",
              es: "El dígito de los décimos es 7, que es 5 o más.",
            },
          },
          {
            text: {
              en: "Round up: 3 becomes 4.",
              pt: "Arredonde para cima: 3 vira 4.",
              es: "Redondea hacia arriba: 3 se convierte en 4.",
            },
          },
          { text: { en: "3.7 rounds to 4.", pt: "3.7 arredonda para 4.", es: "3.7 se redondea a 4." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateRoundDecimal,
    },
  ],
};

const coralBelt: Belt = {
  id: "coral",
  name: { en: "Coral Belt", pt: "Faixa Coral", es: "Cinturón Coral" },
  order: 6,
  operationLabel: { en: "Calculus I", pt: "Cálculo I", es: "Cálculo I" },
  colorVar: "--belt-coral",
  tagline: {
    en: "The rarest rank. Limits, derivatives, and integrals.",
    pt: "A faixa mais rara. Limites, derivadas e integrais.",
    es: "El rango más raro. Límites, derivadas e integrales.",
  },
  stripes: [],
  locked: true,
};

export const belts: Belt[] = [whiteBelt, blueBelt, purpleBelt, brownBelt, blackBelt, coralBelt];
