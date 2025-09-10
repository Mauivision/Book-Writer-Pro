import { useEffect, useRef, useState } from 'react'
import ForceGraph from 'force-graph'

interface Character {
  id: string
  name: string
  role: string
  relationships: {
    targetId: string
    type: string
  }[]
}

interface GraphNode {
  id: string
  name: string
  group: string
  val: number
}

interface GraphLink {
  source: string
  target: string
  type: string
}

interface CharacterGraphProps {
  characters: Character[]
  onNodeClick?: (character: Character) => void
}

export default function CharacterGraph({ characters, onNodeClick }: CharacterGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<any>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!containerRef.current) return

    // Convert characters to graph data
    const nodes: GraphNode[] = characters.map(char => ({
      id: char.id,
      name: char.name,
      group: char.role,
      val: 1
    }))

    const links: GraphLink[] = characters.flatMap(char =>
      char.relationships.map(rel => ({
        source: char.id,
        target: rel.targetId,
        type: rel.type
      }))
    )

    // Initialize the graph
    graphRef.current = ForceGraph.ForceGraph2D()(containerRef.current)
      .graphData({ nodes, links })
      .nodeLabel('name')
      .nodeColor((node: GraphNode) => {
        const colors: { [key: string]: string } = {
          protagonist: '#ff6b6b',
          antagonist: '#4ecdc4',
          supporting: '#45b7d1',
          minor: '#96ceb4'
        }
        return node.id === selectedNode ? '#ffd700' : colors[node.group] || '#999'
      })
      .nodeRelSize(6)
      .linkLabel((link: GraphLink) => link.type)
      .linkDirectionalArrowLength(3.5)
      .linkDirectionalArrowRelPos(1)
      .linkCurvature(0.25)
      .linkWidth((link: GraphLink) => link.source === selectedNode || link.target === selectedNode ? 2 : 1)
      .linkColor((link: GraphLink) => link.source === selectedNode || link.target === selectedNode ? '#ffd700' : '#999')
      .onNodeClick((node: GraphNode) => {
        setSelectedNode(node.id === selectedNode ? null : node.id)
        if (onNodeClick) {
          const character = characters.find(c => c.id === node.id)
          if (character) onNodeClick(character)
        }
      })
      .onBackgroundClick(() => setSelectedNode(null))

    return () => {
      if (graphRef.current) {
        graphRef.current._destructor()
      }
    }
  }, [characters, selectedNode, onNodeClick])

  return (
    <div className="character-graph">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Character Relationships</h2>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#ff6b6b]" />
            <span className="text-sm">Protagonist</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#4ecdc4]" />
            <span className="text-sm">Antagonist</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#45b7d1]" />
            <span className="text-sm">Supporting</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#96ceb4]" />
            <span className="text-sm">Minor</span>
          </div>
        </div>
      </div>
      <div 
        ref={containerRef} 
        className="w-full h-[500px] border rounded-lg bg-white shadow-sm"
      />
    </div>
  )
} 