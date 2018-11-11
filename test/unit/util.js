export function componentThrowErr (cm) {
  return () => {
    try {
      cm.$mount()
    } catch (err) {
      throw new Error('rethrow')
    }
  }
}