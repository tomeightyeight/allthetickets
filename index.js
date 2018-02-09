'use strict'

const axios = require('axios')
const config = require('./config.json')

const URI = config.URI
const TEXT_BELT_KEY = config.SMS_KEY
const PHONE_NUMBERS = config.PHONE_NUMBERS
const INTERVAL = config.INTERVAL_MS

const sendText = (number) => {
  axios.post('https://textbelt.com/text', {
    phone: number,
    message: `BUY DI TIKITZ!!!`,
    key: TEXT_BELT_KEY,
  })
    .then(response => {
      if (response.data.success) {
        console.log(`SMS sent: ${number}`)
      }
    })
    .catch(error => {
      console.warn(error)
    })  
}

const success = async () => {
  console.log('BUY DI TIKITZ!!!')

  PHONE_NUMBERS.forEach(number => {
    sendText(number)
  })

  setTimeout(() => {
    process.exit()
  }, 5000)
}

const failure = () => {
  console.log('no tikz found...')
}

const parsePage = (html) => {
  const match = `<a id="buynow" href="#" title="Buy tickets">Buy tickets</a>`
  html.includes(match) 
    ? success() 
    : failure()
}

const fetch = () => {
  axios.get(URI)
    .then(response => {
      parsePage(response.data)
    })
    .catch(error => {
      console.warn(error)
    }) 
}

const scrapeLoop = () => {
  setTimeout(() => {
    fetch()
    scrapeLoop()
  }, INTERVAL)
}

console.log('polling for da tikz...')
scrapeLoop()
