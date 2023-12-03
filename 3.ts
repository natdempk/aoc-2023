export { };

const text = await Deno.readTextFile("input3.txt");
const lines = text.trim().split(/\r?\n/).map(line => line.trim())

interface Symbol {
  x: number,
  y: number,
  char: string
}

const symbols = []
const numbers: number[][] = Array.from(Array(lines.length), _ => Array(lines[0].length).fill(0))

for (const [y, line] of lines.entries()) {
  let currentNumString = '';
  // console.log(line)

  for (const [x, char] of line.split('').entries()) {
    numbers[y][x] = 0;

    if (char >= '0' && char <= '9') {
      // digit
      currentNumString += char;
    } else if (char === '.') {
      if (currentNumString.length === 0) {
        continue;
      }

      // empty / terminate
      const currentNum = Number(currentNumString);

      for (let i = x - currentNumString.length; i < x; i++) {
        numbers[y][i] = currentNum;
      }

      currentNumString = '';
    } else {
      // symbol
      symbols.push(<Symbol>{
        x: x,
        y: y,
        char: char
      });

      if (currentNumString.length === 0) {
        continue;
      }

      // empty / terminate
      const currentNum = Number(currentNumString);

      for (let i = x - currentNumString.length; i < x; i++) {
        numbers[y][i] = currentNum;
      }

      currentNumString = '';
    }
  }

  // empty / terminate
  if (currentNumString !== '') {
    const currentNum = Number(currentNumString);
    const x = line.length

    for (let i = x - currentNumString.length; i < x; i++) {
      numbers[y][i] = currentNum;
    }
  }
}

// console.log({symbols})
// console.log({numbers})

let sum = 0;
const maxX = lines[0].length - 1
const maxY = lines.length - 1

for (const symbol of symbols) {
  const seen = new Set<number>();

  const coords = new Set<number[]>([
    // first row
    [Math.max(0, symbol.x - 1), Math.max(0, symbol.y - 1)],
    [symbol.x, Math.max(0, symbol.y - 1)],
    [Math.min(maxX, symbol.x + 1), Math.max(0, symbol.y - 1)],
    // second row
    [Math.max(0, symbol.x - 1), symbol.y],
    [Math.min(maxX, symbol.x + 1), symbol.y],
    // third row
    [Math.max(0, symbol.x - 1), Math.min(maxY, symbol.y + 1)],
    [symbol.x, Math.min(maxY, symbol.y + 1)],
    [Math.min(maxX, symbol.x + 1), Math.min(maxY, symbol.y + 1)],
  ]);

  coords.delete([symbol.x, symbol.y])

  for (const coord of coords) {
    const num = numbers[coord[1]][coord[0]];
    if (!seen.has(num)) {
      seen.add(num);
      sum += num;
    }
  }
}

console.log({sum})

// ==== PART 2 ====

let gearSum = 0;
const starSymbols = symbols.filter(sym => sym.char === '*');

// console.log({starSymbols})

for (const symbol of starSymbols) {
  const seen = new Set<number>();

  const coords = new Set<number[]>([
    // first row
    [Math.max(0, symbol.x - 1), Math.max(0, symbol.y - 1)],
    [symbol.x, Math.max(0, symbol.y - 1)],
    [Math.min(maxX, symbol.x + 1), Math.max(0, symbol.y - 1)],
    // second row
    [Math.max(0, symbol.x - 1), symbol.y],
    [Math.min(maxX, symbol.x + 1), symbol.y],
    // third row
    [Math.max(0, symbol.x - 1), Math.min(maxY, symbol.y + 1)],
    [symbol.x, Math.min(maxY, symbol.y + 1)],
    [Math.min(maxX, symbol.x + 1), Math.min(maxY, symbol.y + 1)],
  ]);

  coords.delete([symbol.x, symbol.y])

  for (const coord of coords) {
    const num = numbers[coord[1]][coord[0]];
      if (num != 0) {
        seen.add(num);
      }
  }

  if (seen.size === 2) {
    let gearMul = 1;
    for (const n of seen) {
      gearMul = gearMul * n;
    }
    gearSum += gearMul
  }
}

console.log({gearSum})