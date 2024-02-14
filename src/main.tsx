import './index.css'

import { render } from 'preact'

// import { welcomeEmbed } from '../lib/main'
import App from './App.tsx'

render(<App />, document.getElementById('root')!)

// welcomeEmbed().mount(document.getElementById('welcomeEmbed')!)
