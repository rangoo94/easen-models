const expect = require('expect.js')
const createModel = require('../src/create-model')
const symbols = require('../src/symbols')

const createError = () => new Error('some-error')
const notNull = x => {
  if (x === null) {
    throw createError()
  }

  return x
}

describe('Create model', () => {
  it('should create model class with no properties', () => {
    const Model = createModel({})

    expect(Model).to.be.a('function')
  })

  it('should allow to create instance of model class with no properties', () => {
    const Model = createModel({})
    const instance = new Model({})

    expect(instance).to.be.an('object')
  })

  it('should enumerate only these properties which were defined', () => {
    const Model = createModel({
      some: x => x
    })

    const instance = new Model({})

    expect(Object.keys(instance)).to.eql([ 'some' ])
  })

  it('should return raw data by Raw symbol', () => {
    const Model = createModel({
      some: x => x
    })

    const instance = new Model({
      some: 'data'
    })
    const raw = instance[symbols.Raw]

    expect(instance).to.eql(raw)
    expect(raw).not.to.be.a(Model)
    expect(raw).to.be.an('object')

    expect(instance.prototype).to.eql(raw.prototype)

    expect(Object.keys(instance)).to.eql([ 'some' ])
  })

  it('should throw error when validation failed', () => {
    const Model = createModel({
      some: notNull
    })

    expect(() => new Model({ some: null })).to.throwError()
    expect(() => new Model({ some: 'thing' })).to.not.throwError()

    try {
      new Model({ some: null })
    } catch (e) {
      expect(e.message).to.eql('Model thrown validation error: some')
      expect(e.name).to.eql('ModelValidationError')
    }
  })

  it('should throw more errors when validation failed', () => {
    const Model = createModel({
      some: notNull,
      thing: notNull
    })

    try {
      new Model({ some: null, thing: null })
    } catch (e) {
      expect(e.message).to.eql('Model thrown validation error: some, thing')
      expect(e.name).to.eql('ModelValidationError')
      expect(e.list).to.eql([
        { key: 'some', error: createError() },
        { key: 'thing', error: createError() }
      ])
    }
  })

  it('should correctly set up initial data', () => {
    const Model = createModel({
      some: Number
    })

    const instance = new Model({ some: '1' })

    expect(instance.some).to.equal(1)
    expect(instance[symbols.Raw].some).to.equal(1)
  })

  it('should correctly set up property dynamically', () => {
    const Model = createModel({
      some: Number
    })

    const instance = new Model({ some: '1' })

    instance.some = '10'

    expect(instance.some).to.equal(10)
    expect(instance[symbols.Raw].some).to.equal(10)
  })

  it('should throw error when validation failed (setting up property dynamically)', () => {
    const Model = createModel({
      some: notNull
    })

    const instance = new Model({ some: 'thing' })

    expect(() => {
      instance.some = null
    }).to.throwError()
  })
})
