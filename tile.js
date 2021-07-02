class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.status = "empty";
    this.colour = "#dbdbdb";
    this.label = "";
    this.distance;
    this.isClickable = true;
    this.path = "";
  }

  setColour(colour) {
    this.colour = colour;
  }

  setLabel(label) {
    this.label = label;
  }

  setDistance(distance) {
    this.distance = distance;
  }

  lock() {
    if (this.clickable) {
      this.clickable = false;
    }
  }

  unlock() {
    if (!this.clickable) {
      this.clickable = true;
    }
  }
  setStatus(status) {
    this.status = status;

    if (status == "start") {
      this.colour = "#0B9F00";
      this.label = "start";
    } else if (status == "empty") {
      this.label = "";
      this.colour = "#dbdbdb";
    } else if (status == "racking") {
      this.label = "";
      this.colour = "#736BA6";
    } else if (status == "pick") {
      this.colour = "#f64900";
    } else if (status == "x") {
      this.colour = "#ADD8E6";
    }
  }
}
