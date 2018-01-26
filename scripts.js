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
var heroStats = {HasAce: false, BankRoll: 5000, Hand: [], Bet: 0, Count: 0};
var bankStats = {HasAce: false, Hand: [], Count: 0};

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
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
//Obtains a muckedCard from the deck
function getMuckedCard(){
	muckedCard = deck.pop();
	newCard = muckedCard;
	console.log(muckedCard);
}

//Puts the card into play on both ends of the table. Updates the hand in
//player and bank hand.
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

		if (idPlayer == "hero"){
			heroStats.Hand.push(newCard.CardValue);
			if (newCard.Value == "A"){
				heroStats.HasAce = true;
			}
		} else {
			bankStats.Hand.push(newCard.CardValue);
			if (newCard.Value == "A"){
				bankStats.HasAce = true;
			}
		}
		
}

//Adds the bank's mucked card into play
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
			if (newCard.CardValue[1] + bankCount > 21) { 
				bankCount += 1;
				$("#bankCount").html(bankCount)
			} else {
				bankCount += 11;
				$("#bankCount").html(bankCount)
			} 
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

function restartGame(){
	$("#bankroll").html("Bankroll: "+bankRoll);
	$("#bank").empty();
	$("#hero").empty();
	heroCount = 0;
	$("#count").html(heroCount)
	bankCount = 0;
	$("#bankCount").html(bankCount);
	bet = 0;
	$("#bet").html(bankCount);
	$(".betForm").show();
}

function checkBlackJack(){
	//HERO GETS A NATURAL BLACKJACK
	if (heroCount == 21) {
		uncoverCard();
		//THE BANK DOESN'T HAVE IT, GET PAID
		if (bankCount != 21) {
			bankRoll += bet*1.5;
			restartGame();
		//THE BANK HAS IT, IT'S A TIE
		} else if (bankCount == 21) {
			bankRoll += bet;
			restartGame();
		}
		//THE GAME GOES ON
	} else {
		midGame();
		$(".option").removeAttr('disabled');
	}
}

function midGame(){
	//HAND IS A PAIR
		//ALLOW TO SPLIT
			//SEPARATE HANDS
			//PLACE BET
			//PLAY ONE HAND UNTIL STAND
			//PLAY SECOND HAND UNTIL STAND
	//COUNT IS 9, 10 OR 11
		//ALLOW TO DOUBLE
	//DEALER HAS AN ACE
		//ALLOW TO BUY INSURANCE
			//PLACE BET MONEY
	//
}

function dealerPlay(){
	uncoverCard();
		setTimeout(function(){
			//DEALER HAS A BLACKJACK
			if (bankCount == 21) {
				alert("you lose!");	
			}
			//DEALER HAS TO TAKE MORE CARDS
			while (bankCount <= 16) {
					dealCard("bank");
			}
			//AFTERGAME
			setTimeout(function(){
				if (bankCount > 21) {
					alert("bank loses");
				} else {
					if (bankCount > heroCount) {
						alert("bank Wins");
					} else if (bankCount == heroCount) {
						alert("it's a tie!");
					} else {
						alert("player wins!");
					}
				}
			},1000);
		}, 1000);
}

function checkCount(){
	if (heroCount > 21) {
		alert("busted!");
		restartGame();
	}
}
