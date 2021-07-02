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

    // Check that the desired "label" has been found
    if (currentX > 0 && tileArray[currentX - 1][currentY].label == endLabel) {
      pathFound = true;
    }
    if (
      currentX < tileGrid.numColumns - 1 &&
      tileArray[currentX + 1][currentY].label == endLabel
    ) {
      pathFound = true;
    }
    if (currentY > 0 && tileArray[currentX][currentY - 1].label == endLabel) {
      pathFound = true;
    }
    if (
      currentY < tileGrid.numRows - 1 &&
      tileArray[currentX][currentY + 1].label == endLabel
    ) {
      pathFound = true;
    }

    // Check and explore empty tiles
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

    return visualise(path, startCoords);
  } else {
    configMessage.textContent = "There is no route to the picking item";
    return null;
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
