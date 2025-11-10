import { mount } from 'svelte'
import './app.css'
// @ts-ignore - 忽略类型检查，确保运行时正常工作
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
