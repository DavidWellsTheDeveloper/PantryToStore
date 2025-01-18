<template>
    <div
        class="max-w-sm p-6 my-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-auto">
        <h2 class="text-3xl font-bold mb-6 whitespace-nowrap text-white mb-8 text-center">Login</h2>
        <input v-model="user.username" placeholder="Username"
            class="inline-block py-4 px-8 ml-10 mb-5 bg-cyan-100 hover:bg-teal-100 rounded-xl whitespace-nowrap"></input>
        <input v-model="user.password" placeholder="Password" type="password"
            class="inline-block py-4 px-8 ml-10 mb-5 bg-cyan-100 hover:bg-teal-100 rounded-xl whitespace-nowrap"></input>
        <button :click.prevent="login"
            class="inline-block py-4 px-8 mb-8 ml-10 bg-cyan-700 text-white hover:bg-teal-700 rounded-xl whitespace-nowrap">Login</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const user = ref({
    username: '',
    password: ''
});
const login = async () => {
    console.log("login")
}
</script>

<style scoped></style>