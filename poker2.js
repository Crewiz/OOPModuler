class Card {
    constructor(suit, name, value) {
        this.suit = suit;
        this.name = name;
        this.value = value;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        suits.forEach(suit => {
            names.forEach((name, index) => {
                this.cards.push(new Card(suit, name, index + 2));
            });
        });
    }

    shuffle() {
        // Shuffle kortleken med the Fisher-Yates algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(numberOfCards) {
        return this.cards.splice(0, numberOfCards);
    }

    print() {
        this.cards.forEach(card => {
            console.log(`Suit: ${card.suit}, Name: ${card.name}, Value: ${card.value}`);
        });
    }
}

class Player {
    constructor(name, balance) {
        this.name = name;
        this.hand = [];
        this.balance = balance;
    }

    winBet(amount) {
        this.balance += amount;
    }
    loseBet(amount) {
        this.balance -= amount;
    }


    drawCards(deck, numberOfCards) {
        this.hand = this.hand.concat(deck.deal(numberOfCards));
    }

    discardCards(indices) {
        // tar bort valt antal kort från handen
        for (let i = indices.length - 1; i >= 0; i--) {
            this.hand.splice(indices[i], 1);
        }
    }

    print() {
        console.log(`${this.name}'s hand:`);
        this.hand.forEach(card => {
            console.log(`Suit: ${card.suit}, Name: ${card.name}, Value: ${card.value}`);
        });
    }

    getTotalValue() {
        return this.hand.reduce((total, card) => total + card.value, 0);
    }
    hasPair() {
        let counts = {};
        this.hand.forEach(card => {
            if (!counts[card.name]) {
                counts[card.name] = 1;
            } else {
                counts[card.name]++;
            }
        });
        for (let cardName in counts) {
            if (counts[cardName] === 2) {
                return true;
            }
        }
        return false;
    }

    hasTwoPairs() {
        let counts = {};
        let pairs = 0;
        this.hand.forEach(card => {
            if (!counts[card.name]) {
                counts[card.name] = 1;
            } else {
                counts[card.name]++;
            }
        });
        for (let cardName in counts) {
            if (counts[cardName] === 2) {
                pairs++;
            }
        }
        return pairs >= 2;
    }

    hasThreeOfAKind() {
        let counts = {};
        this.hand.forEach(card => {
            if (!counts[card.name]) {
                counts[card.name] = 1;
            } else {
                counts[card.name]++;
            }
        });
        for (let cardName in counts) {
            if (counts[cardName] === 3) {
                return true;
            }
        }
        return false;
    }
    hasFullHouse() {
        let counts = {};
        let three = false;
        let two = false;
        this.hand.forEach(card => {
            if (!counts[card.name]) {
                counts[card.name] = 1;
            } else {
                counts[card.name]++;
            }
        });
        for (let cardName in counts) {
            if (counts[cardName] === 3) {
                three = true;
            } else if (counts[cardName] === 2) {
                two = true;
            }
        }
        return three && two;
    }
    hasStraight() {
        let sortedHand = this.hand.sort((a, b) => a.value - b.value);
        for (let i = 0; i < sortedHand.length - 1; i++) {
            if (sortedHand[i].value + 1 !== sortedHand[i + 1].value) {
                return false;
            }
        }
        return true;
    }
}





class Dealer {
    constructor() {
        this.deck = new Deck();
    }

    shuffleDeck() {
        this.deck.shuffle();
    }

    dealCards(players, numberOfCards) {
        players.forEach(player => {
            player.drawCards(this.deck, numberOfCards);
        });
    }
}

class HandValidator {
    static validate(players) {
        players.forEach(player => {
            console.log(`${player.name} has a total value of ${player.getTotalValue()}`);
            if (player.hasPair()) console.log(`${player.name} has a Pair`);
            if (player.hasTwoPairs()) console.log(`${player.name} has Two Pairs`);
            if (player.hasThreeOfAKind()) console.log(`${player.name} has Three of a Kind`);
            if (player.hasFullHouse()) console.log(`${player.name} has a Full House`);
            if (player.hasStraight()) console.log(`${player.name} has a Straight`);


        });
        }
        }
        
        class Game {
            constructor() {
                this.players = [];
                this.dealer = new Dealer();
        }
        
            addPlayers(numberOfPlayers) {
            for (let i = 0; i < numberOfPlayers; i++) {
                let name = prompt(`Enter the name of player ${i+1}`);
                this.players.push(new Player(name));
            }
        }
        
            startGame() {
            // Add players
            let numberOfPlayers = prompt("Enter the number of players (at least 2)");
            this.addPlayers(numberOfPlayers);
            // sätter balance till 10
            this.players.forEach(player => player.balance = 10);

            // Add number of rounds you want to play
            let numberOfRounds = prompt("Enter the number of rounds you want to play");
    
            // Shuffle the deck and deal cards to the players
            this.dealer.shuffleDeck();
            this.dealer.dealCards(this.players, 5);
    
            // Validate the players' hands
            HandValidator.validate(this.players);
    
            // Create a game loop for multiple rounds
            for (let i = 0; i < numberOfRounds; i++) {
                // Have the players place their bets
                let betting = new Betting(this.players);
                betting.placeBets();
    
                // Have the players discard 2 cards each
                this.players.forEach(player => {
                    let indices = prompt(`${player.name}, enter the number of the cards you want to discard`);
                    player.discardCards(indices);
                });
    
                // Have the players draw 2 new cards each
                this.dealer.dealCards(this.players, 2);
    
                // Validate the players' hands
                HandValidator.validate(this.players);
    
                // Determine the winner of the round
                let winner = this.players.reduce((prev, current) => {
                    return prev.getTotalValue() > current.getTotalValue() ? prev : current;
                });
                console.log(`The winner of round ${i+1} is ${winner.name}`);

                // Adjust the balance of the winner and losers
            this.players.forEach(player => {
                if (player === winner) {
                    player.winBet(this.players.map(p=>p.bet).reduce((prev,current)=> prev+current));
                } else {
                    player.loseBet(player.bet);
                }
            });
    
                // Discard all cards into the discard pile and move them back to the deck
                this.players.forEach(player => {
                    this.dealer.deck.cards = this.dealer.deck.cards.concat(player.hand);
                    player.hand = [];
                });
                this.dealer.shuffleDeck();
            }
        }
    }
    
// gör så att man kan betta
    class Betting {
        constructor(players) {
            this.players = players;
            this.pot = 0;
        }
    
        placeBets() {
            this.players.forEach(player => {
                // frågar spelaren hur mycket dom ska betta
                let bet = prompt(`${player.name}, enter your bet for this round`);
                player.bet = bet;
                // uppdaterar spelarens balance
                player.balance -= bet;
                console.log(`${player.name} has placed a bet of ${bet} and has a remaining balance of ${player.balance}`);
                this.pot += bet;
            });
        }
    }
        

    // Create an instance of the Game class and start the game
    let game = new Game();
    game.startGame();
