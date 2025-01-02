import { launch } from "puppeteer";

import { url, pincode, product } from "./input.js";

const LINK = url || "https://www.bigbasket.com/";
const PINCODE = pincode || 110017;
const PRODUCT = product || "mustard oil";

const browser = launch({
  headless: false,
  args: ["--start-maximized"],
  defaultViewport: null,
});

let page;

browser
  .then((browserObj) => {
    return browserObj.newPage();
  })
  .then((newTab) => {
    page = newTab;
    return newTab.goto(LINK);
  })
  .then(() => {
    return page.click(
      'button[class="AddressDropdown___StyledMenuButton-sc-i4k67t-1 fmWuAV"]'
    );
  })
  .then(() => {
    return page.waitForSelector(
      'input[class="Input-sc-tvw4mq-0 AddressDropdown___StyledInput-sc-i4k67t-8 hpyysx eQvECn"]'
    );
  })
  .then(() => {
    return page.click(
      'input[class="Input-sc-tvw4mq-0 AddressDropdown___StyledInput-sc-i4k67t-8 hpyysx eQvECn"]'
    );
  })
  .then(() => {
    return page.keyboard.type(PINCODE);
  })
  .then(() => {
    return page.keyboard.press("Enter");
  })
  .then(() => {
    return page.waitForSelector('ul[class="overscroll-contain p-2.5"]');
  })
  .then(() => {
    return page.click('ul[class="overscroll-contain p-2.5"] li:nth-child(1)');
  })
  .then(() => {
    return page.waitForNavigation();
  })
  .then(() => {
    return page.click(
      'div[class="QuickSearch___StyledMenuButton-sc-rtz2vl-1 dpuSIx"]'
    );
  })
  .then(() => {
    return page.keyboard.type(PRODUCT);
  })
  .then(() => {
    return page.waitForSelector(
      'li[class="QuickSearch___StyledMenuItem-sc-rtz2vl-4 ibNDA-d"]'
    );
  })
  .then(() => {
    return page.$$eval(
      'li[class="QuickSearch___StyledMenuItem-sc-rtz2vl-4 ibNDA-d"]',
      (elements) => {
        return elements.map((el) => ({
          text: el.textContent.trim(),
          id: el.getAttribute("id"),
          className: el.getAttribute("class"),
        }));
      }
    );
  })
  .then((data) => {
    const priceList = data.map(({ text }) => {
      const priceMatch = text.match(/₹(\d+(\.\d+)?)/);
      //   const nameMatch = text.match(/^[^\d]+/);
      const price = priceMatch ? priceMatch[1] : null;
      return {
        // name: nameMatch ? nameMatch[0].trim() : null,
        name: text.split("Oil")[0],
        price: price ? parseFloat(price) : null,
      };
    });
    console.log(priceList);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
