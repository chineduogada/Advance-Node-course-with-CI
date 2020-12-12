const puppeteer = require("puppeteer");

class CustomPage {
	static async build() {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();

		const customPage = new CustomPage(page);

		return new Proxy(customPage, {
			get: (target, property) => {
				return (
					target[property] || target.page[property] || browser[property]
				);
			},
		});
	}

	constructor(page) {
		this.page = page;
	}

	login = () => {};
}

module.exports = CustomPage;

