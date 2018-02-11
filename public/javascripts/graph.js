"use strict";

document.addEventListener("DOMContentLoaded", function() {
  // Requesting to server
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

  // Adds nodes to cy graph
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
    fix_layout(cy);
  }

  // Randomize nodes layout
  function fix_layout(cy) {
    var layout = cy.layout({ name: 'circle' });
    layout.run();
  }

  // Defines cy graph
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

    // Initializng graph
    request_word('Amor');

    // Search action
    $("button").click(function(word) {
      var word = $("input:text").val();
      var elements = request_word(word);

      // Emiting graph events
      cy.emit('updateLayout');
    });

    // Handling graph events
    cy.on('updateLayout', function() {
      fix_layout(cy);
    });
  });
