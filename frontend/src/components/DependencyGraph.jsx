import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { createSimulation, getNodeColor, getLinkWidth, setupZoom } from '../utils/d3-helpers'
import { AlertTriangle, Activity, Network } from 'lucide-react'

export default function DependencyGraph({ data }) {
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
      .style('background', 'transparent')

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
      .attr('class', 'link stroke-zinc-300 dark:stroke-zinc-700')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => getLinkWidth(d.weight))

    // Draw nodes
    const node = g
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node stroke-white dark:stroke-zinc-900')
      .attr('r', (d) => (d.type === 'service' ? 6 : 8))
      .attr('fill', (d) => getNodeColor(d))
      .attr('stroke-width', 2)
      .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    // Add labels
    const labels = g
      .selectAll('.label')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('class', 'label fill-zinc-600 dark:fill-zinc-400 font-medium')
      .attr('font-size', '10px')
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

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

      labels.attr('x', (d) => d.x).attr('y', (d) => d.y)
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
    return null
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 overflow-hidden shadow-sm">
      <svg ref={svgRef} style={{ width: '100%', height: '500px' }} />
      <div className="p-5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Network size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Dependent Services</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{data.impact.dependent_services}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Impact Score</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{(data.impact.impact_score * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">Severity</p>
              <p
                className={`text-xl font-bold ${
                  data.impact.impact_severity === 'HIGH'
                    ? 'text-red-600 dark:text-red-500'
                    : data.impact.impact_severity === 'MEDIUM'
                      ? 'text-amber-600 dark:text-amber-500'
                      : 'text-emerald-600 dark:text-emerald-500'
                }`}
              >
                {data.impact.impact_severity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
