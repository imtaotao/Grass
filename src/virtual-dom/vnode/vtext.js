import version from './version'

export default function VirtualText(text) {
  this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = 'VirtualText'