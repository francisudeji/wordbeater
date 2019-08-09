window.addEventListener('load', init)

// Globals

// Available Levels
const levels = {
  easy: 5,
  medium: 3,
  hard: 1
}

// To change level
let currentLevel = levels.easy

let time = currentLevel
let score = 0
let isPlaying

// DOM Elements
const wordInput = document.querySelector('#word-input')
const currentWord = document.querySelector('#current-word')
const scoreDisplay = document.querySelector('#score')
const timeDisplay = document.querySelector('#time')
const message = document.querySelector('#message')
const seconds = document.querySelector('#seconds')

///////////////
const levelSelector = document.querySelector('#level')
const highScore = document.querySelector('#high-score')
const reset = document.querySelector('#reset')
///////////////

let words = []

// Initialize Game
function init() {
  // fetch words
  fetch('https://random-word-api.herokuapp.com/word?key=KL3GOQ7P&number=100')
    .then(res => res.json())
    .then(data => {
      words = [...data]
      showWord(words)
    })
    .catch(err => console.log(err))
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel
  // Load word from array
  // showWord(words)
  // Start matching on word input
  wordInput.addEventListener('input', startMatch)
  ////////////////////////////////////////
  // Listen for level change
  levelSelector.addEventListener('change', selectLevel)
  ////////////////////////////////////////
  // Call countdown every second
  setInterval(countdown, 1000)
  // Check game status
  setInterval(checkStatus, 50)
}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true
    time = currentLevel + 1
    showWord(words)
    wordInput.value = ''
    score++
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0
  } else {
    scoreDisplay.innerHTML = score
  }
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!'
    return true
  } else {
    message.innerHTML = ''
    return false
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length)
  // Output random word
  currentWord.innerHTML = words[randIndex]
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--
  } else if (time === 0) {
    // Game is over
    isPlaying = false
  }
  // Show time
  timeDisplay.innerHTML = time
}

function showHighScore(newScore) {
  const lastHighScore = localStorage.getItem('high-score')

  if (lastHighScore === null || newScore > lastHighScore) {
    localStorage.setItem('high-score', newScore)
    highScore.style.display = 'block'
    highScore.parentElement.style.display = 'block'
    highScore.innerHTML = newScore
  } else {
    highScore.style.display = 'block'
    highScore.parentElement.style.display = 'block'
    highScore.innerHTML = lastHighScore
  }
}

// Check game status
function checkStatus() {
  // let currentScore = 0
  if (!isPlaying && time === 0) {
    message.innerHTML = 'Game Over!!!'
    // currentScore = score
    showHighScore(score)
    score = -1
  }
}

// Select level
function selectLevel(e) {
  // change current level
  currentLevel = levels[e.target.value]
  // reset words
  showWord(words)
  // rest time
  time = currentLevel
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel
}
