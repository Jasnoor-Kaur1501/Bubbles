# 🐥 Bubbles — The Desk Pet

Bubbles is a tiny interactive desk pet that lives on your screen, follows your cursor, and reacts to your behavior. Built using pure HTML, CSS, and JavaScript, it’s a lightweight browser-based companion with simple game mechanics.

---

## ✨ Features

* 🖱️ **Cursor Following** — smoothly follows your mouse with easing
* 😴 **Idle Sleep System** — gets sleepy when you stop moving
* 🍞 **Hunger System** — needs to be fed over time
* ⚡ **Energy System** — drains with activity, recharges while idle
* 😊 **Happiness System** — increases with interaction
* 🎮 **Interactive Controls**

  * Feed → restores hunger
  * Play → increases happiness but uses energy
  * Pet → small happiness boost
* 🧠 **Mood System**

  * 😫 when hungry
  * 😴 when tired
  * 😄 when happy
  * 🐥 default state
* 📈 **Level System**

  * Level up by keeping your pet happy and well-fed
* 💤 **Sleep Indicator**

  * Displays a floating “💤” bubble when idle

---

## 🧩 Tech Stack

* **HTML** — structure
* **CSS** — styling and positioning
* **JavaScript (Vanilla)** — animation, state management, game logic

No frameworks, no libraries — just pure frontend.

---

## 🚀 How to Run

1. Clone the repository

```bash
git clone https://github.com/your-username/bubbles-desk-pet.git
```

2. Open the project folder

3. Run `index.html` in your browser

That’s it. No setup required.

---

## 📁 Project Structure

```
bubbles-desk-pet/
│
├── index.html
├── style.css
└── script.js
```

---

## 🧠 How It Works

* Uses `requestAnimationFrame` for smooth pet movement
* Uses `setInterval` for stat decay and game updates
* Tracks internal state:

  * hunger
  * energy
  * happiness
  * level
* Behavior changes dynamically based on user interaction and inactivity

---

## 🎯 Future Improvements

* 🐣 Pet evolution (egg → chick → bird)
* 🍎 Drag-and-drop food system
* 💾 Save progress using localStorage
* 🎵 Sound effects (purring, sleeping, etc.)
* 🎨 Multiple pet skins

---

## 💡 Inspiration

Inspired by classic desktop pets and Tamagotchi-style interactions, reimagined for the browser.

---

## 📌 Notes

This project was built as a fun experiment to explore:

* DOM manipulation
* animation loops
* interactive UI behavior

---

## ⭐ If You Like This

Consider starring the repo or sharing it — Bubbles appreciates the attention 🐥
