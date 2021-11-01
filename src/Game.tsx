import { Engine, Render, Composite, Bodies, Runner, Body, Events, Bounds } from 'matter-js'
import { useEffect, useRef, useState } from 'react'
import backgroundImage from './assets/backgroundImage.png'

import characterRight1 from './assets/character-right-1.png'
import characterRight2 from './assets/character-right-2.png'
import characterRight3 from './assets/character-right-3.png'

import characterLeft1 from './assets/character-left-1.png'
import characterLeft2 from './assets/character-left-2.png'
import characterLeft3 from './assets/character-left-3.png'

import { GamePad } from './components/GamePad'
import { Alert } from './components/Alert'

const WELCOME_ALERT: AlertConfig = {
  title: 'Hi, my name is Christian',
  msg: 'I am a frontend devloper mainly working with React. This game showcases all the projects I have worked on. You can naviage using the arrow keys. Hit a project to learn more.'
}

const PROJECTS: AlertConfig[] = [
  {
    title: 'A* graph search',
    msg: 'This project is a React app that helps visualize forward, backward, and adaptive A* search on a variety of map types. You can run the search and watch how the algorithm explores the map.',
    learnMore: 'https://a-star-search-visualizer-brown.vercel.app/'
  }
]

type AlertConfig = {
  title: string
  msg: string,
  learnMore?: string
}

const CHARACTER_RIGHT_IMAGES = [
  characterRight1,
  characterRight2,
  characterRight3,
  characterRight2,
]

const CHARACTER_LEFT_IMAGES = [
  characterLeft1,
  characterLeft2,
  characterLeft3,
  characterLeft2,
]

const GAME_WIDTH = 3000
const GAME_HEIGHT = 600

const WALL_THICKNESS = 1
const GROUND_HEIGHT = 153

const BLOCK_HEIGHT = GAME_HEIGHT - 240
const BLOCK_SIZE = 50

const BACKGROUND_IMAGE_HEIGHT = 81
const BACKGROUND_IMAGE_WIDTH = 411

const CHARACTER_IMAGE_HEIGHT = 80
const CHARACTER_IMAGE_WIDTH = 40

function createImage(text: string, width: number) {

  let drawing = document.createElement("canvas");

  drawing.width = width
  drawing.height = BLOCK_SIZE

  let ctx = drawing.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(0,0,width,BLOCK_SIZE)
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, width/2, BLOCK_SIZE/2 + 6);
  }

  return drawing.toDataURL("image/png");
}

function createBox(text: string, createAlert: () => any) {
  const length = (text.length * 9) + 25
  return {
    body: Bodies.rectangle(300, BLOCK_HEIGHT, length, BLOCK_SIZE, { 
      isStatic: true,
      render: {
        sprite: {
          texture: createImage(text, length),
          xScale: 1,
          yScale: 1
        }
      }  
    }),
    onCollision: createAlert
  }
}

/**
 * check if bodies match reguardless of order in array
 */
function matchBodies([refA,refB]: Body[], [a,b]: Body[]) {
  if (refA.id === a.id) {
    return (!refB || !b) || refB?.id === b?.id
  } else if (refA.id === b?.id) {
    return (!refA || !a) || refB.id === a.id
  }
}

function clamp(min: number, val: number, max: number) {
  return Math.max(Math.min(val, max), min)
}

