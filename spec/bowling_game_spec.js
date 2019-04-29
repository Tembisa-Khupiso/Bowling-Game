describe("BowlingGame", function() {

  var player, scoreboard;

  var completeNineFrames = function() {
    for (var i = 1; i <= 18; i++) {
    scoreboard.enterRoll(1); }
  };

  beforeEach(function() {
    player = new Player();
    scoreboard = new BowlingGame(player);
  });

  describe("starting a frame", function() {

    it("will add a frame to the player's scoreboard", function() {
      scoreboard._startFrame();
      expect(scoreboard.frames.length).toBe(1);
    });

  });

  describe("recording results", function() {

    it("will not accept an invalid number", function() {
      scoreboard.enterRoll(5);
      scoreboard.enterRoll(9);
      expect(scoreboard.currentFrame().score).toBe(5);
    });

    it("wil not accept a roll if the game is finished", function() {
      completeNineFrames();
      scoreboard.enterRoll(5);
      scoreboard.enterRoll(4);
      scoreboard.enterRoll(4);
      expect(scoreboard.currentFrame().score).toBe(9);
    });

  });
  
  describe("starting the next frame", function() {

    it("will start a new frame if there have been two rolls in the current frame", function() {
      scoreboard.enterRoll(5);
      scoreboard.enterRoll(3);
      expect(scoreboard.frames.length).toBe(1);
      scoreboard.enterRoll(3);
      expect(scoreboard.frames.length).toBe(2);
    });

    it("will start a new frame if there is a strike in the first roll of a frame", function() {
      scoreboard.enterRoll(10);
      expect(scoreboard.frames.length).toBe(1);
      scoreboard.enterRoll(5);
      expect(scoreboard.frames.length).toBe(2);
    });

    it("after starting a new frame will record the next roll in the new frame", function() {
      scoreboard.enterRoll(5);
      scoreboard.enterRoll(3);
      scoreboard.enterRoll(4);
      expect(scoreboard.frames[1].rolls[0]).toBe(4);
    });

  });

  describe("knowing when the game is finished", function() {
    it("will know the game is finished after 10 frames", function() {
      completeNineFrames();
      expect(scoreboard.isGameFinished()).toBe(false);
      scoreboard.enterRoll(2);
      expect(scoreboard.isGameFinished()).toBe(false);
      scoreboard.enterRoll(3);
      expect(scoreboard.isGameFinished()).toBe(true);
    });

    it("will allow three rolls in the final frame if there is a strike", function() {
      completeNineFrames();
      scoreboard.enterRoll(10);
      scoreboard.enterRoll(8);
      expect(scoreboard.isGameFinished()).toBe(false);
      scoreboard.enterRoll(8);
      expect(scoreboard.isGameFinished()).toBe(true);
    });

    it("will allow three rolls in the final frame if there is a spare", function() {
      completeNineFrames();
      scoreboard.enterRoll(6);
      scoreboard.enterRoll(4);
      expect(scoreboard.isGameFinished()).toBe(false);
      scoreboard.enterRoll(4);
      expect(scoreboard.isGameFinished()).toBe(true);
    });

    it("will not allow another roll if the game is finished", function() {
      completeNineFrames();
      scoreboard.enterRoll(1);
      scoreboard.enterRoll(1);
      expect(scoreboard.enterRoll(1)).toEqual("Game over");
    });

    it("will know if there was a gutter game", function(){
      for (var i = 1; i <= 20; i++) {
        scoreboard.enterRoll(0); }
      expect(scoreboard.isGutterGame()).toBe(true);
    });

    it("will know if there was a perfect game", function(){
      for (var i = 1; i <= 12; i++) {
        scoreboard.enterRoll(10); }
      expect(scoreboard.isPerfectGame()).toBe(true);
    });

  });

  describe("keeping score", function() {

    it("will record the score for each frame", function(){
      scoreboard.enterRoll(3);
      scoreboard.enterRoll(5);
      expect(scoreboard.frames[0].score).toBe(8);
    });

    it("will keep a record of the total score", function(){
      scoreboard.enterRoll(3);
      scoreboard.enterRoll(5);
      scoreboard.enterRoll(6);
      scoreboard.enterRoll(2);
      expect(scoreboard.totalScore()).toBe(16);
    });

  });

  describe("scoring bonuses", function() {

    it("will give the player a bonus equivalent to the number of pins hit in the next roll if the player scores a spare", function() {
      scoreboard.enterRoll(6);
      scoreboard.enterRoll(4);
      scoreboard.enterRoll(5);
      scoreboard.enterRoll(3);
      expect(scoreboard.frames[0].score).toBe(15);
      expect(scoreboard.totalScore()).toBe(23);
    });

    it("will give the player a bonus equivalent to the number of pins hit in the next two rolls if the player scores a strike", function() {
      scoreboard.enterRoll(10);
      scoreboard.enterRoll(5);
      scoreboard.enterRoll(3);
      expect(scoreboard.frames[0].score).toBe(18);
      expect(scoreboard.totalScore()).toBe(26);
    });

    it("will allow a maximum score of 300", function() {
      for (var i = 1; i <= 12; i++) {
        scoreboard.enterRoll(10);
      }
      expect(scoreboard.isGameFinished()).toBe(true);
      expect(scoreboard.totalScore()).toBe(300);
    });
  });
});