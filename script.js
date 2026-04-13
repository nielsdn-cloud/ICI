// henter data fra data.json
d3.json("data.json").then(function(data) {

  const svg = d3.select("body")
    .append("svg")
    .attr("width", 900)
    .attr("height", 600);

  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(450, 300));

  const link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", "#aaa");

  const node = svg.append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("fill", d => {
      if (d.type === "lvl_1") return "red";
      if (d.type === "lvl_2") return "blue";
      if (d.type === "lvl_3") return "green";
      return "orange";
    });

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });
// Basal D3 force graf
const width = 900;
const height = 600;

const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const simulation = d3.forceSimulation(data.nodes)
  .force("link", d3.forceLink(data.links).id(d => d.id).distance(120))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));
  
//Tegn forbindelser
const link = svg.append("g")
  .selectAll("line")
  .data(data.links)
  .enter()
  .append("line")
  .attr("stroke", "#999")
  .attr("stroke-width", 2);
  
//Tegn nodes
const color = d => {
  switch(d.type) {
    case "lvl_1": return "#e63946";
    case "lvl_2": return "#457b9d";
    case "lvl_3": return "#2a9d8f";
    case "lvl_4": return "#f4a261";
  }
};

const node = svg.append("g")
  .selectAll("circle")
  .data(data.nodes)
  .enter()
  .append("circle")
  .attr("r", 8)
  .attr("fill", color)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
  );
  
  //labels
  const label = svg.append("g")
  .selectAll("text")
  .data(data.nodes)
  .enter()
  .append("text")
  .text(d => d.id)
  .attr("font-size", 10)
  .attr("dx", 10)
  .attr("dy", 4);
  
  //Opdatering af simulation
  simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  label
    .attr("x", d => d.x)
    .attr("y", d => d.y);
});

//Drag-funktioner
function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//Trace nerve
node.on("click", (event, clickedNode) => {

  const connected = new Set();

  data.links.forEach(link => {
    if (link.source.id === clickedNode.id || link.target.id === clickedNode.id) {
      connected.add(link.source.id);
      connected.add(link.target.id);
    }
  });

  node.attr("opacity", d => connected.has(d.id) ? 1 : 0.2);
  link.attr("opacity", d =>
    d.source.id === clickedNode.id || d.target.id === clickedNode.id ? 1 : 0.1
  );
});
});
