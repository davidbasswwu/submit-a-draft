const path = require('path')
const fs = require('fs')
﻿const filePath = path.join(__dirname, 'test-upload-file.txt')
fs.writeFileSync(filePath, 'test file contents')
console.log('Wrote test file to ', filePath)
const contents = fs.readFileSync(filePath, 'utf8')
console.log('Test file contains: ', contents)

const puppeteer = require('puppeteer');

; (async () => {

  const screenSize = {
    width: 1280,
    height: 768,
  };

  const browser = await puppeteer.launch(
    {
      headless: false,
      slowMo: 100,
      args: ['--disable-dev-shm-usage']
    });
  try {  
    const page = await browser.newPage();
    await page.setViewport(screenSize);

    const theDate = new Date();
    const date = theDate.toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    const dateArray = date.split(', ');
    const YYYYMMDD = dateArray[0];
    const hhmm = dateArray[1];
    console.log(YYYYMMDD);
    console.log(hhmm);
    const draftTitle = 'Daily autotest ' + date;
    const navigationPromise = page.waitForNavigation()

    await page.goto('https://library.wwu.edu/submit-draft-studio');

    // console.log('process.env.FILE_PATH', process.env.FILE_PATH);
    // console.log('x');

    await typeThis('#edit-title-rws-draft', draftTitle, page);

    await typeThis('#edit-preferred-name-rws-draft', 'David Bass - autotest', page);
  
    await typeThis('#edit-wwu-email-address-rws-draft-mail-1', 'bassd2@wwu.edu', page);
    await typeThis('#edit-wwu-email-address-rws-draft-mail-2', 'bassd2@wwu.edu', page);
  
    await page.waitForSelector('#edit-due-date-rws-draft-date');
    await typeThis('#edit-due-date-rws-draft-date', YYYYMMDD, page);
  
    await page.waitForSelector('#edit-due-date-rws-draft-time');
    // await page.type('#edit-due-date-rws-draft-time', '14:35 PM');
    await typeThis('#edit-due-date-rws-draft-time', '14:35 PM', page);

    await page.waitForSelector('#edit-academic-level-rws-draft');
    waitAndClick('#edit-academic-level-rws-draft', page);
    await page.select('#edit-academic-level-rws-draft', 'Undergraduate Student');

    waitAndClick('#edit-main-concerns-rws-draft-writing-a-thesis-statement', page);

    // await page.waitForSelector('#edit-draft-type-rws-draft-select');
    waitAndClick('#edit-draft-type-rws-draft-select', page);
    await page.select('#edit-draft-type-rws-draft-select', 'Class Paper');

    // await page.waitForSelector('#edit-citation-style-rws-draft-select');
    await page.select('#edit-citation-style-rws-draft-select', 'APA');

    await typeThis('#edit-course-information-rws-draft', 'TST 101', page);

    await typeThis('#edit-instructor-rws-draft', 'Gabe Gossett', page);

    await typeThis('#edit-assignment-description-rws-draft', 'This is just a test', page);

    // get the selector input type=file (for upload file)
    // await page.waitForSelector('input[type=file]');

    // get the ElementHandle of the selector above
    const inputUploadHandle = await page.$('input[type=file]');

    // const fileToUpload = 'test-upload-file.txt'
    // const fileToUpload = process.env.FILE_PATH
    // const fileToUpload = path.join(__dirname, process.env.FILE_PATH)
    const fileToUpload = filePath;
    inputUploadHandle.uploadFile(fileToUpload);

    // doing click on button to trigger upload file
    // await page.waitForSelector('#edit-draft-and-assignment-description-rws-draft-upload');
    // await page.evaluate(() => document.getElementById('edit-draft-and-assignment-description-rws-draft-upload').click());
    await waitAndClick('#edit-draft-and-assignment-description-rws-draft-upload', page);

    // wait for selector that contains the uploaded file URL
    // await page.waitForSelector('#edit-draft-and-assignment-description-rws-draft-upload-button');

    console.log('file uploaded');

    await page.waitForSelector('#edit-how-did-you-learn-about-rws-draft-select');
    await page.select('#edit-how-did-you-learn-about-rws-draft-select', 'Instructor')

    await page.waitForSelector('#edit-may-we-contact-rws-draft');
    // await page.evaluate(() => document.getElementById('edit-may-we-contact-rws-draft').click());
    await waitAndClick('#edit-may-we-contact-rws-draft', page);

    await typeThis('#edit-other-info-rws-draft', 'This is a Puppeteer test', page);

    // await page.waitForSelector('#edit-actions');

    await page.waitForSelector('#edit-submit');
    await waitAndClick('#edit-submit', page);
    // await page.click('#edit-submit'); 
    // await page.evaluate(()=>document.querySelector('#edit-submit').click());
    // await page.evaluate(() => document.getElementById('edit-submit').click());
    // await page.screenshot({ path: 'after_submit.png', fullPage: true })

    await navigationPromise;
    
    console.log('k');
    // await page.close();
    console.log('l');    
    await browser.close();
  } catch (error) {
    console.log(error);
  } finally {
  }
    

})();

  // thanks to https://github.com/puppeteer/puppeteer/issues/2977#issuecomment-737607041
  async function waitAndClick(selector, page) {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
      { visible: true },
    );
    await page.evaluate((selector) => document.querySelector(selector).click(), selector);
    await page.$eval(selector, e => e.blur());
  }

  async function typeThis(selector, theValue, page) {
    await page.waitForTimeout(1000);    // wait for a second
    await page.waitForSelector(selector); // wait for the element
    await page.focus(selector); // focus on the element
    await page.keyboard.type(theValue);  // thanks https://stackoverflow.com/a/56772379
    await page.$eval(selector, e => e.blur());  // blur off of the element
  }
