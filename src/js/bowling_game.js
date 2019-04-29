let player = new Player();
let scoreboard = new BowlingGame(player);
let frameData = new Message('#frame');
let tableData = new Message('#table_data');
let gameMessage = new Message('#messages');

var startGame = function() {
  $('#name_form').on('submit', function(event) {
    event.preventDefault();
    let name = $('#enter_name').val();
    player.setName(name);
    showGameLayout(name);
  });
};

var showGameLayout = function(name) {
  frameData.addGameUpdate(scoreboard, 'frameData');
  $('#name_form').css("display", "none");
  $('#welcome_message').html(name);
  alert("Current Player is: " + name);
  $('#pin_request').show();
  $('#pinHit').css("display", "inline-block");
};

var startNumberAnimations = function() {
  $('#list li').mouseenter(function() { $(this).css("opacity", 1); });
  $('#list li').mouseleave(function() { $(this).css("opacity", 0.8); });
};

var waitForNumberClick = function() {
  $('#list li').on('click', function(event) {
    event.preventDefault();
    let rollEntry = parseInt($(this).data('pick'));
    let enterRoll = scoreboard.enterRoll(rollEntry);
    if (enterRoll !== "Incorrect number") {
      showNumbers(rollEntry);
      showGameMessages();
    }
  });
};

var showNumbers = function(rollEntry) {
  if (parseInt(scoreboard.currentFrame().rolls.length) === 1 &&
    parseInt(scoreboard.currentFrame().rolls[0]) < 10) {
    hideUnavailableNumbers(rollEntry);
  }
  else {
    showAvailableNumbers();
  }
};

var hideUnavailableNumbers = function(rollEntry) {
  for (var i = 0; i <= 10; i++) {
    let unavailable = ('#' + String(i));
    if (parseInt(rollEntry) + parseInt(i) > 10) {
      $(unavailable).unbind('mouseenter').unbind('mouseleave').css('opacity', 0.2);
    }
  }
};

var showAvailableNumbers = function() {
  $('#list li').css('opacity', 0.8).mouseenter(function() { 
    $(this).css('opacity', 1); }).mouseleave(function() {
      $(this).css('opacity', 0.8); });
};

var showGameMessages = function() {
  gameMessage.addGameMessage(scoreboard);
  tableData.addGameUpdate(scoreboard, 'tableData');
  frameData.addGameUpdate(scoreboard, 'frameData');
  if (scoreboard.isGameFinished()) {
    $('#pin_request').css("display", "none");
  }
};

$(document).ready(function(){
  startGame();
  startNumberAnimations();
  waitForNumberClick();
});
