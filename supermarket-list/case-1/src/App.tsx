import type {Item} from "./types";

import {useEffect, useState} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const [loading, setLoading] = useState<Boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState(""); // TO DO - typed state ... or is it done under the hood?

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) => (item.id === id ? {...item, completed: !item.completed} : item)),
    );
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();

    const newItem = {
      id: Math.random(),
      text: inputValue,
      completed: false,
    };

    setItems([newItem, ...items]);
    setInputValue("");
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api.list().then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  return (
    <main className={styles.main}>
      {loading ? (
        <div className={styles.spinner} />
      ) : (
        <>
          <h1>Supermarket list</h1>
          <form onSubmit={handleAdd}>
            <input
              name="text"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button disabled={loading}>Add</button>
          </form>
          <ul>
            {items?.map((item) => (
              <li
                key={item.id}
                className={item.completed ? styles.completed : ""}
                onClick={() => handleToggle(item.id)}
              >
                {item.text} <button onClick={() => handleRemove(item.id)}>[X]</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;
