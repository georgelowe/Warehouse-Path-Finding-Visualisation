function solveUnweighted(tileArray, startLabel, endLabel) {
  var startCoords = findStartCoords(startLabel);
  var xQueue = [startCoords[0]];
  var yQueue = [startCoords[1]];
  var currentX;
  var currentY;
  var pathFound = false;

  while (xQueue.length > 0 && !pathFound) {
    currentX = xQueue.shift();
    currentY = yQueue.shift();

    // Check that the target endLabel has been found
    if (currentX > 0 && tileArray[currentX - 1][currentY].label == endLabel) {
      tileArray[currentX][currentY].status =
        tileArray[currentX][currentY].status + "L";

      pathFound = true;
    }
    if (
      currentX < tileGrid.numColumns - 1 &&
      tileArray[currentX + 1][currentY].label == endLabel
    ) {
      tileArray[currentX][currentY].status =
        tileArray[currentX][currentY].status + "R";
      pathFound = true;
    }
    if (currentY > 0 && tileArray[currentX][currentY - 1].label == endLabel) {
      tileArray[currentX][currentY].status =
        tileArray[currentX][currentY].status + "U";
      pathFound = true;
    }
    if (
      currentY < tileGrid.numRows - 1 &&
      tileArray[currentX][currentY + 1].label == endLabel
    ) {
      tileArray[currentX][currentY].status =
        tileArray[currentX][currentY].status + "D";
      pathFound = true;
    }

    if (currentX > 0 && tileArray[currentX - 1][currentY].status == "empty") {
      xQueue.push(currentX - 1);
      yQueue.push(currentY);

      tileArray[currentX - 1][currentY].status =
        tileArray[currentX][currentY].status + "L";
    }
    if (
      currentX < tileGrid.numColumns - 1 &&
      tileArray[currentX + 1][currentY].status == "empty"
    ) {
      xQueue.push(currentX + 1);
      yQueue.push(currentY);

      tileArray[currentX + 1][currentY].status =
        tileArray[currentX][currentY].status + "R";
    }
    if (currentY > 0 && tileArray[currentX][currentY - 1].status == "empty") {
      xQueue.push(currentX);
      yQueue.push(currentY - 1);

      tileArray[currentX][currentY - 1].status =
        tileArray[currentX][currentY].status + "U";
    }
    if (
      currentY < tileGrid.numRows - 1 &&
      tileArray[currentX][currentY + 1].status == "empty"
    ) {
      xQueue.push(currentX);
      yQueue.push(currentY + 1);

      tileArray[currentX][currentY + 1].status =
        tileArray[currentX][currentY].status + "D";
    }
  }

  if (pathFound) {
    configMessage.textContent = "Pick route found successfully";

    var path = tileArray[currentX][currentY].status;
    storeEdgeDirections(path, startLabel, endLabel);
    return visualiseEdge(path, startCoords);
  } else {
    configMessage.textContent = "There is no route to the picking item";
    return null;
  }
}

function storeEdgeDirections(path, startLabel, endLabel) {
  var edge = startLabel + "" + endLabel;
  if (startLabel == "start") {
    var edge = endLabel;
    path = path.replace("start", "");
  } else {
    var edge = startLabel + "" + endLabel;
    path = path.replace("pick", "");
  }
  if (!edgeDirectionsHash[edge]) {
    edgeDirectionsHash[edge] = path;
  }
}

function findStartCoords(label) {
  for (let i = 0; i < tileGrid.numColumns; i++) {
    for (let j = 0; j < tileGrid.numRows; j++) {
      if (tileArray[i][j].label == label) {
        var startCoords = [i, j];
        return startCoords;
      }
    }
  }
}
