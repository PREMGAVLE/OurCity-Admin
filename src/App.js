  import logo from "./logo.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Mainroute from "./routes/Mainroute";
import { useState } from "react";


function App() {
  const queryClient = new QueryClient();
  const token = localStorage.getItem("logintoken");
  // const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  // const expiry = payload ? new Date(payload.expiry * 1000) : null;
  // console.log(token)
  const [hide ,setHide]=useState(false)
  return (
    <div className="App no-select">
      <QueryClientProvider client={queryClient}>
      {/* {token && token.length > 0 ? (
        <>
          {" "}
          <Sidebar />
           
        </>
      ) : (
        <LoginRout />
      )} */}
      
     
      <Mainroute/>
      </QueryClientProvider>
    </div>
  );
}

export default App;
