// Create async component.
export default function async (factory, cb) {
  const options = Object.create(null)
  
  options.factory = factory
  options.async = true
  options.cb = cb
  
  return options
}