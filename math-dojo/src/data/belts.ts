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
} from "../engine/problemGenerator";
import type { Belt } from "../types";

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
              en: "8 needs 2 more to reach 10.",
              pt: "O 8 precisa de mais 2 para chegar a 10.",
              es: "Al 8 le faltan 2 para llegar a 10.",
            },
          },
          {
            text: {
              en: "Split 5 into 2 + 3.",
              pt: "Separe o 5 em 2 + 3.",
              es: "Separa el 5 en 2 + 3.",
            },
          },
          {
            text: {
              en: "8 + 2 = 10, then 10 + 3 = 13.",
              pt: "8 + 2 = 10, depois 10 + 3 = 13.",
              es: "8 + 2 = 10, luego 10 + 3 = 13.",
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
              en: "Add the units: 8 + 5 = 13. Write the 3, carry the 1.",
              pt: "Some as unidades: 8 + 5 = 13. Escreva o 3 e leve o 1.",
              es: "Suma las unidades: 8 + 5 = 13. Escribe el 3 y lleva el 1.",
            },
          },
          {
            text: {
              en: "Add the carried 1 to the tens: 3 + 1 = 4.",
              pt: "Some o 1 que veio à dezena: 3 + 1 = 4.",
              es: "Suma el 1 que llevaste a la decena: 3 + 1 = 4.",
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
              en: "Add the units column: 7 + 6 = 13. Write the 3, carry the 1.",
              pt: "Some a coluna das unidades: 7 + 6 = 13. Escreva o 3 e leve o 1.",
              es: "Suma la columna de las unidades: 7 + 6 = 13. Escribe el 3 y lleva el 1.",
            },
          },
          {
            text: {
              en: "Add the tens column: 2 + 4 + 1 (carried) = 7.",
              pt: "Some a coluna das dezenas: 2 + 4 + 1 (que veio) = 7.",
              es: "Suma la columna de las decenas: 2 + 4 + 1 (que llevaste) = 7.",
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
              en: "Add the units: 7 + 6 = 13. Write the 3, carry the 1.",
              pt: "Some as unidades: 7 + 6 = 13. Escreva o 3 e leve o 1.",
              es: "Suma las unidades: 7 + 6 = 13. Escribe el 3 y lleva el 1.",
            },
          },
          {
            text: {
              en: "Add the tens plus the carry: 1 + 5 + 1 = 7.",
              pt: "Some as dezenas mais o que veio: 1 + 5 + 1 = 7.",
              es: "Suma las decenas más el acarreo: 1 + 5 + 1 = 7.",
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
              en: "Add the units: 7 + 8 = 15. Write the 5, carry the 1.",
              pt: "Some as unidades: 7 + 8 = 15. Escreva o 5 e leve o 1.",
              es: "Suma las unidades: 7 + 8 = 15. Escribe el 5 y lleva el 1.",
            },
          },
          {
            text: {
              en: "Add the tens plus the carry: 8 + 6 + 1 = 15. Write the 5, carry the 1 again.",
              pt: "Some as dezenas mais o que veio: 8 + 6 + 1 = 15. Escreva o 5 e leve o 1 de novo.",
              es: "Suma las decenas más el acarreo: 8 + 6 + 1 = 15. Escribe el 5 y lleva el 1 de nuevo.",
            },
          },
          {
            text: {
              en: "Add the hundreds plus the carry: 5 + 3 + 1 = 9.",
              pt: "Some as centenas mais o que veio: 5 + 3 + 1 = 9.",
              es: "Suma las centenas más el acarreo: 5 + 3 + 1 = 9.",
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
              en: "15 needs to lose 5 to reach 10.",
              pt: "O 15 precisa perder 5 para chegar a 10.",
              es: "Al 15 le hace falta perder 5 para llegar a 10.",
            },
          },
          {
            text: {
              en: "Split 8 into 5 + 3.",
              pt: "Separe o 8 em 5 + 3.",
              es: "Separa el 8 en 5 + 3.",
            },
          },
          {
            text: {
              en: "15 - 5 = 10, then 10 - 3 = 7.",
              pt: "15 - 5 = 10, depois 10 - 3 = 7.",
              es: "15 - 5 = 10, luego 10 - 3 = 7.",
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
              en: "2 is smaller than 7, so borrow a ten: 12 - 7 = 5.",
              pt: "2 é menor que 7, então empreste uma dezena: 12 - 7 = 5.",
              es: "2 es menor que 7, así que presta una decena: 12 - 7 = 5.",
            },
          },
          {
            text: {
              en: "The tens digit loses 1: 4 becomes 3.",
              pt: "A dezena perde 1: 4 vira 3.",
              es: "La decena pierde 1: 4 se convierte en 3.",
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
              en: "2 is smaller than 7, so borrow: 12 - 7 = 5.",
              pt: "2 é menor que 7, então empreste: 12 - 7 = 5.",
              es: "2 es menor que 7, así que presta: 12 - 7 = 5.",
            },
          },
          {
            text: {
              en: "The tens digit loses 1: 5 - 1 - 2 = 2.",
              pt: "A dezena perde 1: 5 - 1 - 2 = 2.",
              es: "La decena pierde 1: 5 - 1 - 2 = 2.",
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
              en: "2 is smaller than 8, so borrow: 12 - 8 = 4.",
              pt: "2 é menor que 8, então empreste: 12 - 8 = 4.",
              es: "2 es menor que 8, así que presta: 12 - 8 = 4.",
            },
          },
          {
            text: {
              en: "The tens digit loses 1: 4 - 1 - 2 = 1.",
              pt: "A dezena perde 1: 4 - 1 - 2 = 1.",
              es: "La decena pierde 1: 4 - 1 - 2 = 1.",
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
              en: "3 is smaller than 7, so borrow: 13 - 7 = 6.",
              pt: "3 é menor que 7, então empreste: 13 - 7 = 6.",
              es: "3 es menor que 7, así que presta: 13 - 7 = 6.",
            },
          },
          {
            text: {
              en: "The tens digit loses 1, becoming 1, which is smaller than 5 — borrow again: 11 - 5 = 6.",
              pt: "A dezena perde 1, vira 1, que é menor que 5 — empreste de novo: 11 - 5 = 6.",
              es: "La decena pierde 1, queda en 1, que es menor que 5 — presta de nuevo: 11 - 5 = 6.",
            },
          },
          {
            text: {
              en: "The hundreds digit loses 1: 5 - 1 - 3 = 1.",
              pt: "A centena perde 1: 5 - 1 - 3 = 1.",
              es: "La centena pierde 1: 5 - 1 - 3 = 1.",
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
        example: { id: "ex-purple-1", prompt: "8 × 10", answer: 80, operands: [8, 10] },
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
      id: "purple-2",
      beltId: "purple",
      index: 2,
      title: { en: "Times tables 3 and 4", pt: "Tabuada do 3 e do 4", es: "Tablas del 3 y del 4" },
      summary: {
        en: "Skip-count to build up the answer.",
        pt: "Conte de pouco em pouco para chegar na resposta.",
        es: "Cuenta salteado para llegar a la respuesta.",
      },
      lesson: {
        intro: {
          en: "Multiplying means adding the same number again and again. Skip-count to find the answer.",
          pt: "Multiplicar é somar o mesmo número várias vezes. Conte pulando para achar a resposta.",
          es: "Multiplicar es sumar el mismo número varias veces. Cuenta salteado para encontrar la respuesta.",
        },
        example: { id: "ex-purple-2", prompt: "4 × 3", answer: 12, operands: [4, 3] },
        steps: [
          {
            text: {
              en: "4 × 3 means three groups of 4.",
              pt: "4 × 3 significa três grupos de 4.",
              es: "4 × 3 significa tres grupos de 4.",
            },
          },
          { text: { en: "4 + 4 + 4 = 12.", pt: "4 + 4 + 4 = 12.", es: "4 + 4 + 4 = 12." } },
          { text: { en: "4 × 3 = 12.", pt: "4 × 3 = 12.", es: "4 × 3 = 12." } },
        ],
      },
      mastery: { problemsPerPage: 12, pagesToMaster: 7, passAccuracy: 0.8, targetTimeSec: 6 },
      generate: generateTables3and4,
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
              en: "Break 8 into 5 + 3.",
              pt: "Separe o 8 em 5 + 3.",
              es: "Separa el 8 en 5 + 3.",
            },
          },
          {
            text: {
              en: "7 × 5 = 35 and 7 × 3 = 21.",
              pt: "7 × 5 = 35 e 7 × 3 = 21.",
              es: "7 × 5 = 35 y 7 × 3 = 21.",
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
              en: "Stuck on ×9? Multiply by 10 first: 6 × 10 = 60.",
              pt: "Travou no ×9? Multiplique por 10 primeiro: 6 × 10 = 60.",
              es: "¿Te trabaste en el ×9? Multiplica por 10 primero: 6 × 10 = 60.",
            },
          },
          {
            text: {
              en: "Then subtract the number once: 60 - 6 = 54.",
              pt: "Depois subtraia o número uma vez: 60 - 6 = 54.",
              es: "Luego resta el número una vez: 60 - 6 = 54.",
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
              en: "Multiply the units: 4 × 3 = 12. Write the 2, carry the 1.",
              pt: "Multiplique a unidade: 4 × 3 = 12. Escreva o 2 e leve o 1.",
              es: "Multiplica la unidad: 4 × 3 = 12. Escribe el 2 y lleva el 1.",
            },
          },
          {
            text: {
              en: "Multiply the tens: 2 × 3 = 6, plus the carried 1 = 7.",
              pt: "Multiplique a dezena: 2 × 3 = 6, mais o 1 que veio = 7.",
              es: "Multiplica la decena: 2 × 3 = 6, más el 1 que llevaste = 7.",
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
          { text: { en: "Break 12 into 10 + 2.", pt: "Separe o 12 em 10 + 2.", es: "Separa el 12 en 10 + 2." } },
          { text: { en: "23 × 10 = 230.", pt: "23 × 10 = 230.", es: "23 × 10 = 230." } },
          { text: { en: "23 × 2 = 46.", pt: "23 × 2 = 46.", es: "23 × 2 = 46." } },
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
              en: "Multiply the units: 3 × 4 = 12. Write the 2, carry the 1.",
              pt: "Multiplique a unidade: 3 × 4 = 12. Escreva o 2 e leve o 1.",
              es: "Multiplica la unidad: 3 × 4 = 12. Escribe el 2 y lleva el 1.",
            },
          },
          {
            text: {
              en: "Multiply the tens: 1 × 4 = 4, plus the carried 1 = 5.",
              pt: "Multiplique a dezena: 1 × 4 = 4, mais o 1 que veio = 5.",
              es: "Multiplica la decena: 1 × 4 = 4, más el 1 que llevaste = 5.",
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
          { text: { en: "Break 24 into 20 + 4.", pt: "Separe o 24 em 20 + 4.", es: "Separa el 24 en 20 + 4." } },
          { text: { en: "213 × 20 = 4260.", pt: "213 × 20 = 4260.", es: "213 × 20 = 4260." } },
          { text: { en: "213 × 4 = 852.", pt: "213 × 4 = 852.", es: "213 × 4 = 852." } },
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
  stripes: [],
  locked: true,
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
  stripes: [],
  locked: true,
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
