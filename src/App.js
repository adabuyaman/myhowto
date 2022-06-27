import Dashboard from './pages/home/Home';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from './pages/login/Login';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from 'react';
import LoadingPage from './components/LoadingPage/LoadingPage';
import "./App.css";

const auth = getAuth();

function App() {
  const [isAuhenticated, setIsAuhenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  onAuthStateChanged(auth, (user) => {
    console.log('state changed!', user);
    setIsAuhenticated(!!user);
    setIsLoading(false);
  });

  if (isLoading)
    return <LoadingPage />

  if (isAuhenticated)
    return (
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  else return (
    <Login />
  )
}

export default App;
