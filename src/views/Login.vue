<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
  >
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-cyan-500">Welcome</h1>
        <p class="text-cyan-700 mt-2">Sign in to manage your notes</p>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="bg-red-100 text-red-700 p-3 rounded-lg mb-5 text-sm"
      >
        {{ error }}
      </div>

      <form @submit.prevent="login" class="space-y-5">
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            User Name
          </label>
          <input
            v-model="username"
            @input="clearError"
            type="text"
            placeholder="username"
            :class="inputClass(usernameError)"
          />
          <p v-if="usernameError" class="text-red-500 text-xs mt-1">
            Username is required
          </p>
        </div>

        <!-- Password with Eye -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div class="relative">
            <input
              v-model="password"
              @input="clearError"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :class="inputClass(passwordError, true)"
            />

            <!-- Eye Button -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600"
            >
              <!-- Eye Open -->
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5
                     c4.478 0 8.268 2.943 9.542 7
                     -1.274 4.057-5.064 7-9.542 7
                     -4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>

              <!-- Eye Closed -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19
                     c-4.478 0-8.268-2.943-9.543-7
                     a9.965 9.965 0 012.47-4.192"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6.223 6.223A9.956 9.956 0 0112 5
                     c4.478 0 8.268 2.943 9.543 7
                     a9.966 9.966 0 01-4.298 5.774"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3l18 18"
                />
              </svg>
            </button>
          </div>

          <p v-if="passwordError" class="text-red-500 text-xs mt-1">
            Password is required
          </p>
        </div>

        <!-- Login -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
          <span>{{ isLoading ? "Signing in..." : "Sign In" }}</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-600">
        Do you have an existing account?
        <router-link
          to="/register"
          class="text-cyan-600 font-medium hover:underline"
        >
          Register?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const usernameError = ref(false);
const passwordError = ref(false);
const error = ref("");
const isLoading = ref(false);

const clearError = () => {
  error.value = "";
  usernameError.value = false;
  passwordError.value = false;
};

const inputClass = (hasError, hasIcon = false) => [
  "w-full px-4 py-3 border rounded-lg transition focus:outline-none focus:ring-2",
  hasIcon ? "pr-12" : "",
  hasError
    ? "border-red-500 focus:ring-red-500"
    : "border-grey-300 focus:ring-cyan-500",
];

const login = async () => {
  usernameError.value = !username.value;
  passwordError.value = !password.value;

  if (usernameError.value || passwordError.value) {
    error.value = "Please fill in all required fields";
    return;
  }

  isLoading.value = true;

  try {
    await new Promise((r) => setTimeout(r, 1000));
    await userStore.getUserByUserName(username.value);
    if(userStore.user.password===password.value.trim()){
      router.push("/note");
      return;
    }
    error.value ="Invalide Username and Password";
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};
</script>
