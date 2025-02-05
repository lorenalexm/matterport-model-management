/**
 * Filters and groups listings by presenter name with normalization.
 * @param {Object} listingData - The JSON object containing listing data.
 * @returns {Object} - An object where keys are normalized presenter names and values are arrays of listings.
 */
export function filterAndGroupListingsWithNormalization(listingData) {
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

	const businessSuffixes = ["llc", "inc", "ltd", "co", "corp", "corporation", "realtor", "realty", "group"];

	/**
	 * Normalizes the presenter name by removing business suffixes and trimming whitespace.
	 * @param {string} presenter - The original presenter name.
	 * @returns {string} - The normalized presenter name.
	 */
	function normalizePresenterName(presenter) {
		if (!presenter) return "Unknown Presenter";
		let normalized = presenter.toLowerCase().replace(/\s+/g, " ").trim();
		businessSuffixes.forEach(suffix => {
			const regex = new RegExp(`\\b${suffix}\\b`, "gi");
			normalized = normalized.replace(regex, "").trim();
		});
		return normalized;
	}

	/**
	 * Calculates the Levenshtein distance between two strings.
	 * @param {string} str1 - The first string.
	 * @param {string} str2 - The second string.
	 * @returns {number} - The Levenshtein distance between the two strings.
	 */
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

	/**
	 * Finds the closest matching presenter name from existing groups using Levenshtein distance.
	 * @param {string} presenterName - The normalized presenter name.
	 * @param {string[]} existingGroups - The list of existing presenter names.
	 * @returns {string} - The closest matching presenter name or the original presenter name if no close match is found.
	 */
	function findClosestMatch(presenterName, existingGroups) {
		const threshold = 3; // Adjust based on acceptable typo tolerance
		for (const existingName of existingGroups) {
			if (getLevenshteinDistance(presenterName, existingName) <= threshold) {
				return existingName;
			}
		}
		return presenterName;
	}

	const groupedListings = {};

	filteredListings.forEach(listing => {
		let originalPresenter = listing.publication?.presentedBy || "";
		let normalizedPresenter = normalizePresenterName(originalPresenter);
		let closestMatch = findClosestMatch(normalizedPresenter, Object.keys(groupedListings));

		if (!groupedListings[closestMatch]) {
			groupedListings[closestMatch] = [];
		}

		groupedListings[closestMatch].push(listing);
	});

	Object.keys(groupedListings).forEach(presenterName => {
		groupedListings[presenterName].sort((a, b) => new Date(a.created) - new Date(b.created));
	});

	return groupedListings;
}


/*
export function filterAndGroupListingsByPresenter(listingData) {
	const currentDate = new Date();
	const oneYearAgoDate = new Date();
	oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);

	const allListings = listingData?.data?.models?.results || [];

	const filteredListings = allListings.filter(listing => {
		const listingCreationDate = new Date(listing.created);
		return listingCreationDate < oneYearAgoDate;
	});

	const listingsGroupedByPresenter = filteredListings.reduce((groupedListings, listing) => {
		let presenterName = listing.publication?.presentedBy?.trim() || "Unknown Presenter";

		if (!groupedListings[presenterName]) {
			groupedListings[presenterName] = [];
		}
		groupedListings[presenterName].push(listing);

		return groupedListings;
	}, {});

	Object.keys(listingsGroupedByPresenter).forEach(presenterName => {
		listingsGroupedByPresenter[presenterName].sort((firstListing, secondListing) => {
			const firstListingDate = new Date(firstListing.created);
			const secondListingDate = new Date(secondListing.created);
			return firstListingDate - secondListingDate; // Ascending order (oldest first)
		});
	});

	return listingsGroupedByPresenter;
}
*/
