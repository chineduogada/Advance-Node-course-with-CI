const puppeteer = require("puppeteer");

// test("Adds two number", () => {
// 	const sum = 1 + 2;

// 	expect(sum).toEqual(3);
// });

beforeAll(() => jest.setTimeout(500000));

test("We can launch a Browser", async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto("http://127.0.0.1:3000");

	const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

	expect(text).toBe("Blogster");
});

