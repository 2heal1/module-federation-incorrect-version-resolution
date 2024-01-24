import TinyEmitter from 'tiny-emitter'

const emitter = new TinyEmitter()

emitter.on('hello', () => console.log('hello[root]'))
emitter.emit('hello')

import('buildNext/emitterNext').then(({ emitter }) => {
  emitter.emit('hello')
})