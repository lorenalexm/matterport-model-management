<script setup>
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { generateEmailTemplate } from "../utils/emailTemplate";

dayjs.extend(relativeTime);

const endpoint = "https://matterport-model-management.myside.app/api";
const data = ref({});
const updating = ref(false);
const loading = ref(true);
const updatingDialog = ref();
const errorDialog = ref();
const errorMessage = ref("");

const props = defineProps({
	token: {
		type: String,
		default: "",
	}
});

async function archive(id) {
	updatingDialog.value.showModal();
	updating.value = true;

	try {
		const response = await fetch(`${endpoint}/archive/${id}`, {
			method: "POST",
			headers: {
				"Authorization": props.token,
			}
		});
		const json = await response.json();

		if (response.status == 200) {
			data.value = removeListingById(data.value, id);
		} else {
			throw new Error(json.error);
		}
	} catch (error) {
		errorMessage.value = error;
		errorDialog.value.showModal();
		console.error(`Got an error back: ${error}`);
	}

	updating.value = false;
	updatingDialog.value.close();
}

function removeListingById(groupedListings, listingId) {
	if (!listingId || typeof listingId !== "string") {
		errorMessage.value = "Invalid listing ID provided.";
		errorDialog.value.showModal();
		console.error("Invalid listing ID provided.");
		return groupedListings;
	}

	const updatedListings = {};
	Object.keys(groupedListings).forEach(presenterName => {
		const filteredListings = groupedListings[presenterName].filter(listing => listing.id !== listingId);

		if (filteredListings.length > 0) {
			updatedListings[presenterName] = filteredListings;
		}
	});

	return updatedListings;
}

function closeErrorDialog() {
	errorDialog.value.close();
}

onMounted(async () => {
	try {
		const response = await fetch(`${endpoint}/fetch`, {
			method: "GET",
			headers: {
				"Authorization": props.token,
			}
		});
		const json = await response.json();

		if (response.status == 200) {
			data.value = json;
			loading.value = false;
		} else {
			throw new Error(json.error);
		}
	} catch (error) {
		errorMessage.value = error;
		errorDialog.value.showModal();
		console.error(`Got an error back: ${error}`);
	}
});
</script>

<template>
	<dialog 
		ref="updatingDialog"
		class="center"
	>
		<h2>Updating...</h2>
	</dialog>

	<dialog 
		ref="errorDialog"
		class="center"
	>
		<h2>{{ errorMessage }}</h2>
		<button @click="closeErrorDialog">
			Close
		</button>
	</dialog>

	<div 
		v-if="loading" 
		class="center"
	>
		<h2>Loading...</h2>
	</div>
	<div
		v-for="(listings, presenter) in data"
		v-else
		:key="presenter"
	>
		<article class="mv-xxl pb-m">
			<h4 class="mb--m">{{ presenter }}</h4>
			<h6>{{ listings[0].publication.contact.email }}</h6>
			<table class="fullwidth mb-l">
				<thead>
					<tr>
						<td>Address</td>
						<td>Created</td>
						<td>Action</td>
					</tr>
				</thead>
				<tbody>
					<tr 
						v-for="listing in listings"
						:key="listing.id"
					>
						<td>{{ listing.address.address ?? listing.name }}</td>
						<td>{{ dayjs(listing.created).fromNow() }}</td>
						<td>
							<button 
								:disabled="updating" 
								@click="archive(listing.id)"
							>
								Archive
							</button>
						</td>
					</tr>
				</tbody>
			</table>
			<details>
				<summary>Email template</summary>
				<pre>{{ generateEmailTemplate(presenter, listings) }}</pre>
			</details>
		</article>
	</div>
</template>

<style scoped>
pre {
	white-space: pre-wrap;
	white-space: -moz-pre-wrap;
	white-space: -pre-wrap;
	white-space: -o-pre-wrap;
	word-wrap: break-word;
}

.fullwidth { 
	width: 100%; 
}

.center {
	text-align: center;
}
</style>
