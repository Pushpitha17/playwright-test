import { test, expect, chromium } from '@playwright/test';
import { WebPage } from '../pages/webpage';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { testdata } from './verify_title.data';
import { ChromiumBrowserContext } from '@playwright/test';


const sitemapUrl = process.env.SITEMAP_URL;

test('Has Page title', async ({ context }) => {

  console.log(sitemapUrl)
  let titleFound = false;

  if (sitemapUrl === undefined) {
    throw new Error(`Sitemap Url is Not given`);
  }

  const response = await axios.get(sitemapUrl);
  const xmlText = response.data;

  const result = await parseStringPromise(xmlText);
  let urls: string[] = result.urlset.url.map((url: any) => url.loc[0]);

  const MAX_CONCURRENT = 5;
  const chunks: string[][] = []

  for (let i = 0; i < urls.length; i += MAX_CONCURRENT) {
    chunks.push(urls.slice(i, i + MAX_CONCURRENT));
  }

  for await (const batch of chunks) {
    const pagePromises = batch.map(async (url) => {
      const page = await context.newPage();
      const webPage = new WebPage(page);
      await webPage.goto(url);
      if (await webPage.checkTitle(testdata.pageTitle)) {
        console.log(`Pass: Title found for URL: ${url}`);
        titleFound = true;
      }
    });
    await Promise.all(pagePromises);
    if (titleFound) {
      break;
    }
  }


  expect(titleFound).toBe(true);

});
