import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    base: 'http://thecultnft.xyz/',
    },
  plugins: [react()]
})
