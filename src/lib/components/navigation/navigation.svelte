<script lang="ts">
  import HomeIcon from "@lucide/svelte/icons/layout-dashboard";
  import ListIcon from "@lucide/svelte/icons/logs";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import logo from "$lib/assets/logo.svg";

  import { page } from "$app/state";
</script>

<nav class="sidebar">
  <img src={logo} alt="AuthLock Logo" class="logo" />
  <ul class="nav-list">
    <li>
      <a
        class="nav-item"
        href="/"
        aria-label="Home"
        aria-current={page.url.pathname === "/"}
      >
        <HomeIcon class="icon" />
        <span>Dashboard</span>
      </a>
    </li>
    <li>
      <a
        class="nav-item"
        href="/logs"
        aria-label="Log"
        aria-current={page.url.pathname === "/logs"}
      >
        <ListIcon class="icon" />
        <span>Logs</span>
      </a>
    </li>
  </ul>

  <div class="bottom">
    <a
      class="nav-item"
      href="/settings"
      aria-label="Settings"
      aria-current={page.url.pathname === "/settings"}
    >
      <SettingsIcon class="icon" />
      <span>Settings</span>
    </a>
  </div>
</nav>

<style>
  .sidebar {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 150px;
    height: 100vh;
    background-color: var(--sidebar);
  }

  .sidebar li {
    width: 100%;
  }

  .logo {
    width: 87px;
    height: 87px;
    margin-top: 10px;
    margin-bottom: 20px;
    align-self: flex-start;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    padding-left: 10px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
  }

  .nav-item {
    display: inline-flex;
    align-items: center;
    justify-content: left;
    height: 30px;
    border-radius: 0.75rem;
    text-decoration: none;
  }

  .nav-item[aria-current="true"] {
    background: var(--clr-surface-a10);
    color: var(--clr-primary-a20);
  }

  .nav-item span {
    margin-left: 0.5rem;
  }

  .nav-item:hover {
    background: var(--muted-hover, rgba(0, 0, 0, 0.04));
    color: var(--clr-primary-a30);
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .bottom {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
  }
</style>
