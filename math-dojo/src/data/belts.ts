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
  generateVariableBoxReading,
  generateEvaluateExpression,
  generateOrderOfOperations,
  generateNegativeNumberLine,
  generateAddIntegersSameSign,
  generateAddIntegersDifferentSigns,
  generateSubtractIntegers,
  generateCombiningLikeTerms,
  generateDistributiveProperty,
  generateMultiStepExpression,
  generateBalanceScaleReading,
  generateOneStepAddSub,
  generateOneStepMulDiv,
  generateTwoStepEquation,
  generateEquationNegativeSolution,
  generateVariableBothSides,
  generateEquationWithDistribution,
  generateCombineLikeTermsFirst,
  generateDistributionBothSides,
  generateMultiStepEquation,
  generateFunctionMachineReading,
  generateEvaluateFunctionPositive,
  generateEvaluateFunctionNegative,
  generateSlopeStaircaseReading,
  generateSlopeFromTwoPoints,
  generateFindYIntercept,
  generateFindXIntercept,
  generateEvaluateBasicQuadratic,
  generateEvaluateFullQuadratic,
  generateCombineFunctions,
  generateFactorAreaReading,
  generateFactorTrinomialPair,
  generateSolveQuadraticByFactoring,
  generateQuadraticFormula,
  generateCompleteTheSquare,
  generateDiscriminant,
  generateSimplifyRadical,
  generateExponentRules,
  generateLinearSystem,
  generateRearrangeFactorSolve,
  generateLimitLinearConcept,
  generateLimitQuadratic,
  generateLimitFactoring,
  generateDerivativeLinearConcept,
  generateDerivativePowerRule,
  generateDerivativeAtPoint,
  generateAreaBarsReading,
  generateAntiderivativePowerRule,
  generateDefiniteIntegral,
  generateCalculusCapstone,
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

const algebraDegree = {
  index: 3,
  name: { en: "Algebra", pt: "Álgebra", es: "Álgebra" } as LocalizedText,
};

const equationsDegree = {
  index: 4,
  name: { en: "Equations", pt: "Equações", es: "Ecuaciones" } as LocalizedText,
};

const functionsDegree = {
  index: 5,
  name: { en: "Functions", pt: "Funções", es: "Funciones" } as LocalizedText,
};

