import Grass from '../src'
import UserList from './root'
import testJson from './test.json'
import "./global.css"

localStorage.setItem('User', JSON.stringify(testJson))
Grass.mount(document.getElementById('root'), UserList)