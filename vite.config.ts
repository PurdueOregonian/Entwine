import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, './src/certs/key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, './src/certs/cert.pem')),
        },
        host: 'localhost',
        port: 5173
    },
  plugins: [react()]
})
