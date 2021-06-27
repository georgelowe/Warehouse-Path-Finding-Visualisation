function getPermutations(string) {
  var permutations = [];

  if (string.length === 1) {
    permutations.push(string);
    permutations[string];
    return permutations;
  }
  for (var i = 0; i < string.length; i++) {
    var firstChar = string[i];
    var otherChar = string.substring(0, i) + string.substring(i + 1);
    var otherPermutations = getPermutations(otherChar);

    for (var j = 0; j < otherPermutations.length; j++) {
      permutations.push(firstChar + otherPermutations[j]);
    }
  }
  return permutations;
}

function reducePermutations(string) {
  var permutationsHash = {};
  var permutations = getPermutations(string);

  // Create hash of permutations excluding reversed duplicates
  for (let i = 0; i < permutations.length; i++) {
    var perm = permutations[i];
    var reversedPerm = perm.split("").reverse().join("");

    if (!permutationsHash[perm] && !permutationsHash[reversedPerm]) {
      permutationsHash[perm] = true;
    }
  }
  return permutationsHash;
}

function myFunc(routes) {
  console.log(routes);
  var count = 0;
  var lowestCount = 999;
  var bestRoute = "";
  var resultsArr = [];

  Object.keys(routes).forEach(function (key) {
    console.log("\nKey is " + key);

    for (let i = 0; i < key.length - 1; i++) {
      var newKey = key[i] + "" + key[i + 1];
      var sortedNewKey = newKey.split("").sort().join("");

      console.log("Sorted key is: " + sortedNewKey);

      count = count + hash[sortedNewKey];

      if (i == key.length - 2) {
        console.log("Route " + key + " has a score of " + count);

        for (let i = 0; i < 2; i++) {
          var updatedCount = count + hash[key[i * (key.length - 1)]];

          var path = "" + key;

          if (i == 1) {
            path = path.split("").reverse().join("");
          }

          console.log(
            "Route: Start->" + path + " has a score of " + updatedCount
          );
          if (updatedCount < lowestCount) {
            lowestCount = updatedCount;
            bestRoute = path;
          }
        }
      }
    }

    count = 0;
  });
  console.log(
    "Lowest count is " + lowestCount + " with route: start-> " + bestRoute
  );
}

var hash = {};
hash["A"] = 10;
hash["B"] = 6;
hash["C"] = 21;
hash["D"] = 4;
hash["AB"] = 11;
hash["AC"] = 8;
hash["AD"] = 16;
hash["BC"] = 1;
hash["BD"] = 10;
hash["CD"] = 11;
hash["AE"] = 13;
hash["BE"] = 18;
hash["CE"] = 7;
hash["DE"] = 4;

var string = "ABCDE";
var reducedPermutations = reducePermutations(string);
myFunc(reducedPermutations);
