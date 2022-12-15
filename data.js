//UI Config
const textDiv = document.querySelector('#text');
const actionsDiv = document.querySelector('#actions');
const statsDiv = document.querySelector('#stats');
const saveDiv = document.querySelector('#save');
const startButton = document.querySelector('#start');
const resumeButton = document.querySelector('#resume');

//Data
let user = {
    name: '',
    sprite: '',
    health: 5,
    power: 1,
    storage: []
}

let gameId = ''

let progress = 0;

const monsterEncounter = {
    id: 'monster',
    text: 'You come around the corner and see a shadow. It appears to be a ',
    choice: 'Engage?',
    encounters:  [
        {
            itemName: 'goblin',
            monsterHealth: 5,
            affects: 'health',
            affectAmount: -2,
            choice: 'Charge!'
        },
        {
            itemName: 'stone golem',
            monsterHealth: 10,
            affects: 'health',
            affectAmount: -5,
            choice: 'Charge!'
        },
        {
            itemName: 'hellhound',
            monsterHealth: 5,
            affects: 'health',
            affectAmount: -3,
            choice: 'Charge!'
        }
    ]
}


const chestEncounters = {
    id: 'chest',
    text: 'You find a chest half buried in dirt and covered in leaves. You open it and inside is a ',
    encounters: [
        {
            itemName: 'gold embossed scroll',
            affects: 'power',
            affectAmount: -2,
            text: 'After reading the contets, you hear a cackle, and you feel a bit weaker',
            choice: 'Read it?',
        },
        {
            itemName: 'skull ring',
            affects: 'power',
            affectAmount: -1,
            text: 'It clutches to your finger, unable to remove it, it drains a bit of your strength',
            choice: 'Put it on?',
        },
        {
            itemName: 'old Spell Book',
            affects: 'power',
            affectAmount: 5,
            text: 'After reading the book, your sword glows with light. It feels lighter, stronger.',
            choice: 'Read it?',
        },
        {
            itemName: 'blackened sword',
            affects: 'power',
            affectAmount: 10,
            text: `You've found a legendary sword, forged by most skilled dwarves, blessed by the highest elves. It's power is unmatched.`,
            choice: 'Pick it up?',
        },
    ]
} 

const tavernEncounter = {
    id: 'tavern',
    text: `You find an old tavern that seems to be abandoned. You look behind the bar for some food or drink. You find a `,
    encounters : [
        {
            itemName: 'hearty  beer',
            affects: 'health',
            affectAmount: 2,
            text: 'Mmm delicious',
            choice: 'Drink it?',
        },
        {
            itemName: 'golden drink',
            affects: 'health',
            affectAmount: 15,
            text: `You've stumbled upon an elixer of the Gods. Lucky you`,
            choice: 'Drink it?',
        },
        {
            itemName: 'goats milk.',
            affects: 'health',
            affectAmount: -1,
            text: `It's gone bad unfortunately`,
            choice: 'Drink it?',
        },
        {
            itemName: 'fresh water',
            affects: 'health',
            affectAmount: 1,
            text: `You feel refreshed`,
            choice: 'Drink it?',
        },
        {
            itemName: 'ham',
            affects: 'health',
            affectAmount: 3,
            text: `It's...A ham.`,
            choice: 'Eat it?',
        },
        {
            itemName: 'glowing potion',
            affects: 'health',
            affectAmount: -2,
            text: `An unhelpful witch has created this.`,
            choice: 'Drink it?',
        }
    ]
}

const finalEncounter = {
    id: 'final',
    text: `You've made it to castle alive. You enter the courtyard and there he stands. The Horned Skull King. You raise your sword.`,
    encounters : [
        {
            itemName: 'The Horned Skull King',
            monsterHealth: 25
        }
    ]
}

const possibleEncounters = [monsterEncounter, chestEncounters, tavernEncounter];

//Encounters
let curEncounter;
let curEncounterItem;

startButton.onclick = () => {
    gameId = Math.floor(100000 + Math.random() * 900000);;
    renderUserData();
    continueJourney();
}

resumeButton.onclick = () => {
    actionsDiv.innerHTML = '';
    let idInput = document.createElement('input');
    idInput.setAttribute('type', 'text');
    idInput.setAttribute('id', 'resumeInput');
    idInput.setAttribute('placeholder', 'Game Id')
    let submitButton = document.createElement('button');
    submitButton.innerText = 'Resume'
    submitButton.setAttribute('onclick', `resumeGame()`);
    actionsDiv.appendChild(idInput);
    actionsDiv.appendChild(submitButton);
}

