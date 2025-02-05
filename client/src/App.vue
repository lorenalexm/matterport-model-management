<script setup>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { onMounted, ref } from "vue";
import LoginComponent from "./components/LoginComponent.vue";
import TableComponent from "./components/TableComponent.vue";

dayjs.extend(relativeTime);

const loggedIn = ref(false);
const token = ref("");

function onAuthenticated(payload) {
	token.value = payload.token;
	loggedIn.value = true;
}

onMounted(() => {
	console.log("App.vue mounted");
});
</script>

<template>
	<main>
		<div class="container">
			<h1>Matterport Model Management</h1>
			<div v-if="loggedIn == false">
				<LoginComponent @authenticated="onAuthenticated" />
			</div>
			<div v-else>
				<TableComponent :token="token" />
			</div>
		</div>
	</main>
</template>
