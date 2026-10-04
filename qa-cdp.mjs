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
const preferences = {
  name: "Demo Explorer",
  interests: ["Design", "Coffee", "Technology"],
  city: "Taipei",
  maxDistance: 20,
  vibes: ["Relaxed", "Social", "Hands-on"],
  maxPrice: 2000,
  freeOnly: false,
};
const expression = [
  `localStorage.setItem("nextplan.preferences.v1", ${JSON.stringify(JSON.stringify(preferences))})`,
  `localStorage.setItem("nextplan.saved.v1", ${JSON.stringify(JSON.stringify(["coffee-crawl-daan"]))})`,
  `localStorage.setItem("nextplan.skipped.v1", "[]")`,
  `localStorage.setItem("nextplan.checkins.v1", "[]")`,
].join(";");
await send("Runtime.evaluate", { expression });
await send("Browser.close");
setTimeout(() => process.exit(0), 500);