async function resumeGame(){
    gameId = document.querySelector('#resumeInput').value;
    await getGame();
    continueJourney();
}

async function continueJourney(){
    progress++;
    showSave();
    renderUserData();
    if(progress < 15){
        curEncounter = {...possibleEncounters[Math.floor(Math.random()*possibleEncounters.length)]};
        curEncounterItem = {...curEncounter.encounters[Math.floor(Math.random()*curEncounter.encounters.length)]};
        setText(curEncounter.text, curEncounterItem);
        setActions(curEncounterItem.choice);
    } else {
        progress++;
        curEncounter = {...finalEncounter};
        curEncounterItem = {...finalEncounter.encounters[0]}
        setText(curEncounter.text);
        setActions('Charge!')
    }
}

function setText(text, item){
    if(item){
        textDiv.innerText = text + item.itemName;
    } else {
        textDiv.innerText = text;
    }

}

function setActions(text){
    actionsDiv.innerHTML = '';
    let confirmButton = document.createElement('button');
    confirmButton.innerText = text;
    confirmButton.setAttribute('onclick', `confirmAction()`);
    actionsDiv.appendChild(confirmButton);
    if(curEncounter.id !== 'final'){
        let declineButton = document.createElement('button');
        declineButton.innerText = 'Decline';
        declineButton.setAttribute('onclick', `declineAction()`)
        actionsDiv.appendChild(declineButton);
    }

}

function confirmAction(){
    actionsDiv.innerHTML = ''
    if(curEncounter.id === 'monster'){
        user.power = user.power + (curEncounterItem.affectAmount * -1);
        if(user.power < curEncounterItem.monsterHealth){
            user[curEncounterItem.affects] = user[curEncounterItem.affects] + curEncounterItem.affectAmount;
            setText(`The ${curEncounterItem.itemName} was a bit strong for you. You got away with a bit of damage.`)
        } else {
            setText(`The ${curEncounterItem.itemName} was no match for you`);

        }
        renderUserData();
        setTimeout(function() {  continueJourney(); }, 5000);
    } else if(curEncounter.id === 'final'){
        if(user.power < curEncounterItem.monsterHealth){
            setText(`You fall to the foul king's blade. You look down upon the kingdom you weren't able to save...`)
        } else {
            setText(`You fight for the lives of the kingdom. You strike hard and fast. The foul king falls to his knees and with one final slash you end him.  You have finally brought peace to the land.`)
        }
    } else {
        user[curEncounterItem.affects] = user[curEncounterItem.affects] + curEncounterItem.affectAmount;
        setText(curEncounterItem.text);
        renderUserData();
        setTimeout(function() {  continueJourney(); }, 5000);
    }


}

function declineAction(){
    setText('You decide to leave and continue on your journey.')
    actionsDiv.innerHTML = ''
    setTimeout(function() {  continueJourney(); }, 5000);
}
    
function renderUserData(){

    statsDiv.innerHTML = '';
    let health = document.createElement('p');
    health.innerText = 'Health: ' + user.health;
    let power = document.createElement('p');
    power.innerText = 'Power: ' + user.power;
    let step = document.createElement('p');
    step.innerText = progress + '/15'
    statsDiv.appendChild(health);
    statsDiv.appendChild(power);
    statsDiv.appendChild(step)
}

function showSave(){
    saveDiv.innerHTML = '';
    let idLabel = document.createElement('p');
    idLabel.innerText = 'Please note down this Id to resume game: ' + gameId;
    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save Game';
    saveButton.setAttribute('onclick', 'saveGame()');
    saveDiv.appendChild(idLabel);
    saveDiv.appendChild(saveButton);
}

async function saveGame(){
    const game = {
        gameId,
        user,
        progress
    }
    await fetch('/.netlify/functions/save-game/', {
        method: 'POST',
        body: JSON.stringify({game}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => console.log(res.json()));
    // .then(data => console.log(data))
}

async function getGame(){
    await fetch(`/.netlify/functions/get-game/?id=${gameId}`).then(res => console.log(res.json()))
    // .then(data => {
    //     gameId = data.gameId;
    //     progress = data.progress - 1;
    //     user = data.user;
    // });
}