// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// console.log('Loading Vite config with proxy settings...');

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // server: {
//   //   proxy: {
//   //     '/api': {
//   //       target: 'http://127.0.0.1:5000',
//   //       changeOrigin: true,
//   //       // rewrite: (path) => path.replace(/^\/api/, ''),
//   //     }
//   //   }
//   // }
//   // server: {
//   //   proxy: {
//   //     '/api': {
//   //       target: 'http://localhost:5000',
//   //       changeOrigin: true,
//   //       // rewrite: (path) => path.replace(/^\/api/, ''),
//   //     }
//   //   }
//   // }
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://127.0.0.1:5000',
//         changeOrigin: true,
//         // No rewrite if your Flask backend expects /api prefix
//         // Print log when proxy is accessed
//         configure: (proxy) => {
//           // Simple logging that won't cause TypeScript issues
//           proxy.on('error', () => {
//             console.log('Proxy error occurred')
//           })
//         }
//       }
//     },
//     // Force Vite to write more detailed logs
//     hmr: {
//       overlay: false
//     }
//   }
// })



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000'
    }
  }
})