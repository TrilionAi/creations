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
  stripes: [],
  locked: true,
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
