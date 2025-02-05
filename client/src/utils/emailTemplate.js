import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function generateEmailTemplate(presenter, listings) {
	function formatListings(listings) {
		return listings.map((listing) => `• ${listing.address.address} - Originally captured ${dayjs(listing.created).fromNow()}`).join('\n')
	}

	return `
Hi ${presenter},

We hope you're doing well! We wanted to give you a quick heads-up about your Matterport models that have reached or exceeded their included 1-year hosting period.

To ensure continued access, we offer an easy renewal option: $19 per property for an additional year of hosting as stated when the job was originally scheduled.

Properties Needing Renewal:
${formatListings(listings)}

Total cost: $${listings.length * 19}

Each of these models is still live, and we'd love to keep them accessible for you and your clients! If you'd like to extend hosting, simply reply to this email, and we’ll generate an invoice and take care of everything.

If you no longer need hosting, no worries—models that are not renewed will be removed at your request or after two weeks from the date of this email; whichever is sooner.

Let us know how you'd like to proceed, and thanks for being a valued part of our community. We're always here if you have any questions!

Best,
Madeline Loren
Showcase Exposure
scheduling@showcaseexposure.com
	`
}
