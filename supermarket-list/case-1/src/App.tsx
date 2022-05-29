import type {Item} from "./types";

import {useEffect, useState} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState(""); // TO DO - typed state ... or is it done under the hood?

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) => (item.id === id ? {...item, completed: !item.completed} : item)),
    );
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newItem = {
      id: 1, // fix unique id
      text: "Tombola", // read value entered by user
      completed: false,
    };

    const updatedItems = [];

    updatedItems.push(newItem, ...items);

    setItems(updatedItems);
    setInputValue("");
  }

  function handleInputChange(event: React.ChangeEvent<Form>) {
    setInputValue(event.target.value);
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api.list().then(setItems);
  }, []);

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onChange={handleInputChange} onSubmit={handleAdd}>
        <input defaultValue={inputValue} name="text" type="text" />
        <button>Add</button>
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
    </main>
  );
}

export default App;
