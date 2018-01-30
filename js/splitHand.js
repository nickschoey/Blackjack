function countSplit(hand){
	var count = 0;
	var hasAce = false;
	for (var i = 0; i < hand.length; i++) {
		count +=hand[i];
		if(hand[i] == 1) {
			hasAce = true;
		}
	}
	//Handles the aces.
	//Thanks, http://math.hws.edu/eck/cs271/js-work/Blackjack.html
	if (count + 10 <= 21 && hasAce) {
		count += 10;
	}
	return(count);

}

function split(){
	$(".option").hide();
	$(".turnOptions").hide();
	heroStats.BankRoll -= heroStats.Bet;
	heroStats.SideBet = heroStats.Bet;
	$("#bankroll").html("Bankroll: "+heroStats.BankRoll+"&euro;");
	$("#splitBet").html("Split Bet: "+heroStats.SideBet+"&euro;");
	heroStats.SideHand.push(heroStats.Hand.pop());
	$("#hero .card").last().appendTo($("#secondSplit"));
	$("#playerStatus").html("");
	$("#hero .card").last().appendTo($("#firstSplit"));
	heroStats.SideCount = countSplit(heroStats.SideHand);
	$("#playerStatus2").html(heroStats.SideCount);
	heroStats.Count = countSplit(heroStats.Hand);
	$("#playerStatus1").html(heroStats.Count);
	$("#splitBetOptions1").show();
}

$("#getCardSide1").click(function(){
	getCard();
	addCard("secondSplit");
	heroStats.SideHand.push(newCard.CardValue);
	heroStats.SideCount = countSplit(heroStats.SideHand);
	$("#playerStatus2").html(heroStats.SideCount);
	if (heroStats.SideCount > 21) {
		$("#playerStatus2").html("BUST!");
		$("#splitBetOptions1").hide();
		$("#splitBetOptions2").show();
	}
})

$("#standSide1").click(function(){
	$("#splitBetOptions1").hide();
	$("#splitBetOptions2").show();
})

$("#getCardSide2").click(function(){
	getCard();
	addCard("firstSplit");
	heroStats.Hand.push(newCard.CardValue);
	heroStats.Count = countSplit(heroStats.Hand);
	$("#playerStatus1").html(heroStats.Count);
	if (heroStats.Count > 21) {
		$("#playerStatus1").html("BUST");
		$("#splitBetOptions2").hide();
		if(heroStats.SideCount > 21){
			postGameMenu();
		} else {
			dealerPlaySplit();
			endGameSplit(bankStats.Count, heroStats.Count, heroStats.SideCount);
		}
	}
})

$("#standSide2").click(function(){
	$("#splitBetOptions2").hide();
	endGameSplit(dealerPlaySplit(), heroStats.Count, heroStats.SideCount);
})

function endGameSplit(bankCount, count1, count2){
	if (bankCount > 21) {
		$("#bankCount").html("BUSTED");
		if (count1 <= 21) {
			heroStats.BankRoll += heroStats.Bet*2;
			$("#playerStatus1").html("WIN. "+heroStats.Bet*2+"&euro;");
			postGameMenu();	
			
		}
		if (count2 <= 21) {
			heroStats.BankRoll += heroStats.SideBet*2;
			$("#playerStatus2").html("WIN. "+heroStats.SideBet*2+"&euro;")
			postGameMenu();	
			
		}
	} else {

		if (count1 < bankCount && count1 < 22) {
			$("#playerStatus1").html("LOSE");
			postGameMenu();	
		}

		if (count1 == bankCount && count1 < 22) {
			heroStats.BankRoll += heroStats.SideBet;
			$("#playerStatus1").html("TIE. "+heroStats.SideBet+"&euro;");
			postGameMenu();	

		}

		if (count1 > bankCount && count1 < 22) {
			heroStats.BankRoll += heroStats.SideBet*2;
			$("#playerStatus1").html("WIN. "+heroStats.SideBet*2+"&euro;");
			postGameMenu();	
		}
		
		if (count2 < bankCount && count2 < 22) {
			$("#playerStatus2").html("LOSE");
			postGameMenu();	
		}

		if (count2 == bankCount && count2 < 22) {
			heroStats.BankRoll += heroStats.SideBet;
			$("#playerStatus2").html("TIE. "+heroStats.SideBet+"&euro;");
			postGameMenu();	
		}

		if (count2 > bankCount && count2 < 22) {
			heroStats.BankRoll += heroStats.SideBet*2;
			$("#playerStatus2").html("WIN. "+heroStats.SideBet*2+"&euro;");
			postGameMenu();	
		}

	}
}

function dealerPlaySplit(){
	uncoverCard();
	//DEALER HAS A BLACKJACK
	if (bankStats.Count == 21) {
		$("#bankCount").html("BLACKJACK!");
		$("#playerStatus").html("LOSE");
		postGameMenu();	
	}
	//DEALER HAS TO TAKE MORE CARDS
	while (bankStats.Count <= 16) {
			dealCard("bank");
			$("#bankCount").html(bankStats.Count);
	}
	return(bankStats.Count);
};