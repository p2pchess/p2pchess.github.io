import {Chessground} from './chessground.min.js';

const board = Chessground(document.getElementById('board-1'), {});
const chessWorker = new Worker('./scalachess.min.js');
chessWorker.onmessage = function(event){
	console.log(event.data);
};

export function openTab(tabName) {
	var i;
	var x = document.getElementsByClassName("tab");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";  
	}
	document.getElementById(tabName).style.display = "block";  
}			
