export { };

const text = await Deno.readTextFile("input5.txt");
const inputSegments: string[] = text.trim().split(/\r?\n\r?\n/).map(line => line.trim())

const seedInput = inputSegments.shift();

if (seedInput === undefined) {
  throw new Error("undefined seed input");
}

const seeds = seedInput.split(':')[1].trim()
  .split(' ').filter(l => l !== '').map(l => parseInt(l, 10));

const mapSegments = inputSegments;

class MapRange {
  sourceStart: number; // inclusive
  sourceEnd: number; // exclusive
  destStart: number; // inclusive
  destEnd: number; // exclusive
  rangeSize: number;
  constructor(destStart: number, sourceStart: number, rangeSize: number) {
    this.destStart = destStart;
    this.destEnd = destStart + rangeSize;
    this.sourceStart = sourceStart;
    this.sourceEnd = sourceStart + rangeSize;
    this.rangeSize = rangeSize;
  }

  isWithin(n: number): boolean {
    return n >= this.sourceStart && n < this.sourceEnd;
  }

  convert(n: number): number {
    if (n < this.sourceStart) {
      throw new Error("tried to convert too low");
    } else if (n >= this.sourceEnd) {
      throw new Error("tried to convert too high");
    }
    return this.destStart + (n - this.sourceStart);
  }

}

const orderedMapRanges: MapRange[][] = []

for (const segment of mapSegments) {
  const mapLines = segment.split(':')[1].trim().split(/\r?\n/)

  const currentMapRanges = []
  for (const mapLine of mapLines) {
    const [destStart, sourceStart, rangeSize] = mapLine.trim().split(' ').map(n => parseInt(n, 10))
    currentMapRanges.push(new MapRange(destStart, sourceStart, rangeSize));
  }

  currentMapRanges.sort((a, b) => {
    return a.sourceStart - b.sourceStart;
  })

  orderedMapRanges.push(currentMapRanges);
}

const currentSeeds = [...seeds];

for (let i = 0; i < orderedMapRanges.length; i++) {
  const currentMap = orderedMapRanges[i];

  for (let j = 0; j < currentSeeds.length; j++) {
    const currentSeed = currentSeeds[j];

    for (const mapRange of currentMap) {
      if (mapRange.isWithin(currentSeed)) {
        const newSeed = mapRange.convert(currentSeed);
        currentSeeds[j] = newSeed;
        break;
      }
    }
  }
}

const minFinalSeedLocation = Math.min(...currentSeeds);
console.log({minFinalSeedLocation})

console.log('============')

// part 2
const seedPairs = [...seeds];

let seedPairSeeds = []

for (let i = 0; i < seedPairs.length; i += 2) {
  const [start, len] = [seedPairs[i], seedPairs[i+1]]
  const end = start + len - 1;

  seedPairSeeds.push([start, end]);
}

seedPairSeeds.sort((a, b) => {
  return a[0] - b[0] // sort by start of range so we can walk both in order
});

for (let i = 0; i < orderedMapRanges.length; i++) {
  const copy = orderedMapRanges[i];
  const currentMapRanges: MapRange[] = [...copy];
  const currentSeedPairs: number[][] = [...seedPairSeeds]
  const newSeedPairs: number[][] = []

  let currentMap: MapRange | undefined = currentMapRanges.shift()
  let currentPair: number[] | undefined = currentSeedPairs.shift()

  while (currentPair !== undefined || currentMap !== undefined) {
    if (currentPair === undefined) {
      // exhausted all pairs, end the loop
      currentMap = undefined;
      continue;
    }

    if (currentMap === undefined) {
      // we are after all maps, so push as-is
      newSeedPairs.push(currentPair);
      currentPair = currentSeedPairs.shift();
      continue;
    }

    const [currentStart, currentEnd] = [currentPair[0], currentPair[1]];

    // double check < vs <= here because of the map ends
    if (currentStart < currentMap.sourceStart && currentEnd < currentMap.sourceStart) {
      // our range is before any mappings, so we keep the range as-is and go to next pair
      newSeedPairs.push(currentPair);
      currentPair = currentSeedPairs.shift();
    } else if (currentStart >= currentMap.sourceEnd && currentEnd >= currentMap.sourceEnd) {
      // our range is after the map entirely, check the next map
      currentMap = currentMapRanges.shift();
    } else if (currentMap.isWithin(currentStart) && currentMap.isWithin(currentEnd)) {
      // whole range contained in map
      // convert the range wholesale, go to next range
      newSeedPairs.push([currentMap.convert(currentStart), currentMap.convert(currentEnd)]);
      currentPair = currentSeedPairs.shift();
    } else if (currentStart < currentMap.sourceStart && currentMap.isWithin(currentEnd)) {
      // start outside of map end inside
      newSeedPairs.push([currentStart, currentMap.sourceStart - 1])
      newSeedPairs.push([currentMap.convert(currentMap.sourceStart), currentMap.convert(currentEnd)])
      currentPair = currentSeedPairs.shift();
    } else if (currentMap.isWithin(currentStart) && currentEnd >= currentMap.sourceEnd) {
      // start inside of map end outside
      newSeedPairs.push([currentMap.convert(currentStart), currentMap.convert(currentMap.sourceEnd - 1)])
      currentPair = [currentMap.sourceEnd, currentEnd]
      currentMap = currentMapRanges.shift()
    } else if (currentStart < currentMap.sourceStart && currentEnd >= currentMap.sourceEnd) {
      // start and end encompass map range entirely
      newSeedPairs.push([currentStart, currentMap.sourceStart - 1]);
      newSeedPairs.push([currentMap.convert(currentMap.sourceStart), currentMap.convert(currentMap.sourceEnd - 1)])
      currentPair = [currentMap.sourceEnd, currentEnd];
      currentMap = currentMapRanges.shift();
    } else {
      throw new Error('case fail')
    }
  }

  newSeedPairs.sort((a, b) => {
    return a[0] - b[0] // sort by start of range so we can walk both in order
  });
  seedPairSeeds = newSeedPairs;
}

seedPairSeeds.sort((a, b) => {
  return a[0] - b[0] // sort by start of range so we can walk both in order
});

console.log('part 2 min: ', seedPairSeeds[0][0])