

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

const colors = {doctors: "#98abc5",
                medWorkers: "#6b486b",
                hospitals: "#a05d56",
                beds: "#d0743c",
                polyclinics: "#ff8c00"};

const CONTAINER_W = parseFloat(d3.select('container').style('width'));

const margin = {top: 20, right: 30, bottom: 20, left: 70},
      width = CONTAINER_W - margin.left - margin.right,
      height = CONTAINER_W / 2 - margin.top - margin.bottom - 90;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const layout = svg.append('g');
//--------------SCALES---------------------------------------
const xScale = d3.scaleTime()
                 .domain([new Date(2000,01,01), new Date(2016,01,01)])
                 .range([0, width]);

const yScale = d3.scaleLinear()
                 .range([height, 0])
                 .domain([0, 125000]);

const xBandWide = d3.scaleBand()
                    .rangeRound([0, width])
                    .paddingInner(0.1)
                    .domain(data.map(e=>e.year.slice(0,4)));

const xBandNarrow = d3.scaleBand()
                      .padding(0.05)
                      .domain(Object.keys(colors))
                      .rangeRound([0, xBandWide.bandwidth()]);

//--------------AXES----------------------------------------
const xx = d3.axisBottom(xScale)
             .ticks(width / height * 5);
const yy = d3.axisLeft(yScale)
             .ticks(width / height * 5)
             .tickSizeInner(width);
// const xxBandW = d3.axisBottom(xBandWide)
//                   .ticks(width / height * 5);
const xxBandN = d3.axisBottom(xBandNarrow)
                  .ticks(width / height * 5);

var axisXnarrow;

const axisX = svg.append("g")
                 .attr("transform", "translate(0, " + height + ")")
                 .call(xx);

let axisY = svg.append("g")
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
  d3.selectAll('input.group1').on('change', change);
  d3.selectAll('input.group2').on('click', toggleActive);
  d3.selectAll('input.group2').on('change', render);

  let view = 'radio-2';
  function change() {
    view = d3.select(this).attr('id');
    render();
  }

  function toggleActive() {
    d3.select(this).classed('active', !d3.select(this).classed('active'));
    let label = d3.select(`label[for=${this.id}]`);
    let value = this.value;
    d3.select(this).classed('active')
        ? label.style('background', colors[value])
        : label.style('background', null);
  }

  function render() {
    layout.selectAll('path').remove();
    let activeTabs = d3.selectAll('.active')._groups[0];
    activeTabs = Array.from(activeTabs).map(e => e.value);
    let reqFun = (view == 'radio-1') ? drawHist
               : (view == 'radio-2') ? drawPath
               : drawStream;
    if(reqFun == drawPath){
      for(let i = 0; i < activeTabs.length; i++){
        reqFun(activeTabs[i]);
      }
    }
    else if (reqFun == drawStream) {
      reqFun(activeTabs);
    }
    else if (reqFun == drawHist) {
      reqFun(activeTabs);
    }
  }

//---------------------DRAW FUNCS----------------------------------------
  function drawHist(activeTabs) {
    let domain = activeTabs.map(e => d3.max(data, d => d[e]));
    domain = d3.max(domain);
    yScale.domain([0, domain]);
    axisY.remove();
    axisY = svg.append("g")
                     .attr("transform", "translate(" + width + ", 0)")
                     .call(yy);
       axisY.select(".domain").remove();
       axisY.selectAll(".tick:not(:first-of-type) line")
             .attr("stroke", "#777")
             .attr("stroke-dasharray", "2,2");

    // axisXnarrow = svg.append("g")
    //              .attr("transform", `translate(0,${height-20})`)
    //              .call(xxBandN)
    //              .selectAll('text').remove();

    layout.selectAll('g')
          .data(data)
          .enter().append('g')
                  .attr('transform', function(d){
                    return `translate(${xScale(new Date(d.year))}, 0)`})
                  .selectAll('rect')
                  .data(d => Object.keys(colors).map((key) => {
                    return {key: key, value: d[key]}
                  }))
                  .enter().append('rect')
                  .attr('x', d => xBandNarrow(d.key))
                  .attr('y', d => 50)
                  .attr('width', xBandNarrow.bandwidth())
                  .attr('heigth', d => height - yScale(d.value))
                  .attr('fill', d => colors[d.key]);
  }

  function drawPath(value) {
    let activeTabs = d3.selectAll('.active')._groups[0];
    activeTabs = Array.from(activeTabs).map(e => e.value);
    let domain = activeTabs.map(e => d3.max(data, d => d[e]));
    domain = d3.max(domain);
    yScale.domain([0, domain]);
    axisY.remove();
    axisY = svg.append("g")
                     .attr("transform", "translate(" + width + ", 0)")
                     .call(yy);
       axisY.select(".domain").remove();
       axisY.selectAll(".tick:not(:first-of-type) line")
             .attr("stroke", "#777")
             .attr("stroke-dasharray", "2,2");

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
  }

  function drawStream(activeTabs) {
    let domain = activeTabs.map(e => d3.max(data, d => d[e]));
    domain = d3.sum(domain);
    yScale.domain([0, domain]);
    axisY.remove();
    axisY = svg.append("g")
                     .attr("transform", "translate(" + width + ", 0)")
                     .call(yy);
       axisY.select(".domain").remove();
       axisY.selectAll(".tick:not(:first-of-type) line")
             .attr("stroke", "#777")
             .attr("stroke-dasharray", "2,2");

    let area = d3.area()
      .x(function(d) {return xScale(new Date(d.data.year))})
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveCatmullRom);

    let stack = d3.stack()
      .keys([...activeTabs])
      .order(d3.stackOrderInsideout)
      .offset(d3.stackOffsetWiggle);

   layout.selectAll('path')
      .data(stack(data))
      .enter()
      .append('path')
      .style('fill', (d, i) => colors[activeTabs[i]])
      .attr('d', area);
  }
