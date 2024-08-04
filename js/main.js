import {Chessground} from './chessground.min.js';

const board = Chessground(document.getElementById('chessground'), {});
const chessWorker = new Worker('./scalachess.min.js');
chessWorker.onmessage = function(event){
	console.log(event.data);
};

function openTab(evt, tabName) {
	var i;
	var x = document.getElementsByClassName("tab");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";  
	}
	var tablinks = document.getElementsByClassName("tab-item");
	for (i = 0; i < x.length; i++) {
		tablinks[i].className = tablinks[i].className.replace("tab-item-select", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " tab-item-select";
}			

window.openTab = openTab;
