export function filterAndGroupListingsByContact(listingData) {
	if (!listingData || typeof listingData !== "object") {
		console.error("Invalid input: Expected a JSON object containing listing data.");
		return {};
	}

	const currentDate = new Date();
	const oneYearAgoDate = new Date();
	oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);

	const allListings = listingData?.models?.results || [];

	const filteredListings = allListings.filter(listing => {
		if (!listing?.created) return false;
		const listingCreationDate = new Date(listing.created);
		return listingCreationDate < oneYearAgoDate;
	});

	function getContactName(publication) {
		return publication?.contact?.name?.trim() || "Unknown Presenter";
	}

	function toPascalCase(name) {
		return name.replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
	}

	function getLevenshteinDistance(str1, str2) {
		const len1 = str1.length, len2 = str2.length;
		const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

		for (let i = 0; i <= len1; i++) dp[i][0] = i;
		for (let j = 0; j <= len2; j++) dp[0][j] = j;

		for (let i = 1; i <= len1; i++) {
			for (let j = 1; j <= len2; j++) {
				const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
				dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
			}
		}
		return dp[len1][len2];
	}

	function findClosestMatch(contactName, existingGroups) {
		const threshold = 3; // Adjust based on acceptable typo tolerance
		for (const existingName of existingGroups) {
			if (getLevenshteinDistance(contactName, existingName) <= threshold) {
				return existingName;
			}
		}
		return contactName;
	}

	const groupedListings = {};

	filteredListings.forEach(listing => {
		if (listing.state == "inactive") {
			return;
		}
		let originalContact = getContactName(listing.publication);
		let pascalCaseContact = toPascalCase(originalContact);
		let closestMatch = findClosestMatch(pascalCaseContact, Object.keys(groupedListings));

		if (!groupedListings[closestMatch]) {
			groupedListings[closestMatch] = [];
		}

		groupedListings[closestMatch].push(listing);
	});

	Object.keys(groupedListings).forEach(contactName => {
		groupedListings[contactName].sort((a, b) => new Date(a.created) - new Date(b.created));
	});

	return groupedListings;
}
