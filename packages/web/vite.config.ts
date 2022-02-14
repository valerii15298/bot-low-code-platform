import graphql from "@rollup/plugin-graphql";
import { defineConfig, loadEnv } from "vite";
import ViteFonts from "vite-plugin-fonts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // console.log(process.env.WEB_BASE_APP_PATH);
  process.env = { ...process.env, ...loadEnv(mode, "../../", "") };

  return defineConfig({
    base: process.env.BASE_WEB_APP_PATH,
    plugins: [
      graphql(),
      ViteFonts({
        google: {
          families: ["Roboto"],
        },
      }),
      react(),
    ],
    envDir: "../../",
    server: {
      port: 4000,
    },
  });
};
// @ts-ignore
// console.log(import.meta.env);
