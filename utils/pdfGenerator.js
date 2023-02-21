import { chromium } from 'playwright-chromium'
import { GraphQLError } from 'graphql'
import qr from 'qrcode'
// import puppeteer from 'puppeteer'

const html2pdf = async (containers, country = '') => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  const qrMaker = async (counter) => {
    const qrCode = qr.toString(counter, {
      type: 'svg'
    })
    return qrCode
  }

  const htmlPromise = containers.map(async ({ id, tag }) => {
    const qrCode = await qrMaker(id)
    return `
    <div style="page-break-after:always;">
      <h1>${tag}</h1>
      <p>${country}</p>      
        ${qrCode}      
    </div>
    `
  })

  const htmlString = await Promise.all(htmlPromise)

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
            display: grid;
            place-items: center;
            height: 100%; 
          }

          img, picture, svg{
            padding: 10px;
            height: 10cm;
            width: 10cm;
          }

          h1 {
            font-size: 7rem;
            margin: 0;
            padding: 0;
          }

          p {
            font-size: 1.5rem;
            margin: 0;
            padding: 0;
          }

        </style>
      </head>
      <body>        
      ${htmlString.join('\n')}
      </body>
    </html>
    `
    await page.setContent(hmtlGET)

    const pdf = await page.pdf({
      height: '15cm',
      width: '15cm',
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
    throw new GraphQLError('Error in pdfGenerator.js')
  }
}

const pdfGenerator = async (containers, country) => {
  const { pdf } = await html2pdf(containers, country)
  return pdf
}

export default pdfGenerator
