import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // assetsInclude: ['**/*.html'], // Include .html files as assets
  base: '/', // Ensure the base path is correct for development
  server: {
   // Allow external access (e.g., via custom domain)
    port: 5173,      // Default Vite port
  },
  // server: {
  //   proxy: {
  //     '/': {
  //       target: 'http://localhost:5173', // Your server URL
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
