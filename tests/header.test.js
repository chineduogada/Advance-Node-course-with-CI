const puppeteer = require("puppeteer");

beforeAll(() => jest.setTimeout(500000));

let browser, page;

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: false });
	page = await browser.newPage();

	await page.goto("http://127.0.0.1:3000");
});

afterEach(async () => await browser.close());

test("We can launch a Browser", async () => {
	const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

	expect(text).toBe("Blogster");
});

test("We can launch a Browser", async () => {
	const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

	expect(text).toBe("Blogster");
});

