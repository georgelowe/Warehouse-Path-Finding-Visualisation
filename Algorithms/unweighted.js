function solveUnweighted(tileArray, startCoords, endLabel) {
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
      currentX < numColumns - 1 &&
      tileArray[currentX + 1][currentY].label == endLabel
    ) {
      pathFound = true;
    }
    if (currentY > 0 && tileArray[currentX][currentY - 1].label == endLabel) {
      pathFound = true;
    }
    if (
      currentY < numRows - 1 &&
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
      currentX < numColumns - 1 &&
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
      currentY < numRows - 1 &&
      tileArray[currentX][currentY + 1].status == "empty"
    ) {
      xQueue.push(currentX);
      yQueue.push(currentY + 1);

      tileArray[currentX][currentY + 1].status =
        tileArray[currentX][currentY].status + "D";
    }
  }

  if (pathFound) {
    pickCountMessage.textContent = "Pick route found successfully";
    var path = tileArray[currentX][currentY].status;
    return visualise(path, startCoords);
  } else {
    pickCountMessage.textContent = "There is no route to the picking item";
    return null;
  }
}
