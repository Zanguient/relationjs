document.addEventListener("DOMContentLoaded", function() {
  // requesting to server
  function request_word(word) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $.getJSON('/data/' + word.toLowerCase() + '.json', function(data) {
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
    xhttp.open("GET", '/data/' + word.toLowerCase() + '.json', true);
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

    if(_.has(elements, 'forte')) {
      for (var i = 1, len = elements.forte.length; i < len; i++) {
        if (elements.forte[i].length > 2) {
          cy.add({
            data: {
              type: 'frt',
              id: 'node_frt'+i,
              label: elements.forte[i]
            }
          });
          var source = 'node_frt' + i;
          cy.add({
            data: {
              type: 'frt',
              id: 'edge_frt' + i,
              source: source,
              target: 0
            }
          });
        }
      }
    }
    if(_.has(elements, 'antonimo')) {
      for (var i = 1, len = elements.antonimo.length; i < len; i++) {
        if(elements.antonimo[i].length > 2) {
          cy.add({
            data: {
              type: 'ant',
              id: 'node_ant' + i,
              label: elements.antonimo[i]
            }
          });
          var source = 'node_ant' + i;
          cy.add({
            data: {
              type: 'ant',
              id: 'edge_ant' + i,
              source: source,
              target: 0
            }
          });
        }
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
        'border-width': 1,
        'background-opacity': 0.9,
        'label': 'data(label)'
      }
    },
    {
      selector: 'node#0',
      style: {
        'background-color': '#000000',
        'background-opacity': 1
      }
    },
    {
      selector: '*[type = "ant"]',
      style: {
        'line-color': '#fc1900',
        'background-color': '#fc1900',

      }
    }],
      layout: {
        name: 'concentric'
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
      var layout = cy.layout({ name: 'concentric' });
      layout.run();
    }
    // handling graph events
    cy.on('updateLayout', function() {
      fix_layout(cy);
    });
  });
