
const storageOutput = document.querySelector('.storage__output')
const transferOutput = document.querySelector('.transfer__output')

const storageInput = document.querySelector('.storage__range')
const transferInput = document.querySelector('.transfer__range')

const backblaze = document.querySelector('.backblaze')
const bunny = document.querySelector('.bunny')
const scaleway = document.querySelector('.scaleway')
const vultr = document.querySelector('.vultr')


const providers = [
   {
      name: 'backblaze', 
      min: 7,
      storage: 0.005,
      transfer: 0.01
   },
   {
      name: 'vultr', 
      min: 5,
      storage: 0.01,
      transfer: 0.01
   },
   {
      name: 'bunny', 
      max: 10,
      storage_price: {
         hdd: 0.01,
         ssd: 0.02,
      },
      transfer: 0.01
   },
   {
      name: 'scaleway',
      min: 0, 
      storage_price: {
         multi : 0.06,
         single: 0.03,
      },
      transfer: 0.02,
      limit: {
         storage: 75,
         transfer: 75,
      }
   },
]

calculate()

function calculate() {
   
   const storageAmount = Number(storageInput.value)
   const transferAmount = Number(transferInput.value)

   storageOutput.innerHTML = storageAmount
   transferOutput.innerHTML = transferAmount
   
   const bunnyOption = document.querySelector('input[name="group1"]:checked').value
   const scalewayOption = document.querySelector('input[name="group2"]:checked').value

   const backblazeTotal = (storageAmount * providers[0].storage + transferAmount * providers[0].transfer).toFixed(2)
   const vultrTotal = (storageAmount * providers[1].storage + transferAmount * providers[1].transfer).toFixed(2)
   let bunnyTotal
   if (bunnyOption === 'hdd') {
      bunnyTotal = (storageAmount * providers[2].storage_price.hdd + transferAmount * providers[2].transfer).toFixed(2)
   } else if (bunnyOption === 'ssd') {
      bunnyTotal = (storageAmount * providers[2].storage_price.ssd + transferAmount * providers[2].transfer).toFixed(2)
   }
   let scalewayTotal
   if (scalewayOption === 'multi') {
      scalewayTotal = ((storageAmount - providers[3].limit.storage) * providers[3].storage_price.multi + (transferAmount - providers[3].limit.transfer) * providers[3].transfer).toFixed(2)
   } else if (scalewayOption === 'single') {
      scalewayTotal = ((storageAmount - providers[3].limit.storage) * providers[3].storage_price.single + (transferAmount - providers[3].limit.transfer) * providers[3].transfer).toFixed(2)
   }
   
   backblaze.innerHTML = Math.max(backblazeTotal, providers[0].min)
   vultr.innerHTML = Math.max(vultrTotal, providers[1].min)
   bunny.innerHTML = Math.min(bunnyTotal, providers[2].max)
   scaleway.innerHTML = Math.max(scalewayTotal, providers[3].min)
   

   const backblazeBar = document.querySelector('.backblaze-bar')
   const bunnyBar = document.querySelector('.bunny-bar')
   const scalewayBar = document.querySelector('.scaleway-bar')
   const vultrBar = document.querySelector('.vultr-bar') 

   let arrSortedNumber = [+backblaze.innerHTML, +vultr.innerHTML, +bunny.innerHTML, +scaleway.innerHTML]

   
   let arrPercent = Math.max.apply(null, arrSortedNumber)

   let backblazePercent = ((storageAmount / 1000 * 100) + (transferAmount / 1000 * 100) + (+backblaze.innerHTML / arrPercent * 100)) / 3 +  '%'
   let bunnyPercent = ((storageAmount / 1000 * 100) + (transferAmount / 1000 * 100) + (+bunny.innerHTML / arrPercent * 100)) / 3 +  '%'
   let scalewayPercent = ((storageAmount / 1000 * 100) + (transferAmount / 1000 * 100) + (+scaleway.innerHTML / arrPercent * 100)) / 3 +  '%'
   let vultrPercent = ((storageAmount / 1000 * 100) + (transferAmount / 1000 * 100) + (+vultr.innerHTML / arrPercent * 100)) / 3 +  '%'


   backblazeBar.style.height = backblazePercent
   bunnyBar.style.height = bunnyPercent
   scalewayBar.style.height = scalewayPercent
   vultrBar.style.height = vultrPercent

   const bars = document.querySelectorAll('.graph__progress')
   let height = []
   let data = []
   let min
   let i
   for (let i = 0; i < bars.length; i++) {

      height = Array.from(bars, bar => bar.style.height)
      data = height.map(n => {
         return parseFloat(n)
      });
      console.log(height);
      min = Math.min(...data);
      index = data.indexOf(min);
      bars[i].classList.remove('active')
      bars[index].classList.add('active')
   }
}


document.addEventListener('input', calculate)

