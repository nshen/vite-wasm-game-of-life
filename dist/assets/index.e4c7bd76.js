let wasm;
const heap = new Array(32).fill(void 0);
heap.push(void 0, null, true, false);
function getObject(idx) {
  return heap[idx];
}
let heap_next = heap.length;
function dropObject(idx) {
  if (idx < 36)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
let cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
let cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
let WASM_VECTOR_LEN = 0;
let cachedTextEncoder = new TextEncoder("utf-8");
const encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}
function notDefined(what) {
  return () => {
    throw new Error(`${what} is not defined`);
  };
}
const Cell = Object.freeze({ Dead: 0, "0": "Dead", Alive: 1, "1": "Alive" });
class Universe {
  static __wrap(ptr) {
    const obj = Object.create(Universe.prototype);
    obj.ptr = ptr;
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_universe_free(ptr);
  }
  width() {
    var ret = wasm.universe_width(this.ptr);
    return ret >>> 0;
  }
  set_width(width) {
    wasm.universe_set_width(this.ptr, width);
  }
  height() {
    var ret = wasm.universe_height(this.ptr);
    return ret >>> 0;
  }
  set_height(height) {
    wasm.universe_set_height(this.ptr, height);
  }
  cells() {
    var ret = wasm.universe_cells(this.ptr);
    return ret;
  }
  toggle_cell(row, column) {
    wasm.universe_toggle_cell(this.ptr, row, column);
  }
  static new() {
    var ret = wasm.universe_new();
    return Universe.__wrap(ret);
  }
  render() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.universe_render(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  tick() {
    wasm.universe_tick(this.ptr);
  }
}
async function load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
async function init(input) {
  if (typeof input === "undefined") {
    input = "/vite-wasm-game-of-life/dist/assets/wasm_game_of_life_bg.wasm";
  }
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_alert_6cacd95f74a2a594 = function(arg0, arg1) {
    alert(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_59cb74e423758ede = function() {
    var ret = new Error();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
    try {
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm.__wbindgen_free(arg0, arg1);
    }
  };
  imports.wbg.__wbg_log_9a99fb1af846153b = function(arg0) {
    console.log(getObject(arg0));
  };
  imports.wbg.__wbg_time_8897e55ebee4075f = function(arg0, arg1) {
    console.time(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbg_timeEnd_6186a583833a7163 = function(arg0, arg1) {
    console.timeEnd(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbg_random_29218b0f217b2697 = typeof Math.random == "function" ? Math.random : notDefined("Math.random");
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  const { instance, module } = await load(await input, imports);
  wasm = instance.exports;
  init.__wbindgen_wasm_module = module;
  return wasm;
}
class FPS {
  constructor() {
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }
  render() {
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = 1 / delta * 1e3;
    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;
    this.fps.textContent = `
         Frames per Second: latest = ${Math.round(fps)}
        avg of last 100 = ${Math.round(mean)}
        min of last 100 = ${Math.round(min)}
        max of last 100 = ${Math.round(max)}
`.trim();
  }
}
init().then((raw) => {
  console.log("init wasm-pack", raw.memory);
  const fps = new FPS();
  const CELL_SIZE = 5;
  const GRID_COLOR = "#CCCCCC";
  const DEAD_COLOR = "#FFFFFF";
  const ALIVE_COLOR = "#000000";
  const universe = Universe.new();
  const width = universe.width();
  const height = universe.height();
  console.log("init wasm-pack", raw.memory);
  const canvas = document.getElementById("game-of-life-canvas");
  canvas.height = (CELL_SIZE + 1) * height + 1;
  canvas.width = (CELL_SIZE + 1) * width + 1;
  const ctx = canvas.getContext("2d");
  canvas.addEventListener("click", (event) => {
    const boundingRect = canvas.getBoundingClientRect();
    canvas.width / boundingRect.width;
    canvas.height / boundingRect.height;
    const canvasLeft = (event.clientX - boundingRect.left) * 1;
    const canvasTop = (event.clientY - boundingRect.top) * 1;
    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
    universe.toggle_cell(row, col);
    drawGrid();
    drawCells();
  });
  const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
    ctx.stroke();
  };
  const getIndex = (row, column) => {
    return row * width + column;
  };
  const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(raw.memory.buffer, cellsPtr, width * height);
    ctx.beginPath();
    ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col);
        ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;
        ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
      }
    }
    ctx.stroke();
  };
  const isPaused = () => {
    return animationId === null;
  };
  let animationId = null;
  const renderLoop = () => {
    fps.render();
    drawGrid();
    drawCells();
    universe.tick();
    animationId = requestAnimationFrame(renderLoop);
  };
  const playPauseButton = document.getElementById("play-pause");
  const play = () => {
    playPauseButton.textContent = "\u23F8";
    renderLoop();
  };
  const pause = () => {
    playPauseButton.textContent = "\u25B6";
    cancelAnimationFrame(animationId);
    animationId = null;
  };
  playPauseButton.addEventListener("click", (event) => {
    if (isPaused()) {
      play();
    } else {
      pause();
    }
  });
  play();
});
