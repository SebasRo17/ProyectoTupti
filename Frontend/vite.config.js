import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    compress: true, // Habilita la compresión Gzip/Brotli
  },
  build: {
    rollupOptions: {
      external: [
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome'
      ],
      output: {
        manualChunks: undefined,
        compact: true,
        minifyInternalExports: true
      }
    },
    minify: 'terser', // Usa Terser para minificación
    brotliSize: true // Habilita reportes de tamaño Brotli
  }
})
