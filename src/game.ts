import { Statue } from './statue'
import { statues, blocked } from './puzzleBuilder'

// Base
const base = new Entity()
base.addComponent(new GLTFShape('models/base.glb'))
engine.addEntity(base)

const room = new Entity()
room.addComponent(new GLTFShape('models/room.glb'))
engine.addEntity(room)

// Instance the input object
const input = Input.instance
const MAX_DISTANCE = 4

// Button down event
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, (e) => {
  if (e.hit.meshName === 'statue_collider') {
    const statue = engine.entities[e.hit.entityId] as Statue
    const statuePos = statue.getComponent(Transform).position
    const distance = Vector3.Distance(statuePos, Camera.instance.position)
    if (distance < MAX_DISTANCE) {
      const currentPos = statue.getComponent(Transform).position
      const endPos = currentPos.subtract(e.hit.normal.multiplyByFloats(2, 2, 2))

      // Checks if anything is blocking the statue's path
      const isOverlapped = statues.some((statue) => {
        return endPos.equals(statue.getComponent(Transform).position)
      })
      const isBlocked = blocked.some((block) => {
        return endPos.equals(block)
      })

      // Check boundaries
      if (
        endPos.x >= 4 &&
        endPos.x <= 12 &&
        endPos.z >= 1 &&
        endPos.z >= 5 &&
        endPos.z <= 11 &&
        !isOverlapped &&
        !isBlocked
      ) {
        statue.moveStatue(currentPos, endPos)
      }
    }
  }
})