function game({
  elm,
  onBackgroundMove,
  backgroundColor,
  createAlert
}: {
  elm: HTMLDivElement, 
  onBackgroundMove: (x: number) => any,
  backgroundColor: string,
  createAlert: (config: AlertConfig) => any
}) {
  let windowWidth = window.innerWidth
  function handleWindowResize() {
    windowWidth = window.innerWidth
  }
  window.addEventListener('resize', handleWindowResize)

  // create engine
  var engine = Engine.create(),
  world = engine.world;
  engine.gravity.y=2

  // create renderer
  var render = Render.create({
    element: elm,
    engine: engine,
    options: {
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      background: 'transparent',
      wireframes: false,
    }
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  const character = Bodies.rectangle(100, GAME_HEIGHT - GROUND_HEIGHT, CHARACTER_IMAGE_WIDTH, CHARACTER_IMAGE_HEIGHT, { 
    frictionAir: 0.005, 
    friction: 0.1, 
    restitution: 0.1,
    render: {
      sprite: {
        texture: characterRight1,
        xScale: 1,
        yScale: 1
      }
    }
  })
  // lock rotation of character
  Body.setInertia(character, Infinity);

  const renderWall = {
    fillStyle: 'transparent',
    lineWidth: 0
  }

  const projects = PROJECTS.map(({ title, msg, learnMore }) => createBox(title, () => createAlert({ title, msg, learnMore })))

  const ground = Bodies.rectangle(GAME_WIDTH/2, GAME_HEIGHT, GAME_WIDTH, GROUND_HEIGHT, { isStatic: true, render: renderWall })
  // add bodies
  Composite.add(world, [
    // falling blocks
    ...projects.map(p => p.body),

    // walls
    Bodies.rectangle(GAME_WIDTH/2, 0, GAME_WIDTH, WALL_THICKNESS, { isStatic: true, render: renderWall }),
    ground,
    Bodies.rectangle(GAME_WIDTH, GAME_HEIGHT/2, WALL_THICKNESS, GAME_HEIGHT, { isStatic: true, render: renderWall }),
    Bodies.rectangle(0, GAME_HEIGHT/2, WALL_THICKNESS, GAME_HEIGHT, { isStatic: true, render: renderWall }),

    character
  ]);

  // // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: GAME_WIDTH, y: GAME_HEIGHT },
  });
  

  let consecutiveJumps = 0
  let moving = ''
  let jumping = false
  function moveCharacter(direction: 'e' | 'w' | 'n' | 's') {    
    switch (direction) {
      case 'e':
        moving = 'e'
        break;
      case 'w':
        moving = 'w'
        break;
      case 'n':
        if (consecutiveJumps < 2) {
          jumping = true
          Body.setVelocity(character, { 
            ...character.velocity, 
            y: character.velocity.y - (11 - (consecutiveJumps + consecutiveJumps*2))
          });
          consecutiveJumps++;
        }
        break;
      case 's':
        Body.setVelocity(character, { 
          ...character.velocity,
          y: 50 
        });
        break; 
    }
  }

  function stopCharacter() {
    moving = ''
  }

  Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((collision) => {
      const collidingBodies = [collision.bodyA, collision.bodyB]
      
      // Reset jumps when character reaches ground
      if (matchBodies(collidingBodies, [character])) {
        consecutiveJumps = 0
        jumping = false
      }

      for (const project of projects) {
        if (matchBodies(collidingBodies, [project.body, character])) { 
          project.onCollision()
        }
      }

    });
  });

  let shiftX = 0
  Events.on(runner, 'beforeTick', (event) => {
    const newShiftX = clamp(0, character.position.x - windowWidth/2, GAME_WIDTH - windowWidth)
    if (newShiftX !== shiftX) {
      onBackgroundMove(newShiftX)
      shiftX = newShiftX
    }
    Bounds.shift(render.bounds, {
      x: newShiftX,
      y: 0
    });

    if (Math.round(character.velocity.x) > 0) {
      if (jumping) {
        character.render.sprite!.texture = characterRight2
      } else {
        character.render.sprite!.texture = CHARACTER_RIGHT_IMAGES[Math.round(character.position.x/30) % CHARACTER_RIGHT_IMAGES.length]
      }
    } else if (Math.round(character.velocity.x) < 0) {
      if (jumping) {
        character.render.sprite!.texture = characterLeft2
      } else {
        character.render.sprite!.texture = CHARACTER_LEFT_IMAGES[Math.round(character.position.x/30) % CHARACTER_LEFT_IMAGES.length]
      }
    }

    if (moving) {
      Body.setVelocity(character, { 
        ...character.velocity,
        x: (moving === 'e' ? -1 : 1) * 4,
      });
    }
  })

  function destroy() {
    Render.stop(render);
    Runner.stop(runner);
    render.canvas.remove();
    window.removeEventListener('resize', handleWindowResize)
  }

  return {
    moveCharacter,
    stopCharacter,
    destroy
  }
}

export function Game({ backgroundColor }: { backgroundColor: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [backgroundPos, setBackgroundPos] = useState({ x: 0 })
  const gameRef = useRef<ReturnType<typeof game>>()
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(WELCOME_ALERT)

  useEffect(() => {
    const elm = ref.current
    if (elm) {
      gameRef.current = game({
        elm, 
        onBackgroundMove: (x) => {
          setBackgroundPos({ x })
        },
        backgroundColor,
        createAlert: setAlertConfig
      })
      const { destroy, moveCharacter, stopCharacter } = gameRef.current

      window.addEventListener("keydown", e => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          moveCharacter('e');
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          moveCharacter('w');
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.code === 'Space') {
          moveCharacter('n');
        } else if (e.key === 'ArrowDown' || e.key === 's') {
          moveCharacter('s');
        }
      });

      window.addEventListener("keyup", e => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          stopCharacter();
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          stopCharacter();
        }
      });

      return () => {
        destroy()
        gameRef.current = undefined
      }
    }
  }, [backgroundColor])

  return (
    <>
      <div 
        ref={ref} 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: `${-backgroundPos.x}px bottom`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: `${BACKGROUND_IMAGE_WIDTH}px, ${BACKGROUND_IMAGE_HEIGHT}px`,
          position: 'fixed',
          bottom: 0
        }} 
      />
      <GamePad
        onArrowPress={direction => gameRef.current?.moveCharacter(direction)}
        onArrowRelease={() => gameRef.current?.stopCharacter()}
      />
      {alertConfig && (
        <Alert 
          title={alertConfig.title}
          msg={alertConfig.msg} 
          learnMore={alertConfig.learnMore}
          onClose={() => setAlertConfig(null)} 
        />
      )}
    </>
  )
}