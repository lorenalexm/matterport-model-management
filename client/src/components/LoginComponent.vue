<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const error = ref("");
const emits = defineEmits(["authenticated"]);
const endpoint = "https://matterport-model-management-server.myside.app/login";

async function onSubmit(event) {
	event.preventDefault();
	if(username.value == "" || password.value == "") {
		error.value = "Username and password are required";
		return;
	}

	const body = JSON.stringify({
		username: username.value,
		password: password.value,
	});

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: body
		});

		switch (response.status) {
			case 401: {
				error.value = "Invalid username or password";
				break;
			}

			case 200: {
				const data = await response.json();
				const token = data.token ?? "";
				emits("authenticated", { token });
				break;
			}
		}
	} catch (error) {
		console.error(`Got an error back: ${error}`);
	}
}
</script>

<template>
	<form @submit.prevent="onSubmit">
		<fieldset>
			<legend><h4>Login</h4></legend>
			<label for="username">Username</label>
			<input
				v-model="username"
				name="username" 
				type="text" 
				placeholder="Username"
			>
			<label for="password">Password</label>
			<input
				v-model="password"
				name="password" 
				type="password" 
				placeholder="Password"
			>
			<br>
			<input 
				type="submit" 
				value="Login"
			>
			<p class="red">
				{{ error }}
			</p>
		</fieldset>
	</form>
</template>

<style lang="css" scoped>
.red {
	color: red;
}
</style>
