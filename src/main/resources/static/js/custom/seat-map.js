const seatMap = document.getElementById("seatMap");
const generateSeatsBtn = document.getElementById("generateSeats");
const setSeatTypeBtn = document.getElementById("setSeatType");
const hideRowBtn = document.getElementById("hideRow");
const showRowBtn = document.getElementById("showRow");
const hideColBtn = document.getElementById("hideCol");
const showColBtn = document.getElementById("showCol");
const numRowsInput = document.getElementById("numRows");
const numColsInput = document.getElementById("numCols");
const rowSelect = document.getElementById("rowSelect");
const colSelect = document.getElementById("colSelect");
const seatTypeSelect = document.getElementById("seatType");
let defaultSeatColor;
function generateSeats(seats) {
    let isUpdate = seats && seats.length > 0;
    defaultSeatColor = seatTypes.find(item => item.isDefault)?.color;
    if(!defaultSeatColor && seatTypes && seatTypes.length > 0){
        defaultSeatColor = seatTypes[0]?.color;
    }
    seatMap.innerHTML = "";
    let rows = parseInt(numRowsInput.value);
    let cols = parseInt(numColsInput.value);
    seatMap.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const seat = document.createElement("div");
            let rowLabel = getSeatRowLabel(r);
            let seatId = rowLabel + (c + 1);
            seat.classList.add("seat", "regular");
            seat.style.backgroundColor = defaultSeatColor;
            seat.dataset.row = rowLabel;
            seat.dataset.col = c + 1;
            seat.textContent = seatId;
            if(isUpdate){
                let eSeat = seats.find(item => item.seatNumber === seatId);
                if(eSeat){
                    seat.style.backgroundColor = eSeat.color;
                } else{
                    seat.classList.add("hidden");
                    seat.style.backgroundColor = 'black';
                }
            }
            seat.style.fontSize = adjustFontSize(rowLabel);
            seat.addEventListener("click", () => {
                seat.classList.toggle("hidden");
                if (!seat.classList.contains("hidden")) {
                    seat.classList.add("regular");
                    seat.style.backgroundColor = defaultSeatColor;
                } else{
                    seat.style.backgroundColor = 'black';
                }
            });
            seatMap.appendChild(seat);
        }
    }
}

function getSeatRowLabel(index) {
    let label = "";
    while (index >= 0) {
        label = String.fromCharCode(65 + (index % 26)) + label;
        index = Math.floor(index / 26) - 1;
    }
    return label;
}

function adjustFontSize(rowLabel) {
    return `${Math.max(16 - rowLabel.length * 2, 10)}px`;
}

generateSeatsBtn.addEventListener("click", generateSeats);

setSeatTypeBtn.addEventListener("click", () => {
    let selectedRows = rowSelect.value.toUpperCase().split(",").map(r => r.trim());
    let seatType = seatTypeSelect.value;
    selectedRows.forEach(row => {
        document.querySelectorAll(`.seat[data-row='${row}']`).forEach(seat => {
            if (!seat.classList.contains("hidden")) {
                seat.style.backgroundColor = seatType;
            }
        });
    });
});

hideRowBtn.addEventListener("click", () => {
    let selectedRows = rowSelect.value.toUpperCase().split(",").map(r => r.trim());
    selectedRows.forEach(row => {
        document.querySelectorAll(`.seat[data-row='${row}']`).forEach(seat => {
            seat.classList.add("hidden");
            seat.style.backgroundColor = 'black';
        });
    });
});

showRowBtn.addEventListener("click", () => {
    let selectedRows = rowSelect.value.toUpperCase().split(",").map(r => r.trim());
    selectedRows.forEach(row => {
        document.querySelectorAll(`.seat[data-row='${row}']`).forEach(seat => {
            seat.classList.remove("hidden");
            seat.style.backgroundColor = defaultSeatColor;
        });
    });
});

hideColBtn.addEventListener("click", () => {
    let selectedCols = colSelect.value.split(",").map(c => c.trim());
    selectedCols.forEach(col => {
        document.querySelectorAll(`.seat[data-col='${col}']`).forEach(seat => {
            seat.classList.add("hidden");
            seat.style.backgroundColor = 'black';
        });
    });
});

showColBtn.addEventListener("click", () => {
    let selectedCols = colSelect.value.split(",").map(c => c.trim());
    selectedCols.forEach(col => {
        document.querySelectorAll(`.seat[data-col='${col}']`).forEach(seat => {
            seat.classList.remove("hidden");
            seat.style.backgroundColor = defaultSeatColor;
        });
    });
});

function getSeatMap(){
    const seatData = [];
    const rows = parseInt(numRowsInput.value);
    const cols = parseInt(numColsInput.value);
    console.log('seatTypes: ', seatTypes);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const seat = document.querySelector(`.seat[data-row='${getSeatRowLabel(r)}'][data-col='${c + 1}']`);
            const color = seat.style.backgroundColor;
            if(!seat.classList.contains("hidden")) {
                let seatType = seatTypes.find(item => item.color === rgbToHex(color));
                seatData.push({
                    seatNumber: seat.innerHTML,
                    seatTypeSeatTypeId: seatType?.seatTypeId,
                    color: seatType.color,
                    price: seatType.price
                });
            }
        }
    }
    console.log('seat-map: ', seatData);
    return seatData;
}

function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    const hex = rgbValues
        .map(value => {
            const hexValue = parseInt(value).toString(16);
            return hexValue.length === 1 ? '0' + hexValue : hexValue;
        })
        .join('');
    return `#${hex}`;
}