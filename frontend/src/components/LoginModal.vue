<script setup lang="ts">
import { defineComponent, ref } from "vue";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const serverURL = import.meta.env.VITE_BACKEND_URL;

const username = ref("");
const password = ref("");
const loggedin = ref(false);

if (cookies.get("access_token") && cookies.get("refresh_token")) {
  loggedin.value = true;
}

const submitForm = async () => {
  const response = await fetch(`http://${serverURL}:8000/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });

  const data = await response.json();
  cookies.set("access_token", data.access);
  cookies.set("refresh_token", data.refresh);
  loggedin.value = true;
  window.location.reload();
};

const handleLogout = () => {
  cookies.remove("access_token");
  cookies.remove("refresh_token");
  loggedin.value = false;
  window.location.reload();
};

document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el: any) {
    $el.classList.add("is-active");
  }

  function closeModal($el: any) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  document.addEventListener("click", (event: any) => {
    const $trigger = event.target.closest(".js-modal-trigger");

    if ($trigger) {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);

      openModal($target);
    }
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });
});
</script>

<template>
  <div class="login-modal">
    <button
      v-if="loggedin === false"
      class="button js-modal-trigger"
      data-target="login-modal"
    >
      Login
    </button>
    <button v-else class="button" @click="handleLogout">Logout</button>
    <div id="login-modal" class="modal">
      <div class="modal-background"></div>

      <div class="modal-content">
        <div class="box">
          <h1 class="title">Login</h1>
          <form @submit.prevent="submitForm">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Username"
                  autofocus
                  v-model="username"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  class="input"
                  type="password"
                  placeholder="Password"
                  v-model="password"
                />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-link" type="submit">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <button class="modal-close is-large" aria-label="close"></button>
    </div>
  </div>
</template>

<style></style>
