<script lang="ts">
  import HomeIcon from "@lucide/svelte/icons/layout-dashboard";
  import ListIcon from "@lucide/svelte/icons/logs";
  import SettingsIcon from "@lucide/svelte/icons/settings";

  import { page } from "$app/state";
  import Logo from "$lib/components/logo.svelte";
</script>

<nav class="sidebar">
  <div class="logo"><Logo /></div>
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
    <li>
      <a
        class="nav-item"
        href="/settings"
        aria-label="Settings"
        aria-current={page.url.pathname === "/settings"}
      >
        <SettingsIcon class="icon" />
        <span>Settings</span>
      </a>
    </li>
  </ul>

  <div class="bottom"></div>
</nav>

<style>
  .sidebar {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 200px;
    height: 100vh;
    background-color: var(--sidebar);
    border: 1px var(--sidebar-border);
  }

  /* keep above content */
  .sidebar {
    z-index: 50;
  }

  .sidebar li {
    width: 100%;
  }

  .logo {
    width: 87px;
    height: 87px;
    margin-top: 10px;
    margin-bottom: 30px;
    margin-left: 15px;
    align-self: flex-start;
    color: var(--clr-primary-a0);
  }

  .nav-list {
    list-style: none;
    padding: 0;
    padding-left: 30px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
  }

  .nav-item {
    display: inline-flex;
    align-items: center;
    justify-content: left;
    height: 30px;
    border-radius: 0.75rem;
    text-decoration: none;
    font-size: 13pt;
  }

  .nav-item[aria-current="true"] {
    /*background: var(--clr-surface-a10);*/
    color: var(--clr-primary-a20);
  }

  .nav-item span {
    margin-left: 0.5rem;
  }

  .nav-item:hover {
    background: var(--muted-hover, rgba(0, 0, 0, 0.04));
    color: var(--clr-primary-a30);
  }

  .bottom {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
  }

  /* Responsive: on narrow screens move nav to bottom and hide labels/logo */
  @media (max-width: 799px) {
    .sidebar {
      position: fixed;
      top: auto;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 64px;
      flex-direction: row;
      justify-content: center;
      padding: 0;
    }

    .logo {
      display: none;
    }

    .nav-list {
      display: flex;
      flex-direction: row;
      align-items: center;

      padding-left: 0;
      gap: 8px;
      margin: 0;
      height: 100%;
      width: auto;
    }

    .nav-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      height: 48px;
      border-radius: 10px;
    }

    .nav-item span {
      display: none;
    }

    .bottom {
      display: none;
    }
  }
</style>
