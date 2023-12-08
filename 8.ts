export { };

const text = await Deno.readTextFile("input8.txt");
const lines: string[] = text.trim().split(/\r?\n/).map(line => line.trim())

const instructions = lines[0].trim().split('');
const nodeLines = lines.slice(2);

interface Node {
  name: string,
  left: string,
  right: string,
}

const nodes = new Map<string, Node>();

for (const line of nodeLines) {
  let [name, lr] = line.split('=')
  name = name.trim()
  lr = lr.trim()
  const [left, right] = lr.substring(1, lr.length - 1).split(', ')
  nodes.set(name, {
    name: name,
    left: left,
    right: right
  });
}

 let currentNode: Node | undefined = nodes.get('AAA')

if (currentNode === undefined) {
  throw new Error("undefined node")
}

let dirPtr = 0
let steps = 0;

while (currentNode.name !== 'ZZZ') {
  const next = instructions[dirPtr]

  if (next === 'R') {
    currentNode = nodes.get(currentNode.right)
  } else if (next === 'L') {
    currentNode = nodes.get(currentNode.left)
  } else {
    throw new Error("invalid step " + next)
  }

  if (currentNode === undefined) {
    throw new Error("undefined node")
  }

  steps += 1

  dirPtr = (dirPtr + 1) % instructions.length
}


console.log({steps})

// pt 2

const currentNodes: (Node | undefined)[] = [...nodes.values()].filter(node => node.name[2] === 'A');
const startingNodes = [...currentNodes]

const zNodeLen = []

for (let i = 0; i < currentNodes.length; i++) {
  zNodeLen.push(0);
}

for (let i = 0; i < currentNodes.length; i++) {
  let currentNode = startingNodes[i];
  dirPtr = 0;

  while (true) {
    const next = instructions[dirPtr]

    if (currentNode === undefined) {
      throw new Error("undefined node")
    }

    if (next === 'R') {
      currentNode = nodes.get(currentNode.right)
    } else if (next === 'L') {
      currentNode = nodes.get(currentNode.left)
    } else {
      throw new Error("invalid step " + next)
    }
    zNodeLen[i] += 1;

    if (currentNode === undefined) {
      throw new Error("undefined node")
    }

    if (currentNode.name[2] === 'Z') {
      break;
    }

    dirPtr = (dirPtr + 1) % instructions.length  
  }
}

function gcd(a: number, b: number): number  {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return a * b / gcd(a, b) 
}

function lcmOfArray(arr: number[]): number {
  let currLcm = 1;
  for (const n of arr) {
    currLcm = lcm(currLcm, n);
  }

  return currLcm;
}

const zNodeLcm = lcmOfArray(zNodeLen);

console.log({zNodeLcm})