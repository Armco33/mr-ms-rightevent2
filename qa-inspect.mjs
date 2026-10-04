const tabs = await (await fetch("http://127.0.0.1:9222/json")).json();
const socket = new WebSocket(tabs[0].webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
await new Promise((resolve) => { socket.onopen = resolve; });
const send = (method, params = {}) => new Promise((resolve) => {
  const nextId = ++id;
  pending.set(nextId, resolve);
  socket.send(JSON.stringify({ id: nextId, method, params }));
});
const result = await send("Runtime.evaluate", {
  expression: `JSON.stringify({viewport: innerWidth, body: document.body.getBoundingClientRect().width, app: document.querySelector('.app-frame')?.getBoundingClientRect().toJSON(), page: document.querySelector('.page-content')?.getBoundingClientRect().toJSON(), header: document.querySelector('.page-header')?.getBoundingClientRect().toJSON(), layout: document.querySelector('.discover-layout')?.getBoundingClientRect().toJSON(), content: document.querySelector('.discover-layout > section')?.getBoundingClientRect().toJSON()})`,
  returnByValue: true,
});
console.log(result.result.result.value);
const capture = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
const { writeFile } = await import("node:fs/promises");
await writeFile("qa-live.png", Buffer.from(capture.result.data, "base64"));
await send("Browser.close");
setTimeout(() => process.exit(0), 300);
