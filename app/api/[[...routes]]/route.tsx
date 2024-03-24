/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/middlewares'
import { PinataFDK } from 'pinata-fdk'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import getExtendedNetwork from '@/app/lib/openrank'
import { createOrFindEmbeddedWalletForFid } from '@/app/lib/privy'
import {getAllCastsOfUser, getAllFollowersOfFID, getAllFollowingOfFID, getUserInformation} from '@/app/lib/pinata'
import { fetchAllFollowers, fetchAllFollowing } from '@/app/lib/neynar'
import { getAIResponse } from '@/app/lib/gptAI'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

const neynarMiddleware = neynar({
  apiKey: 'NEYNAR_FROG_FM',
  features: ['interactor', 'cast'],
})
const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT_ACCESS_TOKEN as string,
  pinata_gateway: process.env.PINATA_GATEWAY as string,
})

app.use(async (c, next) => {
  await next();
  const isFrame = c.res.headers.get("content-type")?.includes("html");
  if (isFrame) {
    let html = await c.res.text();
    const metaTag = '<meta property="of:accepts:xmtp" content="2024-02-01" />';
    html = html.replace(/(<head>)/i, `$1${metaTag}`);
    c.res = new Response(html, {
      headers: {
        "content-type": "text/html",
      },
    });
  }
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', fdk.analyticsMiddleware({
  frameId: '2822',
  customId: 'my-custom-id',
}), (c) => {
  const {status} = c
  // console.log("--------Currently on / url---------")
  // console.log("--------Data at /---------", c)
  // console.log('status', status)
  return c.res({
    action: '/find',
    image: '/FarConversations-GetStarted.jpg',
    intents: [
      <Button value="get-started">Get Started</Button>,
    ],
  })
})



app.frame('/find', neynarMiddleware, (c) => {
  const { buttonValue, inputText, status } = c
  const { displayName, fid } = c.var.interactor || {}
  console.log("--------Currently on /find url---------")
  console.log('interactor: ', c.var.interactor)

  // async function getFonts() {
  //   const fontFamily = await fetch(
  //     new URL('/assets/SF-Pro-Rounded-Bold.otf', import.meta.url),
  //   ).then((res) => res.arrayBuffer());
  // }
  // getFonts();

  async function choresOnFindFrame(){
    const createEmbeddedWalletAddress = await createOrFindEmbeddedWalletForFid(c.var.interactor?.fid as number, c.var.interactor?.custodyAddress as string);
    // console.log('createEmbeddedWalletAddress', createEmbeddedWalletAddress)
    const userNameOfCurrentUser = c.var.interactor?.username;
    // console.log('userNameOfCurrentUser', userNameOfCurrentUser)
    const bioOfCurrentUser = c.var.interactor?.profile?.bio?.text;
    // console.log('bioOfCurrentUser', bioOfCurrentUser)
    // const allCastsOfCurrentUser = await getAllCastsOfUser(c.var.interactor?.fid as number);
    // console.log('allCastsOfCurrentUser', allCastsOfCurrentUser)
    // const aiResultsOnCurrentUser = await AIResultOnUser(bio, allCastsOfCurrentUser);
  }
  choresOnFindFrame();
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', height: '100%', width: '100%' }}>
        <img style={{position:'absolute', height: '100%', width: '100%'}} src='/FarConversations-Find.jpg' />
        <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '62px', fontWeight: 700, lineHeight: '120%', marginTop: '98px', marginLeft: '42px'}}>Hi {displayName},</p>
      </div>

    ),
    intents: [
      // <Button action='/enter-username' value="enter-username">Enter Username</Button>,
      <Button action='/someone' value="find-someone">Find Someone</Button>,
    ],
  })
})

