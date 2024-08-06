// import the chess board object and the peer object
import {Chessground} from './chessground.min.js';
import {Peer} from 'https://esm.sh/peerjs@1.5.4?bundle-deps';

// globals :)
const 	tabs = document.getElementsByClassName("tab"),
		tablinks = document.getElementsByClassName("tab-item");

var	peer = null, previousPeerInterval = null, previousPeer = null, nextPeer = null, previousId, userId = 1;

// UI Functions

// Switching between app tabs
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

// Creates a quick pairing challenge
function createChallenge(time, increment)
{
	if (previousPeer != null) {
		previousPeer.send({time: time, increment: increment});
	}
	if (nextPeer != null) {
		nextPeer.send({time: time, increment: increment});
	}
}

// Network functions

// Connects user to p2pchess
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
			previousPeer = null;
			if (previousId > 1) {
				previousId = previousId - 1;
				findPreviousPeer();
			}
			else {
				previousId = userId - 1;
				window.setTimeOut(findPreviousPeer, 20000);
			}
		}
	});
	peer.on('open', function(id) {
		document.getElementById('account-name').innerText = 'p2pchess-user' + userId;
		// Listening for the connection of the next user
		peer.on('connection', function(dataConnection) {
			nextPeer = dataConnection;
			nextPeer.on('data', function(data){
				console.log(data)
			});
			nextPeer.on('close', function() {
				nextPeer.close();
				nextPeer = null;
			});
		});
		// If not the number 1 user,try to connect to the previous peer with the closest id number
		if (userId > 1) {
			previousId = userId - 1;
			findPreviousPeer();
		}
	});
}

// Finds the previous peer
function findPreviousPeer()
{
	previousPeer = peer.connect('p2pchess-user' + previousId);
	previousPeer.on('open', function() {
	});
	previousPeer.on('data', function(data){
		console.log(data)
	});
	previousPeer.on('close', function() {
		previousPeer.close();
		previousPeer = null;
		if (userId > 1) {
			previousId = userId - 1;
			findPreviousPeer();
		}
	});
}

// Entry point
(function() {
	// runs the chess worker
	const chessWorker = new Worker('./scalachess.min.js');
	chessWorker.onmessage = function(event){
	};

	// connects to peer network
	connectPeer();
	
	// detects when user closes the page and properly disconnects the peer
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
	window.createChallenge = createChallenge;
})();
