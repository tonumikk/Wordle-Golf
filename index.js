import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-edb23-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const wordleSolutionInDB = ref(database, "wordleSolution")

const inputFieldEl = document.getElementById("input-field")
const guessNumberEl = document.getElementById("guess-number")
const addButtonEl = document.getElementById("add-button")
const wordleSolutionEl = document.getElementById("shopping-list")
const eagleListEl = document.getElementById("eagle-list")
const birdieListEl = document.getElementById("birdie-list")
const parListEl = document.getElementById("par-list")
const bogeyListEl = document.getElementById("bogey-list")
const dblbogeyListEl = document.getElementById("dblbogey-list")
const golfScoreEl = document.getElementById("golf-score")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    let guessNumber = guessNumberEl.value
    let golfScore = 0
    if (guessNumber === 1){
        golfScore = -3
    }else if(guessNumber === 2){
        golfScore = -2
    }else if(guessNumber === 3){
        golfScore = -1
    }else if(guessNumber === 4){
        golfScore = 0
    }else if(guessNumber === 5){
        golfScore = 1
    }else if(guessNumber === 6){
        golfScore = 2
    }else{
        golfScore = 0
    }
    let wordleSolution = {
        word: inputValue,
        guesses: guessNumber,
        score: golfScore
    }
    
    push(wordleSolutionInDB, wordleSolution)
    
    clearInputFieldEl()
})

onValue(wordleSolutionInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearwordleSolutionEl()
        
        let golfScoreArray = []
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let wordArray = Object.values(currentItem[1]) 
            golfScoreArray.push(wordArray[1]) 
            appendItemTowordleSolutionEl(wordArray,currentItemID)
        }    
        calculateGolfScore(golfScoreArray)
    } else {
        wordleSolutionEl.innerHTML = "No items here... yet"
    }
})

function clearwordleSolutionEl() {
    eagleListEl.innerHTML = ""
    birdieListEl.innerHTML = ""
    parListEl.innerHTML = ""
    bogeyListEl.innerHTML = ""
    dblbogeyListEl.innerHTML = ""
    wordleSolutionEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
    guessNumberEl.value= ""
}

function addGolfScoreEl(score) {
    golfScoreEl.innerHTML = `Golf score: ${score}` 
}

function appendItemTowordleSolutionEl(item,itemIDInDB) {
    let itemID = item[0]
    let itemValue = item[2]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `wordleSolution/${itemIDInDB}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    if(itemID === "2"){
        eagleListEl.append(newEl)
    }else if (itemID === "3"){
        birdieListEl.append(newEl)
    }else if (itemID === "4"){
        parListEl.append(newEl)
    }else if (itemID === "5"){
        bogeyListEl.append(newEl)
    }else if (itemID === "6"){
        dblbogeyListEl.append(newEl)
    }else{
    wordleSolutionEl.append(newEl)
    }
    
}

function calculateGolfScore(valuesArray){
    let golfScore = 0
    for (let j = 0; j < valuesArray.length; j++){
        golfScore += valuesArray[j]
    }
    addGolfScoreEl(golfScore)    
}