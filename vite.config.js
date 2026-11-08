import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // The SSR bundle is only used to generate static HTML; don't copy public assets twice.
  publicDir: isSsrBuild ? false : 'public',
  // Bundle browser-only animation libraries into the SSR build so the
  // prerender step can import them in plain Node without ESM interop errors.
  ssr: {
    noExternal: ['gsap', 'lenis', 'lucide-react'],
  },
}))
