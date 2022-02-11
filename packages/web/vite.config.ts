import graphql from "@rollup/plugin-graphql";
import { defineConfig } from "vite";
import ViteFonts from "vite-plugin-fonts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/web/",
  plugins: [
    graphql(),
    ViteFonts({
      google: {
        families: ["Roboto"],
      },
    }),
    react(),
  ],
  server: {
    port: 4000,
    host: true,
    // // change this for docker forwarding ports in dev mode
    // hmr: {
    //   port: 4000,
    //   clientPort: process.env.NODE_ENV === "production" ? 8081 : 4000,
    // },
  },
});

console.log(process.env.NODE_ENV);
