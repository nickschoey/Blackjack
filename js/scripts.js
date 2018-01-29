var decks = 0;
var newCard;
var muckedCard;
var deck = new Array();
var suit = ["diamonds", "spades", "hearts", "clubs"];
var value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var heroStats = {HasAce: false, BankRoll: 5000, Hand: [], 
				 SideHand: [], Bet: 0, SideBet: 0,
				 Count: 0, SideCount: 0, Insurance: 0};
var bankStats = {HasAce: false, Hand: [], Count: 0};

// Creates the deck for the game and sets a value for each card

function createDeck(numberOfDecks) {
	deck = [];
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
//Shows the buttons after the game
function postGameMenu(){
	$("#buttonsGame").hide();
	$("#buttonsPostGame").show();
}

//Returns the last card in the game Deck and removes it from the deck
function getCard(){
	newCard = deck.pop();
	//console.log(newCard);
}
//Obtains a mucked card from the deck
function getMuckedCard(){
	muckedCard = deck.pop();
	newCard = muckedCard;
	//console.log(muckedCard);
}

//Puts a card into play on idPlayer end of the table.
function addCard(idPlayer){
		var code = "#"+idPlayer;
		if (newCard.Suit == "diamonds" || newCard.Suit == "hearts") {
			$(code).append("<div class='card red'><div class='value'>"
							+newCard.Value+
							"</div><div class='suitSmall'><img src=img/"+newCard.Suit+
							".png></div>"+"<div class='suit'><img src=img/"+
							newCard.Suit+
							".png></div></div>");	
		} else {
			$(code).append("<div class='card'><div class='value'>"
								+newCard.Value+
								"</div><div class='suitSmall'><img src=img/"+newCard.Suit+
								".png></div>"+"<div class='suit'><img src=img/"+
								newCard.Suit+
								".png></div></div>");
		}
}

//Adds the bank's mucked card into play
function addMuckedCard(){
	$("#bank").append("<div class=' mucked card'></div>");
}


//Counts the hand of idPlayer and handles the aces.
//Ends the game if the player busts
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
		//Handles the aces.
		//Thanks, http://math.hws.edu/eck/cs271/js-work/Blackjack.html
		if (heroStats.Count + 10 <= 21 && heroStats.HasAce) {
			heroStats.Count += 10;
		}

	$("#playerStatus").html(heroStats.Count);
	
	if (heroStats.Count > 21) {
		$("#playerStatus").html("BUST");
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

//Checks if there's enough money to place a bet.
//Updates bet amount and bankroll.
function updateBet(betAmount){
	heroStats.Bet = parseInt(betAmount);
	if (heroStats.BankRoll - heroStats.Bet < 0) {
		$("#playerStatus").html("Not enough money");
		postGameMenu();
	} else {
		heroStats.BankRoll = heroStats.BankRoll - heroStats.Bet;
		$("#bankroll").html("Bankroll: "+heroStats.BankRoll+"&euro;");
		$("#bet").html("Bet: "+ heroStats.Bet+"&euro;");
	}
}

//Deals a Card, puts it on the table, updates the count
function dealCard(idPlayer){
	getCard();
	addCard(idPlayer);
	updateCount(idPlayer);
	
}
//Deals a mucked Card. Places it in the table, updates the count
function dealMuckedCard(idPlayer){
	getMuckedCard();
	addMuckedCard();
	updateCount(idPlayer);
}

//find the mucked card and uncovers it
function uncoverCard(){
	if (muckedCard.Suit == "diamonds" || muckedCard.Suit == "hearts") {
		$("#bank").find(".mucked").addClass("red");
		$("#bank").find(".mucked").html("<div class='value'>"
							+muckedCard.Value+
							"</div><div class='suitSmall'><img src=img/"+muckedCard.Suit+
							".png></div>"+"<div class='suit'><img src=img/"+
							muckedCard.Suit+
							".png></div></div>");
	} else {
		$("#bank").find(".mucked").html("<div class='value'>"
							+muckedCard.Value+
							"</div><div class='suitSmall'><img src=img/"+muckedCard.Suit+
							".png></div>"+"<div class='suit'><img src=img/"+
							muckedCard.Suit+
							".png></div></div>");
	}
	$("#bank").find(".mucked").removeClass("mucked");
	$("#bankCount").html(bankStats.Count);
}

//Resets all the counters and empties the table
//Allows for a new game to be played
function restartGame(){
	$("#bankroll").html("Bankroll: "+heroStats.BankRoll+"&euro;");
	$("#bank").find(".card").remove();
	$("#hero").find(".card").remove();
	$("#bankCount").html("");
	heroStats.Bet = 0;
	heroStats.SideBet = 0;
	heroStats.Insurance = 0;
	heroStats.SideCount = 0;
	bankStats.Hand = [];
	heroStats.Hand = [];
	heroStats.SideHand = [];
	$("#bet").html("Bet: 0&euro;");
	$("#playerStatus").html("BET");
	$(".betForm").show();
	$("#buttonsPostGame").hide();
	$(".turnOptions").hide();
	$("#playerStatus1").html("");
	$("#playerStatus2").html("");
	$("#splitBet").html("");
	createDeck(decks);
	shuffle(deck.length);
}

//Handles the checks to be done after the first four cards are dealt
function checkBlackJack(){
	//HERO GETS A NATURAL BLACKJACK
	if (heroStats.Count == 21) {
		uncoverCard();
		//THE BANK DOESN'T HAVE IT, GET PAID
		if (bankStats.Count != 21) {
			$("#playerStatus").html("BJ! "+
									heroStats.Bet*1.5+ "&euro;");
			heroStats.BankRoll += heroStats.Bet*1.5;
			postGameMenu();
		//THE BANK HAS IT, IT'S A TIE
		} else if (bankStats.Count == 21) {
			heroStats.BankRoll += heroStats.Bet;
			$("#playerStatus").html("TIE "+heroStats.Bet+"&euro;");
			postGameMenu();
		}
	//The bank has a ten. Checks for a bank's blackjack
	} else if (bankStats.Count == 21 && bankStats.Hand[0] != 1) {
		uncoverCard();
		$("#bankCount").html("BJ!")
		$("#playerStatus").html("LOSE");
		postGameMenu();
	//moves into the midgame's options
	} else {
		midGame();
		$(".option").removeAttr('disabled');
	}
}

//checks for the midgames's options to Double, Split or buy Insurance
//Allows these options to be chosen
function midGame(){
	if (heroStats.Count == 9 
		|| heroStats.Count == 10 
		|| heroStats.Count == 11) {
		$("#double").show();
	}
	if (heroStats.Hand[0] == heroStats.Hand[1]) {
		$("#split").show();
	}

	if (bankStats.Hand[0] == 1) {
		$("#buyInsurance").show();
	}
}
//Handles doubling the bet
function double(){
	heroStats.BankRoll = heroStats.BankRoll - heroStats.Bet;
	$("#bankroll").html("Bankroll: "+heroStats.BankRoll+"&euro;");
	heroStats.Bet = heroStats.Bet*2;
	$("#bet").html("Bet: "+heroStats.Bet+"&euro;");
	dealCard("hero");
	dealerPlay();
}
//handles buying an insurance
function buyInsurance(){
	heroStats.Insurance = heroStats.Bet/2;
	heroStats.BankRoll -= heroStats.Insurance;
	$("#bankroll").html("Bankroll: "+heroStats.BankRoll+"&euro;");

	if (bankStats.Count == 21) {
		uncoverCard();
		heroStats.BankRoll += heroStats.Insurance;
		$("#bankCount").html("BJ!")
		$("#playerStatus").html(heroStats.Insurance+"&euro;");
		postGameMenu();

	} else {
		$("#playerStatus").html("NO BJ! "+heroStats.Count);
		$(".turnOptions").hide();
	}
}

//Plays the turn for the bank and deals the different outcomes
function dealerPlay(){
	uncoverCard();
		setTimeout(function(){
			//DEALER HAS A BLACKJACK
			if (bankStats.Count == 21) {
				$("#bankCount").html("BLACKJACK!")
				$("#playerStatus").html("LOSE "+(heroStats.Bet+heroStats.SideBet)+"&euro;");
				postGameMenu();	
			}
			//DEALER HAS TO TAKE MORE CARDS
			while (bankStats.Count <= 16) {
					dealCard("bank");
					$("#bankCount").html(bankStats.Count);
			}
			//AFTERGAME
			setTimeout(function(){
				if (bankStats.Count > 21) {
					$("#bankCount").html("BUST");
					$("#playerStatus").html("WIN "+ heroStats.Bet*2+"&euro;");
					heroStats.BankRoll += heroStats.Bet*2;
					postGameMenu();	
				} else {
					if (bankStats.Count > heroStats.Count) {
						$("#playerStatus").html("LOSE");
						postGameMenu();	
					} else if (bankStats.Count == heroStats.Count) {
						$("#playerStatus").html("TIE "+heroStats.Bet+"&euro;");
						heroStats.BankRoll += heroStats.Bet;
						postGameMenu();	
					} else {
						$("#playerStatus").html("WIN "+heroStats.Bet*2+"&euro;");
						heroStats.BankRoll += heroStats.Bet*2;
						postGameMenu();	
					}
				}
			},1000);
		}, 1000);
}


