function calculateRouteCosts(routePermutationsHash, edgeCostsHash) {
  var currentCost = 0;
  var content;
  var routeResults = [];

  Object.keys(routePermutationsHash).forEach(function (route) {
    if (route.length == 1) {
      routeResults = [[route, edgeCostsHash[route]]];
      return routeResults;
    }

    var routeSubSections = splitRouteIntoSubsections(route);

    var currCost = 0;

    for (let i = 0; i < routeSubSections.length; i++) {
      currCost += edgeCostsHash[i];

      if(i==)
    }
    for (let i = 0; i < route.length - 1; i++) {
      var routeSubsection = route[i] + "" + route[i + 1];
      var orderedRouteSubsection = routeSubsection.split("").sort().join("");
      currentCost += edgeCostsHash[orderedRouteSubsection];

      if (i == route.length - 2) {
        for (let i = 0; i < 2; i++) {
          var updatedCost =
            currentCost + edgeCostsHash[route[i * (route.length - 1)]];

          var path = "" + route;
          if (i == 1) {
            path = path.split("").reverse().join("");
          }
          content = "Start->" + path;
          routeResults.push([content, updatedCost]);
        }
      }
    }
    currentCost = 0;
  });
  return routeResults;
}

function splitRouteIntoSubsections(route) {
  var routeSubSections = [];

  for (let i = 0; i < route.length; i++) {
    var routeSubsection = route[i] + "" + route[i + 1];
    var orderedRouteSubsection = routeSubsection.split("").sort().join("");
    routeSubSections.push(orderedRouteSubsection);
  }

  return routeSubSections;
}
