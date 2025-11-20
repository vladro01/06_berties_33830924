const bcrypt = require("bcrypt");
const saltRounds = 10;

bcrypt.hash("smiths", saltRounds, function (err, hash) {
  if (err) throw err;
  console.log("Hash for smiths:", hash);
});