// the game itself
var game

var messages = {
  ink: 'Amarelo é a cor da ansiedade! 🤣🤣🤣',
  smoke: 'Só um desabafo: Queria um casal de sobrinhos!! 🥲🥲',
  ballons: 'Vocês acharam que ia ser fácil assim? 😈'
}

var attempts = {
  round: 0,
  degrees: [
    [20, 190, 349],
    [306, 120, 96],
    [256, 212, 40]
  ]
}

// once the window loads...
window.onload = function () {
  // game configuration object
  var gameConfig = {
    // render type
    type: Phaser.CANVAS,

    // game width, in pixels
    width: 850,

    // game height, in pixels
    height: 850,

    transparent: true,

    // scenes used by the game
    scene: [playGame]
  }

  // game constructor
  game = new Phaser.Game(gameConfig)

  // pure javascript to give focus to the page/frame and scale the game
  window.focus()
  resize()
  window.addEventListener('resize', resize, false)
}

// PlayGame scene
class playGame extends Phaser.Scene {
  // constructor
  constructor () {
    super('PlayGame')
  }

  // method to be executed when the scene preloads
  preload () {
    // loading assets

    this.load.image('wheel', window.location.href + 'images/wheel.png')
    this.load.image('pin', window.location.href + 'images/pin.png')
  }

  // method to be executed once the scene has been created
  create () {
    // adding the wheel in the middle of the canvas
    this.wheel = this.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'wheel'
    )

    // adding the pin in the middle of the canvas
    this.pin = this.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'pin'
    )

    this.pin.setInteractive()

    // adding the text field
    this.title = this.add.text(
      game.config.width / 2,
      60,
      ' Revelação do Sexo ',
      {
        font: '60px Bangers',
        align: 'center',
        color: '#022A32'
      }
    )

    // adding the text field
    this.titleBorder = this.add.text(
      game.config.width / 2 - 1,
      59,
      ' Revelação do Sexo ',
      {
        font: '60px Bangers',
        align: 'center',
        color: 'white'
      }
    )

    // center the text
    this.title.setOrigin(0.5)
    this.titleBorder.setOrigin(0.5)

    // the game has just started = we can spin the wheel
    this.canSpin = true

    // waiting for your input, then calling "spinWheel" function
    this.pin.on('pointerdown', this.spinWheel, this)
  }

  // function to spin the wheel
  spinWheel () {
    // can we spin the wheel?
    if (this.canSpin) {
      // the wheel will spin round from 2 to 4 times. This is just coreography
      var rounds = Phaser.Math.Between(4, 6)

      // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
      // var degrees = Phaser.Math.Between(0, 360)

      var degrees = attempts.degrees[attempts.round][Phaser.Math.Between(0, 2)]
      attempts.round = attempts.round >= 2 ? 0 : attempts.round + 1

      // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
      var prize = 7 - Math.floor((degrees + 28) / 60)
      // now the wheel cannot spin because it's already spinning
      this.canSpin = false

      // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
      // the quadratic easing will simulate friction
      this.tweens.add({
        // adding the wheel to tween targets
        targets: [this.wheel],

        // angle destination
        angle: 360 * rounds + degrees,

        // tween duration
        duration: 3000,

        // tween easing
        ease: 'Cubic.easeOut',

        // callback scope
        callbackScope: this,

        // function to be executed once the tween has been completed
        onComplete: function (tween) {
          var result = ['ink', 'ballons', 'smoke'][prize % 3]
          var video = document.getElementById(result)
          if (video) {
            video.classList.remove('hide')
            video.play().then(() => {
              setTimeout(() => {
                document.getElementById(
                  'message-container'
                ).className = `base fadin ${result}-color`
                setTimeout(() => {
                  typeMessage(messages[result])
                  video.classList.add('hide')
                  video.pause()
                  video.currentTime = 0
                }, 1000)
                this.canSpin = true
              }, 5000)
            })
          }
        }
      })
    }
  }
}

// pure javascript to scale the game
function resize () {
  var canvas = document.querySelector('canvas')
  var windowWidth = window.innerWidth
  var windowHeight = window.innerHeight
  var windowRatio = windowWidth / windowHeight
  var gameRatio = game.config.width / game.config.height
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px'
    canvas.style.height = windowWidth / gameRatio + 'px'
  } else {
    canvas.style.width = windowHeight * gameRatio + 'px'
    canvas.style.height = windowHeight + 'px'
  }
}

function typeMessage (msg, i = 0) {
  if (i < msg.length) {
    document.getElementById('message').innerHTML += msg.charAt(i)
    i++
    setTimeout(() => typeMessage(msg, i++), 50)
  } else {
    var container = document.getElementById('message-container')
    setTimeout(() => {
      container.classList.add('fadout')
      setTimeout(() => {
        document.getElementById('message').innerHTML = ''
        container.classList.add('hide')
      }, 1000)
    }, 5000)
  }
}


function createQRCodes () {
  var qrcode1 = new QRCode("player-1-content", {
    text: `${window.location.origin}/control.html?player=1`,
    width: 150,
    height: 150,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

var qrcode2 = new QRCode("player-2-content", {
  text: `${window.location.origin}/control.html?player=2`,
  width: 150,
  height: 150,
  colorDark : "#000000",
  colorLight : "#ffffff",
  correctLevel : QRCode.CorrectLevel.H
});
}


window.addEventListener("load", function() {
  createQRCodes();
});
