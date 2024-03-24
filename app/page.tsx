import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Image from 'next/image'

import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/farConversations.svg"
          alt="FarConversations Logo"
          width={400}
          height={37}
          priority
        />
      </div>
      <p>Helps you strike meaningful first conversations from people in your extended network</p>
      <p>Sign In with Farcaster + onchain messaging coming soon</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p>
          <a
            href="/api/dev"
            style={{ display: 'inline', fontWeight: 'semibold' }}
          >
            <code className={styles.code}>https://far-conversations.vercel.app/api</code>
          </a>{' '}
          is the frame endpoint.
        </p>
      </div>

      <div className={styles.grid}>
        <a
          href="https://github.com/dharmikumbhani/far-conversations"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Github <span>-&gt;</span>
          </h2>
          <p>Help Grow this</p>
        </a>
      </div>
    </main>
  )
}
