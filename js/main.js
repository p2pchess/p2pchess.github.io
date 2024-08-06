// import the chess board object and the peer object
import {Chessground} from './chessground.min.js';
import {Peer} from 'https://esm.sh/peerjs@1.5.4?bundle-deps';

// globals :)
const 	tabs = document.getElementsByClassName("tab"),
		tablinks = document.getElementsByClassName("tab-item");

var	peer = null, previousPeer = null, nextPeer = null, previousId, userId = 1;

// UI Functions

// Switch between app tabs
function openTab(buttonId, tabName)
{
	var i;
	for (i = 0; i < tabs.length; i++) {
		tabs[i].style.display = "none";  
	}
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace("tab-item-select", "");
	}
	document.getElementById(tabName).style.display = "block";
	document.getElementById(buttonId).className += " tab-item-select";
}			

// Network functions

// Connect user to p2pchess
function connectPeer()
{
	peer = new Peer('p2pchess-user' + userId);

	peer.on('error', function(err) {
		if (err.type == 'unavailable-id') {
			userId++;
			connectPeer(userId);
		}
		else if (err.type == 'peer-unavailable') {
			previousPeer.close();
			if (previousId > 1) {
				previousId = previousId - 1;
				findPreviousPeer();
			}
		}
	});
	peer.on('open', function(id) {
		document.getElementById('account-name').innerText = 'p2pchess-user' + userId;
		// Listening for the connection of the next user
		peer.on('connection', function(dataConnection) {
			nextPeer = dataConnection;
			nextPeer.on('close', function() {
				console.log('next peer disconnected');
				nextPeer.close();
				console.log(nextPeer);
			});
		});
		// If not the number 1 user,try to connect to the previous peer with the closest id number
		if (userId > 1) {
			previousId = userId - 1;
			findPreviousPeer();
		}
	});
}

// Find the previous peer
function findPreviousPeer()
{
	previousPeer = peer.connect('p2pchess-user' + previousId);
	previousPeer.on('open', function() {
		//console.log('connected to last peer with id ' + previousId);
	});
	previousPeer.on('close', function() {
		console.log('previous peer disconnected');
		previousPeer.close();
		console.log(previousPeer);
	});
}

// Entry point
(function() {
	// run the chess worker
	const chessWorker = new Worker('./scalachess.min.js');
	chessWorker.onmessage = function(event){
		//console.log(event.data);
	};

	// connect to peer network
	connectPeer();
	
	// detect when users closes the page and properly disconnect the peer
	window.addEventListener('beforeunload', function (e) {
		if (previousPeer != null) {
			previousPeer.close();
		}
		if (nextPeer != null) {
			nextPeer.close();
		}
		peer.destroy();
	});
	//Exposing ui functions in the window object
	window.openTab = openTab;
})();
