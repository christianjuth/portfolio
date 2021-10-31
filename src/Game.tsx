import { Engine, Render, Composite, Bodies, Runner, Body, Events, Bounds, World } from 'matter-js'
import { useEffect, useRef, useState } from 'react'
import backgroundImage from './assets/backgroundImage.jpeg'
import { GamePad } from './components/GamePad'

const GAME_WIDTH = 3000
const GAME_HEIGHT = 600
const WALL_THICKNESS = 1
const BACKGROUND_IMAGE_HEIGHT = 699/1.5
const BACKGROUND_IMAGE_WIDTH = 1000/1.5

/**
 * check if bodies match reguardless of order in array
 */
function matchBodies([refA,refB]: Body[], [a,b]: Body[]) {
  if (refA.id === a.id) {
    return refB.id = b.id
  } else if (refA.id === b.id) {
    return refB.id === a.id
  }
}

function clamp(min: number, val: number, max: number) {
  return Math.max(Math.min(val, max), min)
}

function game({
  elm,
  onBackgroundMove,
  backgroundColor
}: {
  elm: HTMLDivElement, 
  onBackgroundMove: (x: number) => any,
  backgroundColor: string
}) {
  let windowWidth = window.innerWidth
  function handleWindowResize() {
    windowWidth = window.innerWidth
  }
  window.addEventListener('resize', handleWindowResize)

  // create engine
  var engine = Engine.create(),
  world = engine.world;

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

  const character = Bodies.rectangle(200, 200, 50, 100, { frictionAir: 0.005, friction: 0.1, restitution: 0.05 })
  // lock rotation of character
  Body.setInertia(character, Infinity);

  const renderWall = {
    fillStyle: backgroundColor,
    lineWidth: 0
  }

  const ground = Bodies.rectangle(GAME_WIDTH/2, GAME_HEIGHT, GAME_WIDTH, WALL_THICKNESS, { isStatic: true, render: renderWall })
  // add bodies
  Composite.add(world, [
    // falling blocks
    // Bodies.rectangle(200, 100, 60, 60, { isStatic: true }),

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
          Body.setVelocity(character, { 
            ...character.velocity, 
            y: character.velocity.y - (5 - consecutiveJumps)
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
      if (matchBodies(collidingBodies, [ground, character])) {
        consecutiveJumps = 0
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

  useEffect(() => {
    const elm = ref.current
    if (elm) {
      gameRef.current = game({
        elm, 
        onBackgroundMove: (x) => {
          setBackgroundPos({ x })
        },
        backgroundColor
      })
      const { destroy, moveCharacter, stopCharacter } = gameRef.current

      window.addEventListener("keydown", e => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          moveCharacter('e');
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          moveCharacter('w');
        } else if (e.key === 'ArrowUp' || e.key === 'w') {
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
    </>
  )
}