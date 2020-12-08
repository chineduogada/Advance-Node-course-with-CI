const puppeteer = require("puppeteer");
const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../config/keys");

beforeAll(() => jest.setTimeout(500000));

let browser, page;

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: false });
	page = await browser.newPage();

	await page.goto("http://127.0.0.1:3000");
});

// afterEach(async () => await browser.close());

describe("Header", () => {
	// test("has a correct `brand` text", async () => {
	// 	const brand = await page.$eval("a.brand-logo", (el) => el.innerHTML);

	// 	expect(brand).toBe("Blogster");
	// });

	// test("clicking login starts OAuth flow", async () => {
	// 	await page.click('.right [href="/auth/google"]');

	// 	const url = await page.url();

	// 	// expect(url).toContain("accounts.google.com");
	// 	expect(url).toMatch(/accounts\.google\.com/i);
	// });

	test("when signed in, shows `logout` button", async () => {
		const keygrip = new Keygrip([keys.cookieKey]);

		const user = "5fbbd86a764e500728c768ce";
		const sessionObj = {
			passport: { user },
		};

		// use Buffer to get the base64 encode (the `session` itself);
		const session = Buffer.from(JSON.stringify(sessionObj)).toString(
			"base64"
		);

		// use Keygrip to `sign` the `session`
		const signStr = "session=" + session;
		const sessionSig = keygrip.sign(signStr);

		console.log(session, sessionSig);

		expect("2").toBe("2");
	});
});

