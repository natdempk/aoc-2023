export { };

const text = await Deno.readTextFile("input6.txt");
const lines: string[] = text.trim().split(/\r?\n/).map(line => line.trim())

const times = lines[0].split(':')[1].trim().split(' ').filter(t => t !== '').map(t => parseInt(t, 10))
const distances = lines[1].split(':')[1].trim().split(' ').filter(t => t !== '').map(t => parseInt(t, 10))

const pairs = times.map((e, i) => [e, distances[i]]);

let allWinMul = 1;

for (const [t, d] of pairs) {
  let pairWins = 0
  for (let i = 1; i < t; i++) {
    const dist = i * (t - i);

    if (dist > d) {
      pairWins += 1
    }
  }
  allWinMul *= pairWins;
}

console.log({allWinMul});

// part 2

const pt2Time = parseInt(lines[0].split(':')[1].trim().split(' ').filter(t => t !== '').join(''), 10)
const pt2Dist = parseInt(lines[1].split(':')[1].trim().split(' ').filter(t => t !== '').join(''), 10)

let wins = 0
for (let i = 1; i < pt2Time; i++) {
  const dist = i * (pt2Time - i);

  if (dist > pt2Dist) {
    wins += 1
  }
}

console.log({wins})