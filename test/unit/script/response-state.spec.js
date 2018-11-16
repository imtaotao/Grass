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
		}).$mount()
	})

	it('object attribute changed', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					a: { i: 1 },
					b: { j: 2 },
				})
				this.template = '<div>{{a.i}}{{b.j}}</div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.a.i = 2
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('22')
				done()
			}
		}).$mount()
	})

	it('array changed', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr = [1, 1]
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('11')
				done()
			}
		}).$mount()
	})

	it('object chenged', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					obj: {
						a: 1,
						b: 2,
					},
				})
				this.template = '<div><span v-for="val of obj">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.obj = { a: 1 }
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('1')
				done()
			}
		}).$mount()
	})

	it('array item changed', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr[0] = 2
				setTimeout(() => {
					expect(this.$el.textContent).toBe('12')
					done()
				})
			}
		}).$mount()
	})

	it('array push', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr.push(3)
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('123')
				done()
			}
		}).$mount()
	})

	it('array pop', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr.pop()
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('1')
				done()
			}
		}).$mount()
	})

	it('array shift', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr.shift()
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('2')
				done()
			}
		}).$mount()
	})

	it('array unshift', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr.unshift(0)
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('012')
				done()
			}
		}).$mount()
	})

	it('array splice', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr.splice(0, 1, 2)
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('22')
				done()
			}
		}).$mount()
	})

	it('array sort', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 3, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('132')
				this.state.arr.sort()
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('123')
				done()
			}
		}).$mount()
	})

	it('array sort', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					arr: [1, 2],
				})
				this.template = '<div><span v-for="val of arr">{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('12')
				this.state.arr.reverse()
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('21')
				done()
			}
		}).$mount()
	})

	it('state set', done => {
		let isComplete = false;
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					obj: {
						a: 1,
						b: 2,
					},
				})
				this.template = '<div><span v-for="(val, key) of obj">{{key}}{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('a1b2')
				this.set(this.state.obj, 'c', 3)
			}
			didUpdate () {
				if (!isComplete) {
					expect(this.$el.textContent).toBe('a1b2c3')
					this.state.obj.c = 4
					isComplete = true
					setTimeout(() => {
						expect(this.$el.textContent).toBe('a1b2c4')
						done()
					})
				}
			}
		}).$mount()
	})

	it('complex state set', done => {
		let isComplete = false;
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					obj: {
						t: 't',
						c: {
							a: 1,
							b: 2,
						},
					},
				})
				this.template = '<div><span v-for="(val, key) of obj.c">{{key}}{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('a1b2')
				this.set(this.state.obj.c, 'c', 3)
			}
			didUpdate () {
				if (!isComplete) {
					expect(this.$el.textContent).toBe('a1b2c3')
					this.state.obj.c.c = 4
					isComplete = true
					setTimeout(() => {
						expect(this.$el.textContent).toBe('a1b2c4')
						done()
					})
				}
			}
		}).$mount()
	})

	it ('state delete', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					obj: {
						a: 1,
						b: 2,
						c: 3,
					},
				})
				this.template = '<div><span v-for="(val, key) of obj">{{key}}{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('a1b2c3')
				this.delete(this.state.obj, 'c')
			}
			didUpdate () {
				expect(this.$el.textContent).toBe('a1b2')
				done()
			}
		}).$mount()
	})

	it('state set after delete and then set', done => {
		(class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					obj: {
						t: 't',
						c: {
							a: 1,
							b: 2,
						},
					},
				})
				this.template = '<div><span v-for="(val, key) of obj.c">{{key}}{{val}}</span></div>'
			}
			created () {
				expect(this.$el.textContent).toBe('a1b2')
				this.set(this.state.obj.c, 'c', 3)
				Promise.resolve().then(() => {
					expect(this.$el.textContent).toBe('a1b2c3')
					this.state.obj.c.c = 4
				})
				.then(() => {
					expect(this.$el.textContent).toBe('a1b2c4')
					this.delete(this.state.obj.c, 'c')
				})
				.then(() => {
					expect(this.$el.textContent).toBe('a1b2')
					this.set(this.state.obj.c, 'c', 5)
				})
				.then(() => {
					expect(this.$el.textContent).toBe('a1b2c5')
					done()
				})
			}
		}).$mount()
	})

	it('aviod repeat dependency collection', done => {
		class p extends Component {
			constructor () {
				super()
				this.createResponseState({
					obj: {
						a: 1,
						b: 2,
					},
				})
			}
			created () {
				this.set(this.state.obj, 'c', 3)
				setTimeout(() => {
					const subs = this.state.obj.__ob__.dep.subs
					const watcher = subs[0]
					expect(subs.length).toBe(1)
					expect(watcher.depIds.size).toBe(2)
					done()
				})
			}
			template () {
				return '<div><span v-for="val of obj">{{val}}</span></div>'
			}
		}
		const cm = p.$mount()
		const subs = cm.state.obj.__ob__.dep.subs
		const watcher = subs[0]
		expect(subs.length).toBe(1)
		expect(watcher.depIds.size).toBe(2)
	})
})