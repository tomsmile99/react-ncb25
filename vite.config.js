import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { ssr } from 'vite-plugin-ssr/plugin' 
// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(),
    // ssr({
    //   baseAssets: 'https://cdn.example.org/my-website-assets/'
    // })
  ],
  // base: 'https://appncar.sakerp.org/SAKCreditScoring/',
  base: 'https://ncb.sakerp.org/',
  // base: 'http://localhost:3003/SAKCreditScoring/', 
    // base:   import.meta.env.VITE_REACT_APP_BASE_MAIN, 

})



