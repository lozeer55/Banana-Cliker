var game = {
  score: 0,
  totalScore: 0,
  totalClicks: 0,
  clickValue: 1,
  version: 0.002,

  addToScore: function (amount) {
    this.score += amount;
    this.totalScore += amount;
    display.updateScore();
  },

  getScorePerSecond: function () {
    var scorePerSecond = 0;
    for (i = 0; i < building.name.length; i++) {
      scorePerSecond += building.income[i] * building.count[i];
    }
    return scorePerSecond;
  },
};

// -----------------Matriz de valores de botones-------------------------

var building = {
  name: ["cursor", "mono", "fabrica", "jungla", "templo","monoverso"],
  image: [
    "cursor.png",
    "mono1.png",
    "fabrica.png",
    "jungla1.png",
    "templo.png",
    "monoverso.png",
  ],
  count: [0, 0, 0, 0, 0, 0],
  income: [1, 5, 50, 150, 1000, 10000],
  cost: [15, 100, 1500, 10000, 500000, 1000000],
  class: ["cursor", "mono", "fabrica", "jungla", "templo", "monoverso"],
  requirement: [0, 2, 25, 50, 30, 50, 100],

  parchuse: function (index) {
    if (game.score >= this.cost[index]) {
      game.score -= this.cost[index];
      this.count[index]++;
      this.cost[index] = Math.ceil(this.cost[index] * 1.1);
      display.updateScore();
      display.updateShop();
      display.updateUpgrades();
    }
  },
};

// -----------------Matriz de valores de botones----------------------------

// -----------------Matriz de valores de mejoras----------------------------

var upgrade = {
  name: [
    "Dedos de Roca",
    "Dedos de Bronze",
    "Dedos de Oro",
    "Clicker de piedra",
    "Clicker de Bronze",
  ],
  description: [
    "Los cursores son el doble de eficientes",
    "Los cursores son el triple de eficientes",
    "Los cursores son el cuadruple de eficientes",
    "Tus clicks son el doble de eficientes",
    "Tus clicks son el triple de eficientes",
  ],
  image: [
    "cursorpiedra.png ",
    "cursorbronze.png",
    "cursororo.png",
    "clickerpiedra.png",
    "clickerbronze.png",
  ],
  type: ["building", "building", "building", "click", "click"],
  cost: [100, 1000, 10000, 500, 10000],
  buildingIndex: [0, 0, 0, -1, -1],
  requirement: [20, 60, 100, 1, 2],
  bonus: [2, 3, 4, 2, 3],
  purchased: [false, false, false, false, false],

  purchase: function (index) {
    if (!this.purchased[index] && game.score >= this.cost[index]) {
      if (
        this.type[index] == "building" &&
        building.count[this.buildingIndex[index]] >= this.requirement[index]
      ) {
        game.score -= this.cost[index];
        building.income[this.buildingIndex[index]] *= this.bonus[index];
        this.purchased[index] = true;

        display.updateUpgrades();
        display.updateScore();
      } else if (
        this.type[index] == "click" &&
        game.totalClicks >= this.requirement[index]
      ) {
        game.score -= this.cost[index];
        game.clickValue *= this.bonus[index];
        this.purchased[index] = true;

        display.updateUpgrades();
        display.updateScore();
      }
    }
  },
};

// -----------------Matriz de valores de mejoras----------------------------

// -----------------------Mostar valores------------------------------------

var display = {
  updateScore: function () {
    document.getElementById("score").innerHTML = game.score;
    document.getElementById("persecond").innerHTML = game.getScorePerSecond();
    document.title = game.score + " Bananas - Banana Clicker";
  },

  // -----------------------Mostar valores------------------------------------

  // ---------------------------MOSTARR-BOTONES-----------------------------

  updateShop: function () {
    document.getElementById("shopcontainer").innerHTML = "";
    for (i = 0; i < building.name.length; i++) {
      document.getElementById("shopcontainer").innerHTML += '<table class="shopButton" id="' + building.class[i] + '"  onclick="building.parchuse(' + i +')"><tr><td id="image"><img src="./img/' + building.image[i] + '" alt="" /></td><td id="nameAndCost"><p>' + building.name[i] + "</p><p><span>" + building.cost[i] + '</span> bananas</p></td><td id="amount"><span>' + building.count[i] + "</span></td></tr></table>";
    }
  },

  updateUpgrades: function () {
    document.getElementById("upgradeContainer").innerHTML = "";
    for (i = 0; i < upgrade.name.length; i++) {
      if (!upgrade.purchased[i]) {
        if (
          upgrade.type[i] == "building" &&
          building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]
        ) {
          document.getElementById("upgradeContainer").innerHTML =
          '<table class="shopButton" onclick="upgrade.purchase(' + i + ')"'>'<tr><td><span><img src="./img/' + upgrade.image[i] + '></span>'; "<td><tr></table>";
        } else if (
          upgrade.type[i] == "click" &&
          game.totalClicks >= upgrade.requirement[i]
        ) {
          document.getElementById("upgradeContainer").innerHTML =
            '<img src="./img/' +
            upgrade.image[i] +
            '" onclick="upgrade.purchase(' +
            i +
            ')">';
        }
      }
    }
  },
};

