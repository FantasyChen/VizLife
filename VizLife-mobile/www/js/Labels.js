function Labels(date) {
  this.date = date;
  this.numAdditions = 0;
  this.values = [];

  for (let i = 0; i < 51; i++) {
    this.values.push(0);
  }

  this.addProbabilities = function(probs) {
    for (let i = 0; i < 51; i++) {
      this.values[i] += probs[i];
    }
    this.numAdditions++;
  }
}
