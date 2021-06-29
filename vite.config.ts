import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [wasmPack(["./wasm_game_of_life"])],
});
