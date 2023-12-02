export { };

const text = await Deno.readTextFile("input2.txt");
const lines = text.trim().split(/\r?\n/)

function parseLine(line: string): CubeCount[] {
  const cubeCounts: CubeCount[] = [];

  const pulls: string[] = line.split(':')[1].split(';');
  for (const pull of pulls) {
    const cubeCountStrings = pull.split(',');
    const currentCount: CubeCount = {
      red: 0,
      blue: 0,
      green: 0
    }

    for (const s of cubeCountStrings) {
      const [countString, color] = s.trim().split(' ');
      if (color === 'red') {
        currentCount.red = Number(countString)
      } else if (color === 'blue') {
        currentCount.blue = Number(countString)
      } else if (color === 'green') {
        currentCount.green = Number(countString)
      } else {
        console.log('input error check: ', s);
      }   
    }

    cubeCounts.push(currentCount)
  }

  return cubeCounts;
}

const gamePulls: CubeCount[][] = lines.map((l) => parseLine(l))

const exampleGame: CubeCount = {
  red: 12,
  green: 13,
  blue: 14
}

const validGameNumbers: number[] = gamePulls.map((gamePull, index) => {
  for (const cubeCount of gamePull) {
    const validGame: boolean = cubeCount.red <= exampleGame.red
    && cubeCount.blue <= exampleGame.blue
    && cubeCount.green <= exampleGame.green;

    if (!validGame) {
      return 0;
    }
  }
  return index + 1;
})

const validGameSum = validGameNumbers.reduce((acc, n) => acc + n, 0)

console.log(gamePulls)
console.log('validGameNumbers', validGameNumbers)
console.log('validGameSum', validGameSum)

const gamePowers: number[] = gamePulls.map((gamePull) => {
  const maxCounts: CubeCount = {
    red: 0,
    green: 0,
    blue: 0
  }

  for (const cubeCount of gamePull) {
    if (cubeCount.red > maxCounts.red) {
      maxCounts.red = cubeCount.red
    }
    if (cubeCount.blue > maxCounts.blue) {
      maxCounts.blue = cubeCount.blue
    }
    if (cubeCount.green > maxCounts.green) {
      maxCounts.green = cubeCount.green
    }
  }

  return maxCounts.red * maxCounts.green * maxCounts.blue;
})

const gamePowersSum = gamePowers.reduce((acc, n) => acc + n, 0)

console.log('gamePowers', gamePowers)
console.log('gamePowersSum', gamePowersSum)

interface CubeCount {
  red: number,
  blue: number,
  green: number
}
