const Page = require("./helpers/page");

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto("http://127.0.0.1:3000");
});

afterEach(async () => await page.close());

test("has a correct `brand` text", async () => {
	const brand = await page.getContentsOf("a.brand-logo");

	expect(brand).toBe("Blogster");
});

// test("clicking login starts OAuth flow", async () => {
// 	await page.click('.right [href="/auth/google"]');

// 	const url = await page.url();

// 	expect(url).toMatch(/accounts\.google\.com/i);
// });

test("when signed in, shows `logout` button", async () => {
	await page.login();

	// wait 1sec for the logout btn to show after reload
	await page.waitFor(".right a[href='/auth/logout']", {
		timeout: 1000,
	});

	const text = await page.getContentsOf(".right a[href='/auth/logout']");

	expect(text).toMatch(/logout/i);
});

