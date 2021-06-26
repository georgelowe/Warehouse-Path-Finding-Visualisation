class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.status = "empty";
    this.colour = "#dbdbdb";
    this.label = "";
    this.distance;
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
    } else if (status == "end") {
      this.colour = "#960000";
    } else if (status == "x") {
      this.colour = "#9DD999";
    }
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
}
