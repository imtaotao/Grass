import Grass from '../../../src'

const Component = Grass.Component

describe('response state', () => {
	it('response data is normal', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({ a: 1 })
				this.template = '<div>{{a}}</div>'
			}
			beforeCreate () {
				const keys = Object.keys(this.state.__ob__)
				expect(keys.length).toBe(2)
				expect(this.state.__ob__.value).toBe(this.state)
				expect(keys.indexOf('dep') > -1).toBeTruthy()
				expect(keys.indexOf('value') > -1).toBeTruthy()
			}
			created () {
				expect(this.$el.textContent).toBe('1')
				this.state.a = 2
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('2')
				done()
			}
		}).mount()
	})
})