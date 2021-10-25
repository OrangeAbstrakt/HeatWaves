import kaboom from "kaboom";

//entry point
kaboom();

//variables
const MOVE_SPEED = 300;

//Load In Sprites

loadSprite("fireBall", "sprites/FireBall.png")
loadSprite("iceFloor", "sprites/iceFloor.png");
loadSprite("icePillars", "sprites/icePillars.png");
loadSprite("background", "sprites/background.png");
loadSprite("BrainFreeze", "sprites/BrainFreeze.png");
loadSprite("attack1", "sprites/attack1.png");
loadSprite("bomb", "sprites/bomb.png");
loadSprite("attack2", "sprites/attack2.png");
loadSprite("iceBullet", "sprites/iceBullet.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("gameOverbg", "sprites/gameOverbg.png");
loadSprite("vicBg", "sprites/vicBg.png");
loadSprite("menuBg", "sprites/menuBg.png");
loadSprite("generalbg", "sprites/generalbg.png");
loadSprite("homeIcon", "sprites/homeIcon.png");
//Load In Sounds
loadSound("jump", "sounds/jump.mp3");
loadSound("op", "sounds/op.wav");
loadSound("lose", "sounds/lose.wav");
loadSound("throughout", "sounds/throughout.mp3");
loadSound("bomb", "sounds/bomb.wav");
loadSound("blasts", "sounds/blasts.wav");
loadSound("vic", "sounds/vic.wav");


//main Game
//level1

scene("level1", () => {

const mainTheme = play("throughout");

//characters

    const fireBall = add([
      sprite("fireBall"),
      pos(80, 40),
      scale(3),
      area(1),
      body(),
      health(3),
      origin("center"),
      layer("game"),
      "hero",
      "player",

    ])

    const brainFreeze = add([
      sprite("BrainFreeze"),
      pos(960, 40),
      scale(3),
      layer("game"),
      body(),
      area(),
      health(20),
      "villan",
    ])

//layers

    layers([
      "bg",
      "game",
      "ui",
      "ui2",
    ]);

//background

    add([
      sprite("background"),
      layer("bg"),
      scale(0.83),

    ]);

//buttons | Basic UI

   add([
      rect(40, 40),
      area(),
      solid(),
      layer("ui"),
      "homeBtn",
      color(251, 192, 45),
      pos(1200, 10),
    ])

  clicks("homeBtn", () =>{
    go("mainMenu");
  })

  add([
    sprite("homeIcon"),
    area(),
    layer("ui2"),
    pos(1197, 7),
    scale(1.5),
  ])

//Character props


    const playerHealth = add([
      text("FireBall: 3", {
        size: 24,
        width: 480,
      }),
      layer("ui"),
      pos(120, 5),
      { value: 3 },

    ]);

    const villanHealth = add([
      text("BrainFreeze: 20", {
        size: 24,
        width: 480,
      }),
      layer("ui"),
      pos(900, 20),
      { value: 20 },
    ]);

//Player funcs

//jump 

  keyPress("space", () => {
      if (fireBall.grounded()) {
        fireBall.jump(800);
        play("jump");
      }
  });

//movement

  keyDown("d", () => {
    fireBall.move(MOVE_SPEED, 0);
  })

  keyDown("a", () => {
    fireBall.move(-MOVE_SPEED, 0);
  })

//attacks

    keyPress("w", () => {
     play("blasts");
      const attack1 = add([
        sprite("attack1"),
        pos(fireBall.pos),
        area(),
        layer("game"),
        solid(),
        move(RIGHT, 1000),
        "damage",
      ])


//collision for attack1

      attack1.collides("damage", (damage) => {
        destroy(damage);
      });

      attack1.collides("hero", (damage) => {
        destroy(attack1);
      });
      attack1.collides("villan", (villan) => {
        const coin = add([
          sprite("coin"),
          pos(brainFreeze.pos),
          area(),
          body(),
          layer("game"),
          scale(5),
          solid(),
          "hero",
          "destructible",
          lifespan(3, { fade: 0.5 }),
          move(LEFT, 400),
      ])

        coin.collides("player", (p) => {
          p.hurt(1);
          destroy(coin);
          playerHealth.value -= 1;
          playerHealth.text = "FireBall: " + playerHealth.value;
          shake();
        })

        coin.collides("walls", () => {
          destroy(coin);
        })

        coin.collides("damage", () => {
          destroy(coin);
        })
         

        attack1.destroy();
        brainFreeze.hurt(1);
        brainFreeze.move(10000, 0);
        villanHealth.value -= 1;
        villanHealth.text = "BrainFreeze: " + villanHealth.value;

      });
    })

    keyPress("left", () => {
      mainTheme.pause;

    })
    keyPress("right", () => {
      mainTheme.play;
      
    })

    

//attacks
    keyPress("s", () => {
     
      const attack2 = add([
        sprite("attack2"),
        pos(fireBall.pos),
        origin("center"),
        area(),
        layer("game"),
        solid(),
        move(LEFT, 1000),
        "damage",
      ])
      attack2.collides("damage", (damage) => {
        destroy(damage);
      });

      attack2.collides("hero", (damage) => {
        destroy(attack2);
      });
      attack2.collides("villan", (villan) => {
        const coin = add([
          sprite("coin"),
          pos(brainFreeze.pos),
          body(),
          area(),
          layer("game"),
          scale(5),
          solid(),
          "hero",
          "destructible",
          lifespan(3, { fade: 0.5 }),
          move(LEFT, 400),
      ])
       coin.collides("player", () => {
          fireBall.hurt(1);
          playerHealth.value -= 1;
          playerHealth.text = "FireBall: " + playerHealth.value;
          shake();
        })

        coin.collides("walls", () => {
          destroy(coin);
          shake();
        })

        coin.collides("damage", () => {
          destroy(coin);
          shake();
        })

      





        attack2.destroy();
        brainFreeze.hurt(1);
        villanHealth.value -= 1;
        villanHealth.text = "BrainFreeze: " + villanHealth.value;
        shake();

      });
    })

//attack2
    keyPress("e", () => {
      const bomb = add([
        sprite("bomb"),
        pos(mousePos()),
        area(),
        layer("game"),
        body(),
        "damage",
        "destructable",
      ])
//conditions
      bomb.collides("damage", (damage) => {
        play("bomb");
        destroy(bomb);
        shake();
      });

      bomb.collides("player", (damage) => {
        play("bomb");
        destroy(bomb);
        addKaboom(bomb.pos);
        shake();
        fireBall.hurt(1);
        playerHealth.value -= 1;
        playerHealth.text = "FireBall: " + playerHealth.value;
        shake();

      });
      bomb.collides("hero", (damage) => {
        play("bomb");
        destroy(bomb);
        addKaboom(bomb.pos);
        shake();



      });
      bomb.collides("villan", (villan) => {
        play("bomb");
        const coin = add([
          sprite("coin"),
          pos(brainFreeze.pos),
          area(),
          layer("game"),
          scale(5),
          body(),
          solid(),
          "hero",
          "destructible",
          lifespan(3, { fade: 0.5 }),
          move(LEFT, 400)
        ])

         coin.collides("player", () => {
          fireBall.hurt(1);
          destroy(coin);
          playerHealth.value -= 1;
          playerHealth.text = "FireBall: " + playerHealth.value;
          shake();
        })

        coin.collides("walls", () => {
          destroy(coin);
          shake();
        })

        coin.collides("damage", () => {
          destroy(coin);
          shake();
        })


        bomb.destroy();
        brainFreeze.hurt(1);
        addKaboom(brainFreeze.pos);
        shake();
        brainFreeze.hurt(0.1);
        villanHealth.value -= 1;
        villanHealth.text = "BrainFreeze: " + villanHealth.value;

      });
       


      
      
    })

//villan motion
    loop(0.5, () => {
      brainFreeze.moveTo(rand(0, width()), rand(0, height()));
    });



//scenes
//victory | level1

 scene("vic_roy", () => {
  
  layers([
    "bg",
    "game",
    "ui",
  ]);

  add([
    sprite("vicBg"),
    //scale(3),
    pos(0, 0),
    layer("bg"),
  

  ])

    keyPress("enter", () => {
      go("mainMenu");

    });
  })

  keyPress("q", () => {
  if (playerHealth.value !== 3){
    fireBall.heal(1);
    playerHealth.value += 1;
    playerHealth.text = "FireBall: " + playerHealth.value;
  } else if (playerHealth.value == 3){
    shake();
  }
  })

    //------------

    //death of main
    fireBall.on("death", () => {
      destroy(fireBall);
      const loser = play("lose");
      mainTheme.pause();
      go("lose");
    });

    //death of villan
    brainFreeze.on("death", () => {
      destroy(fireBall);
      mainTheme.pause();
      play("vic");
      go("vic_roy");
    });


    //Scene defined
    addLevel([

      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "===================",
    ], {
      width: 67,
      height: 65,

      "=": () => [
        sprite("iceFloor"),
        area(),
        solid(),
        layer("game"),
        "hero",
        "wall",
      ],
      "|": () => [
        sprite("icePillars"),
        area(),
        solid(),
        layer("game"),
        "hero",
        "walls",
      ],

      "!": () => [
        sprite("icePillars"),
        area(),
        solid(),
        layer("game"),
        "hero",
        "walls",
      ],



    });
  });


  scene("mainMenu", () => {

  layers([
    "bg",
    "game",
    "ui",
  ]);


    add([
      sprite("menuBg"),
      scale(1.2),
      layer("bg"),
      area({cursor:"auto"})
    ])

    const startBtn = add([
      rect(240, 60),
      pos(50, 125),
      area({cursor: "pointer"}),
      //color(0, 0, 255, 0),
      layer("ui"),
      opacity(0),
      "btn1",
    ])

  

    const cntrlsBtn = add([
      rect(420, 60),
      pos(50, 275),
      area({cursor: "pointer"}),
      layer("ui"),
      opacity(0),
      "btn2",
    ])

    const charsBtn = add([
      rect(520, 60),
      pos(50, 437),
      area({cursor: "pointer"}),
      layer("ui"),
      opacity(0),
      "btn3",
    ])

    clicks("btn1", () => {
      go("gameModes");
    })

    clicks("btn2", () => {
      play("op");
      go("cntrls");
    })

    clicks("btn3", () => {
      play("op");
      go("chars");
    })








  })

  scene("lose", () => {

  layers([
    "bg",
    "game",
    "ui",
  ]);

  add([
    sprite("gameOverbg"),
    //scale(0.83),
    layer("bg"),
    scale(1.25),
  ])
  
 add([
      text("Press Enter To Try Again", {
        color: rgb(0, 255, 187),
        font: "sinko",
        size: 42,
        width: 900,
      }),
      area(),
      solid(),
      layer("ui"),
      pos(250, 287),
    ])


    keyPress("enter", () => {
      go("level1");

    });

    keyPress("backspace", () => {
      go("mainMenu")
    })

       add([
      rect(40, 40),
      area(),
      solid(),
      layer("ui"),
      "homeBtn",
      color(251, 192, 45),
      pos(1200, 10),
    ])

  clicks("homeBtn", () =>{
    go("mainMenu");
  })

  add([
    sprite("homeIcon"),
    area(),
    layer("ui"),
    pos(1197, 7),
    scale(1.5),
  ])

  


})

scene("cntrls", () => {

  layers([
    "bg",
    "game",
    "ui",
  ]);

  add([
    sprite("generalbg"),
    layer("bg"),
  ])



add([
      layer("game"),
      text("W: Fire A Blast Forward", {
          size: 42,
          width: 1300,
          font: "sinko",
          }),
        area(),
        solid(),
        pos(10, 10)
      ])

add([
      layer("game"),
      text("S: Fire A Blast Behind", {
          size: 42,
          width: 1300,
          font: "sinko",
          }),
        area(),
        solid(),
        pos(10, 80),
      ])
add([
      layer("game"),
      text("A: Move Back(Left on the screen)", {
          size: 42,
          width: 1300,
          font: "sinko",
          }),
        area(),
        solid(),
        pos(10, 150),
      ])
add([
      layer("game"),
      text("D: Move Forward(right on the screen)", {
          size: 42,
          width: 1300,
          font: "sinko",
          }),
        area(),
        solid(),
        pos(10, 220),
      ])
add([
      layer("game"),
      text("Q: Heal Your Player", {
          size: 42,
          width: 1300,
          font: "sinko",
          }),
        area(),
        solid(),
        pos(10, 290),
      ])
add([
      layer("game"),
      text("E: Drop a bomb where You plave your mouse", {
          size: 42,
          width: 1300,
          font: "sinko",
          }),
        area(),
        solid(),
        pos(10, 360),
      ])

    keyPress("backspace", () => {
      go("mainMenu")
    })
       add([
      rect(40, 40),
      area(),
      solid(),
      layer("ui"),
      "homeBtn",
      color(251, 192, 45),
      pos(1200, 10),
    ])

  clicks("homeBtn", () =>{
    go("mainMenu");
  })

  add([
    sprite("homeIcon"),
    area(),
    layer("ui"),
    pos(1197, 7),
    scale(1.5),
  ])

  })

scene("chars", () => {
  layers([
    "bg",
    "game",
    "ui",
  ]);

add([
  sprite("generalbg"),
  layer("bg"),
])


  add([
    sprite("fireBall"),
    area(),
    solid(),
    pos(40, 50),
    layer("game"),
    scale(6),
  ])

  add([
    text("you are FireBall an blob of fire trying to beat your nemisis BrainFreeze. You are a fire based hero who can shoot fire blasts at your enemies to inflict pain and to protect yourself from projectile damage. You can also drop bombs. These moves are dangerous and can cause injuries which is why yoy can heal",{
      size: 24,
      width: 900,
      font: "sinko",
    }),
    layer("ui"),
    pos(240, 50),



  ])


add([
  sprite("BrainFreeze"),
  area(),
  solid(),
  pos(40, 300),
  layer("game"),
  scale(3),
])

  add([
    text("Our rival is BrainFreeze, an average frozen brain that can teleport. As it teleports around to avoid attcks it id your job to kill him. As a defense measure each time he is damaged he creates an ice barrier for protection. This barrier vapors away within 5s but it can cause damage to you in that short amount of time. BrainFreeze is also HUGE and it is your goal to damage him and get him down to ur size only to kill him. Best Of Luck",{
      size: 24,
      width: 900,
      font: "sinko",
    }),
    layer("ui"),
    pos(240, 300),



  ])

keyPress("backspace", () => {
  go("mainMenu");
})
   add([
      rect(40, 40),
      area(),
      solid(),
      layer("ui"),
      "homeBtn",
      color(251, 192, 45),
      pos(1200, 10),
    ])

  clicks("homeBtn", () =>{
    go("mainMenu");
  })

  add([
    sprite("homeIcon"),
    area(),
    layer("ui"),
    pos(1197, 7),
    scale(1.5),
  ])

})


scene("gameModes", () =>{

  layers([
    "bg",
    "game",
    "ui",
  ]);
  
  add([
    sprite("generalbg"),
    layer("bg"),
  ])

  addLevel([

      "                  ",
      "                  ",
      "                  ",
      "    %         $   ",
      "                  ",
      "                  ",
      "                  ",
      "                  ",
      "                  ",
    ], {
      width: 52,
      height: 30,

    "%": () => [
      rect(300, 400),
      layer("game"),
      area(),
      solid(),
      outline(3),
      "card1",
    ],

    "$": () => [
      rect(300, 400),
      layer("game"),
      area(),
      solid(),
      outline(3),
      "card2",
],

})//addLevel

add([
  text("FFA", {
    size: 34,
    width: 130,
    font: "sinko",
  }),
  area(),
  solid(),
  layer("ui"),
  scale(1),
  pos(310, 120),
  color(rgb(6, 128, 130)),
])

add([
  text("In FFA you have 3 lives and you need to kill BrainFreeze. To do so you must hit him 20 times, this will not be easy and you will get hurt. Its a good thing you can heal with 'Q' ", {
    size: 20,
    width: 300,
    font: "sinko",
  }),
  area(),
  solid(),
  layer("ui"),
  scale(1),
  pos(220, 200),
  color(rgb(6, 128, 130)),
])

add([
  text("SURVIVAL", {
    size: 34,
    width: 220,
    font: "sinko",
  }),
  area(),
  solid(),
  layer("ui"),
  scale(1),
  pos(780, 120),
  color(rgb(198, 5, 47)),
])

add([
  text("In this mode you can not kill brainFreeze, instead you have to play to damage and try to get a good score before dying. You have 10 hearts. This is a race with yourself", {
    size: 20,
    width: 300,
    font: "sinko",
  }),
  area(),
  solid(),
  layer("ui"),
  scale(1),
  pos(740, 200),
  color(rgb(198, 5, 47)),
])


clicks("card1", () => {
  go("level1");
})

clicks("card2", () => {
  go("level2");
})

})//scene


scene("level2", () => {
  const mainTheme = play("throughout");

//characters

    const fireBall = add([
      sprite("fireBall"),
      pos(80, 40),
      scale(3),
      area(1),
      body(),
      health(10),
      origin("center"),
      layer("game"),
      "hero",
      "player",

    ])

    const brainFreeze = add([
      sprite("BrainFreeze"),
      pos(960, 40),
      scale(3),
      layer("game"),
      body(),
      area(),
      "villan",
    ])

//layers

    layers([
      "bg",
      "game",
      "ui",
      "ui2",
    ]);

//background

    add([
      sprite("background"),
      layer("bg"),
      scale(0.83),

    ]);

//buttons | Basic UI

   add([
      rect(40, 40),
      area(),
      solid(),
      layer("ui"),
      "homeBtn",
      color(251, 192, 45),
      pos(1200, 10),
    ])

  clicks("homeBtn", () =>{
    go("mainMenu");
  })

  add([
    sprite("homeIcon"),
    area(),
    layer("ui2"),
    pos(1197, 7),
    scale(1.5),
  ])

//Character props

const playerHealth = add([
      text("FireBall: 10", {
        size: 24,
        width: 480,
      }),
      layer("ui"),
      pos(20, 5),
      { value: 10 },

    ]);

    const score = add([
      text("score: 0", {
        size: 24,
        width: 480,
      }),
      layer("ui"),
      pos(900, 20),
      {value: 0},
    ]);

    keyPress("space", () => {
      if (fireBall.grounded()) {
        fireBall.jump(800);
        play("jump");
      }
  });

//movement

  keyDown("d", () => {
    fireBall.move(MOVE_SPEED, 0);
  })

  keyDown("a", () => {
    fireBall.move(-MOVE_SPEED, 0);
  })

   keyPress("w", () => {
     play("blasts");
      const attack1 = add([
        sprite("attack1"),
        pos(fireBall.pos),
        area(),
        layer("game"),
        solid(),
        move(RIGHT, 1000),
        "damage",
      ])


//collision for attack1

      attack1.collides("damage", (damage) => {
        destroy(damage);
      });

      attack1.collides("hero", (damage) => {
        destroy(attack1);
      });
      attack1.collides("villan", (villan) => {
        score.value += 100;
        score.text = "Score: " + score.value;
        const coin = add([
          sprite("coin"),
          pos(brainFreeze.pos),
          area(),
          body(),
          layer("game"),
          scale(5),
          solid(),
          "hero",
          "destructible",
          lifespan(3, { fade: 0.5 }),
          move(LEFT, 400),
      ])

        coin.collides("player", (p) => {
          destroy(coin);
          fireBall.hurt(1);
          shake();
          playerHealth.value -= 1;
          playerHealth.text = "FireBall: " + playerHealth.value;
        })

        coin.collides("walls", () => {
          destroy(coin);
        })

        coin.collides("damage", () => {
          destroy(coin);
          score.value += 50;
        score.text = "Score: " + score.value;
        })
         

        attack1.destroy();
        brainFreeze.move(10000, 0);
      });
    })

     keyPress("s", () => {
     
      const attack2 = add([
        sprite("attack2"),
        pos(fireBall.pos),
        origin("center"),
        area(),
        layer("game"),
        solid(),
        move(LEFT, 1000),
        "damage",
      ])
      attack2.collides("damage", (damage) => {
        destroy(damage);
      });

      attack2.collides("hero", (damage) => {
        destroy(attack2);
      });
      attack2.collides("villan", (villan) => {
        score.value += 100;
        score.text = "Score: " + score.value;
        const coin = add([
          sprite("coin"),
          pos(brainFreeze.pos),
          body(),
          area(),
          layer("game"),
          scale(5),
          solid(),
          "hero",
          "destructible",
          lifespan(3, { fade: 0.5 }),
          move(LEFT, 400),
      ])
       coin.collides("player", () => {
          shake();
          fireBall.hurt(1);
          playerHealth.value -= 1;
          playerHealth.text = "FireBall: " + playerHealth.value;
        })

        coin.collides("walls", () => {
          score.value += 50;
          score.text = "Score: " + score.value;
          destroy(coin);
          shake();
        })

        coin.collides("damage", () => {
          destroy(coin);
          shake();
        })
        attack2.destroy();
        shake();

      });
    })

    keyPress("e", () => {
      const bomb = add([
        sprite("bomb"),
        pos(mousePos()),
        area(),
        layer("game"),
        body(),
        "damage",
        "destructable",
      ])
//conditions
      bomb.collides("damage", (damage) => {
        play("bomb");
        destroy(bomb);
        shake();
      });

      bomb.collides("player", (damage) => {
        play("bomb");
        destroy(bomb);
        addKaboom(bomb.pos);
        fireBall.hurt(1);
        shake();
        playerHealth.value -= 1;
          playerHealth.text = "FireBall: " + playerHealth.value;

      });
      bomb.collides("hero", (damage) => {
        play("bomb");
        destroy(bomb);
        addKaboom(bomb.pos);
        shake();



      });
      bomb.collides("villan", (villan) => {
        play("bomb");
        score.value += 100;
        score.text = "Score: " + score.value;
        const coin = add([
          sprite("coin"),
          pos(brainFreeze.pos),
          area(),
          layer("game"),
          scale(5),
          body(),
          solid(),
          "hero",
          "destructible",
          lifespan(3, { fade: 0.5 }),
          move(LEFT, 400)
        ])

         coin.collides("player", () => {
          destroy(coin);
          fireBall.hurt(1);
          shake();
          playerHealth.value -= 1;
          playerHealth.text = "FireBall: " + playerHealth.value;
        })

        coin.collides("walls", () => {
          destroy(coin);
          shake();
        })

        coin.collides("damage", () => {
          score.value += 50;
        score.text = "Score: " + score.value;
          destroy(coin);
          shake();
        })


        bomb.destroy();
        addKaboom(brainFreeze.pos);
        shake();
      });
       


      
      
    })


   loop(0.5, () => {
      brainFreeze.moveTo(rand(0, width()), rand(0, height()));
    });

      fireBall.on("death", () => {
      destroy(fireBall);
      const loser = play("lose");
      mainTheme.pause();
      go("lose1");

      setData("highscore", score.value)
    });

    

addLevel([

      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "|                 !",
      "===================",
    ], {
      width: 67,
      height: 65,

      "=": () => [
        sprite("iceFloor"),
        area(),
        solid(),
        layer("game"),
        "hero",
        "wall",
      ],
      "|": () => [
        sprite("icePillars"),
        area(),
        solid(),
        layer("game"),
        "hero",
        "walls",
      ],

      "!": () => [
        sprite("icePillars"),
        area(),
        solid(),
        layer("game"),
        "hero",
        "walls",
      ],



    });
  

})
scene("lose1", () => {

  layers([
    "bg",
    "game",
    "ui",
  ]);

  add([
    sprite("gameOverbg"),
    //scale(0.83),
    layer("bg"),
    scale(1.25),
  ])
  
 add([
      text("Press Enter To Try Again", {
        color: rgb(0, 255, 187),
        font: "sinko",
        size: 42,
        width: 900,
      }),
      area(),
      solid(),
      layer("ui"),
      pos(250, 287),
    ])
    add([
      text("SCORE: " + getData("highscore"), {
        color: rgb(0, 255, 187),
        //font: "sinko",
        size: 42,
        width: 900,
      }),
      area(),
      solid(),
      layer("ui"),
      pos(20, 40),
    ])


    keyPress("enter", () => {
      go("level2");

    });

    keyPress("backspace", () => {
      go("mainMenu")
    })

       add([
      rect(40, 40),
      area(),
      solid(),
      layer("ui"),
      "homeBtn",
      color(251, 192, 45),
      pos(1200, 10),
    ])

  clicks("homeBtn", () =>{
    go("mainMenu");
  })

  add([
    sprite("homeIcon"),
    area(),
    layer("ui"),
    pos(1197, 7),
    scale(1.5),
  ])

  


})



go("mainMenu");


