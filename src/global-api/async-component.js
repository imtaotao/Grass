// Create async component.
export default function async (factory) {
  const options = Object.create(null)
  
  options.factory = factory
  options.async = true
  
  return options
}