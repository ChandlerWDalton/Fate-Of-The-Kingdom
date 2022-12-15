const conquerors = document.querySelector('#conquerors');
const getConquerors = document.querySelector('#getConquerors');

getConquerors.onclick = async () => {
    await fetch(`/.netlify/functions/get-conquerors/`)
    .then(res => res.json())
    .then(data => {
        conquerors.innerHTML = ''
        for (const hero of data){
            let label = document.createElement('p')
            label.innerText = hero.user.name;
            conquerors.appendChild(label);
        }
    })
}