import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './app/providers.tsx'
import './index.css'
import App from './App.tsx'

const prepare = async () => {
  const { worker } = await import('./lib/msw/browser.ts')

  await worker.start()
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>
  )
})
