<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();

const formCreateUser = ref({
  fullName: "",
  userName: "",
  password: "",
});

const showPassword = ref(false);

const isLoading = ref(false); // Loading state
const error = ref(""); // Error message state

const register = async () => {
  // Clear previous errors
  error.value = "";

  // Form validation
  if (
    !formCreateUser.value.fullName ||
    !formCreateUser.value.userName ||
    !formCreateUser.value.password
  ) {
    error.value = "All fields are required.";
    return;
  }

  isLoading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 500));
    userStore.createUser(formCreateUser.value);
    router.push("/login");
    formCreateUser.value.fullName = "";
    formCreateUser.value.userName = "";
    formCreateUser.value.password = "";
  } catch (e) {
    error.value = "An error occurred while registering.";
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
  >
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-cyan-500">
          Create Your Note Account
        </h1>
        <p class="text-cyan-700 mt-2">Fill in the form to sign up</p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
        <p>{{ error }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="register" class="space-y-5">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            v-model="formCreateUser.fullName"
            type="text"
            placeholder="full name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            User name
          </label>
          <input
            v-model="formCreateUser.userName"
            type="text"
            placeholder="username"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div class="relative">
            <input
              v-model="formCreateUser.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              <!-- Eye open -->
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>

              <!-- Eye closed -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.97 10.97 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.97 10.97 0 012.184-3.184M1 1l22 22"
                />
                <path d="M10.58 10.58a3 3 0 104.84 4.84" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Button -->
        <button
          type="submit"
          class="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
          :disabled="isLoading"
        >
          <svg
            v-if="isLoading"
            class="w-5 h-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              stroke-width="4"
            />
          </svg>

          <span>{{ isLoading ? "Signing Up..." : "Sign Up" }}</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-600">
        Already have an account?
        <router-link
          to="/login"
          class="text-cyan-600 font-medium hover:underline"
        >
          Login
        </router-link>
      </div>
    </div>
  </div>
</template>
