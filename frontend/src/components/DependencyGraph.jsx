import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { ZoomIn, ZoomOut, Maximize, Filter } from 'lucide-react'

// Helper functions (inlined to avoid changing d3-helpers.js, or we can keep them there)
const createSimulation = (nodes, edges, width, height) =>
  d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(edges).id((node) => node.id).distance(90).strength(0.7))
    .force('charge', d3.forceManyBody().strength(-280))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide(28))

const getNodeColor = (node) => {
  if (node.type === 'service') return '#60A5FA' // zinc/cobalt vibe
  if (node.status === 'ACTIVE') return '#10B981' // emerald
  if (node.status === 'DEPRECATED') return '#F59E0B' // amber
  if (node.status === 'ZOMBIE') return '#E11D48' // crimson
  if (node.status === 'SHADOW') return '#8B5CF6' // purple
  return '#3B82F6' // cobalt blue default
}

const getLinkWidth = (weight) => Math.max(1, Math.min(4, weight / 40))

export default function DependencyGraph({ data, simulatedDecommission }) {
  const containerRef = useRef()
  const svgRef = useRef()
  const [zoomBehavior, setZoomBehavior] = useState(null)
  const [svgSelection, setSvgSelection] = useState(null)

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return

    const container = containerRef.current
    let width = container.clientWidth || 800
    const height = 500

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      // We will handle background via css class
      
    setSvgSelection(svg)

    // Define arrow markers and animations
    const defs = svg.append('defs')
    
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94a3b8') // zinc-400
      .attr('opacity', 0.8)

    defs.append('marker')
      .attr('id', 'arrowhead-impacted')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#e11d48') // crimson
      .attr('opacity', 1)

    // Add a pulsing glow filter
    const filter = defs.append('filter').attr('id', 'glow')
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur')
    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Create groups for edges and nodes
    const g = svg.append('g')

    // Compute downstream impacted edges if simulatedDecommission is active
    const impactedEdges = new Set()
    const impactedNodes = new Set(simulatedDecommission || [])
    
    if (simulatedDecommission && simulatedDecommission.length > 0) {
      let queue = [...simulatedDecommission]
      while (queue.length > 0) {
        const current = queue.shift()
        
        data.edges.forEach(edge => {
          const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source
          const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target
          
          // If the target (dependency) is impacted, the source (caller) is impacted
          if (targetId === current || sourceId === current) {
            impactedEdges.add(edge)
            if (!impactedNodes.has(sourceId)) {
              impactedNodes.add(sourceId)
              queue.push(sourceId)
            }
            if (!impactedNodes.has(targetId)) {
              impactedNodes.add(targetId)
              queue.push(targetId)
            }
          }
        })
      }
    }

    // Draw edges
    const link = g
      .selectAll('.link')
      .data(data.edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => impactedEdges.has(d) ? '#e11d48' : '#cbd5e1') // crimson or zinc-300
      .attr('stroke-opacity', d => impactedEdges.has(d) ? 1 : 0.6)
      .attr('stroke-width', d => impactedEdges.has(d) ? 2 : getLinkWidth(d.weight))
      .attr('stroke-dasharray', d => impactedEdges.has(d) ? '5,5' : 'none')
      .attr('marker-end', d => impactedEdges.has(d) ? 'url(#arrowhead-impacted)' : 'url(#arrowhead)')
      .style('transition', 'all 0.3s ease')

    // Draw flowing particles for simulation (only for active, non-impacted paths)
    const particle = g
      .selectAll('.particle')
      .data(data.edges.filter(d => !impactedEdges.has(d)))
      .enter()
      .append('circle')
      .attr('class', 'particle')
      .attr('r', 2)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.6)

    // Draw nodes
    const node = g
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d) => (d.type === 'service' ? 10 : 12))
      .attr('fill', (d) => impactedNodes.has(d.id) ? '#ffe4e6' : '#f8fafc') // rose-50 or slate-50
      .attr('stroke', (d) => {
        if (simulatedDecommission && simulatedDecommission.includes(d.id)) return '#be123c' // dark crimson
        if (impactedNodes.has(d.id)) return '#e11d48'
        return getNodeColor(d)
      })
      .attr('stroke-width', (d) => (simulatedDecommission && simulatedDecommission.includes(d.id) ? 4 : 2))
      .attr('filter', (d) => (simulatedDecommission && simulatedDecommission.includes(d.id) ? 'url(#glow)' : null))
      .style('cursor', 'grab')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
          d3.select(event.sourceEvent.target).style('cursor', 'grabbing')
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
          d3.select(event.sourceEvent.target).style('cursor', 'grab')
        })
      )

    // Add node icons/text
    const labels = g
      .selectAll('.label')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', d => impactedNodes.has(d.id) ? '#e11d48' : '#64748b') // crimson or slate-500
      .attr('text-anchor', 'middle')
      .attr('dy', '24px')
      .text((d) => d.id.substring(0, 12))

    // Create forces
    const simulation = createSimulation(data.nodes, data.edges, width, height)

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
    
    // Setup continuous animation loop for particles
    const timer = d3.timer(() => {
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

    // Zoom setup
    const zoom = d3.zoom().scaleExtent([0.2, 4]).on('zoom', (event) => {
      g.attr('transform', event.transform)
    })
    svg.call(zoom)
    setZoomBehavior(() => zoom)

    // Handle Resize smoothly
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        svg.attr('width', '100%');
        simulation.force('center', d3.forceCenter(newWidth / 2, height / 2));
        simulation.alpha(0.3).restart();
      }
    });
    resizeObserver.observe(container);

    return () => {
      timer.stop()
      simulation.stop()
      resizeObserver.disconnect()
    }
  }, [data, simulatedDecommission])

  const handleZoomIn = () => {
    if (svgSelection && zoomBehavior) {
      svgSelection.transition().duration(300).call(zoomBehavior.scaleBy, 1.3)
    }
  }

  const handleZoomOut = () => {
    if (svgSelection && zoomBehavior) {
      svgSelection.transition().duration(300).call(zoomBehavior.scaleBy, 0.7)
    }
  }

  const handleRecenter = () => {
    if (svgSelection && zoomBehavior) {
      svgSelection.transition().duration(500).call(zoomBehavior.transform, d3.zoomIdentity)
    }
  }

  if (!data) {
    return <div className="text-zinc-600 text-center py-8">No dependency data</div>
  }

  return (
    <div className="flex flex-col h-full relative" ref={containerRef}>
      
      {/* Floating Control Panel */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 p-1 flex flex-col gap-1">
          <button onClick={handleZoomIn} className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleRecenter} className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors" title="Recenter">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
         <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-600" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Filters</span>
         </div>
      </div>

      <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50">
        <svg ref={svgRef} className="w-full h-full min-h-[500px]" />
      </div>

      {data.impact && (
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Dependent Services</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{data.impact.dependent_services}</p>
            </div>
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Impact Score</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{(data.impact.impact_score * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Severity</p>
              <p
                className={`text-xl font-bold ${
                  data.impact.impact_severity === 'HIGH'
                    ? 'text-rose-500'
                    : data.impact.impact_severity === 'MEDIUM'
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                }`}
              >
                {data.impact.impact_severity}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
