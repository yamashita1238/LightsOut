let gameLevel = 3;

class Panel {
    constructor(isOn, board, tableRowElement, row, col) {
	this.isOn = isOn;
	this.board = board;
	this.row = row;
	this.col = col;
	this.panelElement = tableRowElement.insertCell(-1);
	this.panelElement.className = 'panel';
	this.panelElement.setAttribute('isOn', false);
	this.panelElement.setAttribute('selected', false);
	this.panelElement.addEventListener('click', this.onClick(this));
	this.panelElement.addEventListener('mouseover', this.onMouseOver(this));
    }

    toggleLight() {
	this.isOn = !this.isOn;
	this.panelElement.setAttribute('isOn', this.isOn);
    }

    onClick(panel) {
	return () => {
	    panel.board.onClickPanel(panel.row, panel.col);
	};
    }

    onMouseOver(panel) {
	return () => {
	    panel.board.onMouseOverAPanel(panel.row, panel.col);
	}
    }
}

class Board {
    constructor(height, width) {
	this.element = document.getElementById('boardtable');
	this.height  = height;
	this.width   = width;
	this.reconstruct();
	this.randomize();
    }

    reconstruct() {
	this.panels  = [];
	while (this.element.firstChild) {
	    this.element.removeChild(this.element.firstChild)
	}
	for (let row = 0; row < this.height; row++) {
	    this.panels[row] = [];
	    let rowElement = this.element.insertRow(row);
	    rowElement.id = 'row' + row.toString();
	    for (let col = 0; col < this.width; col++) {
		this.panels[row][col] =
		    new Panel(false, this, rowElement, row, col);
	    }
	}
    }
    
    onClickPanel(clickRow, clickCol) {
	this.toggleFivePanels(clickRow, clickCol);
	if (this.checkClear()) {
	    setTimeout(showClearMessage, 1);
	}
    }

    onMouseOverAPanel(mouseRow, mouseCol) {
	for (let row = 0; row < this.height; row++) {
	    for (let col = 0; col < this.width; col++) {
		board.panels[row][col].panelElement
		     .setAttribute('selected', isNeighbor(row, col, mouseRow, mouseCol));
	    }
	}
    }

    toggleFivePanels(centerRow, centerCol) {
	for (let row = 0; row < this.height; row++) {
	    for (let col = 0; col < this.width; col++) {
		if (isNeighbor(row, col, centerRow, centerCol)) {
		    this.panels[row][col].toggleLight();
		}
	    }
	}
    }
    
    turnOffAll() {
	for (let row = 0; row < this.height; row++) {
	    for (let col = 0; col < this.width; col++) {
		let panel = this.panels[row][col];
		if (panel.isOn) {
		    panel.toggleLight();
		}		    
	    }
	}
    }

    randomize() {
	this.turnOffAll();
	for (let i = 0; i < gameLevel; i++) {
	    let row = Math.floor(Math.random() * this.height);
	    let col = Math.floor(Math.random() * this.width);
	    this.toggleFivePanels(row, col);
	}
	if (this.checkClear()) {
	    this.randomize();
	}
    }

    checkClear() {
	for (let row = 0; row < this.height; row++) {
	    for (let col = 0; col < this.width; col++) {
		if (this.panels[row][col].isOn) {
		    return false;
		}
	    }
	}
	return true;
    }
}

function isNeighbor(row1, col1, row2, col2) {
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) <= 1;
}

function showClearMessage() {
    window.alert('クリア！！');
}

function onLevelInput() {
    gameLevel = document.getElementById('levelSettingBox').value;
    board.randomize();
}

function onSizeInput() {
    board.height = document.getElementById('heightSettingBox').value;
    board.width = document.getElementById('widthSettingBox').value;
    board.reconstruct();
    board.randomize();
}

const levelSettingBox  = document.getElementById('levelSettingBox');
levelSettingBox.setAttribute('value', gameLevel);
levelSettingBox.addEventListener('input', onLevelInput);

const heightSettingBox = document.getElementById('heightSettingBox');
heightSettingBox.addEventListener('input', onSizeInput);

const widthSettingBox  = document.getElementById('widthSettingBox');
widthSettingBox.addEventListener('input', onSizeInput);

let board = new Board(heightSettingBox.value, widthSettingBox.value);

