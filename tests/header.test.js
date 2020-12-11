const puppeteer = require("puppeteer");
const sessionsFactory = require("./factories/sessionFactory");

beforeAll(() => jest.setTimeout(500000));

let browser, page;

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: false });
	page = await browser.newPage();

	await page.goto("http://127.0.0.1:3000");
});

afterEach(async () => await browser.close());

describe("Header", () => {
	test("has a correct `brand` text", async () => {
		const brand = await page.$eval("a.brand-logo", (el) => el.innerHTML);

		expect(brand).toBe("Blogster");
	});

	test("clicking login starts OAuth flow", async () => {
		await page.click('.right [href="/auth/google"]');

		const url = await page.url();

		expect(url).toMatch(/accounts\.google\.com/i);
	});

	test("when signed in, shows `logout` button", async () => {
		const { session, sig } = sessionsFactory(user);

		// set session and signature and  then reload to fake login
		await page.setCookie({
			name: "session",
			value: session,
		});

		await page.setCookie({
			name: "session.sig",
			value: sig,
		});
		await page.reload();

		const logoutSelector = ".right a[href='/auth/logout']";
		// wait 1sec for the logout btn to show after reload
		await page.waitFor(logoutSelector, { timeout: 1000 });
		const text = await page.$eval(logoutSelector, (el) => el.innerHTML);

		expect(text).toMatch(/logout/i);
	});
});

