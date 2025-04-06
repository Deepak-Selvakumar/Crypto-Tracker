import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Chart.css';

interface ChartProps {
  data: [number, number][];
  width?: number;
  height?: number;
  positive: boolean;
}

const Chart: React.FC<ChartProps> = ({ data, width = 300, height = 150, positive }) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 10, bottom: 20, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Convert timestamp to date and extract prices
    const dates = data.map(item => new Date(item[0]));
    const prices = data.map(item => item[1]);

    const xScale = d3.scaleTime()
      .domain([d3.min(dates) || new Date(), d3.max(dates) || new Date()])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(prices) || 0, d3.max(prices) || 1])
      .range([innerHeight, 0]);

    const line = d3.line<[number, number]>()
      .x((d) => xScale(new Date(d[0])))
      .y((d) => yScale(d[1]))
      .curve(d3.curveBasis);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add gradient
    const gradient = g.append('defs')
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', yScale(d3.max(prices) || 0))
      .attr('x2', 0)
      .attr('y2', yScale(d3.min(prices) || 0));

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', positive ? 'var(--positive)' : 'var(--negative)')
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', positive ? 'var(--positive)' : 'var(--negative)')
      .attr('stop-opacity', 0.1);

    // Add area
    const area = d3.area<[number, number]>()
      .x(d => xScale(new Date(d[0])))
      .y0(innerHeight)
      .y1(d => yScale(d[1]))
      .curve(d3.curveBasis);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#line-gradient)')
      .attr('d', area);

    // Add line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', positive ? 'var(--positive)' : 'var(--negative)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add x-axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.timeFormat('%b %d') as any);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

  }, [data, width, height, positive]);

  return (
    <div className="chart-container">
      <svg ref={chartRef} width={width} height={height}></svg>
    </div>
  );
};

export default Chart;