const puppeteer = require('puppeteer');

; (async () => {
  const browser = await puppeteer.launch(
    {
      headless: false,
      slowMo: 25, // slow down by _ ms 
      devtools: false
    });

  const page = await browser.newPage()
  const theDate = new Date();
  const date = theDate.toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  const dateArray = date.split(', ')
  const YYYYMMDD = dateArray[0]
  const hhmm = dateArray[1]
  console.log(YYYYMMDD)
  console.log(hhmm)
  const draftTitle = 'Daily autotest ' + date;

  const navigationPromise = page.waitForNavigation()

  await page.goto('https://library.wwu.edu/submit-draft-studio')

  await page.setViewport({ width: 1184, height: 1159 })

  await navigationPromise

  console.log('process.env.FILE_PATH', process.env.FILE_PATH);
  console.log('x');

  await page.waitForSelector('#edit-title-rws-draft')
  await page.click('#edit-title-rws-draft')
  await page.type('#edit-title-rws-draft', draftTitle)
  console.log('x1');

  // await page.type('#edit-details-other-information-rws-draft', '')

  await page.type('#edit-preferred-name-rws-draft', 'David Bass')

  await page.type('#edit-wwu-email-address-rws-draft-mail-1', 'bassd2@wwu.edu')
  await page.type('#edit-wwu-email-address-rws-draft-mail-2', 'bassd2@wwu.edu')
  console.log('x2');

  await page.waitForSelector('#edit-due-date-rws-draft-date')
  // await page.click('#edit-due-date-rws-draft-date')
  await page.type('#edit-due-date-rws-draft-date', YYYYMMDD)

  await page.waitForSelector('#edit-due-date-rws-draft-time')
  await page.type('#edit-due-date-rws-draft-time', '14:35 PM')

  console.log('x3');

  await page.waitForSelector('#edit-academic-level-rws-draft')
  await page.click('#edit-academic-level-rws-draft')
  await page.select('#edit-academic-level-rws-draft', 'Undergraduate Student')

  console.log('x4');

  await page.evaluate(() => {
    document.querySelector("#edit-main-concerns-rws-draft-writing-a-thesis-statement").click();
  });

  console.log('x5');

  await page.waitForSelector('#edit-draft-type-rws-draft-select')
  await page.select('#edit-draft-type-rws-draft-select', 'Presentation')

  console.log('x6');

  await page.waitForSelector('#edit-academic-level-rws-draft')
  await page.click('#edit-academic-level-rws-draft')
  console.log('x7');

  await page.waitForSelector('#edit-citation-style-rws-draft-select')
  await page.select('#edit-citation-style-rws-draft-select', 'APA')

  console.log('a');

  await page.waitForSelector('#edit-course-information-rws-draft')
  await page.type('#edit-course-information-rws-draft', 'TST 101')

  console.log('b');
  await page.waitForSelector('#edit-instructor-rws-draft')
  await page.type('#edit-instructor-rws-draft', 'Gabe Gossett')

  console.log('c');
  await page.waitForSelector('#edit-assignment-description-rws-draft')
  await page.type('#edit-assignment-description-rws-draft', 'My assignment description does here.')


  console.log('e');
  // get the selector input type=file (for upload file)
  await page.waitForSelector('input[type=file]');

  // get the ElementHandle of the selector above
  const inputUploadHandle = await page.$('input[type=file]');

  // const fileToUpload = 'test-upload-file.txt'
  const fileToUpload = process.env.FILE_PATH
  inputUploadHandle.uploadFile(fileToUpload)
  console.log('f');

  // doing click on button to trigger upload file
  await page.waitForSelector('#edit-draft-and-assignment-description-rws-draft-upload');
  await page.evaluate(() => document.getElementById('edit-draft-and-assignment-description-rws-draft-upload').click());

  // wait for selector that contains the uploaded file URL
  await page.waitForSelector('#edit-draft-and-assignment-description-rws-draft-upload-button');

  console.log('file uploaded')

  await page.waitForSelector('#edit-other-info-rws-draft')
  await page.click('#edit-other-info-rws-draft')
  await page.type('#edit-preferred-name-rws-draft', ' created by https://app.checklyhq.com/checks/1862047a-0f53-44fa-80bf-f536ece5b7e0/browser/edit ')


  await page.waitForSelector('#edit-submit')
  await page.click('#edit-submit')

  await navigationPromise

  await browser.close()
})()