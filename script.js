class Panel {
    constructor(board, tableRowElement, row, col) {
	this.isOn    = false;
	this.board   = board;
	this.row     = row;
	this.col     = col;
	this.element = tableRowElement.insertCell(-1);
	this.element.className = 'panel';
	this.element.setAttribute('isOn', false);
	this.element.setAttribute('selected', false);
	this.element.addEventListener('click', this.onClick(this));
	this.element.addEventListener('mouseover', this.onMouseOver(this));
    }

    turnLight(b) {
	this.isOn = b;
	this.element.setAttribute('isOn', b);
    }

    toggleLight() {
	this.turnLight(!this.isOn);
    }

    onClick(panel) {
	return () => {
	    panel.board.onClickPanel(panel);
	};
    }

    onMouseOver(panel) {
	return () => {
	    panel.board.onMouseOverAPanel(panel);
	};
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
	    this.element.removeChild(this.element.firstChild);
	}
	for (let row = 0; row < this.height; row++) {
	    this.panels[row] = [];
	    let rowElement = this.element.insertRow(row);
	    for (let col = 0; col < this.width; col++) {
		this.panels[row][col] =
		    new Panel(this, rowElement, row, col);
	    }
	}
    }

    enumAllPanels() {
	return this.panels.reduce((row, listOfPanels) =>
				  row.concat(listOfPanels), []);
    }

    enumSelectedPanels(centerPanel) {
	return this.enumAllPanels().filter(panel => isNeighbor(panel, centerPanel));
    }
    
    onClickPanel(clickedPanel) {
	this.toggleSelectedPanels(clickedPanel);
	if (this.checkClear()) {
	    setTimeout(clearHandling, 1);
	}
    }

    onMouseOverAPanel(mousePanel) {
	this.enumAllPanels().forEach(
	    panel => panel.element.setAttribute('selected', isNeighbor(panel, mousePanel)));
    }

    toggleSelectedPanels(centerPanel) {
	this.enumSelectedPanels(centerPanel).forEach(panel => panel.toggleLight());
    }
    
    turnOffAll() {
	this.enumAllPanels().forEach(panel => panel.turnLight(false));
    }

    randomize() {
	this.turnOffAll();
	for (let i = 0; i < levelSettingBox.getValue(); i++) {
	    let row = Math.floor(Math.random() * this.height);
	    let col = Math.floor(Math.random() * this.width);
	    this.toggleSelectedPanels(this.panels[row][col]);
	}
	if (this.checkClear()) {
	    this.randomize();
	}
    }

    checkClear() {
	let clear = true;
	this.enumAllPanels().forEach(
	    panel => { if (panel.isOn) clear = false; });
	return clear;
    }
}

function isNeighbor(panel1, panel2) {
    return Math.abs(panel1.row - panel2.row) + Math.abs(panel1.col - panel2.col) <= 1;
}

function clearHandling() {
    window.alert('クリア！！');
    levelSettingBox.setValue(levelSettingBox.getValue() + 1);
    board.randomize();
    
}

function onLevelInput() {
    board.randomize();
}

function onSizeInput() {
    board.height = document.getElementById('heightSettingBox').value;
    board.width = document.getElementById('widthSettingBox').value;
    board.reconstruct();
    board.randomize();
}

class SettingBox {
    constructor(elementId, defaultValue, inputListener) {
	this.element = document.getElementById(elementId);
	this.element.setAttribute('value', defaultValue);
	this.element.addEventListener('input', inputListener);
    }

    getValue() {
	return Number(this.element.value);
    }

    setValue(x) {
	this.element.value = x;
    }
}

const levelSettingBox  = new SettingBox('levelSettingBox' , 1, onLevelInput);
const heightSettingBox = new SettingBox('heightSettingBox', 5, onSizeInput);
const widthSettingBox  = new SettingBox('widthSettingBox' , 5, onSizeInput);

const board = new Board(heightSettingBox.getValue(), widthSettingBox.getValue());

