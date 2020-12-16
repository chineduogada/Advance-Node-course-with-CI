const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class Page {
	static async build() {
		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-snadbox"],
		});
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

	async getContentsOf(selector, textContent) {
		const cb = textContent ? (el) => el.textContent : (el) => el.innerHTML;

		return await this.page.$eval(selector, cb);
	}

	get(path) {
		return this.page.evaluate(async (_path) => {
			const response = await fetch(_path, {
				method: "GET",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
			});

			return response.json();
		}, path);
	}

	post(path, data) {
		return this.page.evaluate(
			async (_path, _data) => {
				const response = await fetch(_path, {
					method: "POST",
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: _data,
				});

				return response.json();
			},
			path,
			data
		);
	}

	execRequests(actions) {
		return Promise.all(
			actions.map(({ method, path, data }) => {
				return this[method](path, data);
			})
		);
	}
}

module.exports = Page;