// --------------------------------GUARDADO---------------------------------

function saveGame() {
  var gameSave = {
    score: game.score,
    totalScore: game.totalScore,
    totalClicks: game.totalClicks,
    clickValue: game.clickValue,
    version: game.version,
    buildingCount: building.count,
    buildingIncome: building.income,
    buildingCost: building.cost,
    upgradePurchased: upgrade.purchased,
  };
  localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame() {
  var savedGame = JSON.parse(localStorage.getItem("gameSave"));
  if (localStorage.getItem("gameSave") !== null) {
    if (typeof savedGame.score !== "undefined") game.score = savedGame.score;
    if (typeof savedGame.totalScore !== "undefined")
      game.totalScore = savedGame.totalScore;
    if (typeof savedGame.totalClics !== "undefined")
      game.totalClicks = savedGame.totalClicks;
    if (typeof savedGame.clickValue !== "undefined")
      game.clickValue = savedGame.clickValue;
    if (typeof savedGame.buildingCount !== "undefined") {
      for (i = 0; i < savedGame.buildingCount.length; i++) {
        building.count[i] = savedGame.buildingCount[i];
      }
    }
    if (typeof savedGame.buildingIncome !== "undefined") {
      for (i = 0; i < savedGame.buildingIncome.length; i++) {
        building.income[i] = savedGame.buildingIncome[i];
      }
    }
    if (typeof savedGame.buildingCost !== "undefined") {
      for (i = 0; i < savedGame.buildingCost.length; i++) {
        building.cost[i] = savedGame.buildingCost[i];
      }
    }
    if (typeof savedGame.upgradePurchased !== "undefined") {
      for (i = 0; i < savedGame.upgradePurchased.length; i++) {
        upgrade.purchased[i] = savedGame.upgradePurchased[i];
      }
    }
  }
}

//--------------------------Reiniciar------------------------------------

function restGame() {
  if (confirm("Estas seguro de que quieres reiniciar el progreso?")) {
    var gameSave = {};
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
    location.reload();
  }
}

//--------------------------Reiniciar------------------------------------

// ----------------------------------------------------------------------
document.getElementById("clicker").addEventListener(
  "click",
  function () {
    game.totalClicks++;
    game.addToScore(game.clickValue);
  },
  false
);

// ------------------------------------------------------------------------
window.onload = function () {
  loadGame();
  display.updateScore();
  display.updateUpgrades();
  display.updateShop();
};

// ---------------------Intervalos---------------------------------------

setInterval(function () {
  game.score += game.getScorePerSecond();
  game.totalScore += game.getScorePerSecond();
  display.updateScore();
  display.updateUpgrades();

  // if (building.count[i] >= building.requirement[i]) {
  //   document.getElementById.bind("" + building.class[i]).style.visibility =
  //     "visible";
  // }
}, 1000); //1000ms = 1s

setInterval(function () {
  display.updateScore();
  display.updateUpgrades();
}, 10000);

setInterval(function () {
  saveGame();
}, 30000); //30000ms = 30s

// ---------------------Intervalos----------------------------------------

// --------------------Ctr + S  = saveGame--------------------------------
document.addEventListener(
  "keydown",
  function (event) {
    if (event.ctrlKey && event.which == 83) {
      // ctr + s press
      event.preventDefault();
      saveGame();
    }
  },
  false
);

// --------------------Ctr + S  = saveGame--------------------------------
