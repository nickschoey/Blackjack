var newCard;
var deck = new Array();
var suit = ["diamonds", "spades", "hearts", "clubs"];
var value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var playerCount = 0;
var bankCount = 0;
var bankRoll = 5000;
var count = 0;
var bet = 0;
// Creates the deck for the game and sets a value for each card
function createDeck(numberOfDecks) {
	for (var x = 0; x < numberOfDecks; x++) {
		for (var i = 0; i < suit.length; i++) {
			for (var j = 0; j < value.length; j++) {
				if (value[j] == "A") {
					var cardValue = [1, 10];
				} else if (value[j] == "J"|| value[j] == "Q" || value[j] == "K") {
					var cardValue = 10;
				} else {
					cardValue = parseInt(value[j]);
				}
				var card = {Value: value[j], Suit: suit[i], CardValue: cardValue};
				deck.push(card);	
			}
		}
	}
	return deck;
};
// Shuffles two random Cards X Times.
function shuffle(gameDeckLength) {
	for (var i = 0; i < 10000; i++) {
		var card1 = Math.floor(Math.random() * 10000 % gameDeckLength);
		var card2 = Math.floor(Math.random() * 10000 % gameDeckLength);
		var tempCard = deck[card1];
		deck[card1] = deck[card2];
		deck[card2] = tempCard; 
	}
}

//Returns the last card in the game Deck and removes it from the deck
function getCard(){
	newCard = deck.pop()
	return newCard;
}

function addPlayerCard(){
	$("#hero").append("<div class='card'><div class='value'>"
						+newCard.Value+
						"</div><div class='suit'><img src="+
						newCard.Suit+
						".png></div></div>");
}

function addBankCard(){
	$("#bank").append("<div class='card'><div class='value'>"
						+newCard.Value+
						"</div><div class='suit'><img src="+
						newCard.Suit+
						".png></div></div>");
}

function updatePlayerCount(){
	if ($.isArray(newCard.CardValue)) {
		//IF CARDVALUE(10)+COUNT > 21 -> CARDVALUE(1)
		//ELSE CARDVALUE(10); 
	} else {
		playerCount += newCard.CardValue;
		if (playerCount == 21) {
			$("#count").html(playerCount);
			alert("BlackJack!");
		} else if (playerCount > 21) {
			alert("You lose!");
		} else {
			$("#count").html(playerCount);
		}
	}
}

function updateBankCount(){
	bankCount += newCard.CardValue;
	$("#bankCount").html(bankCount);
}

function updateBet(betAmount){
	bet = betAmount;
	if (bankRoll - bet < 0) {
		alert("Not enough money");
	} else {
		bankRoll = bankRoll - bet;
		$("#bankroll").html("Bankroll: "+bankRoll);
		$("#Bet").html("Bet: "+ bet);
	}
}

function dealPlayerCard(){
	getCard();
	updatePlayerCount();
	addPlayerCard();
}

function dealBankCard(){
	getCard();
	updateBankCount();
	addBankCard();

}

