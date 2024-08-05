// import the chess board object and the peer object
import {Chessground} from './chessground.min.js';
import {Peer} from 'https://esm.sh/peerjs@1.5.4?bundle-deps';

// globals :)
const 	tabs = document.getElementsByClassName("tab"),
		tablinks = document.getElementsByClassName("tab-item");

var	peer = null, userId = 1;

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

function connectPeer()
{
	peer = new Peer('p2p-user' + userId);

	peer.on('error', function(err) {
		if (err.type == 'unavailable-id') {
			console.log('User id unavailable, trying next');
			userId++;
			connectPeer(userId);
		}
	});
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
	});
}

// Entry point
(function() {
	// run the chess worker
	const chessWorker = new Worker('./scalachess.min.js');
	chessWorker.onmessage = function(event){
		console.log(event.data);
	};

	// connect to peer network
	connectPeer();

	// some functions need to be accessed via html page
	window.openTab = openTab;
})();

	// test board
	//Chessground(document.getElementById('chessground'), {});