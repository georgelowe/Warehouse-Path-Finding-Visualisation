class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.status = "empty";
    this.colour = "#dbdbdb";
    this.label = "null";
  }

  setStatus(status) {
    this.status = status;
    if (status == "start") {
      this.colour = "#0B9F00";
    } else if (status == "empty") {
      this.colour = "#dbdbdb";
    } else if (status == "racking") {
      this.colour = "#736BA6";
    } else if (status == "pick") {
      this.colour = "#f64900";
    } else if (status == "end") {
      this.colour = "#960000";
    }
  }

  setLabel(label) {
    this.label = label;
  }
}
