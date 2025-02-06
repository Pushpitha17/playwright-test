import { Page } from '@playwright/test';

export class WebPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    try {
      await this.page.goto(url , {waitUntil: "domcontentloaded", timeout: 20000 });
    } catch (error) {
      console.error(`Failed to load URL: ${url}. Error: ${error.message}`);
    }
  }

  async checkTitle(expectedTitle: string): Promise<boolean> {
    const title = await this.page.title();
    console.log("page Title :" ,title)
    return title === expectedTitle;
  }

  async checkTitleExists(): Promise<boolean> {
    const title = await this.page.title();
    console.log("Title Exists : ", title )
    return title ? true : false
  }

  async closePage() {
    this.page.close()
  }
}