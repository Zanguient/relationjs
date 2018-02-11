document.addEventListener("DOMContentLoaded", function() {
  // requesting to server
  function request_word(word) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $.getJSON('/javascripts/data/' + word.toLowerCase() + '.json', function(data) {
              add_elements(data, cy);
          });
        }
        else if (this.status >= 404) {
          var data = {
            palavra: 'Palavra nao encontrada, tente procurar por outra!'
          }
          add_elements(data, cy);
        }
    };
    xhttp.open("GET", '/javascripts/data/' + word.toLowerCase() + '.json', true);
    xhttp.send();
  }

  // adds nodes to cy graph
  function add_elements(elements, cy) {
    cy.elements().remove();
    cy.add({
      data: {
        id: 0,
        label: elements.palavra
      }
    });

    if(_.has(elements, 'relacoes')) {
      for (var i = 1, len = elements.relacoes.length; i < len; i++) {
        cy.add({
          data: {
            id: i,
            label: elements.relacoes[i]
          }
        });
        var source = i;
        cy.add({
          data: {
            id: 'e' + i,
            source: source,
            target: 0
          }
        });
      }
    }
    cy.emit('updateLayout');
  }

  // defines cy graph
  var cy = cytoscape({
    container: document.getElementById('cy'),
    style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666555',
        'label': 'data(label)'
      }
    }],
      layout: {
        name: 'circle'
      }
    });

    // initializing graph
    request_word('Aba');

    // press enter search action
    $(document).keypress(function(e) {
        if(e.which == 13) {
          search();
        }
    });
    // click search action
    $("button").click(function(word) {
      search();
    });

    function search() {
      var word = $("input:text").val();
      $("input:text").val("")
      request_word(word);
    }

    // fix nodes layout
    function fix_layout(cy) {
      var layout = cy.layout({ name: 'circle' });
      layout.run();
    }
    // handling graph events
    cy.on('updateLayout', function() {
      fix_layout(cy);
    });
  });
