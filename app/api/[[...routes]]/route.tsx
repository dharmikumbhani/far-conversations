/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  return c.res({
    action: '/find',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          'Welcome!'
        </div>
      </div>
    ),
    intents: [
      <Button value="get-started">Get Started</Button>,
    ],
  })
})



app.frame('/find', (c) => {
  const { buttonValue, inputText, status } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Selected: {buttonValue}
      </div>
    ),
    intents: [
      <Button action='/enter-username' value="enter-username">Enter Username</Button>,
      <Button action='/find-someone' value="find-someone">Find Someone</Button>,
    ],
  })
})

app.frame('/find-someone', (c) => {
  console.log(c);
  const { buttonValue, inputText, status } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Selected: {buttonValue}
      </div>
    ),
    intents: [
      <Button action='/find-someone' value="re-find-someone">Re-find someone</Button>,
      <Button action='/farconversation' value="farconversation">Farconversation</Button>,
      // <Button.Link href="https://google.com">Google</Button.Link>,
    ],
  })
})


app.frame('/farconversation', (c) => {
  const { buttonValue, inputText, status } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Selected: {buttonValue}
      </div>
    ),
    intents: [
      <Button action='/find-someone' value="re-find-someone">Re-find someone</Button>,
      <Button action='/farconversation' value="farconversation">Farconversation</Button>,
      <Button.Link href="https://google.com">Google</Button.Link>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
