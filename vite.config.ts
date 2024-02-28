import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const hosts = ['localhost', '10.8.0.2', '192.168.100.10'];

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: hosts.join(','),
  },
});
