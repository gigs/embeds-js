# Porting Embed

## Usage

```ts
import { PortingEmbed } from '@gigs/gigs-embeds-js'

// Obtain a ConnectSession from your own backend
const connectSession = await fetchConnectSession()

const embed = await PortingEmbed(connectSession, { project: 'your-project' })
embed.mount(document.getElementById('gigsEmbedMount'))

// can also use a selector:
// embed.mount('#gigsEmbedMount')

// Here be more dragons

// ---
// index.html
<div id="gigsEmbedMount"></div>
```
