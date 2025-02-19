import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function generateEmailTemplate(presenter, listings) {
	function formatListings(listings) {
		return listings.map((listing) => `• ${listing.address.address} - Originally captured ${dayjs(listing.created).fromNow()}`).join('\n')
	}

	return `
Hi ${presenter},

We hope the start of 2025 finds you well! We are also reaching out to let you know that your Matterport home model(s) listed below have either reached or exceeded their included 1-year period of hosting contracted at the time of original scheduling. 

Not to worry - Showcase Exposure has kept each of these models live for you on a temporary basis. If you are needing continued access, we are happy to take care of this through an easy renewal option. Simply reply to this email letting us know which property model(s) to keep active, and for $19 per property, we will renew the hosting of your Matterport model for another 1-year and provide a copy of your final invoice for your records. 

Properties Needing Renewal:
${formatListings(listings)}

Total cost: $${listings.length * 19}

If your model(s) no longer require hosting, no problem! Models that are NOT renewed will be removed either at your request OR within two weeks from the date of this email, whichever comes first.

We’re always here for you; so please let us know how you would like to proceed or if you have any additional questions. Showcase Exposure values YOU, which means taking care of your needs is our number one priority. Thank you so much for your support of our business!

Cordially,
Madeline Loren
Showcase Exposure
scheduling@showcaseexposure.com
	`
}
