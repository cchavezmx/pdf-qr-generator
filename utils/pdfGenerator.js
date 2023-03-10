import { chromium } from 'playwright-chromium'
import { GraphQLError } from 'graphql'
import qr from 'qrcode'
import redisClient from '../utils/redis.js'
// import puppeteer from 'puppeteer'

const html2pdf = async (containers, country, station) => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  const qrMaker = async (counter) => {
    const qrCode = qr.toString(counter, {
      type: 'svg'
    })
    return qrCode
  }

  const htmlPromise = containers.map(async ({ id, tag }, index) => {
    const qrCode = await qrMaker(id)
    return `
    <div style="break-after: avoid-page;">
      <h1>${tag}</h1>
      <p>${station}</p>      
        ${qrCode}      
    </div>
    ${index % 2 === 0 ? '<hr />' : null}
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
            padding: 10px;
          }

          img, picture, svg{            
            height: 13cm;
            width: 13cm;
          }

          h1 {
            font-size: 6rem;
            margin: 0;
            padding: 0;
          }

          p {
            font-size: 1.5rem;
            margin: 0;
            padding: 0;
          }

          hr {
            width: 100vh;
            height: 2px;
            background-color: black;
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
      height: '297mm',
      width: '210mm',
      printBackground: true,

      margin: {
        left: 0,
        top: 2,
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

const pdfGenerator = async (containers, country, station) => {
  const { pdf } = await html2pdf(containers, country, station)
  return pdf
}

const pdfRegenerator = async (uuid) => {
  const data = await redisClient.get(uuid)
  const { containers, country, station } = JSON.parse(data)
  const { pdf } = await html2pdf(containers, country, station)
  return pdf
}

export {
  pdfGenerator,
  pdfRegenerator
}
