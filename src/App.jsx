import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/Header/Header";
import Body from "@/container/Body";
import Footer from "@/Footer/Footer";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    logEvent(analytics, "app_opened");
  }, []);

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
