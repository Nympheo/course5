

const data = [
  {year: '2000,01,01', doctors: 45800, medWorkers: 122600, hospitals: 830, beds: 126200, polyclinics: 1843},
  {year: '2001,01,01', doctors: 44900, medWorkers: 123200, hospitals: 817, beds: 125400, polyclinics: 1856},
  {year: '2002,01,01', doctors: 44800, medWorkers: 123500, hospitals: 781, beds: 118500, polyclinics: 1862},
  {year: '2003,01,01', doctors: 45000, medWorkers: 117000, hospitals: 729, beds: 112000, polyclinics: 1918},
  {year: '2004,01,01', doctors: 45300, medWorkers: 117300, hospitals: 704, beds: 105300, polyclinics: 1983},
  {year: '2005,01,01', doctors: 45600, medWorkers: 118500, hospitals: 711, beds: 108800, polyclinics: 2005},
  {year: '2006,01,01', doctors: 46400, medWorkers: 118300, hospitals: 725, beds: 108800, polyclinics: 2022},
  {year: '2007,01,01', doctors: 47000, medWorkers: 118200, hospitals: 792, beds: 108900, polyclinics: 2027},
  {year: '2008,01,01', doctors: 48100, medWorkers: 120600, hospitals: 773, beds: 107700, polyclinics: 2208},
  {year: '2009,01,01', doctors: 49400, medWorkers: 122200, hospitals: 661, beds: 107000, polyclinics: 2205},
  {year: '2010,01,01', doctors: 45300, medWorkers: 121800, hospitals: 661, beds: 108700, polyclinics: 2228},
  {year: '2011,01,01', doctors: 48000, medWorkers: 120000, hospitals: 656, beds: 106600, polyclinics: 2292},
  {year: '2012,01,01', doctors: 48800, medWorkers: 125100, hospitals: 657, beds: 106600, polyclinics: 2263},
  {year: '2013,01,01', doctors: 49300, medWorkers: 122700, hospitals: 646, beds: 84000, polyclinics: 2267},
  {year: '2014,01,01', doctors: 51100, medWorkers: 123900, hospitals: 641, beds: 82300, polyclinics: 2309},
  {year: '2015,01,01', doctors: 53200, medWorkers: 126100, hospitals: 640, beds: 82000, polyclinics: 2325},
  {year: '2016,01,01', doctors: 54500, medWorkers: 125800, hospitals: 636, beds: 83000, polyclinics: 2311},
];

const colors = {doctors: 'rgb(60, 132, 164)',
                medWorkers: 'rgb(104, 53, 133)',
                hospitals: 'rgb(212, 13, 78)',
                beds: 'rgb(0, 182, 46)',
                polyclinics: 'rgb(224, 251, 0)'};

const CONTAINER_W = parseFloat(d3.select('container').style('width'));

const margin = {top: 20, right: 30, bottom: 20, left: 70},
      width = CONTAINER_W - margin.left - margin.right,
      height = CONTAINER_W / 2 - margin.top - margin.bottom - 90;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const layout = svg.append('rect')
                  .attr('width', width)
                  .attr('height', height)
                  .attr('fill', 'white');
//--------------SCALES---------------------------------------
const xScale = d3.scaleTime()
                 .domain([new Date(2000,01,01), new Date(2016,01,01)])
                 .range([0, width]);

const yScale = d3.scaleLinear()
                 .range([height, 0])
                 .domain([0, 125000]);

//--------------AXES----------------------------------------
const xx = d3.axisBottom(xScale)
             .ticks(width / height * 5);
const yy = d3.axisLeft(yScale)
             .ticks(width / height * 5)
             .tickSizeInner(width);

const axisX = svg.append("g")
                 .attr("transform", "translate(0, " + height + ")")
                 .call(xx);

const axisY = svg.append("g")
                 .attr("transform", "translate(" + width + ", 0)")
                 .call(yy);
   axisY.select(".domain").remove();
   axisY.selectAll(".tick:not(:first-of-type) line")
         .attr("stroke", "#777")
         .attr("stroke-dasharray", "2,2");

//------------ZOOM-------------------------------------------
const zoom = d3.zoom()
               .scaleExtent([-10, 10])
               .translateExtent([[-5, -5], [width + 10, height + 10]])
               .on('zoom', zoomed);

 layout.call(zoom);

function zoomed() {
  layout.attr('transform', d3.event.transform);
  axisX.call(xx.scale(d3.event.transform.rescaleX(xScale)));
  axisY.call(yy.scale(d3.event.transform.rescaleY(yScale)));
  axisY.selectAll(".tick:not(:first-of-type) line")
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2,2");
};

//-------------RENDER----------------------------------------------
  d3.selectAll('input').on('change', render);

  function render() {
    let value = this.value;
    let label = d3.select(`label[for=${this.id}]`);
    if(!d3.select('path#' + value)._groups[0][0]){
      label.style('background', colors[value]);
      let line = d3.line()
                   .x(d => xScale(new Date(d.year)))
                   .y(d => yScale(d[value]))
                   .curve(d3.curveBasis);

      layout.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', d => colors[value])
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('id', value)
        .attr('d', line);
    } else {
      label.style('background', null);
      d3.select('path#' + value)._groups[0][0].remove();
    }
  }
