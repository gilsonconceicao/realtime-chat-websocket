import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
console.log('socket', socket)
  useEffect(() => {
    if (socket.connected === true) {
      socket.on("chat message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("chat message");
      };
    } 
  }, []);

  const sendMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("chat message", input);
    setInput("");
  };


  return (
    <div>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>

      <form onSubmit={sendMessage}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button>Send</button>
      </form>

      {socket.disconnected && <ServerIsNotConnected />}
    </div>
  );
}

const ServerIsNotConnected = () => {
  return <div>Websocket está fora do ar</div>;
};

export default App;
