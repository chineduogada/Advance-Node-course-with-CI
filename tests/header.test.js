const puppeteer = require("puppeteer");

beforeAll(() => jest.setTimeout(500000));

let browser, page;

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: false });
	page = await browser.newPage();

	await page.goto("http://127.0.0.1:3000");
});

// afterEach(async () => await browser.close());

describe("Header", () => {
	test("has a correct `brand` text", async () => {
		const brand = await page.$eval("a.brand-logo", (el) => el.innerHTML);

		expect(brand).toBe("Blogster");
	});

	test("clicking login starts OAuth flow", async () => {
		await page.click('.right [href="/auth/google"]');

		const url = await page.url();

		console.log(url);

		// expect(text).toBe("Blogster");
	});
});

