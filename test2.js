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

function myFunc(p) {
  Object.keys(p).forEach(function (key) {
    console.log(key);
  });
}

var string = "ABC";
var reducedPermutations = reducePermutations(string);

myFunc(reducedPermutations);
