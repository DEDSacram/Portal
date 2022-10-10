import {Component} from 'solid-js';
import { useNavigate } from '@solidjs/router';
const Logout: Component = () => {
  const navigate = useNavigate();
    const reset = async () => {
        await fetch('http://127.0.0.1:8000/logout', {
        method: 'GET',
        credentials: "include"
      }).then((response) => response.json())
      .then((data) => navigate("/login", { replace: true }))
      }
      reset()
    return (
        <h1>OUT</h1>
    );
  }

  export default Logout