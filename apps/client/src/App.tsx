import { useEffect, useState } from "react";

import "./App.css";
import { sharedString } from "@repo/utils";
import trpc from "./trpc";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8787/")
      .then((res) => res.json())
      .then((data) => {
        setMessage(JSON.stringify(data));
      });

    const user = trpc.greetUser.query({
      name: "John",
    });

    user.then((data) => {
      setMessage(data.message);
    });
  }, []);

  return (
    <div>
      <h1>Vite + React + CF Workers</h1>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>

      <h3>The response from CF worker is: </h3>
      <p>{message}</p>

      <p>Shared string : {sharedString}</p>
    </div>
  );
}

export default App;
