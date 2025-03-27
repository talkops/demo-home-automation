import { Extension, Parameter } from 'talkops'
import update_lights from './schemas/functions/update_lights.json' with { type: 'json' }

const states = new Map()

const names = new Parameter('LIGHT_NAMES')
  .setDescription('The names of the lights.')
  .setDefaultValue('Desk lamp,Bedroom ceiling light')

const extension = new Extension()
  .setName('Home Automation')
  .setIcon('https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678078-light-bulb-512.png')
  .setCategory('Demo')
  .setFeatures(['Turn on/off virtual lights'])
  .setParameters([names])
  .setFunctionSchemas([update_lights])
  .setFunctions([
    function update_lights(names, action) {
      for (const name of names) {
        states.set(name, action)
      }
      return 'Done.'
    },
  ])
  .setBootstrap(loop)

function loop() {
  const lights = []
  for (const name of names.getValue().split(',')) {
    if (!states.has(name)) states.set(name, 'off')
    lights.push(`"${name}" (${states.get(name)})`)
  }
  extension.setInstructions(
    `You are a home automation assistant, you can manage the lights: ${lights.join(', ')}.`,
  )
  setTimeout(loop, 1000)
}
