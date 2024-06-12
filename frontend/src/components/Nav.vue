<script setup lang="ts">
import LoginModal from "./LoginModal.vue";
document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Add a click event on each of them
  $navbarBurgers.forEach((el) => {
    el.addEventListener("click", () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Check if $target exists before toggling the "is-active" class
      if ($target) {
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      }
    });
  });
});
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/"> DF Chronicles </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbar"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbar" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item"> Home </a>

        <a class="navbar-item"> Social </a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> Profile </a>

          <div class="navbar-dropdown">
            <a class="navbar-item"> My Stories </a>
            <a class="navbar-item"> Favorites </a>
            <a class="navbar-item"> Settings </a>
            <hr class="navbar-divider" />
            <a class="navbar-item"> Report an issue </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <LoginModal />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
