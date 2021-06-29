import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
  base: "/vite-wasm-game-of-life/dist/",
  build: {
    minify: false,
  },
  plugins: [wasmPack(["./wasm_game_of_life"])],
});
