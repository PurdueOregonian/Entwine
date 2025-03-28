import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, './src/certs/local-dev.key')),
            cert: fs.readFileSync(path.resolve(__dirname, './src/certs/local-dev.crt')),
        },
        host: 'localhost',
        port: 5173
    },
  plugins: [react(), tailwindcss()]
})
