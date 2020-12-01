const puppeteer = require("puppeteer");

test("Adds two number", () => {
	const sum = 1 + 2;

	expect(sum).toEqual(3);
});

test("We can launch a Browser", async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto("localhost:3000");
});