app.frame('/someone', neynarMiddleware, async (c) => {
  const {buttonValue, inputText, status } = c
  const someoneInformation = await choresOnSomeoneFrame()
  async function choresOnSomeoneFrame(){
    try {
      const extendedNetwork: any = await getExtendedNetwork(c.var.interactor?.fid as number);
      const randomlySelectedFromExtendedNetwork = extendedNetwork[Math.floor(Math.random() * extendedNetwork.length)]
      const someoneFID: number =  randomlySelectedFromExtendedNetwork.fid as number;
      const someoneInformation = await getUserInformation(someoneFID);
      const currentUserFollowers = await getAllFollowersOfFID(c.var.interactor?.fid as number);
      const someoneFollowing = await getAllFollowingOfFID(someoneFID);
      // console.log('currentUserFollowers', currentUserFollowers)
      // console.log('someoneFollowing', someoneFollowing)
      const mutualConnections: [] = currentUserFollowers.filter((follower: any) =>
        someoneFollowing.some((following: any) => following.fid === follower.fid)
      );
      const keepProp=(arr: [], keepProp: any)=>arr.map(o=>Object.fromEntries(keepProp.map((n: string | number)=>[n,o[n]])));
      const mutualConnectionsFiltered = keepProp(mutualConnections, ['username'])
      const combinedUsernames = mutualConnectionsFiltered.length?mutualConnectionsFiltered.slice(0, 12).map(obj => obj.username).join(', '): 'none'
      someoneInformation.combinedUsernames = combinedUsernames;

      return someoneInformation
    }
    catch (error) {
      console.log(error)
    }
  }
  console.log(someoneInformation)
  const pfpURLSomeone = someoneInformation?.pfp_url;
  console.log(pfpURLSomeone)
  const displayNameSomeone = someoneInformation?.display_name;
  const bioSomeone = someoneInformation?.bio;
  const fidSomeone = someoneInformation?.fid;
  const usernameSomeone = someoneInformation?.username;
  const urlSomeone = 'https://warpcast.com/'+usernameSomeone
  const combinedUsernames = someoneInformation?.combinedUsernames;

  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', height: '100%', width: '100%' }}>
        <img style={{position:'absolute', height: '100%', width: '100%'}} src='/FarConversations-Someone.jpg' />
        <div style={{display:'flex', flexDirection: 'column', position: 'absolute', top: '130px', left: '42px'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '36px'}}>
            <div style={{display: 'flex', width: '240px', height: '240px', backgroundColor: 'white', borderRadius: '50%', overflow: 'hidden'}}>
              <img style={{objectFit: 'cover'}} src={pfpURLSomeone} />
            </div>
            <div style={{display: 'flex', flexDirection:'column', alignItems:'flex-start', marginLeft: '64px'}}>
              <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '54px', fontWeight: 700, marginBottom:'-8px'}}>{displayNameSomeone}</p>
              <div style={{display:'flex', maxWidth: '600px'}}>
                <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '28px', fontWeight: 400}}>{bioSomeone}</p>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '28px', marginBottom: '-8px', opacity: 0.6}}>Potential warm connects b/w {displayNameSomeone} and you include:</p>
            <div style={{display:'flex', maxWidth: '900px'}}>
              <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '28px'}}>{combinedUsernames}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button action='/someone' value="re-find-someone">Re-find</Button>,
      <Button action={`/farconversation?somoneInformation=${someoneInformation}`} value={`${fidSomeone}`}>FarConversation</Button>,
      <Button.Link href={urlSomeone}>{usernameSomeone}</Button.Link>,
      // <Button action='/find' value='find'>Start Over</Button>,
    ],
  })
})



app.frame('/farconversation', async (c) => {
  const { buttonValue, inputText, status } = c
  const someoneInformation = await getUserInformation(parseInt(buttonValue as string));
  console.log(someoneInformation)
  const pfpURLSomeone = someoneInformation?.pfp_url;
  const displayNameSomeone = someoneInformation?.display_name;
  const bioSomeone = someoneInformation?.bio;
  const usernameSomeone = someoneInformation?.username;
  const urlSomeone = 'https://warpcast.com/'+usernameSomeone;

  const aiResponse = await choresForSomeoneFrame();
  async function choresForSomeoneFrame(){
    try{
      const allCastsOfSomeone = await getAllCastsOfUser(parseInt(buttonValue as string));
      const filteredCasts = allCastsOfSomeone.filter((cast: { parent_hash: null }) => cast.parent_hash === null);
      const extractedContents = filteredCasts.map((cast: { content: any }) => ({content: cast.content,}))
      const combinedContent: String = extractedContents.map((obj: { content: any }) => obj.content).join(', ');
      console.log(combinedContent)
      const promptText = `Here is a bio for someone along with everything that this person is talking about lately seperated by commas: ${combinedContent}. Please elp me with a object in response which has 2 key value properties. The first one is what are the likes of ${displayNameSomeone} and second key value is, what a good conversational starter with ${displayNameSomeone} would be, based on everything that you have consumed in terms of content`
      const aiResponse = await getAIResponse(promptText);
      console.log(aiResponse)
      // aiResponse.likesOfSomeone
      // aiResponse.firstConversationStarterOfSomeone
      return aiResponse
    }
    catch(error) {
      console.log(error)
    }
  }

  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', height: '100%', width: '100%' }}>
        <img style={{position:'absolute', height: '100%', width: '100%'}} src='/FarConversations-Message.jpg' />
        <div style={{display:'flex', flexDirection: 'column', position: 'absolute', top: '130px', left: '42px'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '36px'}}>
            <div style={{display: 'flex', width: '120px', height: '120px', backgroundColor: 'white', borderRadius: '50%', overflow: 'hidden'}}>
              <img style={{objectFit: 'cover'}} src={pfpURLSomeone} />
            </div>
            <div style={{display: 'flex', flexDirection:'column', alignItems:'flex-start', marginLeft: '32px'}}>
              <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '42px', fontWeight: 700, marginBottom:'-8px'}}>{displayNameSomeone}</p>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '32px', marginBottom: '-8px', opacity: 0.6}}>A good conversation starter could be:</p>
            <div style={{display:'flex', maxWidth: '900px'}}>
              <p style={{fontFamily: 'SF-Pro-Rounded-Bold, -apple-system, sans-serif', fontSize: '32px'}}>{aiResponse}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Reset</Button.Reset>,
      <Button action='/farconversation' value="farconversation">Cast Message</Button>,
      <Button.Link href={urlSomeone}>{usernameSomeone}</Button.Link>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
