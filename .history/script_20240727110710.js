let data = [];
let quantity = [4,4,2,1,1];
let gift = ['Quạt gió', 'Quạt gió', 'Nồi cơm', 'Tủ lạnh', 'Xe máy'];
let number_arr = 0;
let intervalId; 
const audioElement = document.getElementById('spin-audio'); 
const startButton = document.getElementById('start-button');
const resultTable = document.getElementById('result-table');
const clearButton = document.getElementById('clear-result');


async function loadExcel() {
    await fetch('data-code.xlsx')
        .then(response => response.arrayBuffer())
        .then(d => {
            const workbook = XLSX.read(d, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            data = jsonData;


        })
        .catch(error => console.error('Error loading Excel file:', error));
        
    }
    
window.onload = loadExcel;
async function startRandom() {
    // await loadExcel()

    audioElement.play();

    if (data.length === 0) {
        alert('Dữ liệu chưa được tải xong.');
        return;
    }

    startButton.disabled = true;

    intervalId = setInterval(() => {
        // const randomIndex = Math.floor(Math.random() * data.length);
        // const randomEntry = data[randomIndex];

        // document.getElementById('code-display').innerText = randomEntry[0];

        const winners = getRandomEntries(data, quantity[number_arr]);
        const displayText = winners.map(entry => entry[0]).join(', ');
        document.getElementById('code-display').innerText = displayText;
    }, 100);
    
    
    setTimeout(stopRandom, 10000);
}


async function stopRandom() {

    // await loadExcel();

    clearInterval(intervalId);

    const winners = getSequentialEntries(data, quantity[number_arr]);
    const displayText = winners.map(entry => entry[0]).join(', ');
    document.getElementById('code-display').innerText = displayText;

    const finalEntries = winners.map(entry => {
        const index = data.findIndex(d => d[0] === entry[0]);
        if (index !== -1) {
            return data.splice(index, 1)[0];
        }
        return null;
    }).filter(entry => entry !== null);


    updateResultTable(finalEntries);

    if (number_arr < 5) {
        number_arr = number_arr + 1;
    }else{
        return alert('Đã hết 5 lần quay');
    }

    startButton.disabled = false;
}

function getSequentialEntries(array, n) {
    const result = array.slice(0, n);
    return result;
}

function getRandomEntries(array, n) {
    const result = new Array(n);
    let len = array.length;
    const taken = new Array(len);
    if (n > len) {
        throw new RangeError("getRandomEntries: nhiều phần tử hơn số lượng mảng hiện có");
    }
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = array[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function updateResultTable(entries) {

    const rows = resultTable.querySelectorAll('.table-row:not(:first-child)');
    rows.forEach(row => row.remove());

    entries.forEach((entry, index) => {
        const row = document.createElement('div');
        row.classList.add('table-row');

        const sttCol = document.createElement('div');
        sttCol.classList.add('table-col');
        sttCol.textContent = index + 1;

        const prizeCol = document.createElement('div');
        prizeCol.classList.add('table-col');
        prizeCol.textContent = gift[number_arr];

        const codeCol = document.createElement('div');
        codeCol.classList.add('table-col');
        codeCol.textContent = entry[0];

        const phoneCol = document.createElement('div');
        phoneCol.classList.add('table-col');
        phoneCol.textContent = entry[2];

        row.appendChild(sttCol);
        row.appendChild(prizeCol);
        row.appendChild(codeCol);
        row.appendChild(phoneCol);

        resultTable.appendChild(row);
    });
}


function clearResults() {
    document.getElementById('code-display').innerText = '';

    const rows = resultTable.querySelectorAll('.table-row:not(:first-child)');
    rows.forEach(row => row.remove());
}