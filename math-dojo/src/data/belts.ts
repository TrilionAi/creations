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
  stripes: [],
  locked: true,
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
