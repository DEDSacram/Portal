import { Component, createEffect, createSignal } from "solid-js";
import { useForm } from "..//helper/useForm";
import FormControl from "@suid/material/FormControl";
import Button from "@suid/material/Button";
import FormGroup from "@suid/material/FormGroup";
import Box from '@suid/material/Box';
import TextField from "@suid/material/TextField";
import { useNavigate } from '@solidjs/router';
const Login: Component = () => {
  const { form, updateFormField, submit } = useForm();
  const [loading, setLoading] = createSignal(false)
  const navigate = useNavigate();
  const rese = async () => {
    await fetch('http://127.0.0.1:8000/auth/refresh_token', {
    method: 'GET',
    credentials: "include"
  }).then((response) => (response) ?response.json(): console.log("token failed"))
  .then((data) => data.code == '200' ? navigate("/portal/accept", { replace: true }) : navigate("/login", { replace: true }))
  }
  const check = async () => {
    await fetch('http://127.0.0.1:8000/auth/check', {
    method: 'GET',
    credentials: "include",
    headers: {
      'Access-Control-Request-Headers': 'Location',
      'Content-Type': 'text/html',
    },
  }).then((response) => (response.ok) ? navigate("/portal/accept", { replace: true }) : rese())
  }
  check()

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    const data = submit(form);
    ////In Memory access token
    // const rese = async (data: any) => {
    //   console.log(data.token)
    //   await fetch('http://127.0.0.1:8000/auth/refresh_token', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + data.token
    //   },
    //   credentials: "include"
    // }).then((response) => (response) ?response.json(): console.log("failed"))
    // .then((data) => console.log(data))
    // }

    // const rese = async () => {
    //   await fetch('http://127.0.0.1:8000/auth/refresh_token', {
    //   method: 'GET',
    //   credentials: "include"
    // }).then((response) => (response) ?response.json(): console.log("failed"))
    // .then((data) => console.log(data))
    // }
    // rese()

    setLoading(true)
    const res = async () => {
      return await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(data),
      }).then((response) => (response) ? response.json() : console.log("failed"))
        .then((data) => (data.code == 200) && navigate("/portal/accept", { replace: true }))

    }
    res()
    // const reset = async () => {
    //   await fetch('http://127.0.0.1:8000/logout', {
    //   method: 'GET',
    //   credentials: "include"
    // }).then((response) => (response) ?response.json(): console.log("failed"))
    // .then((data) => console.log(data))
    // }
    // reset()

    // const fetchUser = async () =>
    // (await fetch(`http://127.0.0.1:8000/test`,{method: 'GET'}).then(result => console.log('Result ', result.json())) 
    // .catch(error => console.log('This is Error message -', error)));
    // fetchUser()
    // const fetchUser = async () =>
    // (await fetch(`http://127.0.0.1:8000/logout`,{method: 'GET',credentials: "include"}).then(result => console.log('Result ', result.json())) 
    // .catch(error => console.log('This is Error message -', error)));
    // fetchUser()
  };

  // createEffect(() => {
  //   if (form.sameAsAddress) {
  //     clearField("shippingAddress");
  //   }
  // });

  return (

    <Box sx={{ p: 2,backgroundColor: "white", width: '40%' }}>
      <h1>Přihlášení</h1>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl sx={{ padding: '20px' }}>
            <TextField type="text"
              id="username"
              value={form.username}
              label="Jméno" variant="filled"
              onChange={updateFormField("username")} aria-describedby="my-helper-text" required />
          </FormControl>
          <FormControl sx={{ padding: '20px' }}>
            <TextField type="password"
              id="password"
              value={form.password}
              label="Heslo" variant="filled"
              onChange={updateFormField("password")} aria-describedby="my-helper-text" required />
          </FormControl>
        </FormGroup>
        <br />
        <Button type="submit" variant="contained" fullWidth>Přihlásit</Button>
      </form>
    </Box>
  );
};
export default Login