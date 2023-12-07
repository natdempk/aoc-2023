export { };

const text = await Deno.readTextFile("input7.txt");
const lines: string[] = text.trim().split(/\r?\n/).map(line => line.trim())

const cardOrder = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

class Hand {
  cards: string;
  bid: number;
  rank: number;

  constructor(cards: string, bid: number) {
    this.cards = cards;
    this.bid = bid;


    this.rank = this.determineRank(cards);
  }

  determineRank(c: string): number {
    const cardCounts = new Map<string, number>();

    const cards = [...c]

    cards.forEach(card => {
      if (cardCounts.has(card)) {
        const ct = cardCounts.get(card);
        if (ct === undefined) {
          throw new Error("ct undefined");
        }
        cardCounts.set(card, ct + 1);
      } else {
        cardCounts.set(card, 1);
      }
    })

    const jCount = cardCounts.has('J') ? cardCounts.get('J') : 0;
    if (jCount === undefined) {
      throw new Error('invalid Js');
    }

    // remove J's
    cardCounts.delete('J');

    if (jCount === 5) {
      return 6
    }

    if (jCount === 4) {
      return 6
    }

    if (jCount === 3) {
      if (cardCounts.size === 1) {
        return 6
      } else {
        return 5
      }
    }

    if (jCount == 2) {
      if (cardCounts.size === 1) {
        return 6;
      } else if (cardCounts.size == 2) {
        return 5; 
      } else {
        return 3;
      }
    }

    if (jCount == 1) {
      if (cardCounts.size === 1) {
        return 6; // 5oak
      } else if (cardCounts.size == 2) {
        // 3,1 = 4oak
        for (const value of cardCounts.values()) {
          if (value === 3) {
            return 5; // 4oak
          }
        }
        // 2,2 = fh
        return 4 
        
      } else if (cardCounts.size == 3) {
        // 3oak
        return 3;
      } else {
        return 1 // 1 pair
      }
    }


    if (cardCounts.size === 1) { // 5
      return 6;
    }

    // 4
    for (const value of cardCounts.values()) {
      if (value === 4) {
        return 5;
      }
    }

    // full
    if (cardCounts.size === 2) {
      let [two, three] = [false, false];

      for (const value of cardCounts.values()) {
        if (value === 2) {
          two = true;
        }
        if (value === 3) {
          three = true
        }
      }

      if (two && three) {
        return 4;
      }
    }

    // 3
    for (const value of cardCounts.values()) {
      if (value === 3) {
        return 3;
      }
    }

    // 2
    let twosCount = 0;
    for (const value of cardCounts.values()) {
      if (value === 2) {
        twosCount += 1;
      }
    }
    if (twosCount == 2) {
      return 2;
    }

    // one
    if (twosCount == 1) {
      return 1;
    }

    // high
    return 0;
  }


  compareTo(other: Hand): number {
    if (this.rank != other.rank) {
      return this.rank - other.rank; // backwards?
    } else {
      // check pairwise cards
      let zipped = [...this.cards].map((e, i) => [e, [...other.cards][i]]);

      for (const [thisCard, otherCard] of zipped) {
        if (thisCard === otherCard) {
          continue;
        }

        const thisCardRank = cardOrder.indexOf(thisCard);
        const otherCardRank = cardOrder.indexOf(otherCard);
        return otherCardRank - thisCardRank;
      }

      return 0;
    }
  }
}

const hands = lines.map(line => {
  const [cards, bid] = line.split(' ');
  return  new Hand(cards, parseInt(bid,10));
});

hands.sort((a, b) => a.compareTo(b))

// console.log({hands});

let winnings = 0;

hands.forEach((v, i) => {
  // console.log(v);
  winnings += v.bid * (i + 1);
});

console.log({winnings});