import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/main.jsx'],
            // input: ['public/build/assets/app.f7c94572.css', 'public/build/assets/main.5bff8757.css', 'public/build/assets/main.9eced995.js'],
            refresh: true,
        }),
    ],
});
