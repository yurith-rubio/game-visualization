import {select, forceSimulation, forceManyBody, forceCenter, forceX, forceY, forceRadial, selectAll} from 'd3';
import {useEffect} from 'react';
import styles from './App.css'

let loaded = false;

export default function App() {

  function renderGames(nodes) {
    if (loaded) return;
    loaded = true;
    const svg = select('#svgCirclesWrapper');
    const initialPosition = document.querySelector('#svgCirclesWrapper').getBoundingClientRect();
    const height = initialPosition.height;
    const width = initialPosition.width;
      
    var simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(1))
      .force('center', forceCenter(width / 2, height / 2))
      .force('x', forceX().x(function(d) {
        return width / 2;
      }))
      .force('y', forceY().y(function(d) {
        return height / 2;
      }))     
      .on('tick', ticked);
    
    function ticked() {
    
      svg
        .selectAll("circle")
        .data(nodes)
        .join(
         "circle"
        )
        .classed('circle', true)
        .classed('visible', true)
        .attr("fill", function (d) {
          let r = d.playTime > 255 ? 255 : d.playTime;
          return `rgb(64, ${r}, 196)`;
        })
        .attr("r", function (d) {          
          return 10;
        })
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })

        .on('mouseenter', function (d, value){
          const element = d.target;
          const xPosition = element.cx.baseVal.value;
          const yPosition = element.cy.baseVal.value;

          svg
          .append('image')
          .attr('href', value.iconURL)
          .attr('width', 32)
          .attr('x', xPosition + 20)
          .attr('y', yPosition - 40);
          

        })

        .on('mouseout', function(d, value){
          const element = d.target;
          svg
          .selectAll('image')
          .remove()
        })

        .on('click', function(d, value){
          selectAll(".text").remove();

          const x = d.target.cx.baseVal.value;
          const y = d.target.cy.baseVal.value;

          const words = value.name.split(" ");
          const parts = [];
          let em = 0;

          for (let i = 0; i < words.length; i+=2) {
            if (words[i + 1]) {
              parts.push(words[i] + " " + words[i + 1]);
            } else {
              parts.push(words[i]);
            }
          }

          parts.push(value.playTime + " minutes");
          
          let lastText;
          for (let part of parts) {
            lastText = svg
            .append('text')
            .attr('fill', 'white')
            .classed('text textShows', true)
            .text(part)
            .attr("dy", `${em}em`)
            .attr('x', d.target.cx.baseVal.value - 60)
            .attr('y', d.target.cy.baseVal.value - 10)

            em += 1;
          }
          
          
          lastText
          .classed('number', true)
          .attr("dy", `${em - .5}em`)

          const bg = document.querySelector("#root");
          bg.style.background = `url(${value.backgroundURL})`;
          bg.style.backgroundSize = 'cover';
          bg.style.backgroundColor = '#09263c';
          bg.style.backgroundBlendMode = 'soft-light';

          simulation.force("radial", forceRadial(200, x, y)).alpha(1).restart();
        });

      simulation.force('charge', forceManyBody());
    }
  }

  useEffect(() => {
    fetch("/api/games").then(response => response.json()).then(data => {
      renderGames(data);
    });
  }, []);

  return <>
    <svg id='svgCirclesWrapper'></svg>
  </>
}
