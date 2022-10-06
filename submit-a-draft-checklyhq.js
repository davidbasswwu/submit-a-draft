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

  const browser = await puppeteer.launch({headless: true});
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

  // const navigationPromise = page.waitForNavigation();

  await page.goto('https://library.wwu.edu/submit-draft-studio');

  // console.log('process.env.FILE_PATH', process.env.FILE_PATH);
  // console.log('x');

  await page.waitForSelector('#edit-title-rws-draft');
  // await page.click('#edit-title-rws-draft')
  await page.type('#edit-title-rws-draft', draftTitle);

  await page.waitForSelector('#edit-other-info-rws-draft');
  await page.type('#edit-preferred-name-rws-draft', 'David Bass');
  // await page.type('#edit-preferred-name-rws-draft', ' created by https://app.checklyhq.com/checks/1862047a-0f53-44fa-80bf-f536ece5b7e0/browser/edit by David Bass');

  await page.type('#edit-wwu-email-address-rws-draft-mail-1', 'bassd2@wwu.edu');
  await page.type('#edit-wwu-email-address-rws-draft-mail-2', 'bassd2@wwu.edu');

  await page.waitForSelector('#edit-due-date-rws-draft-date');
  // await page.click('#edit-due-date-rws-draft-date')
  await page.type('#edit-due-date-rws-draft-date', YYYYMMDD);

  await page.waitForSelector('#edit-due-date-rws-draft-time');
  await page.type('#edit-due-date-rws-draft-time', '14:35 PM');

  await page.waitForSelector('#edit-academic-level-rws-draft');
  // await page.click('#edit-academic-level-rws-draft');
  await page.select('#edit-academic-level-rws-draft', 'Undergraduate Student');

  console.log('x4');

  waitAndClick('#edit-main-concerns-rws-draft-writing-a-thesis-statement', page);
  // await page.evaluate(() => {
  //   document.querySelector("#edit-main-concerns-rws-draft-writing-a-thesis-statement").click();
  // });

  console.log('x5');

  await page.waitForSelector('#edit-draft-type-rws-draft-select');
  await page.select('#edit-draft-type-rws-draft-select', 'Class Paper');

  console.log('x6');

  // await page.waitForSelector('#edit-academic-level-rws-draft')
  // await page.click('#edit-academic-level-rws-draft')
  // console.log('x7');

  await page.waitForSelector('#edit-citation-style-rws-draft-select');
  await page.select('#edit-citation-style-rws-draft-select', 'APA');

  console.log('a');

  await page.waitForSelector('#edit-course-information-rws-draft');
  await page.type('#edit-course-information-rws-draft', 'TST 101');

  console.log('b');
  await page.waitForSelector('#edit-instructor-rws-draft');
  await page.type('#edit-instructor-rws-draft', 'Gabe Gossett');

  console.log('c');
  await page.waitForSelector('#edit-assignment-description-rws-draft');
  await page.type('#edit-assignment-description-rws-draft', 'My assignment description does here.');

  console.log('e');
  // get the selector input type=file (for upload file)
  // await page.waitForSelector('input[type=file]');

  // get the ElementHandle of the selector above
  const inputUploadHandle = await page.$('input[type=file]');

  // const fileToUpload = 'test-upload-file.txt'
  // const fileToUpload = process.env.FILE_PATH
  // const fileToUpload = path.join(__dirname, process.env.FILE_PATH)
  const fileToUpload = filePath;
  inputUploadHandle.uploadFile(fileToUpload);
  console.log('f');

  // doing click on button to trigger upload file
  await page.waitForSelector('#edit-draft-and-assignment-description-rws-draft-upload');
  // await page.evaluate(() => document.getElementById('edit-draft-and-assignment-description-rws-draft-upload').click());
  waitAndClick('#edit-draft-and-assignment-description-rws-draft-upload', page);


  // wait for selector that contains the uploaded file URL
  // await page.waitForSelector('#edit-draft-and-assignment-description-rws-draft-upload-button');

  console.log('file uploaded');

  console.log('g');

  await page.waitForSelector('#edit-how-did-you-learn-about-rws-draft-select');
  await page.select('#edit-how-did-you-learn-about-rws-draft-select', 'Instructor')

  await page.waitForSelector('#edit-may-we-contact-rws-draft');
  // await page.evaluate(() => document.getElementById('edit-may-we-contact-rws-draft').click());
  waitAndClick('#edit-may-we-contact-rws-draft', page);

  // await page.waitForSelector('#edit-actions');
  console.log('h');

  await page.waitForSelector('#edit-submit');
  console.log('i');

  waitAndClick('#edit-submit', page);
  // await page.click('#edit-submit'); 
  // await page.evaluate(()=>document.querySelector('#edit-submit').click());
  // await page.evaluate(() => document.getElementById('edit-submit').click());
  // await page.screenshot({ path: 'after_submit.png', fullPage: true })

  console.log('j');
  await page.waitForNavigation();

  console.log('k');
  // await page.close();
  console.log('l');
  await browser.close()
})()

  // https://github.com/puppeteer/puppeteer/issues/2977#issuecomment-737607041
  async function waitAndClick(selector, page) {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
      { visible: true },
    );
    const element = await page.$(selector);
    await element.click();
  }
