import { Component,createEffect,createSignal,Show} from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Outlet } from '@solidjs/router';
const UserGuard: Component = () => {
    const [allow, setAllow] = createSignal(false)
    const navigate = useNavigate();
    const rese = async () => {
      await fetch('http://127.0.0.1:8000/auth/refresh_token', {
      method: 'GET',
      credentials: "include"
    }).then((response) => (response) ?response.json(): console.log("token failed"))
    .then((data) => data.code == '200' ? setAllow(true) : navigate("/login", { replace: true }))
    }
    const check = async () => {
      await fetch('http://127.0.0.1:8000/auth/check', {
      method: 'GET',
      credentials: "include",
    }).then((response) => {
      (response.ok) ?setAllow(true): rese()
    })
    }
    check()
    return (
      <Show when={allow()} fallback="Loading">
      <Outlet />
    </Show>
    );
  }

  export default UserGuard