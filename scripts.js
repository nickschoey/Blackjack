var newCard;
var muckedCard;
var deck = new Array();
var suit = ["diamonds", "spades", "hearts", "clubs"];
var value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var heroStats = {HasAce: false, BankRoll: 5000, Hand: [], Bet: 0, Count: 0};
var bankStats = {HasAce: false, Hand: [], Count: 0};
var deckLength = 0;

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
	deckLength = deck.length;
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

function postGameMenu(){
	$("#buttonsGame").hide();
	$("#buttonsPostGame").show();
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
							"</div><div class='suitSmall'><img src="+newCard.Suit+
							".png></div>"+"<div class='suit'><img src="+
							newCard.Suit+
							".png></div></div>");	
		} else {
			$(code).append("<div class='card'><div class='value'>"
								+newCard.Value+
								"</div><div class='suitSmall'><img src="+newCard.Suit+
								".png></div>"+"<div class='suit'><img src="+
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
	
	if (heroStats.Count > 21) {
		$("#playerStatus").html("Busted! You lose "+heroStats.Bet);
		postGameMenu();
	};

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

function updateBet(betAmount){
	heroStats.Bet = parseInt(betAmount);
	if (heroStats.BankRoll - heroStats.Bet < 0) {
		alert("Not enough money");
	} else {
		heroStats.BankRoll = heroStats.BankRoll - heroStats.Bet;
		$("#bankroll").html("Bankroll: "+heroStats.BankRoll);
		$("#bet").html("Bet: "+ heroStats.Bet);
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
							"</div><div class='suitSmall'><img src="+newCard.Suit+
							".png></div>"+"<div class='suit'><img src="+
							muckedCard.Suit+
							".png></div></div>");
	} else {
		$("#bank").find(".mucked").html("<div class='value'>"
							+muckedCard.Value+
							"</div><div class='suitSmall'><img src="+newCard.Suit+
							".png></div>"+"<div class='suit'><img src="+
							muckedCard.Suit+
							".png></div></div>");
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
	$("#playerStatus").html("Game Status");
	$("#bankCount").html("Bank Count:");
	$(".betForm").show();
	$("#buttonsPostGame").hide();
	$(".turnOptions").hide();
}

function checkBlackJack(){
	//HERO GETS A NATURAL BLACKJACK
	if (heroStats.Count == 21) {
		uncoverCard();
		//THE BANK DOESN'T HAVE IT, GET PAID
		if (bankStats.Count != 21) {
			$("#playerStatus").html("BlackJack! You win "+
									heroStats.Bet*1.5);
			heroStats.BankRoll += heroStats.Bet*1.5;
			postGameMenu();

		//THE BANK HAS IT, IT'S A TIE
		} else if (bankStats.Count == 21) {
			heroStats.BankRoll += heroStats.Bet;
			$("#playerStatus").html("It's a tie! You get your "+heroStats.Bet+" back.");
			postGameMenu();
		}
		//THE GAME GOES ON
	} else if (bankStats.Count == 21) {
		uncoverCard();
		$("#playerStatus").html("the bank has a blackjack, you lose");
		postGameMenu();

	} else {
		midGame();
		$(".option").removeAttr('disabled');
	}
}

function midGame(){
	if (heroStats.Count == 9 
		|| heroStats.Count == 10 
		|| heroStats.Count == 11) {
		$("#double").show();

	} else if (heroStats.Hand[0] == heroStats.Hand[1]) {
		$("#split").show();
	}
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
				$("#playerStatus").html("Bank Has Blackjack! You lose "+heroStats.Bet);
				postGameMenu();	
			}
			//DEALER HAS TO TAKE MORE CARDS
			while (bankStats.Count <= 16) {
					dealCard("bank");
					$("#bankCount").html("Bank Count: "+ bankStats.Count);
			}
			//AFTERGAME
			setTimeout(function(){
				if (bankStats.Count > 21) {
					$("#playerStatus").html("Bank busts. You Win "+ heroStats.Bet*2);
					heroStats.BankRoll += heroStats.Bet*2;
					postGameMenu();	
				} else {
					if (bankStats.Count > heroStats.Count) {
						$("#playerStatus").html("Bank Wins. You lose "+heroStats.Bet);
						postGameMenu();	
					} else if (bankStats.Count == heroStats.Count) {
						$("#playerStatus").html("It's a tie! Get your "+heroStats.Bet+" back");
						heroStats.BankRoll += heroStats.Bet;
						postGameMenu();	
					} else {
						$("#playerStatus").html("You win. Collect "+heroStats.Bet*2);
						heroStats.BankRoll += heroStats.Bet*2;
						postGameMenu();	
					}
				}
			},1000);
		}, 1000);
}

