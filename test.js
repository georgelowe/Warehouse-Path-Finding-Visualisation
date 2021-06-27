function test(pickCount) {
  var labelMap = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H",
    9: "I",
    10: "J",
  };
  var hash = {};
  var string = "";

  for (let i = 1; i < pickCount + 1; i++) {
    string = string + labelMap[i];
  }

  for (let i = 0; i < string.length - 1; i++) {
    for (let j = 1; j < string.length; j++) {
      if (i + j < string.length) {
        let res = string[i] + "" + string[i + j];
        console.log(res);

        if (!hash[res]) {
          hash[res] = solve(string[i], string[i + j]);
        }
      }
    }
  }
  console.log(hash);
}

function solve(start, end) {
  console.log("Route from " + start + " to " + end);
  return 10;
}

var pickCount = 4;

test(pickCount);
