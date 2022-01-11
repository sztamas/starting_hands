var allCards = ['10C', '10D', '10H', '10S', '2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', 'AC', 'AD', 'AH', 'AS', 'JC', 'JD', 'JH', 'JS', 'KC', 'KD', 'KH', 'KS', 'QC', 'QD', 'QH', 'QS'];

// var categories = ['very-strong', 'strong', 'mediocre', 'speculative', 'mixed'];
//var categories = ['speculative'];

var card1;
var card2;

function setCard(cardId, type) {
  if (type === 'blank') {
    type = 'Blue_Back';
  }
  img = 'img/' + type + '.svg';
  $(cardId).attr('src', img);
}

function setBlankCards() {
  setCard("#card1", "blank");
  setCard("#card2", "blank");
}

function cardSuit(card) {
  return card.substring(card.length - 1);
}

function cardRank(card) {
  if (card.indexOf('10') === 0) {
    return '10';
  } else {
    return card.substring(0,1);
  }
}

function numericRank(rank) {
  var ranks = {'J': 11, 'Q': 12, 'K': 13, 'A': 14};
  return parseInt(rank) ? parseInt(rank) : ranks[rank];
}

function sorterFun(a, b) {
  return numericRank(cardRank(a)) - numericRank(cardRank(b));  
}

function abbreviate(card1, card2) {
  var cards = [card1, card2];
  cards.sort(sorterFun).reverse();
  function subsTens(rank) { return '10' === rank ? 'T': rank; }
  var abbr = subsTens(cardRank(cards[0])) + subsTens(cardRank(cards[1]));
  if (cardRank(card1) !== cardRank(card2)) {
    var cat = cardSuit(card1) === cardSuit(card2) ? 's' : 'o';
    abbr += cat;
  }
  return abbr;
}

function categorise(card1, card2) {
  var abbr = abbreviate(card1, card2);

  if (_.includes(['AA', 'KK', 'QQ', 'AKs', 'AKo'], abbr)) {
    return 'very-strong';
  }
  if (_.includes(['JJ', 'TT', '99', 'AQs', 'AQo', 'AJs'], abbr)) {
    return 'strong';
  };
  if (_.includes(['AJo', 'ATs', 'ATo', 'KQs', 'KQo'], abbr)) {
    return 'mediocre';
  };
  if (_.includes(['KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s',
                  '88', '77', '66', '55', '44', '33', '22'], abbr)) {
    return 'speculative';
  };
  if (_.includes(['KJo', 'KTo', 'QJo', 'QTo', 'JTo',
                  'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                  'K9s', '87s', '98s'], abbr)) {
    return 'mixed';
  };
  
  return "trash";
}

function modeBtnHandler(ev) {
  var newMode = this.id.substring(4);
  setMode(newMode);
}

function answerBtnHandler(ev) {
  var node = $(this);
  // $('#answer .btn').addClass('disabled');
  var correctNode;
  
  var guessedCategory = this.id.substring(4);
  var correctCategory = categorise(card1, card2);

  if (guessedCategory === correctCategory) {
    node.addClass('btn-success');
    setTimeout(function() {
      node.removeClass('btn-success');
      nextDraw();
    }, 500);
  } else {
    correctNode = $('#btn-' + correctCategory);
    correctNode.addClass('btn-success');
    node.addClass('btn-danger');
    setTimeout(function() {
      node.removeClass('btn-danger :active');
      correctNode.removeClass('btn-success');
      nextDraw();
    }, 3000);
  }
}

function realisticDraw() {
  return _.sampleSize(allCards, 2);
}

function evenDistrDraw(categories) {
  var cards, cardsCategory;
  var category = _.sample(categories);

  do {
    cards = _.sampleSize(allCards, 2);
    cardsCategory = categorise(cards[0], cards[1]);
  } while (cardsCategory !== category);

  return cards;
}

function nextDraw() {
  setBlankCards();
  var categories = ['very-strong', 'strong', 'mediocre', 'speculative', 'mixed'];
  var cards;
  if (mode === 'even-distr') {
    cards = evenDistrDraw(categories.concat('trash'));
  } else if (mode === 'no-trash') {
    cards = evenDistrDraw(categories);
  } else {
    cards = realisticDraw();
  }
  card1 = cards[0];
  card2 = cards[1];
  setCard('#card1', card1);
  setCard('#card2', card2);
  // $('#answer .btn').removeClass('disabled');
}

function setMode(newMode) {
  mode = newMode;
  $('#mode .btn').removeClass('btn-primary');
  var btn = $('#btn-' + mode).addClass('btn-primary');
}

function init() {
  $('#mode .btn').click(modeBtnHandler);
  $('#answer .btn').click(answerBtnHandler);
  setMode('even-distr');
  nextDraw();
}

init();
