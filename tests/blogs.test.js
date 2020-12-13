const Page = require("./helpers/page");

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto("http://127.0.0.1:3000");
});

afterEach(async () => {
	await page.close();
});

describe("When logged in", async () => {
	beforeEach(async () => {
		await page.login();
		await page.click("a.btn-floating");
	});

	test("Can see create blog form", async () => {
		const label = await page.getContentsOf("form label");

		expect(label).toMatch(/blog title/i);
	});

	describe("And using valid inputs", async () => {
		beforeEach(async () => {});

		test("", async () => {});
	});

	describe("And using invalid inputs", async () => {
		// beforeEach(async () => {
		// 	await page.click("form button");
		// });

		test("the form shows an error message", async () => {
			await page.click("form button");
			const titleErr = await page.getContentsOf(".title .red-text");
			const contentErr = await page.getContentsOf(".content .red-text");

			expect(titleErr).toMatch(/you must provide a value/i);
			expect(contentErr).toMatch(/you must provide a value/i);
		});
	});
});

