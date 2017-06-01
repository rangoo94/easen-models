/* global describe, it */

const expect = require('expect.js')

describe('Index', () => {
  it('should not throw any error', () => {
    expect(() => require('../src/index')).to.not.throwError()
  })

  it('should correctly check raw value of model', () => {
    const { createModel, raw } = require('../src/index')

    const Model = createModel({
      some: x => x
    })

    const instance = new Model({ some: 'thing' })
    const data = raw(instance)

    expect(instance).to.eql(data)
    expect(data).not.to.be.a(Model)
    expect(data).to.be.an('object')
  })
})
