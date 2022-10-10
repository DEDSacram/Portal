import type { Component } from 'solid-js';
import { Routes, Route } from "@solidjs/router"

import UserGuard from './pages/userGuard';
import Login from './pages/login';
import Accept from './pages/accept';
import Logout from './pages/logout';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
      <Routes>
      <Route path="/login" component={Login} />
      <Route path="/portal" element={<UserGuard />}>
      <Route path="/accept" component={Accept} />
      </Route>
      <Route path="/logout" component={Logout} />
    </Routes>
      </header>
    </div>
  );
};

export default App;
