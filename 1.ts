export { };


const text = await Deno.readTextFile("input1.txt");
const lines = text.trim().split(/\r?\n/)


const digits = new Map<string, number> ([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9]
]);

function extractNumber(s: string): number {
  const regexp = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
  const matches: string[] = Array.from(s.matchAll(regexp), (match) => match[1]);
  // let matches = s.match(regexp);
  const firstMatch: string = matches[0];
  const lastMatch: string = matches[matches.length - 1]

  return matchToNum(firstMatch) * 10 + matchToNum(lastMatch)
}

function matchToNum(s: string): number {
  if (s.length > 1) {
    return digits.get(s);
  } else {
    return Number(s)
  }
}

const numbers = lines.map((l) => {
  const n = extractNumber(l);
  // console.log(n + ' ' + l);
  return n;
})
const total = numbers.reduce((sum, x) => sum + x);

console.log(total);