const preCalcDegree = {
  index: 6,
  name: { en: "Pre-Calculus", pt: "Pré-Cálculo", es: "Precálculo" } as LocalizedText,
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
    {
      id: "black-21",
      beltId: "black",
      index: 1,
      degree: algebraDegree,
      title: {
        en: "What a variable means",
        pt: "O que significa uma variável",
        es: "Qué significa una variable",
      },
      summary: {
        en: "A variable is just a box that holds a number.",
        pt: "Uma variável é só uma caixa que guarda um número.",
        es: "Una variable es solo una caja que guarda un número.",
      },
      lesson: {
        intro: {
          en: "A letter like x stands for a number — sometimes it's a mystery, but here it's already revealed. Read the picture and add up what it's worth.",
          pt: "Uma letra como x representa um número — às vezes é um mistério, mas aqui já foi revelado. Leia a figura e some o que ela vale.",
          es: "Una letra como x representa un número — a veces es un misterio, pero aquí ya fue revelado. Lee la imagen y suma lo que vale.",
        },
        example: { id: "ex-black-21", prompt: "", answer: 5, operands: [3, 2] },
        diagram: { kind: "variableBox", xValue: 3, units: 2 },
        steps: [
          {
            text: {
              en: "The box is labeled x, and it's revealed to hold {{3}}.",
              pt: "A caixa está rotulada x, e foi revelado que ela guarda {{3}}.",
              es: "La caja está etiquetada x, y se reveló que guarda {{3}}.",
            },
          },
          {
            text: {
              en: "Add the loose units: {{3}} + 2 = 5.",
              pt: "Some as unidades soltas: {{3}} + 2 = 5.",
              es: "Suma las unidades sueltas: {{3}} + 2 = 5.",
            },
          },
          { text: { en: "x + 2 = 5, when x = 3.", pt: "x + 2 = 5, quando x = 3.", es: "x + 2 = 5, cuando x = 3." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateVariableBoxReading,
    },
    {
      id: "black-22",
      beltId: "black",
      index: 2,
      degree: algebraDegree,
      title: {
        en: "Evaluating expressions",
        pt: "Avaliando expressões",
        es: "Evaluando expresiones",
      },
      summary: {
        en: "Swap the letter for its number, then do the math.",
        pt: "Troque a letra pelo número, depois faça a conta.",
        es: "Cambia la letra por su número, luego haz la cuenta.",
      },
      lesson: {
        intro: {
          en: "Once you know what x equals, replace every x in the expression with that number and solve like normal.",
          pt: "Depois de saber quanto vale x, troque cada x na expressão por esse número e resolva normalmente.",
          es: "Una vez que sabes cuánto vale x, cambia cada x en la expresión por ese número y resuelve normalmente.",
        },
        example: { id: "ex-black-22", prompt: "3x + 2, x = 4", answer: 14, operands: [3, 2, 4] },
        steps: [
          {
            text: {
              en: "Swap x for its value: 3 × {{4}}.",
              pt: "Troque x pelo valor: 3 × {{4}}.",
              es: "Cambia x por su valor: 3 × {{4}}.",
            },
          },
          {
            text: {
              en: "Multiply: 3 × 4 = {{12}}.",
              pt: "Multiplique: 3 × 4 = {{12}}.",
              es: "Multiplica: 3 × 4 = {{12}}.",
            },
          },
          {
            text: {
              en: "Add the rest: 12 + 2 = 14.",
              pt: "Some o resto: 12 + 2 = 14.",
              es: "Suma el resto: 12 + 2 = 14.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateEvaluateExpression,
    },
    {
      id: "black-23",
      beltId: "black",
      index: 3,
      degree: algebraDegree,
      title: {
        en: "Order of operations",
        pt: "Ordem das operações",
        es: "Orden de las operaciones",
      },
      summary: {
        en: "Multiply and divide before you add or subtract.",
        pt: "Multiplique e divida antes de somar ou subtrair.",
        es: "Multiplica y divide antes de sumar o restar.",
      },
      lesson: {
        intro: {
          en: "Math reads left to right, but multiplication and division always happen before addition and subtraction — and anything inside parentheses happens first of all.",
          pt: "A matemática se lê da esquerda para a direita, mas multiplicação e divisão sempre acontecem antes de soma e subtração — e o que está dentro de parênteses acontece primeiro de tudo.",
          es: "La matemática se lee de izquierda a derecha, pero la multiplicación y la división siempre ocurren antes de la suma y la resta — y lo que está dentro de paréntesis ocurre primero que nada.",
        },
        example: { id: "ex-black-23", prompt: "4 + 3 × 2", answer: 10, operands: [4, 3, 2] },
        steps: [
          {
            text: {
              en: "Multiply first: 3 × 2 = {{6}}.",
              pt: "Multiplique primeiro: 3 × 2 = {{6}}.",
              es: "Multiplica primero: 3 × 2 = {{6}}.",
            },
          },
          {
            text: {
              en: "Then add: 4 + 6 = 10.",
              pt: "Depois some: 4 + 6 = 10.",
              es: "Luego suma: 4 + 6 = 10.",
            },
          },
          {
            text: {
              en: "4 + 3 × 2 = 10, not 14 — multiplication always goes first.",
              pt: "4 + 3 × 2 = 10, não 14 — multiplicação sempre vem primeiro.",
              es: "4 + 3 × 2 = 10, no 14 — la multiplicación siempre va primero.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateOrderOfOperations,
    },
    {
      id: "black-24",
      beltId: "black",
      index: 4,
      degree: algebraDegree,
      title: {
        en: "Negative numbers on the number line",
        pt: "Números negativos na reta numérica",
        es: "Números negativos en la recta numérica",
      },
      summary: {
        en: "Numbers can go below zero too.",
        pt: "Os números também podem ficar abaixo de zero.",
        es: "Los números también pueden estar debajo de cero.",
      },
      lesson: {
        intro: {
          en: "Every hop left past zero keeps counting down — zero isn't the end of the line. A minus sign just means 'the opposite direction.'",
          pt: "Cada salto para a esquerda depois do zero continua contando — zero não é o fim da reta. Um sinal de menos só significa 'a direção oposta.'",
          es: "Cada salto a la izquierda después de cero sigue contando — el cero no es el final de la recta. Un signo menos solo significa 'la dirección opuesta.'",
        },
        example: { id: "ex-black-24", prompt: "", answer: -3, operands: [2, 5] },
        diagram: { kind: "numberLine", start: 2, end: -3 },
        steps: [
          {
            text: {
              en: "Start at {{2}} and hop left 5 times, past zero.",
              pt: "Comece em {{2}} e dê 5 saltos para a esquerda, passando do zero.",
              es: "Empieza en {{2}} y da 5 saltos a la izquierda, pasando por cero.",
            },
          },
          {
            text: {
              en: "Each hop past zero keeps counting down: 0, -1, -2, -3.",
              pt: "Cada salto depois do zero continua contando: 0, -1, -2, -3.",
              es: "Cada salto después de cero sigue contando: 0, -1, -2, -3.",
            },
          },
          { text: { en: "You land on -3.", pt: "Você cai em -3.", es: "Caes en -3." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateNegativeNumberLine,
    },
    {
      id: "black-25",
      beltId: "black",
      index: 5,
      degree: algebraDegree,
      title: {
        en: "Adding integers, same sign",
        pt: "Somando números inteiros, mesmo sinal",
        es: "Sumando números enteros, mismo signo",
      },
      summary: {
        en: "Same sign? Add the sizes and keep the sign.",
        pt: "Mesmo sinal? Some os tamanhos e mantenha o sinal.",
        es: "¿Mismo signo? Suma los tamaños y mantén el signo.",
      },
      lesson: {
        intro: {
          en: "When both numbers have the same sign, add their sizes like normal, then give the answer that same sign.",
          pt: "Quando os dois números têm o mesmo sinal, some os tamanhos normalmente, depois dê à resposta esse mesmo sinal.",
          es: "Cuando los dos números tienen el mismo signo, suma los tamaños normalmente, luego dale a la respuesta ese mismo signo.",
        },
        example: { id: "ex-black-25", prompt: "-4 + (-7)", answer: -11, operands: [-4, -7] },
        steps: [
          {
            text: {
              en: "Both numbers are negative — same sign.",
              pt: "Os dois números são negativos — mesmo sinal.",
              es: "Los dos números son negativos — mismo signo.",
            },
          },
          {
            text: {
              en: "Add their sizes: 4 + 7 = {{11}}.",
              pt: "Some os tamanhos: 4 + 7 = {{11}}.",
              es: "Suma los tamaños: 4 + 7 = {{11}}.",
            },
          },
          {
            text: {
              en: "Keep the negative sign: -4 + (-7) = -11.",
              pt: "Mantenha o sinal negativo: -4 + (-7) = -11.",
              es: "Mantén el signo negativo: -4 + (-7) = -11.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateAddIntegersSameSign,
    },
    {
      id: "black-26",
      beltId: "black",
      index: 6,
      degree: algebraDegree,
      title: {
        en: "Adding integers, different signs",
        pt: "Somando números inteiros, sinais diferentes",
        es: "Sumando números enteros, signos diferentes",
      },
      summary: {
        en: "Different signs? Subtract the sizes, keep the bigger one's sign.",
        pt: "Sinais diferentes? Subtraia os tamanhos, mantenha o sinal do maior.",
        es: "¿Signos diferentes? Resta los tamaños, mantén el signo del mayor.",
      },
      lesson: {
        intro: {
          en: "When the signs are different, the numbers partly cancel out — find the difference in their sizes, then give the answer the sign of whichever number was bigger.",
          pt: "Quando os sinais são diferentes, os números se cancelam em parte — ache a diferença entre os tamanhos, depois dê à resposta o sinal do número que era maior.",
          es: "Cuando los signos son diferentes, los números se cancelan en parte — halla la diferencia entre los tamaños, luego dale a la respuesta el signo del número que era mayor.",
        },
        example: { id: "ex-black-26", prompt: "-8 + 3", answer: -5, operands: [-8, 3] },
        steps: [
          {
            text: {
              en: "Different signs — find the difference in size: 8 - 3 = {{5}}.",
              pt: "Sinais diferentes — ache a diferença de tamanho: 8 - 3 = {{5}}.",
              es: "Signos diferentes — halla la diferencia de tamaño: 8 - 3 = {{5}}.",
            },
          },
          {
            text: {
              en: "The 8 is bigger and it's negative, so the answer stays negative.",
              pt: "O 8 é maior e é negativo, então a resposta continua negativa.",
              es: "El 8 es mayor y es negativo, así que la respuesta sigue siendo negativa.",
            },
          },
          { text: { en: "-8 + 3 = -5.", pt: "-8 + 3 = -5.", es: "-8 + 3 = -5." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateAddIntegersDifferentSigns,
    },
    {
      id: "black-27",
      beltId: "black",
      index: 7,
      degree: algebraDegree,
      title: {
        en: "Subtracting integers",
        pt: "Subtraindo números inteiros",
        es: "Restando números enteros",
      },
      summary: {
        en: "Subtracting is the same as adding the opposite.",
        pt: "Subtrair é o mesmo que somar o oposto.",
        es: "Restar es lo mismo que sumar el opuesto.",
      },
      lesson: {
        intro: {
          en: "Every subtraction can be rewritten as adding a negative — flip the sign of the second number, then add using the rules you already know.",
          pt: "Toda subtração pode ser reescrita como somar um negativo — inverta o sinal do segundo número, depois some usando as regras que você já conhece.",
          es: "Toda resta se puede reescribir como sumar un negativo — invierte el signo del segundo número, luego suma usando las reglas que ya conoces.",
        },
        example: { id: "ex-black-27", prompt: "4 - 9", answer: -5, operands: [4, 9] },
        steps: [
          {
            text: {
              en: "Turn subtraction into adding the opposite: 4 - 9 becomes 4 + ({{-9}}).",
              pt: "Transforme a subtração em soma do oposto: 4 - 9 vira 4 + ({{-9}}).",
              es: "Convierte la resta en sumar el opuesto: 4 - 9 se convierte en 4 + ({{-9}}).",
            },
          },
          {
            text: {
              en: "Now add like before: 4 + (-9) = -5.",
              pt: "Agora some como antes: 4 + (-9) = -5.",
              es: "Ahora suma como antes: 4 + (-9) = -5.",
            },
          },
          { text: { en: "4 - 9 = -5.", pt: "4 - 9 = -5.", es: "4 - 9 = -5." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateSubtractIntegers,
    },
    {
      id: "black-28",
      beltId: "black",
      index: 8,
      degree: algebraDegree,
      title: {
        en: "Combining like terms",
        pt: "Combinando termos semelhantes",
        es: "Combinando términos semejantes",
      },
      summary: {
        en: "Same variable? Just add or subtract the coefficients.",
        pt: "Mesma variável? Só some ou subtraia os coeficientes.",
        es: "¿Misma variable? Solo suma o resta los coeficientes.",
      },
      lesson: {
        intro: {
          en: "Terms with the exact same variable are 'like terms' — the x just comes along for the ride while you add or subtract the numbers in front of it.",
          pt: "Termos com exatamente a mesma variável são 'termos semelhantes' — o x só acompanha enquanto você soma ou subtrai os números na frente dele.",
          es: "Los términos con exactamente la misma variable son 'términos semejantes' — la x solo acompaña mientras sumas o restas los números al frente.",
        },
        example: { id: "ex-black-28", prompt: "5x + 3x", answer: 8, operands: [5, 3] },
        steps: [
          {
            text: {
              en: "Both terms have x, so they're 'like terms.'",
              pt: "Os dois termos têm x, então são 'termos semelhantes.'",
              es: "Los dos términos tienen x, así que son 'términos semejantes.'",
            },
          },
          {
            text: {
              en: "Add the coefficients: 5 + 3 = {{8}}.",
              pt: "Some os coeficientes: 5 + 3 = {{8}}.",
              es: "Suma los coeficientes: 5 + 3 = {{8}}.",
            },
          },
          { text: { en: "5x + 3x = 8x.", pt: "5x + 3x = 8x.", es: "5x + 3x = 8x." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateCombiningLikeTerms,
    },
    {
      id: "black-29",
      beltId: "black",
      index: 9,
      degree: algebraDegree,
      title: {
        en: "The distributive property",
        pt: "A propriedade distributiva",
        es: "La propiedad distributiva",
      },
      summary: {
        en: "Multiply the outside number by everything inside the parentheses.",
        pt: "Multiplique o número de fora por tudo que está dentro dos parênteses.",
        es: "Multiplica el número de afuera por todo lo que está dentro del paréntesis.",
      },
      lesson: {
        intro: {
          en: "This is the same trick as splitting 23 × 4 into 20 × 4 + 3 × 4 back in Purple Belt — just with a variable standing in for part of the sum now.",
          pt: "É o mesmo truque de dividir 23 × 4 em 20 × 4 + 3 × 4 lá da Faixa Roxa — só que agora uma variável ocupa o lugar de parte da soma.",
          es: "Es el mismo truco de dividir 23 × 4 en 20 × 4 + 3 × 4 del Cinturón Morado — solo que ahora una variable ocupa parte de la suma.",
        },
        example: { id: "ex-black-29", prompt: "3(x + 4), x = 2", answer: 18, operands: [3, 4, 2] },
        steps: [
          {
            text: {
              en: "Multiply 3 by each part inside: 3 × x and 3 × 4.",
              pt: "Multiplique 3 por cada parte de dentro: 3 × x e 3 × 4.",
              es: "Multiplica 3 por cada parte de adentro: 3 × x y 3 × 4.",
            },
          },
          {
            text: {
              en: "Substitute x = 2 first: 3 × (2 + 4) = 3 × {{6}}.",
              pt: "Substitua x = 2 primeiro: 3 × (2 + 4) = 3 × {{6}}.",
              es: "Sustituye x = 2 primero: 3 × (2 + 4) = 3 × {{6}}.",
            },
          },
          { text: { en: "3 × 6 = 18.", pt: "3 × 6 = 18.", es: "3 × 6 = 18." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateDistributiveProperty,
    },
    {
      id: "black-30",
      beltId: "black",
      index: 10,
      degree: algebraDegree,
      title: {
        en: "Multi-step expressions",
        pt: "Expressões de várias etapas",
        es: "Expresiones de varios pasos",
      },
      summary: {
        en: "Distribute, then finish the rest — every Algebra skill in one problem.",
        pt: "Distribua, depois termine o resto — todas as habilidades de Álgebra em um problema.",
        es: "Distribuye, luego termina el resto — todas las habilidades de Álgebra en un problema.",
      },
      lesson: {
        intro: {
          en: "A phrase like 'four times the sum of a number and 3, minus 5' becomes 4(x + 3) - 5. Once it's written as an expression, evaluating it uses everything from this belt: substitution, order of operations, negative numbers, and distributing.",
          pt: "Uma frase como 'quatro vezes a soma de um número e 3, menos 5' vira 4(x + 3) - 5. Depois de escrita como expressão, avaliá-la usa tudo desta faixa: substituição, ordem das operações, números negativos e distributiva.",
          es: "Una frase como 'cuatro veces la suma de un número y 3, menos 5' se convierte en 4(x + 3) - 5. Una vez escrita como expresión, evaluarla usa todo de este cinturón: sustitución, orden de operaciones, números negativos y distributiva.",
        },
        example: { id: "ex-black-30", prompt: "4(x + 3) - 5, x = -2", answer: -1, operands: [4, 3, 5, -2] },
        steps: [
          {
            text: {
              en: "Substitute x = -2 inside the parentheses: 4(-2 + 3) - 5.",
              pt: "Substitua x = -2 dentro dos parênteses: 4(-2 + 3) - 5.",
              es: "Sustituye x = -2 dentro del paréntesis: 4(-2 + 3) - 5.",
            },
          },
          {
            text: {
              en: "Add inside first: -2 + 3 = {{1}}.",
              pt: "Some dentro primeiro: -2 + 3 = {{1}}.",
              es: "Suma adentro primero: -2 + 3 = {{1}}.",
            },
          },
          {
            text: {
              en: "Distribute: 4 × 1 = 4, then finish: 4 - 5 = -1.",
              pt: "Distribua: 4 × 1 = 4, depois termine: 4 - 5 = -1.",
              es: "Distribuye: 4 × 1 = 4, luego termina: 4 - 5 = -1.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateMultiStepExpression,
    },
    {
      id: "black-31",
      beltId: "black",
      index: 1,
      degree: equationsDegree,
      title: {
        en: "What an equation means",
        pt: "O que significa uma equação",
        es: "Qué significa una ecuación",
      },
      summary: {
        en: "An equation is a balance — both sides must stay equal.",
        pt: "Uma equação é uma balança — os dois lados têm que ficar iguais.",
        es: "Una ecuación es una balanza — los dos lados deben quedar iguales.",
      },
      lesson: {
        intro: {
          en: "The scale is level because both sides weigh the same. Figure out what x must be to keep it balanced.",
          pt: "A balança está nivelada porque os dois lados pesam o mesmo. Descubra quanto x precisa valer para manter o equilíbrio.",
          es: "La balanza está nivelada porque los dos lados pesan lo mismo. Descubre cuánto debe valer x para mantener el equilibrio.",
        },
        example: { id: "ex-black-31", prompt: "", answer: 4, operands: [2, 6] },
        diagram: { kind: "balanceScale", leftUnits: 2, rightUnits: 6 },
        steps: [
          {
            text: {
              en: "The left side has x plus {{2}} units. The right side has 6 units.",
              pt: "O lado esquerdo tem x mais {{2}} unidades. O lado direito tem 6 unidades.",
              es: "El lado izquierdo tiene x más {{2}} unidades. El lado derecho tiene 6 unidades.",
            },
          },
          {
            text: {
              en: "For the scale to balance, x must make up the difference: 6 - 2 = {{4}}.",
              pt: "Para a balança ficar equilibrada, x precisa cobrir a diferença: 6 - 2 = {{4}}.",
              es: "Para que la balanza quede equilibrada, x debe cubrir la diferencia: 6 - 2 = {{4}}.",
            },
          },
          {
            text: {
              en: "x = 4, since 4 + 2 = 6.",
              pt: "x = 4, pois 4 + 2 = 6.",
              es: "x = 4, porque 4 + 2 = 6.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateBalanceScaleReading,
    },
    {
      id: "black-32",
      beltId: "black",
      index: 2,
      degree: equationsDegree,
      title: {
        en: "One-step equations: addition and subtraction",
        pt: "Equações de um passo: soma e subtração",
        es: "Ecuaciones de un paso: suma y resta",
      },
      summary: {
        en: "Undo the operation — subtract what's added, add what's subtracted.",
        pt: "Desfaça a operação — subtraia o que foi somado, some o que foi subtraído.",
        es: "Deshaz la operación — resta lo que se sumó, suma lo que se restó.",
      },
      lesson: {
        intro: {
          en: "Whatever was done to x, do the opposite to both sides to get x alone.",
          pt: "O que foi feito com x, faça o oposto nos dois lados para deixar x sozinho.",
          es: "Lo que se le hizo a x, haz lo opuesto en ambos lados para dejar a x solo.",
        },
        example: { id: "ex-black-32", prompt: "x + 5 = 12", answer: 7, operands: [5, 12], isEquation: true },
        steps: [
          {
            text: {
              en: "x has 5 added to it. Do the opposite: subtract 5 from both sides.",
              pt: "x tem 5 somado a ele. Faça o oposto: subtraia 5 dos dois lados.",
              es: "A x se le suma 5. Haz lo opuesto: resta 5 de ambos lados.",
            },
          },
          {
            text: { en: "12 - 5 = {{7}}.", pt: "12 - 5 = {{7}}.", es: "12 - 5 = {{7}}." },
          },
          { text: { en: "x = 7.", pt: "x = 7.", es: "x = 7." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateOneStepAddSub,
    },
    {
      id: "black-33",
      beltId: "black",
      index: 3,
      degree: equationsDegree,
      title: {
        en: "One-step equations: multiplication and division",
        pt: "Equações de um passo: multiplicação e divisão",
        es: "Ecuaciones de un paso: multiplicación y división",
      },
      summary: {
        en: "Undo multiplication with division, and division with multiplication.",
        pt: "Desfaça a multiplicação com divisão, e a divisão com multiplicação.",
        es: "Deshaz la multiplicación con división, y la división con multiplicación.",
      },
      lesson: {
        intro: {
          en: "x is being multiplied by 4 — divide both sides by 4 to undo it.",
          pt: "x está sendo multiplicado por 4 — divida os dois lados por 4 para desfazer isso.",
          es: "x está siendo multiplicado por 4 — divide ambos lados entre 4 para deshacerlo.",
        },
        example: { id: "ex-black-33", prompt: "4x = 20", answer: 5, operands: [4, 20], isEquation: true },
        steps: [
          {
            text: {
              en: "x is multiplied by 4. Do the opposite: divide both sides by 4.",
              pt: "x é multiplicado por 4. Faça o oposto: divida os dois lados por 4.",
              es: "x está multiplicado por 4. Haz lo opuesto: divide ambos lados entre 4.",
            },
          },
          {
            text: { en: "20 ÷ 4 = {{5}}.", pt: "20 ÷ 4 = {{5}}.", es: "20 ÷ 4 = {{5}}." },
          },
          { text: { en: "x = 5.", pt: "x = 5.", es: "x = 5." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateOneStepMulDiv,
    },
    {
      id: "black-34",
      beltId: "black",
      index: 4,
      degree: equationsDegree,
      title: {
        en: "Two-step equations",
        pt: "Equações de dois passos",
        es: "Ecuaciones de dos pasos",
      },
      summary: {
        en: "Undo addition or subtraction first, then multiplication or division.",
        pt: "Desfaça a soma ou subtração primeiro, depois a multiplicação ou divisão.",
        es: "Deshaz la suma o resta primero, luego la multiplicación o división.",
      },
      lesson: {
        intro: {
          en: "Work backwards through the order of operations: undo the +/- part first, then the ×/÷ part.",
          pt: "Trabalhe de trás para frente pela ordem das operações: desfaça a parte de +/- primeiro, depois a de ×/÷.",
          es: "Trabaja hacia atrás en el orden de las operaciones: deshaz la parte de +/- primero, luego la de ×/÷.",
        },
        example: { id: "ex-black-34", prompt: "3x + 4 = 19", answer: 5, operands: [3, 4, 19], isEquation: true },
        steps: [
          {
            text: {
              en: "Undo the +4 first: subtract 4 from both sides. 19 - 4 = {{15}}.",
              pt: "Desfaça o +4 primeiro: subtraia 4 dos dois lados. 19 - 4 = {{15}}.",
              es: "Deshaz el +4 primero: resta 4 de ambos lados. 19 - 4 = {{15}}.",
            },
          },
          {
            text: {
              en: "Now undo the ×3: divide both sides by 3. 15 ÷ 3 = 5.",
              pt: "Agora desfaça o ×3: divida os dois lados por 3. 15 ÷ 3 = 5.",
              es: "Ahora deshaz el ×3: divide ambos lados entre 3. 15 ÷ 3 = 5.",
            },
          },
          { text: { en: "x = 5.", pt: "x = 5.", es: "x = 5." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateTwoStepEquation,
    },
    {
      id: "black-35",
      beltId: "black",
      index: 5,
      degree: equationsDegree,
      title: {
        en: "Equations with negative solutions",
        pt: "Equações com soluções negativas",
        es: "Ecuaciones con soluciones negativas",
      },
      summary: {
        en: "Sometimes x has to be negative to balance the scale.",
        pt: "Às vezes x precisa ser negativo para equilibrar a balança.",
        es: "A veces x tiene que ser negativo para equilibrar la balanza.",
      },
      lesson: {
        intro: {
          en: "Solve the same way as before — the answer just happens to land below zero this time.",
          pt: "Resolva do mesmo jeito de antes — a resposta só acaba ficando abaixo de zero dessa vez.",
          es: "Resuelve de la misma manera que antes — la respuesta solo termina quedando debajo de cero esta vez.",
        },
        example: { id: "ex-black-35", prompt: "2x + 9 = 3", answer: -3, operands: [2, 9, 3], isEquation: true },
        steps: [
          {
            text: {
              en: "Undo the +9 first: 3 - 9 = {{-6}}.",
              pt: "Desfaça o +9 primeiro: 3 - 9 = {{-6}}.",
              es: "Deshaz el +9 primero: 3 - 9 = {{-6}}.",
            },
          },
          {
            text: {
              en: "Now undo the ×2: -6 ÷ 2 = -3.",
              pt: "Agora desfaça o ×2: -6 ÷ 2 = -3.",
              es: "Ahora deshaz el ×2: -6 ÷ 2 = -3.",
            },
          },
          { text: { en: "x = -3.", pt: "x = -3.", es: "x = -3." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateEquationNegativeSolution,
    },
    {
      id: "black-36",
      beltId: "black",
      index: 6,
      degree: equationsDegree,
      title: {
        en: "Variables on both sides",
        pt: "Variável nos dois lados",
        es: "Variable en ambos lados",
      },
      summary: {
        en: "Gather the x terms on one side before you solve.",
        pt: "Reúna os termos com x em um lado antes de resolver.",
        es: "Reúne los términos con x en un lado antes de resolver.",
      },
      lesson: {
        intro: {
          en: "When x shows up on both sides, subtract the smaller x-term from both sides first — then it's a normal two-step equation.",
          pt: "Quando x aparece nos dois lados, subtraia o termo com x menor dos dois lados primeiro — depois é uma equação normal de dois passos.",
          es: "Cuando x aparece en ambos lados, resta el término con x menor de ambos lados primero — después es una ecuación normal de dos pasos.",
        },
        example: { id: "ex-black-36", prompt: "5x + 2 = 2x + 11", answer: 3, operands: [5, 2, 2, 11], isEquation: true },
        steps: [
          {
            text: {
              en: "Subtract 2x from both sides: 5x - 2x = 3x, and 2x - 2x = 0.",
              pt: "Subtraia 2x dos dois lados: 5x - 2x = 3x, e 2x - 2x = 0.",
              es: "Resta 2x de ambos lados: 5x - 2x = 3x, y 2x - 2x = 0.",
            },
          },
          {
            text: {
              en: "Now it's 3x + 2 = 11. Undo the +2: 11 - 2 = {{9}}.",
              pt: "Agora é 3x + 2 = 11. Desfaça o +2: 11 - 2 = {{9}}.",
              es: "Ahora es 3x + 2 = 11. Deshaz el +2: 11 - 2 = {{9}}.",
            },
          },
          {
            text: {
              en: "Undo the ×3: 9 ÷ 3 = 3. x = 3.",
              pt: "Desfaça o ×3: 9 ÷ 3 = 3. x = 3.",
              es: "Deshaz el ×3: 9 ÷ 3 = 3. x = 3.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateVariableBothSides,
    },
    {
      id: "black-37",
      beltId: "black",
      index: 7,
      degree: equationsDegree,
      title: {
        en: "Equations with distribution",
        pt: "Equações com distributiva",
        es: "Ecuaciones con distributiva",
      },
      summary: {
        en: "Distribute first, then solve like normal.",
        pt: "Distribua primeiro, depois resolva normalmente.",
        es: "Distribuye primero, luego resuelve normalmente.",
      },
      lesson: {
        intro: {
          en: "Multiply through the parentheses first — same distributive property from Algebra — then it's a regular two-step equation.",
          pt: "Multiplique pelos parênteses primeiro — a mesma propriedade distributiva da Álgebra — depois é uma equação normal de dois passos.",
          es: "Multiplica por el paréntesis primero — la misma propiedad distributiva de Álgebra — luego es una ecuación normal de dos pasos.",
        },
        example: { id: "ex-black-37", prompt: "3(x + 2) = 21", answer: 5, operands: [3, 2, 21], isEquation: true },
        steps: [
          {
            text: {
              en: "Distribute the 3: 3x + 6 = 21.",
              pt: "Distribua o 3: 3x + 6 = 21.",
              es: "Distribuye el 3: 3x + 6 = 21.",
            },
          },
          {
            text: {
              en: "Undo the +6: 21 - 6 = {{15}}.",
              pt: "Desfaça o +6: 21 - 6 = {{15}}.",
              es: "Deshaz el +6: 21 - 6 = {{15}}.",
            },
          },
          {
            text: {
              en: "Undo the ×3: 15 ÷ 3 = 5. x = 5.",
              pt: "Desfaça o ×3: 15 ÷ 3 = 5. x = 5.",
              es: "Deshaz el ×3: 15 ÷ 3 = 5. x = 5.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateEquationWithDistribution,
    },
    {
      id: "black-38",
      beltId: "black",
      index: 8,
      degree: equationsDegree,
      title: {
        en: "Combining like terms first",
        pt: "Combinando termos semelhantes primeiro",
        es: "Combinando términos semejantes primero",
      },
      summary: {
        en: "Simplify each side before you start undoing operations.",
        pt: "Simplifique cada lado antes de começar a desfazer as operações.",
        es: "Simplifica cada lado antes de empezar a deshacer las operaciones.",
      },
      lesson: {
        intro: {
          en: "If a side has more than one x-term, combine them into a single term first — same trick as Algebra's combining like terms.",
          pt: "Se um lado tem mais de um termo com x, combine-os em um único termo primeiro — o mesmo truque de combinar termos semelhantes da Álgebra.",
          es: "Si un lado tiene más de un término con x, combínalos en un solo término primero — el mismo truco de combinar términos semejantes de Álgebra.",
        },
        example: { id: "ex-black-38", prompt: "4x + 2x - 3 = 15", answer: 3, operands: [4, 2, 3, 15], isEquation: true },
        steps: [
          {
            text: {
              en: "Combine the x-terms: 4x + 2x = {{6}}x.",
              pt: "Combine os termos com x: 4x + 2x = {{6}}x.",
              es: "Combina los términos con x: 4x + 2x = {{6}}x.",
            },
          },
          {
            text: {
              en: "Now it's 6x - 3 = 15. Undo the -3: 15 + 3 = 18.",
              pt: "Agora é 6x - 3 = 15. Desfaça o -3: 15 + 3 = 18.",
              es: "Ahora es 6x - 3 = 15. Deshaz el -3: 15 + 3 = 18.",
            },
          },
          {
            text: {
              en: "Undo the ×6: 18 ÷ 6 = 3. x = 3.",
              pt: "Desfaça o ×6: 18 ÷ 6 = 3. x = 3.",
              es: "Deshaz el ×6: 18 ÷ 6 = 3. x = 3.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateCombineLikeTermsFirst,
    },
    {
      id: "black-39",
      beltId: "black",
      index: 9,
      degree: equationsDegree,
      title: {
        en: "Distribution with variables on both sides",
        pt: "Distributiva com variável nos dois lados",
        es: "Distributiva con variable en ambos lados",
      },
      summary: {
        en: "Distribute first, then gather the x terms.",
        pt: "Distribua primeiro, depois reúna os termos com x.",
        es: "Distribuye primero, luego reúne los términos con x.",
      },
      lesson: {
        intro: {
          en: "Distribute the parentheses first, then treat it like a variables-on-both-sides equation.",
          pt: "Distribua os parênteses primeiro, depois trate como uma equação com variável nos dois lados.",
          es: "Distribuye el paréntesis primero, luego trátala como una ecuación con variable en ambos lados.",
        },
        example: { id: "ex-black-39", prompt: "3(x + 2) = 4x + 4", answer: 2, operands: [3, 2, 4, 4], isEquation: true },
        steps: [
          {
            text: {
              en: "Distribute the 3: 3x + 6 = 4x + 4.",
              pt: "Distribua o 3: 3x + 6 = 4x + 4.",
              es: "Distribuye el 3: 3x + 6 = 4x + 4.",
            },
          },
          {
            text: {
              en: "Subtract 3x from both sides: 6 = x + 4.",
              pt: "Subtraia 3x dos dois lados: 6 = x + 4.",
              es: "Resta 3x de ambos lados: 6 = x + 4.",
            },
          },
          {
            text: {
              en: "Undo the +4: 6 - 4 = {{2}}. x = 2.",
              pt: "Desfaça o +4: 6 - 4 = {{2}}. x = 2.",
              es: "Deshaz el +4: 6 - 4 = {{2}}. x = 2.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateDistributionBothSides,
    },
    {
      id: "black-40",
      beltId: "black",
      index: 10,
      degree: equationsDegree,
      title: {
        en: "Multi-step equations",
        pt: "Equações de múltiplas etapas",
        es: "Ecuaciones de varios pasos",
      },
      summary: {
        en: "Distribute, combine, then solve — every Equations skill in one problem.",
        pt: "Distribua, combine, depois resolva — todas as habilidades de Equações em um problema.",
        es: "Distribuye, combina, luego resuelve — todas las habilidades de Ecuaciones en un problema.",
      },
      lesson: {
        intro: {
          en: "This pulls together everything from this degree: distribute the parentheses, simplify each side, gather x terms on one side, then undo the remaining steps.",
          pt: "Isso reúne tudo desta faixa: distribua os parênteses, simplifique cada lado, reúna os termos com x em um lado, depois desfaça os passos restantes.",
          es: "Esto reúne todo de este cinturón: distribuye el paréntesis, simplifica cada lado, reúne los términos con x en un lado, luego deshaz los pasos restantes.",
        },
        example: { id: "ex-black-40", prompt: "2(x + 3) - 4 = 3x - 3", answer: 5, operands: [2, 3, 4, 3, 3], isEquation: true },
        steps: [
          {
            text: {
              en: "Distribute the 2: 2x + 6 - 4 = 3x - 3.",
              pt: "Distribua o 2: 2x + 6 - 4 = 3x - 3.",
              es: "Distribuye el 2: 2x + 6 - 4 = 3x - 3.",
            },
          },
          {
            text: {
              en: "Simplify the left side: 2x + 2 = 3x - 3.",
              pt: "Simplifique o lado esquerdo: 2x + 2 = 3x - 3.",
              es: "Simplifica el lado izquierdo: 2x + 2 = 3x - 3.",
            },
          },
          {
            text: {
              en: "Subtract 2x from both sides: 2 = x - 3. Undo the -3: 2 + 3 = {{5}}. x = 5.",
              pt: "Subtraia 2x dos dois lados: 2 = x - 3. Desfaça o -3: 2 + 3 = {{5}}. x = 5.",
              es: "Resta 2x de ambos lados: 2 = x - 3. Deshaz el -3: 2 + 3 = {{5}}. x = 5.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 24 },
      generate: generateMultiStepEquation,
    },
    {
      id: "black-41",
      beltId: "black",
      index: 1,
      degree: functionsDegree,
      title: {
        en: "What a function means",
        pt: "O que significa uma função",
        es: "Qué significa una función",
      },
      summary: {
        en: "A function is a machine — put a number in, a new number comes out.",
        pt: "Uma função é uma máquina — coloca um número, sai outro número.",
        es: "Una función es una máquina — metes un número, sale otro número.",
      },
      lesson: {
        intro: {
          en: "The machine always applies the same rule to whatever goes in. Read the rule, apply it to the input, and find the output.",
          pt: "A máquina sempre aplica a mesma regra ao que entra. Leia a regra, aplique ao valor de entrada e descubra a saída.",
          es: "La máquina siempre aplica la misma regla a lo que entra. Lee la regla, aplícala al valor de entrada y descubre la salida.",
        },
        example: { id: "ex-black-41", prompt: "", answer: 6, operands: [3, 6] },
        diagram: { kind: "functionMachine", input: 3, rule: "× 2", output: 6 },
        steps: [
          {
            text: {
              en: "The machine's rule is × 2 — it doubles whatever goes in.",
              pt: "A regra da máquina é × 2 — ela dobra o que entra.",
              es: "La regla de la máquina es × 2 — duplica lo que entra.",
            },
          },
          {
            text: {
              en: "Put in 3: 3 × 2 = {{6}}.",
              pt: "Coloque 3: 3 × 2 = {{6}}.",
              es: "Mete 3: 3 × 2 = {{6}}.",
            },
          },
          { text: { en: "The output is 6.", pt: "A saída é 6.", es: "La salida es 6." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateFunctionMachineReading,
    },
    {
      id: "black-42",
      beltId: "black",
      index: 2,
      degree: functionsDegree,
      title: {
        en: "Function notation: evaluating f(x)",
        pt: "Notação de função: avaliando f(x)",
        es: "Notación de función: evaluando f(x)",
      },
      summary: {
        en: "f(x) just means \"the output when you put x in.\"",
        pt: "f(x) só significa \"o resultado quando você coloca x.\"",
        es: "f(x) solo significa \"el resultado cuando pones x.\"",
      },
      lesson: {
        intro: {
          en: "f(x) is just a labeled version of the machine from before — replace every x with the given number, then solve like usual.",
          pt: "f(x) é só uma versão rotulada da máquina de antes — troque cada x pelo número dado e resolva normalmente.",
          es: "f(x) es solo una versión etiquetada de la máquina de antes — cambia cada x por el número dado y resuelve normalmente.",
        },
        example: { id: "ex-black-42", prompt: "f(x) = 3x + 2; f(4)", answer: 14, operands: [3, 2, 4] },
        steps: [
          {
            text: {
              en: "Replace x with 4: f(4) = 3 × {{4}} + 2.",
              pt: "Troque x por 4: f(4) = 3 × {{4}} + 2.",
              es: "Cambia x por 4: f(4) = 3 × {{4}} + 2.",
            },
          },
          {
            text: {
              en: "Multiply: 3 × 4 = {{12}}.",
              pt: "Multiplique: 3 × 4 = {{12}}.",
              es: "Multiplica: 3 × 4 = {{12}}.",
            },
          },
          {
            text: {
              en: "Add: 12 + 2 = 14. So f(4) = 14.",
              pt: "Some: 12 + 2 = 14. Então f(4) = 14.",
              es: "Suma: 12 + 2 = 14. Entonces f(4) = 14.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateEvaluateFunctionPositive,
    },
    {
      id: "black-43",
      beltId: "black",
      index: 3,
      degree: functionsDegree,
      title: {
        en: "Evaluating f(x) with negative inputs",
        pt: "Avaliando f(x) com entradas negativas",
        es: "Evaluando f(x) con entradas negativas",
      },
      summary: {
        en: "The same rule works no matter what sign x has.",
        pt: "A mesma regra funciona não importa o sinal de x.",
        es: "La misma regla funciona sin importar el signo de x.",
      },
      lesson: {
        intro: {
          en: "Substitute the negative value exactly the same way — just keep careful track of the signs while you multiply and add.",
          pt: "Substitua o valor negativo do mesmo jeito — só preste atenção nos sinais enquanto multiplica e soma.",
          es: "Sustituye el valor negativo de la misma manera — solo presta atención a los signos mientras multiplicas y sumas.",
        },
        example: { id: "ex-black-43", prompt: "f(x) = 2x + 5; f(-4)", answer: -3, operands: [2, 5, -4] },
        steps: [
          {
            text: {
              en: "Replace x with -4: f(-4) = 2 × ({{-4}}) + 5.",
              pt: "Troque x por -4: f(-4) = 2 × ({{-4}}) + 5.",
              es: "Cambia x por -4: f(-4) = 2 × ({{-4}}) + 5.",
            },
          },
          {
            text: {
              en: "Multiply: 2 × (-4) = -8.",
              pt: "Multiplique: 2 × (-4) = -8.",
              es: "Multiplica: 2 × (-4) = -8.",
            },
          },
          {
            text: {
              en: "Add: -8 + 5 = -3. So f(-4) = -3.",
              pt: "Some: -8 + 5 = -3. Então f(-4) = -3.",
              es: "Suma: -8 + 5 = -3. Entonces f(-4) = -3.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateEvaluateFunctionNegative,
    },
    {
      id: "black-44",
      beltId: "black",
      index: 4,
      degree: functionsDegree,
      title: {
        en: "What slope means",
        pt: "O que significa inclinação",
        es: "Qué significa la pendiente",
      },
      summary: {
        en: "Slope is how steep a line is — rise over run.",
        pt: "Inclinação é o quão íngreme uma reta é — subida sobre avanço.",
        es: "La pendiente es qué tan inclinada es una recta — subida sobre avance.",
      },
      lesson: {
        intro: {
          en: "Count how many steps up the staircase climbs (the rise), and how many steps across it goes (the run). Slope is rise over run.",
          pt: "Conte quantos degraus a escada sobe (a subida) e quantos ela avança (o avanço). Inclinação é subida sobre avanço.",
          es: "Cuenta cuántos escalones sube la escalera (la subida) y cuántos avanza (el avance). La pendiente es subida sobre avance.",
        },
        example: {
          id: "ex-black-44",
          prompt: "",
          answer: 3,
          secondaryAnswer: 4,
          secondaryFormat: "fraction",
          operands: [3, 4],
        },
        diagram: { kind: "slopeStaircase", rise: 3, run: 4 },
        steps: [
          {
            text: {
              en: "Count the rise (steps up): {{3}}.",
              pt: "Conte a subida (degraus para cima): {{3}}.",
              es: "Cuenta la subida (escalones hacia arriba): {{3}}.",
            },
          },
          {
            text: {
              en: "Count the run (steps across): 4.",
              pt: "Conte o avanço (degraus para o lado): 4.",
              es: "Cuenta el avance (escalones hacia el lado): 4.",
            },
          },
          {
            text: {
              en: "Slope = rise/run = 3/4.",
              pt: "Inclinação = subida/avanço = 3/4.",
              es: "Pendiente = subida/avance = 3/4.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateSlopeStaircaseReading,
    },
    {
      id: "black-45",
      beltId: "black",
      index: 5,
      degree: functionsDegree,
      title: {
        en: "Calculating slope from two points",
        pt: "Calculando a inclinação a partir de dois pontos",
        es: "Calculando la pendiente a partir de dos puntos",
      },
      summary: {
        en: "Two points are enough to find the slope between them.",
        pt: "Dois pontos são suficientes para achar a inclinação entre eles.",
        es: "Dos puntos son suficientes para hallar la pendiente entre ellos.",
      },
      lesson: {
        intro: {
          en: "The rise is how much y changes between the two points; the run is how much x changes. Slope is still rise over run.",
          pt: "A subida é quanto y muda entre os dois pontos; o avanço é quanto x muda. Inclinação continua sendo subida sobre avanço.",
          es: "La subida es cuánto cambia y entre los dos puntos; el avance es cuánto cambia x. La pendiente sigue siendo subida sobre avance.",
        },
        example: {
          id: "ex-black-45",
          prompt: "(1, 2), (3, 5)",
          answer: 3,
          secondaryAnswer: 2,
          secondaryFormat: "fraction",
          operands: [1, 2, 3, 5],
        },
        steps: [
          {
            text: {
              en: "Find the rise: change in y = 5 - 2 = {{3}}.",
              pt: "Ache a subida: mudança em y = 5 - 2 = {{3}}.",
              es: "Halla la subida: cambio en y = 5 - 2 = {{3}}.",
            },
          },
          {
            text: {
              en: "Find the run: change in x = 3 - 1 = 2.",
              pt: "Ache o avanço: mudança em x = 3 - 1 = 2.",
              es: "Halla el avance: cambio en x = 3 - 1 = 2.",
            },
          },
          {
            text: {
              en: "Slope = rise/run = 3/2.",
              pt: "Inclinação = subida/avanço = 3/2.",
              es: "Pendiente = subida/avance = 3/2.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateSlopeFromTwoPoints,
    },
    {
      id: "black-46",
      beltId: "black",
      index: 6,
      degree: functionsDegree,
      title: {
        en: "Finding the y-intercept",
        pt: "Achando o intercepto em y",
        es: "Hallando el intercepto en y",
      },
      summary: {
        en: "The y-intercept is just the constant term.",
        pt: "O intercepto em y é só o termo constante.",
        es: "El intercepto en y es solo el término constante.",
      },
      lesson: {
        intro: {
          en: "A line crosses the y-axis exactly where x = 0. For f(x) = ax + b, that's always just b — no calculation needed once you see the pattern.",
          pt: "Uma reta cruza o eixo y exatamente onde x = 0. Para f(x) = ax + b, isso é sempre só b — sem precisar calcular depois que você vê o padrão.",
          es: "Una recta cruza el eje y exactamente donde x = 0. Para f(x) = ax + b, eso siempre es solo b — sin necesidad de calcular una vez que ves el patrón.",
        },
        example: { id: "ex-black-46", prompt: "f(x) = 3x + 7; f(0)", answer: 7, operands: [3, 7] },
        steps: [
          {
            text: {
              en: "The y-intercept is where the line crosses the y-axis — that happens when x = 0.",
              pt: "O intercepto em y é onde a reta cruza o eixo y — isso acontece quando x = 0.",
              es: "El intercepto en y es donde la recta cruza el eje y — eso pasa cuando x = 0.",
            },
          },
          {
            text: {
              en: "f(0) = 3 × 0 + 7 = {{7}}.",
              pt: "f(0) = 3 × 0 + 7 = {{7}}.",
              es: "f(0) = 3 × 0 + 7 = {{7}}.",
            },
          },
          {
            text: {
              en: "The y-intercept is 7 — it's always just the constant term.",
              pt: "O intercepto em y é 7 — é sempre só o termo constante.",
              es: "El intercepto en y es 7 — siempre es solo el término constante.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 10 },
      generate: generateFindYIntercept,
    },
    {
      id: "black-47",
      beltId: "black",
      index: 7,
      degree: functionsDegree,
      title: {
        en: "Finding the x-intercept (the zero)",
        pt: "Achando o intercepto em x (o zero)",
        es: "Hallando el intercepto en x (el cero)",
      },
      summary: {
        en: "The zero is where the function crosses the x-axis — solve like any equation.",
        pt: "O zero é onde a função cruza o eixo x — resolva como qualquer equação.",
        es: "El cero es donde la función cruza el eje x — resuélvela como cualquier ecuación.",
      },
      lesson: {
        intro: {
          en: "The x-intercept (or \"zero\") of a function is the input that makes the output 0. That's exactly the same skill as solving an equation from the last belt — just set the function equal to 0 and solve for x.",
          pt: "O intercepto em x (ou \"zero\") de uma função é a entrada que faz a saída ser 0. É exatamente a mesma habilidade de resolver uma equação da faixa passada — só iguale a função a 0 e resolva para x.",
          es: "El intercepto en x (o \"cero\") de una función es la entrada que hace que la salida sea 0. Es exactamente la misma habilidad de resolver una ecuación del cinturón anterior — solo iguala la función a 0 y resuelve para x.",
        },
        example: { id: "ex-black-47", prompt: "2x - 8 = 0", answer: 4, operands: [2, -8], isEquation: true },
        steps: [
          {
            text: {
              en: "This is where f(x) = 2x - 8 crosses zero — solve it like any equation.",
              pt: "É onde f(x) = 2x - 8 cruza o zero — resolva como qualquer equação.",
              es: "Es donde f(x) = 2x - 8 cruza el cero — resuélvela como cualquier ecuación.",
            },
          },
          {
            text: {
              en: "Undo the -8: add 8 to both sides. 0 + 8 = {{8}}.",
              pt: "Desfaça o -8: some 8 nos dois lados. 0 + 8 = {{8}}.",
              es: "Deshaz el -8: suma 8 en ambos lados. 0 + 8 = {{8}}.",
            },
          },
          {
            text: {
              en: "Now it's 2x = 8. Undo the ×2: 8 ÷ 2 = 4. x = 4.",
              pt: "Agora é 2x = 8. Desfaça o ×2: 8 ÷ 2 = 4. x = 4.",
              es: "Ahora es 2x = 8. Deshaz el ×2: 8 ÷ 2 = 4. x = 4.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateFindXIntercept,
    },
    {
      id: "black-48",
      beltId: "black",
      index: 8,
      degree: functionsDegree,
      title: {
        en: "What a quadratic function means",
        pt: "O que significa uma função quadrática",
        es: "Qué significa una función cuadrática",
      },
      summary: {
        en: "Squaring makes negative inputs positive — that's what shapes the U.",
        pt: "Elevar ao quadrado deixa entradas negativas positivas — é isso que forma o U.",
        es: "Elevar al cuadrado hace que las entradas negativas sean positivas — eso forma la U.",
      },
      lesson: {
        intro: {
          en: "In f(x) = x², both a positive and its matching negative input give the same output, since squaring removes the sign. Plotting several inputs traces out a U-shaped curve called a parabola.",
          pt: "Em f(x) = x², tanto uma entrada positiva quanto a negativa correspondente dão a mesma saída, já que elevar ao quadrado remove o sinal. Marcando várias entradas, forma-se uma curva em U chamada parábola.",
          es: "En f(x) = x², tanto una entrada positiva como su negativa correspondiente dan la misma salida, ya que elevar al cuadrado quita el signo. Marcando varias entradas, se traza una curva en forma de U llamada parábola.",
        },
        example: { id: "ex-black-48", prompt: "f(x) = x²; f(3)", answer: 9, operands: [3] },
        diagram: {
          kind: "parabola",
          points: [
            { x: -2, y: 4 },
            { x: -1, y: 1 },
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 4 },
          ],
        },
        steps: [
          {
            text: {
              en: "Squaring a negative number gives a positive result: (-2)² = {{4}}, just like 2² = 4.",
              pt: "Elevar um número negativo ao quadrado dá um resultado positivo: (-2)² = {{4}}, igual a 2² = 4.",
              es: "Elevar un número negativo al cuadrado da un resultado positivo: (-2)² = {{4}}, igual que 2² = 4.",
            },
          },
          {
            text: {
              en: "That's why the graph curves back up on both sides — it's shaped like a U, called a parabola.",
              pt: "Por isso o gráfico curva para cima nos dois lados — tem formato de U, chamado de parábola.",
              es: "Por eso la gráfica se curva hacia arriba en ambos lados — tiene forma de U, llamada parábola.",
            },
          },
          {
            text: {
              en: "f(3) = 3² = 9.",
              pt: "f(3) = 3² = 9.",
              es: "f(3) = 3² = 9.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateEvaluateBasicQuadratic,
    },
    {
      id: "black-49",
      beltId: "black",
      index: 9,
      degree: functionsDegree,
      title: {
        en: "Evaluating quadratic functions",
        pt: "Avaliando funções quadráticas",
        es: "Evaluando funciones cuadráticas",
      },
      summary: {
        en: "Square first, then multiply, then add — order of operations still applies.",
        pt: "Eleve ao quadrado primeiro, depois multiplique, depois some — a ordem das operações continua valendo.",
        es: "Eleva al cuadrado primero, luego multiplica, luego suma — el orden de las operaciones sigue aplicando.",
      },
      lesson: {
        intro: {
          en: "A full quadratic has three parts — a squared term, an x term, and a constant. Substitute, then work through order of operations just like any other expression.",
          pt: "Uma quadrática completa tem três partes — um termo ao quadrado, um termo com x, e uma constante. Substitua e siga a ordem das operações como em qualquer expressão.",
          es: "Una cuadrática completa tiene tres partes — un término al cuadrado, un término con x, y una constante. Sustituye y sigue el orden de las operaciones como en cualquier expresión.",
        },
        example: { id: "ex-black-49", prompt: "f(x) = x² + 3x - 4; f(2)", answer: 6, operands: [3, -4, 2] },
        steps: [
          {
            text: {
              en: "Replace x with 2: f(2) = 2² + 3 × 2 - 4.",
              pt: "Troque x por 2: f(2) = 2² + 3 × 2 - 4.",
              es: "Cambia x por 2: f(2) = 2² + 3 × 2 - 4.",
            },
          },
          {
            text: {
              en: "Square first: 2² = {{4}}. Then multiply: 3 × 2 = 6.",
              pt: "Eleve ao quadrado primeiro: 2² = {{4}}. Depois multiplique: 3 × 2 = 6.",
              es: "Eleva al cuadrado primero: 2² = {{4}}. Luego multiplica: 3 × 2 = 6.",
            },
          },
          {
            text: {
              en: "Add it up: 4 + 6 - 4 = 6.",
              pt: "Some tudo: 4 + 6 - 4 = 6.",
              es: "Suma todo: 4 + 6 - 4 = 6.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateEvaluateFullQuadratic,
    },
    {
      id: "black-50",
      beltId: "black",
      index: 10,
      degree: functionsDegree,
      title: {
        en: "Combining two functions",
        pt: "Combinando duas funções",
        es: "Combinando dos funciones",
      },
      summary: {
        en: "Evaluate each function separately, then add the results — every Functions skill in one problem.",
        pt: "Avalie cada função separadamente, depois some os resultados — todas as habilidades de Funções em um problema.",
        es: "Evalúa cada función por separado, luego suma los resultados — todas las habilidades de Funciones en un problema.",
      },
      lesson: {
        intro: {
          en: "f and g are two different machines. Run the same input through each one separately, then combine the outputs — this pulls together linear and quadratic evaluation from this whole degree.",
          pt: "f e g são duas máquinas diferentes. Passe a mesma entrada por cada uma separadamente, depois combine as saídas — isso reúne avaliação linear e quadrática de toda essa faixa.",
          es: "f y g son dos máquinas diferentes. Pasa la misma entrada por cada una por separado, luego combina las salidas — esto reúne evaluación lineal y cuadrática de todo este cinturón.",
        },
        example: {
          id: "ex-black-50",
          prompt: "f(x) = 2x + 1, g(x) = x² - 3; f(3) + g(3)",
          answer: 13,
          operands: [2, 1, -3, 3],
        },
        steps: [
          {
            text: {
              en: "Evaluate f(3): f(3) = 2 × 3 + 1 = {{7}}.",
              pt: "Avalie f(3): f(3) = 2 × 3 + 1 = {{7}}.",
              es: "Evalúa f(3): f(3) = 2 × 3 + 1 = {{7}}.",
            },
          },
          {
            text: {
              en: "Evaluate g(3): g(3) = 3² - 3 = 9 - 3 = 6.",
              pt: "Avalie g(3): g(3) = 3² - 3 = 9 - 3 = 6.",
              es: "Evalúa g(3): g(3) = 3² - 3 = 9 - 3 = 6.",
            },
          },
          {
            text: {
              en: "Add the results: 7 + 6 = 13.",
              pt: "Some os resultados: 7 + 6 = 13.",
              es: "Suma los resultados: 7 + 6 = 13.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 24 },
      generate: generateCombineFunctions,
    },
    {
      id: "black-51",
      beltId: "black",
      index: 1,
      degree: preCalcDegree,
      title: {
        en: "What factoring means",
        pt: "O que significa fatorar",
        es: "Qué significa factorizar",
      },
      summary: {
        en: "Multiplying two binomials fills a rectangle with four pieces.",
        pt: "Multiplicar dois binômios preenche um retângulo com quatro partes.",
        es: "Multiplicar dos binomios llena un rectángulo con cuatro partes.",
      },
      lesson: {
        intro: {
          en: "The area of the whole rectangle is x² plus the two middle strips plus the small corner — add the middle strips together to get the combined x-term.",
          pt: "A área do retângulo inteiro é x² mais as duas faixas do meio mais o cantinho — some as faixas do meio para achar o termo x combinado.",
          es: "El área del rectángulo completo es x² más las dos franjas del medio más la esquina — suma las franjas del medio para hallar el término x combinado.",
        },
        example: { id: "ex-black-51", prompt: "", answer: 7, operands: [3, 4] },
        diagram: { kind: "factorArea", a: 3, b: 4 },
        steps: [
          {
            text: {
              en: "The two middle pieces are 3x and 4x — together they combine into one x-term.",
              pt: "As duas partes do meio são 3x e 4x — juntas elas se combinam em um único termo x.",
              es: "Las dos partes del medio son 3x y 4x — juntas se combinan en un solo término x.",
            },
          },
          {
            text: {
              en: "3x + 4x = {{7}}x.",
              pt: "3x + 4x = {{7}}x.",
              es: "3x + 4x = {{7}}x.",
            },
          },
          {
            text: {
              en: "(x + 3)(x + 4) = x² + 7x + 12.",
              pt: "(x + 3)(x + 4) = x² + 7x + 12.",
              es: "(x + 3)(x + 4) = x² + 7x + 12.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateFactorAreaReading,
    },
    {
      id: "black-52",
      beltId: "black",
      index: 2,
      degree: preCalcDegree,
      title: {
        en: "Factoring trinomials: finding the pair",
        pt: "Fatorando trinômios: achando o par",
        es: "Factorizando trinomios: hallando el par",
      },
      summary: {
        en: "Find two numbers that multiply to c and add to b.",
        pt: "Ache dois números que multiplicam para c e somam para b.",
        es: "Halla dos números que multiplican para c y suman para b.",
      },
      lesson: {
        intro: {
          en: "This is the reverse of the area model: given x² - bx + c, find the two numbers whose product is c and whose sum is b.",
          pt: "Isso é o inverso do modelo de área: dado x² - bx + c, ache os dois números cujo produto é c e cuja soma é b.",
          es: "Esto es lo inverso del modelo de área: dado x² - bx + c, halla los dos números cuyo producto es c y cuya suma es b.",
        },
        example: {
          id: "ex-black-52",
          prompt: "x² - 7x + 12",
          answer: 3,
          secondaryAnswer: 4,
          secondaryFormat: "pair",
          operands: [7, 12],
        },
        steps: [
          {
            text: {
              en: "Look for two numbers that multiply to 12: 3 × 4 = {{12}}.",
              pt: "Procure dois números que multiplicam para 12: 3 × 4 = {{12}}.",
              es: "Busca dos números que multiplican para 12: 3 × 4 = {{12}}.",
            },
          },
          {
            text: {
              en: "Check that they also add to 7: 3 + 4 = 7.",
              pt: "Confira que eles também somam 7: 3 + 4 = 7.",
              es: "Comprueba que también suman 7: 3 + 4 = 7.",
            },
          },
          {
            text: {
              en: "x² - 7x + 12 = (x - 3)(x - 4).",
              pt: "x² - 7x + 12 = (x - 3)(x - 4).",
              es: "x² - 7x + 12 = (x - 3)(x - 4).",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateFactorTrinomialPair,
    },
    {
      id: "black-53",
      beltId: "black",
      index: 3,
      degree: preCalcDegree,
      title: {
        en: "Solving quadratic equations by factoring",
        pt: "Resolvendo equações quadráticas por fatoração",
        es: "Resolviendo ecuaciones cuadráticas por factorización",
      },
      summary: {
        en: "Factor first, then each piece separately equals zero.",
        pt: "Fatore primeiro, depois cada parte separadamente é igual a zero.",
        es: "Factoriza primero, luego cada parte por separado es igual a cero.",
      },
      lesson: {
        intro: {
          en: "If two things multiply to zero, at least one of them must be zero. Factor the equation, then set each factor equal to zero on its own.",
          pt: "Se duas coisas se multiplicam para dar zero, pelo menos uma delas precisa ser zero. Fatore a equação, depois iguale cada fator a zero separadamente.",
          es: "Si dos cosas se multiplican y dan cero, al menos una de ellas debe ser cero. Factoriza la ecuación, luego iguala cada factor a cero por separado.",
        },
        example: {
          id: "ex-black-53",
          prompt: "x² - 7x + 12 = 0",
          answer: 3,
          secondaryAnswer: 4,
          secondaryFormat: "pair",
          isEquation: true,
          operands: [7, 12],
        },
        steps: [
          {
            text: {
              en: "Factor: x² - 7x + 12 = (x - 3)(x - 4).",
              pt: "Fatore: x² - 7x + 12 = (x - 3)(x - 4).",
              es: "Factoriza: x² - 7x + 12 = (x - 3)(x - 4).",
            },
          },
          {
            text: {
              en: "For the product to be zero, one factor must be zero: x - 3 = 0 or x - 4 = 0.",
              pt: "Para o produto ser zero, um fator precisa ser zero: x - 3 = 0 ou x - 4 = 0.",
              es: "Para que el producto sea cero, un factor debe ser cero: x - 3 = 0 o x - 4 = 0.",
            },
          },
          {
            text: {
              en: "x = 3 or x = {{4}}.",
              pt: "x = 3 ou x = {{4}}.",
              es: "x = 3 o x = {{4}}.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateSolveQuadraticByFactoring,
    },
    {
      id: "black-54",
      beltId: "black",
      index: 4,
      degree: preCalcDegree,
      title: {
        en: "The quadratic formula",
        pt: "A fórmula de Bhaskara",
        es: "La fórmula cuadrática",
      },
      summary: {
        en: "x = (b ± √(b² - 4c)) / 2 — a formula that always works.",
        pt: "x = (b ± √(b² - 4c)) / 2 — uma fórmula que sempre funciona.",
        es: "x = (b ± √(b² - 4c)) / 2 — una fórmula que siempre funciona.",
      },
      lesson: {
        intro: {
          en: "Factoring doesn't always come easily, but this formula always solves x² - bx + c = 0, no guessing required.",
          pt: "Fatorar nem sempre é fácil, mas essa fórmula sempre resolve x² - bx + c = 0, sem precisar adivinhar.",
          es: "Factorizar no siempre es fácil, pero esta fórmula siempre resuelve x² - bx + c = 0, sin necesidad de adivinar.",
        },
        example: {
          id: "ex-black-54",
          prompt: "x² - 7x + 12 = 0",
          answer: 3,
          secondaryAnswer: 4,
          secondaryFormat: "pair",
          isEquation: true,
          operands: [7, 12],
        },
        steps: [
          {
            text: {
              en: "Here b = 7 and c = 12. Compute the discriminant: b² - 4c = 49 - 48 = {{1}}.",
              pt: "Aqui b = 7 e c = 12. Calcule o discriminante: b² - 4c = 49 - 48 = {{1}}.",
              es: "Aquí b = 7 y c = 12. Calcula el discriminante: b² - 4c = 49 - 48 = {{1}}.",
            },
          },
          {
            text: {
              en: "√1 = 1, so x = (7 ± 1) / 2.",
              pt: "√1 = 1, então x = (7 ± 1) / 2.",
              es: "√1 = 1, entonces x = (7 ± 1) / 2.",
            },
          },
          {
            text: {
              en: "x = 8/2 = 4, or x = 6/2 = 3.",
              pt: "x = 8/2 = 4, ou x = 6/2 = 3.",
              es: "x = 8/2 = 4, o x = 6/2 = 3.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateQuadraticFormula,
    },
    {
      id: "black-55",
      beltId: "black",
      index: 5,
      degree: preCalcDegree,
      title: {
        en: "Completing the square",
        pt: "Completando o quadrado",
        es: "Completando el cuadrado",
      },
      summary: {
        en: "Add (b/2)² to turn x² + bx into a perfect square.",
        pt: "Some (b/2)² para transformar x² + bx em um quadrado perfeito.",
        es: "Suma (b/2)² para convertir x² + bx en un cuadrado perfecto.",
      },
      lesson: {
        intro: {
          en: "Take half of the x-coefficient and square it — that's always the constant that turns x² + bx into a perfect-square trinomial.",
          pt: "Pegue metade do coeficiente de x e eleve ao quadrado — essa é sempre a constante que transforma x² + bx em um trinômio quadrado perfeito.",
          es: "Toma la mitad del coeficiente de x y elévala al cuadrado — esa siempre es la constante que convierte x² + bx en un trinomio cuadrado perfecto.",
        },
        example: { id: "ex-black-55", prompt: "x² + 6x + ___", answer: 9, operands: [6] },
        steps: [
          {
            text: {
              en: "Take half of the x-coefficient: 6 ÷ 2 = {{3}}.",
              pt: "Pegue metade do coeficiente de x: 6 ÷ 2 = {{3}}.",
              es: "Toma la mitad del coeficiente de x: 6 ÷ 2 = {{3}}.",
            },
          },
          {
            text: {
              en: "Square it: 3² = 9.",
              pt: "Eleve ao quadrado: 3² = 9.",
              es: "Elévala al cuadrado: 3² = 9.",
            },
          },
          {
            text: {
              en: "x² + 6x + 9 = (x + 3)², a perfect square.",
              pt: "x² + 6x + 9 = (x + 3)², um quadrado perfeito.",
              es: "x² + 6x + 9 = (x + 3)², un cuadrado perfecto.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateCompleteTheSquare,
    },
    {
      id: "black-56",
      beltId: "black",
      index: 6,
      degree: preCalcDegree,
      title: {
        en: "The discriminant",
        pt: "O discriminante",
        es: "El discriminante",
      },
      summary: {
        en: "b² - 4c tells you how many real roots there are.",
        pt: "b² - 4c diz quantas raízes reais existem.",
        es: "b² - 4c dice cuántas raíces reales hay.",
      },
      lesson: {
        intro: {
          en: "The discriminant is the part under the square root in the quadratic formula. Positive means two real roots, zero means one repeated root, negative means no real roots at all.",
          pt: "O discriminante é a parte dentro da raiz quadrada na fórmula de Bhaskara. Positivo significa duas raízes reais, zero significa uma raiz repetida, negativo significa nenhuma raiz real.",
          es: "El discriminante es la parte dentro de la raíz cuadrada en la fórmula cuadrática. Positivo significa dos raíces reales, cero significa una raíz repetida, negativo significa ninguna raíz real.",
        },
        example: { id: "ex-black-56", prompt: "x² - 5x + 3", answer: 13, operands: [5, 3] },
        steps: [
          {
            text: {
              en: "b = 5, c = 3. Square b: 5² = {{25}}.",
              pt: "b = 5, c = 3. Eleve b ao quadrado: 5² = {{25}}.",
              es: "b = 5, c = 3. Eleva b al cuadrado: 5² = {{25}}.",
            },
          },
          {
            text: {
              en: "Multiply: 4 × 3 = 12.",
              pt: "Multiplique: 4 × 3 = 12.",
              es: "Multiplica: 4 × 3 = 12.",
            },
          },
          {
            text: {
              en: "Discriminant = 25 - 12 = 13 — positive, so there are two real roots.",
              pt: "Discriminante = 25 - 12 = 13 — positivo, então existem duas raízes reais.",
              es: "Discriminante = 25 - 12 = 13 — positivo, así que hay dos raíces reales.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateDiscriminant,
    },
    {
      id: "black-57",
      beltId: "black",
      index: 7,
      degree: preCalcDegree,
      title: {
        en: "Simplifying square roots",
        pt: "Simplificando raízes quadradas",
        es: "Simplificando raíces cuadradas",
      },
      summary: {
        en: "Pull the largest perfect square factor out from under the root.",
        pt: "Tire o maior fator quadrado perfeito de dentro da raiz.",
        es: "Saca el mayor factor cuadrado perfecto de debajo de la raíz.",
      },
      lesson: {
        intro: {
          en: "Split the number under the root into a perfect square times whatever's left, then pull the perfect square's root outside.",
          pt: "Divida o número dentro da raiz em um quadrado perfeito vezes o que sobra, depois tire a raiz do quadrado perfeito para fora.",
          es: "Divide el número bajo la raíz en un cuadrado perfecto por lo que queda, luego saca la raíz del cuadrado perfecto hacia afuera.",
        },
        example: {
          id: "ex-black-57",
          prompt: "√50",
          answer: 5,
          secondaryAnswer: 2,
          secondaryFormat: "radical",
          operands: [50],
        },
        steps: [
          {
            text: {
              en: "50 = 25 × 2, and 25 is a perfect square: 5² = {{25}}.",
              pt: "50 = 25 × 2, e 25 é um quadrado perfeito: 5² = {{25}}.",
              es: "50 = 25 × 2, y 25 es un cuadrado perfecto: 5² = {{25}}.",
            },
          },
          {
            text: {
              en: "Pull the 5 out from under the root: √50 = 5√2.",
              pt: "Tire o 5 de dentro da raiz: √50 = 5√2.",
              es: "Saca el 5 de debajo de la raíz: √50 = 5√2.",
            },
          },
          {
            text: {
              en: "5√2 is already simplified — 2 has no more square factors.",
              pt: "5√2 já está simplificado — 2 não tem mais fatores quadrados.",
              es: "5√2 ya está simplificado — 2 no tiene más factores cuadrados.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 16 },
      generate: generateSimplifyRadical,
    },
    {
      id: "black-58",
      beltId: "black",
      index: 8,
      degree: preCalcDegree,
      title: {
        en: "Laws of exponents",
        pt: "Propriedades das potências",
        es: "Leyes de los exponentes",
      },
      summary: {
        en: "Multiplying same-base powers adds the exponents; dividing subtracts them.",
        pt: "Multiplicar potências de mesma base soma os expoentes; dividir subtrai.",
        es: "Multiplicar potencias de la misma base suma los exponentes; dividir los resta.",
      },
      lesson: {
        intro: {
          en: "When the base is the same, multiplying means adding the exponents, and dividing means subtracting them — no need to expand anything.",
          pt: "Quando a base é a mesma, multiplicar significa somar os expoentes, e dividir significa subtraí-los — sem precisar expandir nada.",
          es: "Cuando la base es la misma, multiplicar significa sumar los exponentes, y dividir significa restarlos — sin necesidad de expandir nada.",
        },
        example: { id: "ex-black-58", prompt: "x⁵ × x³ = xⁿ", answer: 8, operands: [5, 3] },
        steps: [
          {
            text: {
              en: "Same base (x), so add the exponents: 5 + 3 = {{8}}.",
              pt: "Mesma base (x), então some os expoentes: 5 + 3 = {{8}}.",
              es: "Misma base (x), así que suma los exponentes: 5 + 3 = {{8}}.",
            },
          },
          {
            text: {
              en: "x⁵ × x³ = x⁸.",
              pt: "x⁵ × x³ = x⁸.",
              es: "x⁵ × x³ = x⁸.",
            },
          },
          { text: { en: "n = 8.", pt: "n = 8.", es: "n = 8." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateExponentRules,
    },
    {
      id: "black-59",
      beltId: "black",
      index: 9,
      degree: preCalcDegree,
      title: {
        en: "Systems of linear equations",
        pt: "Sistemas de equações lineares",
        es: "Sistemas de ecuaciones lineales",
      },
      summary: {
        en: "Add the equations together to cancel one variable.",
        pt: "Some as equações para cancelar uma variável.",
        es: "Suma las ecuaciones para cancelar una variable.",
      },
      lesson: {
        intro: {
          en: "When one equation has +y and the other has -y, adding them straight down cancels y completely, leaving a one-step equation for x.",
          pt: "Quando uma equação tem +y e a outra tem -y, somá-las direto cancela o y completamente, deixando uma equação de um passo só para x.",
          es: "Cuando una ecuación tiene +y y la otra tiene -y, sumarlas directamente cancela la y por completo, dejando una ecuación de un solo paso para x.",
        },
        example: {
          id: "ex-black-59",
          prompt: "x + y = 10, x - y = 4",
          answer: 7,
          secondaryAnswer: 3,
          secondaryFormat: "pair",
          isEquation: true,
          equationLabel: "x, y =",
          operands: [10, 4],
        },
        steps: [
          {
            text: {
              en: "Add the two equations: (x + y) + (x - y) = 10 + 4, so 2x = {{14}}.",
              pt: "Some as duas equações: (x + y) + (x - y) = 10 + 4, então 2x = {{14}}.",
              es: "Suma las dos ecuaciones: (x + y) + (x - y) = 10 + 4, entonces 2x = {{14}}.",
            },
          },
          {
            text: {
              en: "x = 14 ÷ 2 = 7.",
              pt: "x = 14 ÷ 2 = 7.",
              es: "x = 14 ÷ 2 = 7.",
            },
          },
          {
            text: {
              en: "Substitute back: 7 + y = 10, so y = 3.",
              pt: "Substitua de volta: 7 + y = 10, então y = 3.",
              es: "Sustituye de vuelta: 7 + y = 10, entonces y = 3.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 9, passAccuracy: 0.8, targetTimeSec: 20 },
      generate: generateLinearSystem,
    },
    {
      id: "black-60",
      beltId: "black",
      index: 10,
      degree: preCalcDegree,
      title: {
        en: "Rearranging, factoring, and solving",
        pt: "Reorganizando, fatorando e resolvendo",
        es: "Reorganizando, factorizando y resolviendo",
      },
      summary: {
        en: "Get everything on one side first, then factor and solve — every Pre-Calculus skill in one problem.",
        pt: "Coloque tudo de um lado primeiro, depois fatore e resolva — todas as habilidades de Pré-Cálculo em um problema.",
        es: "Pon todo de un lado primero, luego factoriza y resuelve — todas las habilidades de Precálculo en un problema.",
      },
      lesson: {
        intro: {
          en: "This pulls together everything from this degree: rearrange into standard form, factor the trinomial, then apply the zero-product property.",
          pt: "Isso reúne tudo desta faixa: reorganize na forma padrão, fatore o trinômio, depois aplique a propriedade do produto zero.",
          es: "Esto reúne todo de este cinturón: reorganiza en la forma estándar, factoriza el trinomio, luego aplica la propiedad del producto cero.",
        },
        example: {
          id: "ex-black-60",
          prompt: "x² - 7x = -12",
          answer: 3,
          secondaryAnswer: 4,
          secondaryFormat: "pair",
          isEquation: true,
          operands: [7, -12],
        },
        steps: [
          {
            text: {
              en: "Add 12 to both sides: x² - 7x + 12 = 0.",
              pt: "Some 12 dos dois lados: x² - 7x + 12 = 0.",
              es: "Suma 12 en ambos lados: x² - 7x + 12 = 0.",
            },
          },
          {
            text: {
              en: "Factor: (x - 3)(x - 4) = 0.",
              pt: "Fatore: (x - 3)(x - 4) = 0.",
              es: "Factoriza: (x - 3)(x - 4) = 0.",
            },
          },
          {
            text: {
              en: "x = 3 or x = {{4}}.",
              pt: "x = 3 ou x = {{4}}.",
              es: "x = 3 o x = {{4}}.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 24 },
      generate: generateRearrangeFactorSolve,
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
  stripes: [
    {
      id: "coral-1",
      beltId: "coral",
      index: 1,
      title: {
        en: "What a limit means",
        pt: "O que significa um limite",
        es: "Qué significa un límite",
      },
      summary: {
        en: "A limit is what f(x) approaches as x gets closer and closer to a point.",
        pt: "Um limite é o que f(x) se aproxima conforme x chega mais perto de um ponto.",
        es: "Un límite es lo que f(x) se acerca conforme x se acerca a un punto.",
      },
      lesson: {
        intro: {
          en: "As x hops closer and closer to a target value, watch what happens to f(x) — that's the limit. For a smooth function like this one, you can just substitute the target value directly.",
          pt: "Conforme x salta cada vez mais perto de um valor alvo, observe o que acontece com f(x) — isso é o limite. Para uma função suave como essa, você pode simplesmente substituir o valor alvo direto.",
          es: "Conforme x salta cada vez más cerca de un valor objetivo, observa qué le pasa a f(x) — eso es el límite. Para una función suave como esta, puedes simplemente sustituir el valor objetivo directamente.",
        },
        example: { id: "ex-coral-1", prompt: "lim(x→2) 3x + 2", answer: 8, operands: [3, 2, 2] },
        diagram: { kind: "numberLine", start: 5, end: 2 },
        steps: [
          {
            text: {
              en: "x is getting closer and closer to {{2}}.",
              pt: "x está chegando cada vez mais perto de {{2}}.",
              es: "x se está acercando cada vez más a {{2}}.",
            },
          },
          {
            text: {
              en: "Since this line has no breaks or holes, just substitute: 3 × 2 + 2.",
              pt: "Como essa reta não tem quebras ou buracos, é só substituir: 3 × 2 + 2.",
              es: "Como esta recta no tiene cortes ni huecos, solo sustituye: 3 × 2 + 2.",
            },
          },
          { text: { en: "3 × 2 + 2 = 8.", pt: "3 × 2 + 2 = 8.", es: "3 × 2 + 2 = 8." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateLimitLinearConcept,
    },
    {
      id: "coral-2",
      beltId: "coral",
      index: 2,
      title: {
        en: "Evaluating limits by direct substitution",
        pt: "Avaliando limites por substituição direta",
        es: "Evaluando límites por sustitución directa",
      },
      summary: {
        en: "Smooth functions let you just plug in the target value.",
        pt: "Funções suaves deixam você simplesmente substituir o valor alvo.",
        es: "Las funciones suaves te dejan simplemente sustituir el valor objetivo.",
      },
      lesson: {
        intro: {
          en: "The same substitution trick works for any polynomial, not just lines — plug the target value in for x and simplify.",
          pt: "O mesmo truque de substituição funciona para qualquer polinômio, não só retas — substitua o valor alvo no lugar de x e simplifique.",
          es: "El mismo truco de sustitución funciona para cualquier polinomio, no solo rectas — sustituye el valor objetivo por x y simplifica.",
        },
        example: { id: "ex-coral-2", prompt: "lim(x→2) x² - 3x + 1", answer: -1, operands: [2, -3, 1] },
        steps: [
          {
            text: {
              en: "Substitute x = 2 directly: 2² - 3 × 2 + 1.",
              pt: "Substitua x = 2 direto: 2² - 3 × 2 + 1.",
              es: "Sustituye x = 2 directamente: 2² - 3 × 2 + 1.",
            },
          },
          {
            text: {
              en: "Square first: 2² = {{4}}.",
              pt: "Eleve ao quadrado primeiro: 2² = {{4}}.",
              es: "Eleva al cuadrado primero: 2² = {{4}}.",
            },
          },
          { text: { en: "4 - 6 + 1 = -1.", pt: "4 - 6 + 1 = -1.", es: "4 - 6 + 1 = -1." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 14 },
      generate: generateLimitQuadratic,
    },
    {
      id: "coral-3",
      beltId: "coral",
      index: 3,
      title: {
        en: "Evaluating limits algebraically",
        pt: "Avaliando limites algebricamente",
        es: "Evaluando límites algebraicamente",
      },
      summary: {
        en: "Factor first to cancel the part that's causing 0/0.",
        pt: "Fatore primeiro para cancelar a parte que está causando 0/0.",
        es: "Factoriza primero para cancelar la parte que causa 0/0.",
      },
      lesson: {
        intro: {
          en: "Plugging in directly gives 0/0 here — that's a sign to factor the top first. The matching factor cancels, leaving something you CAN substitute into.",
          pt: "Substituir direto dá 0/0 aqui — isso é um sinal para fatorar o de cima primeiro. O fator que combina cancela, deixando algo em que você PODE substituir.",
          es: "Sustituir directamente da 0/0 aquí — esa es la señal para factorizar arriba primero. El factor que coincide se cancela, dejando algo en lo que SÍ puedes sustituir.",
        },
        example: {
          id: "ex-coral-3",
          prompt: "lim(x→3) (x² + 4x - 21) / (x - 3)",
          answer: 10,
          operands: [3, 7],
        },
        steps: [
          {
            text: {
              en: "Direct substitution gives 0/0 — factor the numerator instead: x² + 4x - 21 = (x - 3)(x + 7).",
              pt: "Substituição direta dá 0/0 — fatore o numerador: x² + 4x - 21 = (x - 3)(x + 7).",
              es: "La sustitución directa da 0/0 — factoriza el numerador: x² + 4x - 21 = (x - 3)(x + 7).",
            },
          },
          {
            text: {
              en: "Cancel the (x - 3) from top and bottom, leaving just (x + 7).",
              pt: "Cancele o (x - 3) de cima e de baixo, deixando só (x + 7).",
              es: "Cancela el (x - 3) de arriba y de abajo, dejando solo (x + 7).",
            },
          },
          {
            text: {
              en: "Now substitute: 3 + 7 = {{10}}.",
              pt: "Agora substitua: 3 + 7 = {{10}}.",
              es: "Ahora sustituye: 3 + 7 = {{10}}.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateLimitFactoring,
    },
    {
      id: "coral-4",
      beltId: "coral",
      index: 4,
      title: {
        en: "What a derivative means",
        pt: "O que significa uma derivada",
        es: "Qué significa una derivada",
      },
      summary: {
        en: "A derivative is the slope of the tangent line.",
        pt: "Uma derivada é a inclinação da reta tangente.",
        es: "Una derivada es la pendiente de la recta tangente.",
      },
      lesson: {
        intro: {
          en: "A derivative measures how steeply a function is climbing at each point. For a straight line, the steepness never changes — it's just the slope, same as you found back in Functions.",
          pt: "Uma derivada mede o quão íngreme uma função está subindo em cada ponto. Para uma reta, a inclinação nunca muda — é só a inclinação, igual você achou lá em Funções.",
          es: "Una derivada mide qué tan empinada está subiendo una función en cada punto. Para una recta, la inclinación nunca cambia — es solo la pendiente, igual que hallaste en Funciones.",
        },
        example: { id: "ex-coral-4", prompt: "f(x) = 4x + 3, f'(x) = n", answer: 4, operands: [4, 3] },
        diagram: { kind: "slopeStaircase", rise: 4, run: 1 },
        steps: [
          {
            text: {
              en: "This line's slope is rise/run = 4/1 = {{4}}.",
              pt: "A inclinação dessa reta é subida/avanço = 4/1 = {{4}}.",
              es: "La pendiente de esta recta es subida/avance = 4/1 = {{4}}.",
            },
          },
          {
            text: {
              en: "A straight line's steepness never changes.",
              pt: "A inclinação de uma reta nunca muda.",
              es: "La inclinación de una recta nunca cambia.",
            },
          },
          {
            text: {
              en: "f'(x) = 4, for every x.",
              pt: "f'(x) = 4, para todo x.",
              es: "f'(x) = 4, para todo x.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateDerivativeLinearConcept,
    },
    {
      id: "coral-5",
      beltId: "coral",
      index: 5,
      title: {
        en: "The power rule for derivatives",
        pt: "A regra do poder para derivadas",
        es: "La regla de la potencia para derivadas",
      },
      summary: {
        en: "Bring the exponent down as a multiplier, then subtract one from it.",
        pt: "Traga o expoente para baixo como multiplicador, depois subtraia um dele.",
        es: "Baja el exponente como multiplicador, luego réstale uno.",
      },
      lesson: {
        intro: {
          en: "For any power of x, the derivative follows the same pattern every time: the exponent becomes the new coefficient, and the exponent itself drops by one.",
          pt: "Para qualquer potência de x, a derivada segue o mesmo padrão sempre: o expoente vira o novo coeficiente, e o expoente em si diminui em um.",
          es: "Para cualquier potencia de x, la derivada sigue el mismo patrón siempre: el exponente se convierte en el nuevo coeficiente, y el exponente mismo baja en uno.",
        },
        example: { id: "ex-coral-5", prompt: "f(x) = x⁵, f'(x) = n·x⁴", answer: 5, operands: [5] },
        steps: [
          {
            text: {
              en: "The exponent is {{5}} — bring it down in front as a multiplier.",
              pt: "O expoente é {{5}} — traga-o para frente como multiplicador.",
              es: "El exponente es {{5}} — bájalo al frente como multiplicador.",
            },
          },
          {
            text: {
              en: "Subtract one from the exponent: 5 - 1 = 4.",
              pt: "Subtraia um do expoente: 5 - 1 = 4.",
              es: "Resta uno al exponente: 5 - 1 = 4.",
            },
          },
          {
            text: {
              en: "f'(x) = 5x⁴, so n = 5.",
              pt: "f'(x) = 5x⁴, então n = 5.",
              es: "f'(x) = 5x⁴, entonces n = 5.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateDerivativePowerRule,
    },
    {
      id: "coral-6",
      beltId: "coral",
      index: 6,
      title: {
        en: "Differentiating polynomials",
        pt: "Derivando polinômios",
        es: "Derivando polinomios",
      },
      summary: {
        en: "Apply the power rule to each term, then substitute.",
        pt: "Aplique a regra do poder em cada termo, depois substitua.",
        es: "Aplica la regla de la potencia a cada término, luego sustituye.",
      },
      lesson: {
        intro: {
          en: "Differentiate each term on its own using the power rule, combine them, then evaluate the result at the given point — same layered approach as evaluating any other expression.",
          pt: "Derive cada termo separadamente usando a regra do poder, combine-os, depois avalie o resultado no ponto dado — a mesma abordagem em camadas de avaliar qualquer outra expressão.",
          es: "Deriva cada término por separado usando la regla de la potencia, combínalos, luego evalúa el resultado en el punto dado — el mismo enfoque en capas de evaluar cualquier otra expresión.",
        },
        example: { id: "ex-coral-6", prompt: "f(x) = 3x² + 4x; f'(2)", answer: 16, operands: [3, 4, 2] },
        steps: [
          {
            text: {
              en: "Differentiate each term: the derivative of 3x² is 6x, and the derivative of 4x is 4.",
              pt: "Derive cada termo: a derivada de 3x² é 6x, e a derivada de 4x é 4.",
              es: "Deriva cada término: la derivada de 3x² es 6x, y la derivada de 4x es 4.",
            },
          },
          {
            text: {
              en: "f'(x) = 6x + 4.",
              pt: "f'(x) = 6x + 4.",
              es: "f'(x) = 6x + 4.",
            },
          },
          {
            text: {
              en: "f'(2) = 6 × 2 + 4 = {{16}}.",
              pt: "f'(2) = 6 × 2 + 4 = {{16}}.",
              es: "f'(2) = 6 × 2 + 4 = {{16}}.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateDerivativeAtPoint,
    },
    {
      id: "coral-7",
      beltId: "coral",
      index: 7,
      title: {
        en: "What an integral means",
        pt: "O que significa uma integral",
        es: "Qué significa una integral",
      },
      summary: {
        en: "Add up thin rectangles to approximate the area under a curve.",
        pt: "Some retângulos finos para aproximar a área sob uma curva.",
        es: "Suma rectángulos delgados para aproximar el área bajo una curva.",
      },
      lesson: {
        intro: {
          en: "Each bar's area is just its height times a width of 1. Add all the bars together and you get an approximation of the total area under the curve — that's the core idea behind an integral.",
          pt: "A área de cada barra é só a altura dela vezes uma largura de 1. Some todas as barras e você tem uma aproximação da área total sob a curva — essa é a ideia central de uma integral.",
          es: "El área de cada barra es solo su altura por un ancho de 1. Suma todas las barras y obtienes una aproximación del área total bajo la curva — esa es la idea central de una integral.",
        },
        example: { id: "ex-coral-7", prompt: "", answer: 20, operands: [3, 5, 4, 6, 2] },
        diagram: { kind: "areaBars", heights: [3, 5, 4, 6, 2] },
        steps: [
          {
            text: {
              en: "Each bar has width 1, so its area is just its height.",
              pt: "Cada barra tem largura 1, então a área dela é só a altura.",
              es: "Cada barra tiene ancho 1, así que su área es solo la altura.",
            },
          },
          {
            text: {
              en: "Add up all five heights: 3 + 5 + 4 + 6 + 2.",
              pt: "Some as cinco alturas: 3 + 5 + 4 + 6 + 2.",
              es: "Suma las cinco alturas: 3 + 5 + 4 + 6 + 2.",
            },
          },
          {
            text: {
              en: "3 + 5 + 4 + 6 + 2 = {{20}}.",
              pt: "3 + 5 + 4 + 6 + 2 = {{20}}.",
              es: "3 + 5 + 4 + 6 + 2 = {{20}}.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 6, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateAreaBarsReading,
    },
    {
      id: "coral-8",
      beltId: "coral",
      index: 8,
      title: {
        en: "Basic integration",
        pt: "Integração básica",
        es: "Integración básica",
      },
      summary: {
        en: "Integration reverses the power rule — add one to the exponent, then divide by it.",
        pt: "Integração inverte a regra do poder — some um ao expoente, depois divida por ele.",
        es: "La integración invierte la regla de la potencia — suma uno al exponente, luego divide entre él.",
      },
      lesson: {
        intro: {
          en: "Integration undoes differentiation: instead of bringing the exponent down, you raise it by one, then divide by that same new number.",
          pt: "A integração desfaz a derivação: em vez de trazer o expoente para baixo, você aumenta ele em um, depois divide por esse mesmo número novo.",
          es: "La integración deshace la derivación: en lugar de bajar el exponente, lo subes en uno, luego divides entre ese mismo número nuevo.",
        },
        example: { id: "ex-coral-8", prompt: "∫x² dx = xⁿ/n", answer: 3, operands: [2] },
        steps: [
          {
            text: {
              en: "Add one to the exponent: 2 + 1 = {{3}}.",
              pt: "Some um ao expoente: 2 + 1 = {{3}}.",
              es: "Suma uno al exponente: 2 + 1 = {{3}}.",
            },
          },
          {
            text: {
              en: "Divide by that same new exponent.",
              pt: "Divida por esse mesmo expoente novo.",
              es: "Divide entre ese mismo exponente nuevo.",
            },
          },
          {
            text: {
              en: "∫x² dx = x³/3, so n = 3.",
              pt: "∫x² dx = x³/3, então n = 3.",
              es: "∫x² dx = x³/3, entonces n = 3.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 12 },
      generate: generateAntiderivativePowerRule,
    },
    {
      id: "coral-9",
      beltId: "coral",
      index: 9,
      title: {
        en: "Definite integrals",
        pt: "Integrais definidas",
        es: "Integrales definidas",
      },
      summary: {
        en: "Find the antiderivative, then evaluate it at both bounds and subtract.",
        pt: "Ache a antiderivada, depois avalie nos dois limites e subtraia.",
        es: "Halla la antiderivada, luego evalúala en ambos límites y resta.",
      },
      lesson: {
        intro: {
          en: "A definite integral has two bounds. Find the antiderivative first, then evaluate it at the top bound and subtract its value at the bottom bound — that difference is the actual area.",
          pt: "Uma integral definida tem dois limites. Ache a antiderivada primeiro, depois avalie no limite de cima e subtraia o valor no limite de baixo — essa diferença é a área de verdade.",
          es: "Una integral definida tiene dos límites. Halla la antiderivada primero, luego evalúala en el límite superior y resta su valor en el límite inferior — esa diferencia es el área real.",
        },
        example: { id: "ex-coral-9", prompt: "∫[1, 4] 2x dx", answer: 15, operands: [1, 1, 4] },
        steps: [
          {
            text: {
              en: "The antiderivative of 2x is x².",
              pt: "A antiderivada de 2x é x².",
              es: "La antiderivada de 2x es x².",
            },
          },
          {
            text: {
              en: "Evaluate at the top bound: 4² = {{16}}.",
              pt: "Avalie no limite de cima: 4² = {{16}}.",
              es: "Evalúa en el límite superior: 4² = {{16}}.",
            },
          },
          {
            text: {
              en: "Subtract the bottom bound: 16 - 1² = 15.",
              pt: "Subtraia o limite de baixo: 16 - 1² = 15.",
              es: "Resta el límite inferior: 16 - 1² = 15.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 8, passAccuracy: 0.8, targetTimeSec: 18 },
      generate: generateDefiniteIntegral,
    },
    {
      id: "coral-10",
      beltId: "coral",
      index: 10,
      title: {
        en: "Derivatives and integrals together",
        pt: "Derivadas e integrais juntas",
        es: "Derivadas e integrales juntas",
      },
      summary: {
        en: "Differentiate and evaluate, then integrate and evaluate — every Coral Belt skill in one problem.",
        pt: "Derive e avalie, depois integre e avalie — todas as habilidades da Faixa Coral em um problema.",
        es: "Deriva y evalúa, luego integra y evalúa — todas las habilidades del Cinturón Coral en un problema.",
      },
      lesson: {
        intro: {
          en: "This pulls together everything from this belt: differentiate a polynomial and evaluate it at a point, then find a definite integral, and add the two results together.",
          pt: "Isso reúne tudo desta faixa: derive um polinômio e avalie num ponto, depois ache uma integral definida, e some os dois resultados.",
          es: "Esto reúne todo de este cinturón: deriva un polinomio y evalúalo en un punto, luego halla una integral definida, y suma los dos resultados.",
        },
        example: {
          id: "ex-coral-10",
          prompt: "f(x) = 2x² + 3x; f'(1) + ∫[0, 3] 2x dx",
          answer: 16,
          operands: [2, 3, 1, 1, 3],
        },
        steps: [
          {
            text: {
              en: "Differentiate: f'(x) = 4x + 3. Evaluate at 1: 4 + 3 = {{7}}.",
              pt: "Derive: f'(x) = 4x + 3. Avalie em 1: 4 + 3 = {{7}}.",
              es: "Deriva: f'(x) = 4x + 3. Evalúa en 1: 4 + 3 = {{7}}.",
            },
          },
          {
            text: {
              en: "Integrate: ∫2x dx = x². Evaluate from 0 to 3: 9 - 0 = 9.",
              pt: "Integre: ∫2x dx = x². Avalie de 0 a 3: 9 - 0 = 9.",
              es: "Integra: ∫2x dx = x². Evalúa de 0 a 3: 9 - 0 = 9.",
            },
          },
          {
            text: {
              en: "Add the two results: 7 + 9 = 16.",
              pt: "Some os dois resultados: 7 + 9 = 16.",
              es: "Suma los dos resultados: 7 + 9 = 16.",
            },
          },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 10, passAccuracy: 0.8, targetTimeSec: 26 },
      generate: generateCalculusCapstone,
    },
  ],
};

export const belts: Belt[] = [whiteBelt, blueBelt, purpleBelt, brownBelt, blackBelt, coralBelt];
