var newCard;
var muckedCard;
var deck = new Array();
var suit = ["diamonds", "spades", "hearts", "clubs"];
var value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var heroStats = {HasAce: false, BankRoll: 5000, Hand: [], Bet: 0, Count: 0};
var bankStats = {HasAce: false, Hand: [], Count: 0};

// Creates the deck for the game and sets a value for each card
function createDeck(numberOfDecks) {
	for (var x = 0; x < numberOfDecks; x++) {
		for (var i = 0; i < suit.length; i++) {
			for (var j = 0; j < value.length; j++) {
				if (value[j] == "A") {
					var cardValue = 1;
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
// Shuffles two random Cards 10000 Times.
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
	console.log(newCard);
}
//Obtains a mucked card from the deck
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
}

//Adds the bank's mucked card into play
function addMuckedCard(){
	$("#bank").append("<div class=' mucked card'></div>");
}

function updateCount(idPlayer){
	if (idPlayer == "hero") {
		heroStats.Count = 0;
		heroStats.HasAce = false;
		heroStats.Hand.push(newCard.CardValue);
		for (var i = 0; i < heroStats.Hand.length; i++) {
			heroStats.Count += heroStats.Hand[i];
			if(heroStats.Hand[i] == 1) {
				heroStats.HasAce = true;
			}
		}
		if (heroStats.Count + 10 <= 21 && heroStats.HasAce) {
			heroStats.Count += 10;
		}

	$("#count").html("Your Count: "+heroStats.Count);

	} else if (idPlayer == "bank") {
		bankStats.Count = 0;
		bankStats.HasAce = false;
		bankStats.Hand.push(newCard.CardValue);
		for (var i = 0; i < bankStats.Hand.length; i++) {
			bankStats.Count += bankStats.Hand[i];
			if(bankStats.Hand[i] == 1) {
				bankStats.HasAce = true;
			}
		}
		if (bankStats.Count + 10 <= 21 && bankStats.HasAce) {
			bankStats.Count += 10;
		}
		
	}
}

function updateBankCount(){
	bankCount += newCard.CardValue;
	$("#bankCount").html(bankCount);
}

function updateBet(betAmount){
	heroStats.Bet = parseInt(betAmount);
	if (heroStats.BankRoll - heroStats.Bet < 0) {
		alert("Not enough money");
	} else {
		heroStats.BankRoll = heroStats.BankRoll - heroStats.Bet;
		$("#bankroll").html("Bankroll: "+heroStats.BankRoll);
		$("#Bet").html("Bet: "+ heroStats.Bet);
	}
}

function dealCard(idPlayer){
	getCard();
	addCard(idPlayer);
	updateCount(idPlayer);
	
}

function dealMuckedCard(idPlayer){
	getMuckedCard();
	addMuckedCard();
	updateCount(idPlayer);
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
	$("#bankCount").html("Bank Count: "+ bankStats.Count);
}

function restartGame(){
	$("#bankroll").html("Bankroll: "+heroStats.BankRoll);
	$("#bank").empty();
	$("#hero").empty();
	$("#count").html("Count: 0")
	$("#bankCount").html("Count: 0");
	heroStats.Bet = 0;
	bankStats.Hand = [];
	heroStats.Hand = [];
	$("#bet").html("Bet: 0");
	$(".betForm").show();
}

function checkBlackJack(){
	//HERO GETS A NATURAL BLACKJACK
	if (heroStats.Count == 21) {
		uncoverCard();
		//THE BANK DOESN'T HAVE IT, GET PAID
		if (bankStats.Count != 21) {
			heroStats.BankRoll += heroStats.Bet*1.5;
			alert("BlackJack!");
			restartGame();
		//THE BANK HAS IT, IT'S A TIE
		} else if (bankStats.Count == 21) {
			heroStats.BankRoll += heroStats.Bet;
			alert("it's a tie!");
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
			if (bankStats.Count == 21) {
				alert("you lose!");	
			}
			//DEALER HAS TO TAKE MORE CARDS
			while (bankStats.Count <= 16) {
					dealCard("bank");
					$("#bankCount").html("Bank Count: "+ bankStats.Count);
			}
			//AFTERGAME
			setTimeout(function(){
				if (bankStats.Count > 21) {
					alert("bank loses");
				} else {
					if (bankStats.Count > heroStats.Count) {
						alert("bank Wins");
					} else if (bankStats.Count == heroStats.Count) {
						alert("it's a tie!");
					} else {
						alert("player wins!");
					}
				}
			},1000);
		}, 1000);
}

function checkCount(){

	if (heroStats.Count > 21) {
		alert("busted!");
		restartGame();
	}
}
