const pet = document.getElementById("pet")
const hungerDisplay = document.getElementById("hunger")

let mouseX = window.innerWidth/2
let mouseY = window.innerHeight/2

let petX = mouseX
let petY = mouseY

let hunger = 100
let idleTimer = 0

document.addEventListener("mousemove", e=>{
  mouseX = e.clientX
  mouseY = e.clientY
  idleTimer = 0
  pet.classList.remove("sleep")
})

document.addEventListener("click", ()=>{
  hunger = Math.min(100, hunger + 10)
})

function updatePet(){

  petX += (mouseX - petX) * 0.08
  petY += (mouseY - petY) * 0.08

  pet.style.left = petX + "px"
  pet.style.top = petY + "px"

  idleTimer++

  if(idleTimer > 300){
    pet.classList.add("sleep")
  }

  requestAnimationFrame(updatePet)
}

setInterval(()=>{

  hunger -= 1

  if(hunger < 30){
    pet.classList.add("hungry")
  }else{
    pet.classList.remove("hungry")
  }

  if(hunger <= 0){
    hunger = 0
  }

  hungerDisplay.textContent = hunger

},2000)

updatePet()
