import {Chessground} from './chessground.min.js';

const board = Chessground(document.getElementById('chessground'), {});
const chessWorker = new Worker('./scalachess.min.js');
chessWorker.onmessage = function(event){
	console.log(event.data);
};

function openTab(tabName) {
	var i;
	var x = document.getElementsByClassName("tab");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";  
	}
	document.getElementById(tabName).style.display = "block";  
}			

window.openTab = openTab;
