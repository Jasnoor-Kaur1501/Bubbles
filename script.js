const pet = document.getElementById("pet")
const energyDisplay = document.getElementById("energy")
const happyDisplay = document.getElementById("happy")
const levelDisplay = document.getElementById("level")
const sleepBubble = document.getElementById("sleepBubble")

let mouseX = window.innerWidth/2
let mouseY = window.innerHeight/2

let petX = mouseX
let petY = mouseY

let hunger = 100
let energy = 100
let happiness = 80
let level = 1
let idleTimer = 0

document.addEventListener("mousemove", e=>{
  mouseX = e.clientX
  mouseY = e.clientY
  idleTimer = 0

  pet.classList.remove("sleep")
  sleepBubble.style.opacity = 0
})

document.addEventListener("click", ()=>{

  hunger = Math.min(100, hunger + 10)

  // jump animation
  pet.style.transform = "translate(-50%, -60%) scale(1.2)"

  setTimeout(()=>{
    pet.style.transform = "translate(-50%, -50%)"
  },200)

})

function updatePet(){

  petX += (mouseX - petX) * 0.08
  petY += (mouseY - petY) * 0.08

  pet.style.left = petX + "px"
  pet.style.top = petY + "px"

  sleepBubble.style.left = petX + 40 + "px"
  sleepBubble.style.top = petY - 30 + "px"

  idleTimer++

  if(idleTimer > 300){
    pet.classList.add("sleep")
    sleepBubble.style.opacity = 1
  }

  requestAnimationFrame(updatePet)
}

setInterval(()=>{

  hunger -= 1

  if(hunger < 30){
    pet.classList.add("hungry")
  } else{
    pet.classList.remove("hungry")
  }

  if(hunger <= 0){
    hunger = 0
  }

  hungerDisplay.textContent = hunger

},2000)

updatePet()
