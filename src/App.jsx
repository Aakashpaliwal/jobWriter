import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";
import Header from "@/Header/Header";
import Body from "@/container/Body";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Body />
    </>
  );
}

export default App;
 