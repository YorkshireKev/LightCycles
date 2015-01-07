/*
LightCycles

v0.1 K Ellis 19/12/2014

Inspired by the Sinclair ZX Spectrum classic by PSS from 1983 of the same name.
This is an experiment in HTML5's Canvas and Javascript.
*/

(function () {
  "use strict";

  //Initialise the 'global' variables
  var lc = {},
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  function initialiseGame(numberOfPlayers) {
    var iy, ix;

    lc.pixelSize = (Math.floor(canvas.width / 320) < Math.floor(canvas.height / 200)) ? Math.floor(canvas.width / 320) : Math.floor(canvas.height / 200);

    //Set player start position and directions.
    lc.player1 = {
      xPos: 289,
      yPos: 100,
      dir: 0,
      crashed: false
    };
    lc.player2 = {
      xPos: 30,
      yPos: 100,
      dir: 1,
      crashed: false
    };

    lc.inGame = true;
    lc.players = (numberOfPlayers);
    lc.endMessage = 'Welcome to LightCycles';

    //Clear the drawing area
    context.clearRect(0, 0, canvas.width, canvas.height);

    //(re)set the game array ready for the start of the game.
    lc.gameGrid = []; //320 x 200 grid
    lc.gameDrawn = []; //320 x 200 grid
    for (ix = 0; ix < 320; ix += 1) {
      for (iy = 0; iy < 200; iy += 1) {
        lc.gameGrid[ix * 320 + iy] = 0;
        lc.gameDrawn[ix * 320 + iy] = 0;
        if (iy === 0 || iy === 199) {
          //Replace top/bottom edge with a wall
          lc.gameGrid[ix * 320 + iy] = 1;
        }
        if (ix === 0 || ix === 319) {
          //Replace left/right edge with a wall
          lc.gameGrid[ix * 320 + iy] = 1;
        }
      }
    }
  }

  function drawGameGrid() {
    var iy, ix,
      xOffset, yOffset,
      block, drawn;


    xOffset = (canvas.width - (320 * lc.pixelSize)) / 2;
    yOffset = (canvas.height - (200 * lc.pixelSize)) / 2;

    for (ix = 0; ix < 320; ix += 1) {
      for (iy = 0; iy < 200; iy += 1) {

        //Check gameGrid against drawnGrid, so we only draw the deltas and don't
        //waste cyclers drawing stuff that is already on screen.
        block = lc.gameGrid[ix * 320 + iy];
        drawn = lc.gameDrawn[ix * 320 + iy];
        if (block !== drawn) {
          //Draw pixel grid

          switch (block) {
          case 1: //borders
            context.fillStyle = '#00e2ff';
            break;
          case 2: //Player 1 (red)
            context.fillStyle = '#ff0000';
            break;
          case 3: //player 2 (green)
            context.fillStyle = '#00ff00';
            break;
          default:
            context.fillStyle = '#000000';
            break;
          }

          //Draw a pre-defined wall
          context.fillRect((ix * lc.pixelSize) + xOffset, (iy * lc.pixelSize) + yOffset, lc.pixelSize, lc.pixelSize);
          lc.gameDrawn[ix * 320 + iy] = block;
        } //end draw pixel grid
      }
    }
  }

  function updatePlayerPositions() {
    var choice;
    if (lc.players === 1) {
      choice = Math.floor(Math.random() * 2); //Random turn direction if computer is 1 pixel from crashing.
      //if single player game, we'll update player 2 here.
      switch (lc.player2.dir) {
      case 0: //Left
        if (lc.gameGrid[((lc.player2.xPos - 1) * 320) + lc.player2.yPos] !== 0) {
          if (choice === 0) {
            if (lc.gameGrid[(lc.player2.xPos * 320) + (lc.player2.yPos - 1)] === 0) {
              lc.player2.dir = 2;
            } else {
              lc.player2.dir = 3;
            }
          } else {
            if (lc.gameGrid[(lc.player2.xPos * 320) + (lc.player2.yPos + 1)] === 0) {
              lc.player2.dir = 3;
            } else {
              lc.player2.dir = 2;
            }
          }
        }
        break;

      case 1: //Right
        if (lc.gameGrid[((lc.player2.xPos + 1) * 320) + lc.player2.yPos] !== 0) {
          if (choice === 0) {
            if (lc.gameGrid[(lc.player2.xPos * 320) + (lc.player2.yPos + 1)] === 0) {
              lc.player2.dir = 3;
            } else {
              lc.player2.dir = 2;
            }
          } else {
            if (lc.gameGrid[(lc.player2.xPos * 320) + (lc.player2.yPos - 1)] === 0) {
              lc.player2.dir = 2;
            } else {
              lc.player2.dir = 3;
            }
          }
        }
        break;

      case 2: //Up
        if (lc.gameGrid[(lc.player2.xPos * 320) + (lc.player2.yPos - 1)] !== 0) {
          if (choice === 0) {
            if (lc.gameGrid[((lc.player2.xPos - 1) * 320) + lc.player2.yPos] !== 0) {
              lc.player2.dir = 1;
            } else {
              lc.player2.dir = 0;
            }
          } else {
            if (lc.gameGrid[((lc.player2.xPos + 1) * 320) + lc.player2.yPos] !== 0) {
              lc.player2.dir = 0;
            } else {
              lc.player2.dir = 1;
            }
          }
        }
        break;

      case 3: //Down
        if (lc.gameGrid[(lc.player2.xPos * 320) + (lc.player2.yPos + 1)] !== 0) {
          if (choice === 0) {
            if (lc.gameGrid[((lc.player2.xPos + 1) * 320) + lc.player2.yPos] !== 0) {
              lc.player2.dir = 0;
            } else {
              lc.player2.dir = 1;
            }
          } else {
            if (lc.gameGrid[((lc.player2.xPos - 1) * 320) + lc.player2.yPos] !== 0) {
              lc.player2.dir = 1;
            } else {
              lc.player2.dir = 0;
            }
          }
        }
        break;

      }
    } //end computer controlled player.

    //Player 1
    switch (lc.player1.dir) {
    case 0: //left
      lc.player1.xPos -= 1;
      break;
    case 1: //right
      lc.player1.xPos += 1;
      break;
    case 2: //up
      lc.player1.yPos -= 1;
      break;
    case 3: //down
      lc.player1.yPos += 1;
      break;
    }
    if (lc.gameGrid[(lc.player1.xPos * 320) + lc.player1.yPos] === 0) {
      lc.gameGrid[(lc.player1.xPos * 320) + lc.player1.yPos] = 2;
    } else {
      lc.player1.crashed = true;
    }

    //Player 2
    switch (lc.player2.dir) {
    case 0: //left
      lc.player2.xPos -= 1;
      break;
    case 1: //right
      lc.player2.xPos += 1;
      break;
    case 2: //up
      lc.player2.yPos -= 1;
      break;
    case 3: //down
      lc.player2.yPos += 1;
      break;
    }
    if (lc.gameGrid[(lc.player2.xPos * 320) + lc.player2.yPos] === 0) {
      lc.gameGrid[(lc.player2.xPos * 320) + lc.player2.yPos] = 3;
    } else {
      lc.player2.crashed = true;
    }
  }

  function checkForPlayerCrash() {
    //Someone has crashed, so what's the score alfy?    
    if ((lc.player1.crashed === true && lc.player2.crashed === true) || ((lc.player1.xPos === lc.player2.xPos) && (lc.player1.yPos === lc.player2.yPos))) {
      //it's a draw!
      lc.inGame = false;
      return "Both players have crashed! It's a draw!";
    }

    if (lc.player1.crashed === true) {
      //Player 1
      lc.inGame = false;
      return "Red has crashed. Green Wins!";
    }

    if (lc.player2.crashed === true) {
      //Player 2
      lc.inGame = false;
      return "Green has crashed. Red Wins!";
    }
    return;
  }

  function drawGameOverScreen(text) {
    context.font = lc.pixelSize * 15 + "px Arial";
    context.textAlign = 'center';
    context.fillStyle = '#ffeb00';
    context.fillText(text, canvas.width / 2, (canvas.height / 2) - (lc.pixelSize * 30));
    context.font = lc.pixelSize * 10 + "px Arial";
    context.fillStyle = '#d4c406';
    context.fillText("Press 1 for 1 player (Computer Plays Green), or 2 for 2 players", canvas.width / 2, (canvas.height / 2) + (lc.pixelSize * 40));
    context.fillStyle = '#7ee8f5';
    context.fillText("Green Player: Q, A, Z and X. Red Player: O, P, N and M", canvas.width / 2, (canvas.height / 2) + (lc.pixelSize * 70));
  }

  window.addEventListener("keydown", function (event) {
    switch (event.keyCode) {

    case 78:
      //Key: N - Player 1 Left
      if (lc.player1.dir !== 1) {
        lc.player1.dir = 0;
      }
      break;
    case 77:
      //Key: M - Player 1 Right
      if (lc.player1.dir !== 0) {
        lc.player1.dir = 1;
      }
      break;
    case 80:
      //Key: P - Player 1 Up
      if (lc.player1.dir !== 3) {
        lc.player1.dir = 2;
      }
      break;
    case 76:
      //Key: L - Player 1 Down
      if (lc.player1.dir !== 2) {
        lc.player1.dir = 3;
      }
      break;

    case 49:
      //1 player game selected
      if (lc.inGame === false) {
        initialiseGame(1);
      }
      break;
    case 50:
      //2 player game selected
      if (lc.inGame === false) {
        initialiseGame(2);
      }
      break;
    }

    if (lc.players === 2) {
      //Keyboard controls player 2 (green) only in 2 player mode)
      switch (event.keyCode) {
      case 90:
        //Key: Z - Player 2 Left
        if (lc.player2.dir !== 1) {
          lc.player2.dir = 0;
        }
        break;
      case 88:
        //Key: X - Player 2 Right
        if (lc.player2.dir !== 0) {
          lc.player2.dir = 1;
        }
        break;
      case 81:
        //Key: Q - Player 2 Up
        if (lc.player2.dir !== 3) {
          lc.player2.dir = 2;
        }
        break;
      case 65:
        //Key: A - Player 2 Down
        if (lc.player2.dir !== 2) {
          lc.player2.dir = 3;
        }
        break;
      }
    }

  }, false);



  function draw() {
    setTimeout(function () {
      window.requestAnimationFrame(draw);

      if (lc.inGame === true) {
        updatePlayerPositions();
        lc.endMessage = checkForPlayerCrash();
        drawGameGrid();
      } else {
        drawGameOverScreen(lc.endMessage);
        //waitForGameRestart
      }

    }, 25); // 25ms is 40fps (1000/40)
  }

  //First time in, so force game over and wait for user to start game.
  initialiseGame(0);
  lc.inGame = false;
  draw();

}());