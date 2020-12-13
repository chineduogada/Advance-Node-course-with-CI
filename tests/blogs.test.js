const Page = require("./helpers/page");

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto("http://127.0.0.1:3000");
});

afterEach(async () => {
	await page.close();
});

describe("Blogs", () => {
	test("When logged in, can see create blog form", async () => {
		await page.login();

		await page.click(".btn-floating.btn-large.red");

		const label = await page.getContentsOf("form label");

		expect(label).toMatch(/blog title/i);
	});
});

