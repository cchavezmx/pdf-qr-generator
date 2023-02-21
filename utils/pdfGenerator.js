import { chromium } from 'playwright-chromium'
import { GraphQLError } from 'graphql'
// import puppeteer from 'puppeteer'

const html2pdf = async (payload) => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()

  try {
    const hmtlGET = `
    <!DOCTYPE html>        
    <html>
      <head>
        <meta charset="utf-8">
        <title>PDF Result Template</title>
        <style>
          body {
            display: grid;  
            justify-content: center;        
            position: relative;
          }     
          
          div {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-direction: column;
          }
        </style>
      </head>
      <body>
        <div>
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google Logo" width="200" height="200">
        </div>      
      </body>
    </html>
    `
    await page.setContent(hmtlGET)

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })

    await browser.close()
    // convert pdf to base64
    const base64 = pdf.toString('base64')
    return { pdf: base64 }
  } catch (error) {
    console.log(error)
    throw new GraphQLError('Error in pdfGenerator.js')
  }
}

const pdfGenerator = async (numContainers, station, country) => {
  console.log(numContainers, station, country)
  const { pdf } = await html2pdf()
  return pdf
}

export default pdfGenerator
