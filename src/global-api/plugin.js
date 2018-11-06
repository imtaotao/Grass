const installedPlugins = []

export default function use (plugin, ...args) {
  if (!plugin || installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  args.unshift(this)

  if (typeof plugin === 'function') {
    plugin.apply(null, args)
  } else if (typeof plugin.init === 'function') {
    plugin.init.apply(plugin, args)
  }

  installedPlugins.push(plugin)
  return this
}