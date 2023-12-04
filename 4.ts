export { };

const text = await Deno.readTextFile("input4.txt");
let lines = text.trim().split(/\r?\n/).map(line => line.trim())

let sum = 0;

for (const line of lines) {
  const [_, nums] = line.split(':')
  let [winString, cardString] = nums.split('|');

  const winningNums = new Set<number>(
    winString.trim().split(' ').filter(s => s !== '')
    .map(s => parseInt(s, 10)));
  const cardNums = new Set<number>(
    cardString.trim().split(' ').filter(s => s != '')
    .map(s => parseInt(s, 10)));
  
  let matches = 0;
  for (const n of cardNums) {
    if (winningNums.has(n)) {
      matches += 1;
    }
  }

  if (matches > 0) {
    sum += Math.pow(2, matches - 1);
  }
}

console.log({sum});

// === part 2 ===

interface Card {
  winningNums: Set<number>,
  cardNums: Set<number>,
  cardCount: number
}

lines = text.trim().split(/\r?\n/).map(line => line.trim())

let cards : Card[] = lines.map(line => {
  const [_, nums] = line.split(':')
  let [winString, cardString] = nums.split('|');

  const winningNums = new Set<number>(
    winString.trim().split(' ').filter(s => s !== '')
    .map(s => parseInt(s, 10)));
  const cardNums = new Set<number>(
    cardString.trim().split(' ').filter(s => s != '')
    .map(s => parseInt(s, 10)));

    return {
      winningNums: winningNums,
      cardNums: cardNums,
      cardCount: 1
    }
});

let part2Sum = 0;

for (let i = 0; i < cards.length; i++) {
  const currentCard = cards[i];

  let matches = 0
  for (const n of currentCard.cardNums) {
    if (currentCard.winningNums.has(n)) {
      matches += 1;
    }
  }

  part2Sum += currentCard.cardCount;

  for (let j = 1; j < matches+1; j++) {
    const nextCard = cards[i+j];
    nextCard.cardCount += currentCard.cardCount;
  }
}

console.log({part2Sum});