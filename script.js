const pet = document.getElementById("pet")
const sleepBubble = document.getElementById("sleepBubble")

const hungerDisplay = document.getElementById("hunger")
const energyDisplay = document.getElementById("energy")
const happyDisplay = document.getElementById("happy")
const levelDisplay = document.getElementById("level")

let mouseX = window.innerWidth/2
let mouseY = window.innerHeight/2

let petX = mouseX
let petY = mouseY

let hunger = 100
let energy = 100
let happiness = 80
let level = 1

let idleTimer = 0

// BUTTON ACTIONS

document.getElementById("feed").onclick = () => {
  hunger = Math.min(100, hunger + 20)
}

document.getElementById("play").onclick = () => {
  happiness = Math.min(100, happiness + 15)
  energy = Math.max(0, energy - 10)
}

document.getElementById("petBtn").onclick = () => {
  happiness = Math.min(100, happiness + 5)
}


// MOUSE MOVEMENT

document.addEventListener("mousemove", e=>{
  mouseX = e.clientX
  mouseY = e.clientY
  idleTimer = 0

  pet.classList.remove("sleep")
  sleepBubble.style.opacity = 0
})


// CLICK REACTION

document.addEventListener("click", ()=>{

  pet.style.transform = "translate(-50%, -60%) scale(1.2)"

  setTimeout(()=>{
    pet.style.transform = "translate(-50%, -50%)"
  },200)

})


// PET CLICK INTERACTION

pet.onclick = () => {
  happiness = Math.min(100, happiness + 10)
}


// MOOD SYSTEM

function updateMood(){

  if(hunger < 20){
    pet.innerHTML = "😫"
  }
  else if(energy < 20){
    pet.innerHTML = "😴"
  }
  else if(happiness > 80){
    pet.innerHTML = "😄"
  }
  else{
    pet.innerHTML = "🐥"
  }

}


// PET MOVEMENT LOOP

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

    energy = Math.min(100, energy + 1)
  }

  updateMood()

  requestAnimationFrame(updatePet)
}


// GAME LOOP

setInterval(()=>{

  hunger -= 2
  energy -= 1
  happiness -= 1

  if(hunger < 30){
    pet.classList.add("hungry")
  }else{
    pet.classList.remove("hungry")
  }

  if(hunger < 0) hunger = 0
  if(energy < 0) energy = 0
  if(happiness < 0) happiness = 0

  // LEVEL SYSTEM

  if(happiness > 90 && hunger > 80){
    level += 1
    happiness = 70
  }

  // UPDATE UI

  hungerDisplay.textContent = hunger
  energyDisplay.textContent = energy
  happyDisplay.textContent = happiness
  levelDisplay.textContent = level

},2000)


updatePet()
