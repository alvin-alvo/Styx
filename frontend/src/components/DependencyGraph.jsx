import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { createSimulation, getNodeColor, getLinkWidth, setupZoom } from '../utils/d3-helpers'

export default function DependencyGraph({ data, simulatedDecommission }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || !svgRef.current) return

    const width = svgRef.current.clientWidth || 800
    const height = 500

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#15193C')

    // Define arrow markers and animations
    const defs = svg.append('defs')
    
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 18) // Offset to account for node radius
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#CADCFC')
      .attr('opacity', 0.5)

    // Add a pulsing glow filter
    const filter = defs.append('filter').attr('id', 'glow')
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur')
    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Create forces
    const simulation = createSimulation(data.nodes, data.edges, width, height)

    // Create groups for edges and nodes
    const g = svg.append('g')

    // Draw edges
    const link = g
      .selectAll('.link')
      .data(data.edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#CADCFC')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', (d) => getLinkWidth(d.weight))
      .attr('marker-end', 'url(#arrowhead)')

    // Draw flowing particles for simulation
    const particle = g
      .selectAll('.particle')
      .data(data.edges)
      .enter()
      .append('circle')
      .attr('class', 'particle')
      .attr('r', 2)
      .attr('fill', '#60A5FA')
      .attr('opacity', 0.8)

    // Draw nodes
    const node = g
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d) => (d.type === 'service' ? 6 : 8))
      .attr('fill', (d) => getNodeColor(d))
      .attr('stroke', (d) => (simulatedDecommission && simulatedDecommission.includes(d.id) ? '#EF4444' : '#1E2761'))
      .attr('stroke-width', (d) => (simulatedDecommission && simulatedDecommission.includes(d.id) ? 3 : 2))
      .attr('filter', (d) => (simulatedDecommission && simulatedDecommission.includes(d.id) ? 'url(#glow)' : null))
      .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    // Add labels
    const labels = g
      .selectAll('.label')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('font-size', '10px')
      .attr('fill', '#CADCFC')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .text((d) => d.id.substring(0, 8))

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)
        
      // Animate particles along the links
      const time = Date.now() / 1500
      particle
        .attr('cx', (d) => {
          const t = (time + (d.source.index || 0) * 0.1) % 1
          return d.source.x + (d.target.x - d.source.x) * t
        })
        .attr('cy', (d) => {
          const t = (time + (d.source.index || 0) * 0.1) % 1
          return d.source.y + (d.target.y - d.source.y) * t
        })

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

      labels.attr('x', (d) => d.x).attr('y', (d) => d.y)
    })
    
    // Setup continuous animation loop for particles
    d3.timer(() => {
      const time = Date.now() / 1500
      particle
        .attr('cx', (d) => {
          if (!d.source.x || !d.target.x) return 0
          const t = (time + (d.source.index || 0) * 0.1) % 1
          return d.source.x + (d.target.x - d.source.x) * t
        })
        .attr('cy', (d) => {
          if (!d.source.y || !d.target.y) return 0
          const t = (time + (d.source.index || 0) * 0.1) % 1
          return d.source.y + (d.target.y - d.source.y) * t
        })
    })

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Zoom
    setupZoom(svg, g)
  }, [data])

  if (!data) {
    return <div className="text-ice-blue/50 text-center py-8">No dependency data</div>
  }

  return (
    <div className="border border-light-navy/30 rounded bg-dark-navy overflow-hidden">
      <svg ref={svgRef} style={{ width: '100%', height: '500px' }} />
      <div className="p-4 bg-navy/50 border-t border-light-navy/30">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-ice-blue/70">Dependent Services</p>
            <p className="text-lg font-bold text-ice-blue">{data.impact.dependent_services}</p>
          </div>
          <div>
            <p className="text-ice-blue/70">Impact Score</p>
            <p className="text-lg font-bold text-ice-blue">{(data.impact.impact_score * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-ice-blue/70">Severity</p>
            <p
              className={`text-lg font-bold ${
                data.impact.impact_severity === 'HIGH'
                  ? 'text-red-400'
                  : data.impact.impact_severity === 'MEDIUM'
                    ? 'text-yellow-400'
                    : 'text-green-400'
              }`}
            >
              {data.impact.impact_severity}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
