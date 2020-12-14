const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class Page {
	static async build() {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		const customPage = new Page(page, browser);

		return new Proxy(customPage, {
			get: (target, property) => {
				return (
					target[property] ||
					target.page[property] ||
					target.browser[property]
				);
			},
		});
	}

	constructor(page, browser) {
		this.page = page;
		this.browser = browser;
	}

	async login() {
		const user = await userFactory();
		const { session, sig } = sessionFactory(user);
		this.userId = user.id;

		// set session and signature and  then reload to fake login
		await this.page.setCookie({
			name: "session",
			value: session,
		});

		await this.page.setCookie({
			name: "session.sig",
			value: sig,
		});
		await this.page.goto("http://127.0.0.1:3000/blogs");
	}

	async close() {
		// clear test user from the DB
		if (this.userId) {
			await userFactory(this.userId);
		}

		await this.browser.close();
	}

	async getContentsOf(selector) {
		return await this.page.$eval(selector, (el) => el.innerHTML);
	}
}

module.exports = Page;

