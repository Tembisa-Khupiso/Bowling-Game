var BowlingGame = function(player) {
  this.player = player;
  this.frames = [];
};

BowlingGame.prototype.enterRoll = function(pinsHit) {
  if (this.isGameFinished()) { return "Game over"; }
  this._checkIfNewFrame();
  if (this.currentFrame().isInvalidNumber(pinsHit)) { return "Incorrect number"; }
  this.currentFrame().recordScore(pinsHit);
  this._checkBonus(pinsHit);
};

BowlingGame.prototype.currentFrame = function() {
  return this.frames[this.frames.length-1];
};

BowlingGame.prototype.totalScore = function() {
  var total = 0;
  for (var frame = 0; frame < this.frames.length; frame++) {
    total+= parseInt(this.frames[frame].score);
  } return total;
};

BowlingGame.prototype.isGameFinished = function() {
  return (this.frames.length === 10 && this.currentFrame().isFinalFrameFinished());
};

BowlingGame.prototype.isGutterGame = function() {
  return (this.isGameFinished() && this.totalScore() === 0);
};

BowlingGame.prototype.isPerfectGame = function() {
  return (this.isGameFinished() && this.totalScore() === 300);
};

BowlingGame.prototype._checkIfNewFrame = function() {
  if (this.frames.length === 0 || (this.frames.length < 10 &&
    this.currentFrame().isStandardFrameFinished())) {
    this._startFrame();
  }
};

BowlingGame.prototype._startFrame = function() {
  this.frames.push(new Frame());
};

BowlingGame.prototype._checkBonus = function(pinsHit) {
  if (this.frames.length < 10) {
    this.currentFrame().recordIfStrikeOrSpare();
  }
  if (this.frames.length > 1) {
    this._addPreviousFramesBonus(pinsHit);
  }
};

BowlingGame.prototype._addPreviousFramesBonus = function(pinsHit) {
  for (var frame = 0; frame < this.frames.length-1; frame++) {
    if (this.frames[frame].bonus > 0) {
      this.frames[frame].score += parseInt(pinsHit);
      this.frames[frame].bonus--;
    }
  }
};
