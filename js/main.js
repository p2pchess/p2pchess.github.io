// import the chess board object
import {Chessground} from './chessground.min.js';

// globals :)
const	tabs		= document.getElementsByClassName("tab"),
		tablinks	= document.getElementsByClassName("tab-item");

function openTab(evt, tabName) {
	var i;
	for (i = 0; i < tabs.length; i++) {
		tabs[i].style.display = "none";  
	}
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace("tab-item-select", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " tab-item-select";
}			

(function() {
	// test board
	Chessground(document.getElementById('chessground'), {});
	// run the chess worker
	const chessWorker = new Worker('./scalachess.min.js');
	chessWorker.onmessage = function(event){
		console.log(event.data);
	};

	// some functions need to be accessed via html page
	window.openTab = openTab;
})();

