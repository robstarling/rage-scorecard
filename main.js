jQuery(function($,undefined) {

  var Rage = {};
  Rage.serialized = '';
  Rage.nPlayers = 0;
  Rage.playerNames = [];
  Rage.bids = [];
  Rage.deltas = [];

  Rage.serialize = function() {
    var state = {
      playerNames: Rage.playerNames,
      bids: Rage.bids,
      deltas: Rage.deltas
    };
    return btoa(JSON.stringify(state));
  }

  Rage.deserialize = function(s) {
    var state = JSON.parse(atob(s));
    Rage.playerNames = state.playerNames || [];
    Rage.bids = state.bids || [];
    Rage.deltas = state.deltas || [];
    Rage.nPlayers = Rage.playerNames.length;
    $('#m').empty();
    Rage.build();
  }

  Rage.hash = function() {
    Rage.serialized = Rage.serialize();
    location.hash = '#' + Rage.serialized;
  }

  Rage.dehash = function() {
    var h = location.hash;
    var hp = h.indexOf('#');
    if (hp < 0) return;
    Rage.serialized = h.substring(hp + 1);
    Rage.deserialize(Rage.serialized);
  }

  Rage.addPlayer = function() {
    var defName = 'Player ' + (Rage.nPlayers + 1);
    var resp = prompt("Player name? (cancel to not add)", defName);
    if (resp == null) {
      return false;
    }
    Rage.playerNames[Rage.nPlayers] = resp;
    Rage.nPlayers += 1;
    return true;
  }

  Rage.bid = function(r) {
    var n = Rage.nPlayers;
    var s = (10 - r) % n;
    for (var i = 0; i < n; i++) {
      var p = (s + i) % n;
      var name = Rage.playerNames[p];
      var b = prompt("Round of "+r+" bid for "+name);
      if (b == null) return;
      Rage.bids[((10 - r) * n) + p] = parseInt(b);
    }
  }

  Rage.edit = function(p, r) {
    var n = Rage.nPlayers;
    var name = Rage.playerNames[p];
    var s = prompt("Score in round of "+r+" for "+name);
    if (s == null) return;
    Rage.deltas[((10 - r) * n) + p] = parseInt(s);
  }

  Rage.build = function() {
    $('#m').append('<table><thead><tr><th></th></tr></thead><tbody></tbody></table>');
    var thr = $('#m thead tr');
    var tb = $('#m tbody');
    $.each(Rage.playerNames, function(i, name) {
      var hn = $('<th></th>').appendTo(thr);
      hn.text(name);
    });
    for (var r = 10; r > 0; r--) {
      var tr = $('<tr></tr>').appendTo(tb);
      var rn = $('<td></td>').appendTo(tr);
      rn.text(r+" Cards");
      $('<br>').appendTo(rn);
      var bid = $('<button>Set bids</button>').appendTo(rn);
      var bidThis = (function() {
        var _r = r; // close over current values
        return function(){ Rage.bid(_r); Rage.hash(); Rage.dehash(); };
      })();
      bid.click(bidThis);

      var n = Rage.nPlayers;
      for (var p = 0; p < n; p++) {
        var pn = $('<td></td>').appendTo(tr);

        var b = Rage.bids[((10 - r) * n) + p];
        if (b != undefined && b != null) {
          var bid = $('<span class="bid"></span>').appendTo(pn);
          bid.text(b);
        }

        var delta = $(document.createTextNode('_')).appendTo(pn);
        $('<hr>').appendTo(pn);
        var subtotal = $(document.createTextNode('_')).appendTo(pn);

        var d = Rage.deltas[((10 - r) * n) + p];
        if (d != undefined && d != null) {
          delta[0].textContent = d < 0 ? d : '+' + d;

          var st = 0, real = false;
          for (var _r = 10; _r >= r; _r--) {
            var d = Rage.deltas[((10 - _r) * n) + p];
            if (d != undefined && d != null) {
              real = true;
              st += d;
            }
          }
          if (real) {
            subtotal[0].textContent = st;
          }
        }

        var editThis = (function() {
          var _p = p, _r = r; // close over current values
          return function(){ Rage.edit(_p, _r); Rage.hash(); Rage.dehash(); };
        })();
        pn.click(editThis);
      }
    }
  }

  Rage.reset = function() {
    $('#m').empty();
    Rage.nPlayers = 0;
    Rage.playerNames = [];
    location.hash = '';
    var adding = Rage.addPlayer();
    while (adding) {
      var name = Rage.playerNames[Rage.nPlayers-1];
      adding = Rage.addPlayer();
    }
    Rage.build();
    Rage.hash();
  }

  Rage.init = function() {
    Rage.dehash();
    if (Rage.nPlayers <= 0) Rage.reset();
  }

  $('#bReset').click(Rage.reset);

  window.Rage = Rage;  // for debugging
  Rage.init();
});
