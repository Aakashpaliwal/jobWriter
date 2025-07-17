import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/Header/Header";
import Body from "@/container/Body";
import Footer from "@/Footer/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header />
      <Body />
      <Footer />
    </>
  );
}

export default App;
