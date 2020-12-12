const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");
const Page = require("./helpers/page");

beforeAll(() => jest.setTimeout(500000));

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto("http://127.0.0.1:3000");
});

afterEach(async () => await page.close());

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
		const user = await userFactory();
		const { session, sig } = sessionFactory(user);

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

