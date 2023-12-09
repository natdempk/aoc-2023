export { };

const text = await Deno.readTextFile("input9.txt");
const lines: string[] = text.trim().split(/\r?\n/).map(line => line.trim())

const histories = lines.map(line => line.trim().split(' ').map(n => parseInt(n,10)))

function findNext(nums: number[]): number {
  const allZeros = nums.every(n => n === 0);
  if (allZeros) {
    return 0
  }
  // compute the next array
  const arr = []
  for (let i = 0; i < nums.length - 1; i++) {
    arr.push(nums[i+1] - nums[i]);
  }

  return findNext(arr) + nums[nums.length - 1]
}

let sum = 0
for (const h of histories) {
  sum += findNext(h);
}

console.log({sum})

// part 2
function findNextFirst(nums: number[]): number {
  const allZeros = nums.every(n => n === 0);

  if (allZeros) {
    return 0
  }
  // compute the next array
  const arr = []
  for (let i = 0; i < nums.length - 1; i++) {
    arr.push(nums[i+1] - nums[i]);
  }

  const next = nums[0] - findNextFirst(arr)
  return  next;
}

let firstSum = 0
for (const h of histories) {
  const n = findNextFirst(h)
  firstSum += n;
}

console.log({firstSum})