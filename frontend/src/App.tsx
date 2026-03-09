import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type UserType = {
  userId: string;
  message: string;
  username: string;
};

const userRegistered = "user:register";
const chatMessage = "chat:message";

function App() {
  const [messages, setMessages] = useState<UserType[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on(chatMessage, (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on(userRegistered, (user) => {
      alert(`Usuário ${user} registrado com sucesso.`);
    });

    return () => {
      socket.off(chatMessage);
      socket.off(userRegistered);
    };
  }, []);

  const sendMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit(chatMessage, input);
    setInput("");
  };

  const handleRegisterUser = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit(userRegistered, username);
    setUsername("");
  };

  return (
    <div>
      <h3>Registrar usuário: </h3>

      <form onSubmit={handleRegisterUser}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <button>set user</button>
      </form>

      <h3>Mensagens: </h3>
      <ul>
        {messages.map((data, i) => (
          <li key={i}>
            {data.username}: {data.message}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button>send</button>
      </form>
    </div>
  );
}

export default App;
