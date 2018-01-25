var newCard;
var muckedCard;
var deck = new Array();
var suit = ["diamonds", "spades", "hearts", "clubs"];
var value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var heroCount = 0;
var bankCount = 0;
var bankRoll = 5000;
var count = 0;
var bet = 0;
var heroStats = {BankRoll: 5000, Hand: [], Bet: 0, Count: 0};

function endGame(){
	heroCount = 0;
	bankCount = 0;
	bet = 0;
}
// Creates the deck for the game and sets a value for each card
function createDeck(numberOfDecks) {
	for (var x = 0; x < numberOfDecks; x++) {
		for (var i = 0; i < suit.length; i++) {
			for (var j = 0; j < value.length; j++) {
				if (value[j] == "A") {
					var cardValue = [1, 11];
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
	newCard = deck.pop();
}

function getMuckedCard(){
	muckedCard = deck.pop();
	newCard = muckedCard;
	console.log(muckedCard);
}

function addCard(idPlayer){
	var code = "#"+idPlayer;
	if (newCard.Suit == "diamonds" || newCard.Suit == "hearts") {
		$(code).append("<div class='card red'><div class='value'>"
							+newCard.Value+
							"</div><div class='suit'><img src="+
							newCard.Suit+
							".png></div></div>");	
	} else {
		$(code).append("<div class='card'><div class='value'>"
							+newCard.Value+
							"</div><div class='suit'><img src="+
							newCard.Suit+
							".png></div></div>");
	}
}

function addMuckedCard(){
	$("#bank").append("<div class=' mucked card'></div>");

}

function updateCount(idPlayer){
	if (idPlayer == "hero") {
		if ($.isArray(newCard.CardValue)) {
			if (newCard.CardValue[1] + heroCount > 21) { 
				heroCount += 1;
				$("#count").html(heroCount)
			} else {
				heroCount += 11;
				$("#count").html(heroCount)
			} 
		} else {
			heroCount += newCard.CardValue;
			$("#count").html(heroCount);	
		}
	} else if (idPlayer == "bank") {
		if ($.isArray(newCard.CardValue)) {
			//IF CARDVALUE(11)+COUNT > 21 -> CARDVALUE(1)
			//ELSE CARDVALUE(10); 
		} else {
			bankCount += newCard.CardValue;
			$("#bankCount").html(bankCount);	
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

function dealCard(idPlayer){
	getCard();
	updateCount(idPlayer);
	addCard(idPlayer);
}

function dealMuckedCard(idPlayer){
	getMuckedCard();
	updateCount(idPlayer);
	addMuckedCard();
}
function uncoverCard(){
	//find the mucked card and uncovers it
	if (muckedCard.Suit == "diamonds" || muckedCard.Suit == "hearts") {
		$("#bank").find(".mucked").addClass("red");
		$("#bank").find(".mucked").html("<div class='value'>"
							+muckedCard.Value+
							"</div><div class='suit'><img src="+
							muckedCard.Suit+
							".png></div>");	
	} else {
		$("#bank").find(".mucked").html("<div class='value'>"
							+muckedCard.Value+
							"</div><div class='suit'><img src="+
							muckedCard.Suit+
							".png></div>");
	}
	$("#bank").find(".mucked").removeClass("mucked");
}

function checkBlackJack(){
	if (heroCount == 21) {
		alert("Blackjack!");
		//IF bankcount is not 21
			bankRoll += bet*1.5;
			//
			//
		//ELSE
			//Return the money

		//function to restart the game
			// update Bankroll
			// Counters set to 0
			// Bet set to 0
			// Table Cleared
			// Show the betting menu
			// 
	} else {
		$(".option").removeAttr('disabled');
	}
}