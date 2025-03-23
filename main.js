// < ========================================================
// < Imports
// < ========================================================

import { utils } from './utils.js';
import { Card } from './custom-elements/card.js';
import { Overlay } from './custom-elements/overlay.js';
import { Pile } from './custom-elements/pile.js';
import { Player } from './player.js';
import { Game } from './game.js';
import { handlers } from './handlers.js';
import { buttons } from './buttons.js';
import { Pending } from './pending.js';

// < ========================================================
// < Registration of Custom HTML Elements
// < ========================================================

Card.register();
Overlay.register();
Pile.register();

// < ========================================================
// < Queries for HTML Elements
// < ========================================================

let page = document.getElementById('page');
let information = document.getElementById('information');

// < ========================================================
// < Instantiation of Custom HTML Elements
// < ========================================================

let deck = Pile.create('deck', page);
let center = Pile.create('center', page)
let burned = Pile.create('burned', page)

// < ========================================================
// < Instantiation of Other Object Instances
// < ========================================================

let human = new Player('human', false, false);
let computer = new Player('computer', true, true);

// < ========================================================
// < Functions
// < ========================================================

function checker(booleanFunction, ms = 5) {
    setInterval(() => {
        let result = booleanFunction();
        information.innerText = `Result: ${result}`
    }, ms);
}

// < ========================================================
// < Entry Point
// < ========================================================

function main() {
    handlers.init();
    buttons.init();
    Game.init({ human, computer });
    Game.populate(true, true);
    Game.cull(30);
    Game.distributeStartingCards();
    Game.pickBestShownCards();
    Game.update();
    // utils.logger.start();

    // Game.transfer(burned.top, burned, center, false);

    information.innerText = '';
    let newline = (message, n = 0) => information.innerText += '\n'.repeat(n) + message + '\n';
    newline('Build 0.0.1-alpha');
    newline('> PC version functional');
    newline('> Mobile version untested');
    newline('Bugs', 1);
    newline('> Overlays can get stuck when cards burned or picked up');
    newline('> Players able to play multiple cards from a ground pile, instead of just shown OR hidden');
    newline('> Win condition is calculated before pending cards are processed');
    newline('Temporary Features', 1);
    newline('> 350ms delay for player.action calls');

    window.Game = Game;
    window.Pending = Pending;

    // Game.addSpacer(human.blind)

}

// < ========================================================
// < Execution
// < ========================================================

main();