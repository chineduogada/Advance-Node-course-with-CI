const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");
class CustomPage {
	static async build() {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		const customPage = new CustomPage(page);

		return new Proxy(customPage, {
			get: (target, property) => {
				return (
					target[property] || browser[property] || target.page[property]
				);
			},
		});
	}

	constructor(page) {
		this.page = page;
	}

	async login() {
		const user = await userFactory();
		const { session, sig } = sessionFactory(user);

		// set session and signature and  then reload to fake login
		await this.page.setCookie({
			name: "session",
			value: session,
		});

		await this.page.setCookie({
			name: "session.sig",
			value: sig,
		});
		await this.page.reload();

		// wait 1sec for the logout btn to show after reload
		await this.page.waitFor(".right a[href='/auth/logout']", {
			timeout: 1000,
		});
	}

	async getContentsOf(selector) {
		return await this.page.$eval(selector, (el) => el.innerHTML);
	}
}

module.exports = CustomPage;

