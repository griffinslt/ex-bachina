const nodes = {
    node1: { name: "Start" },
    node2: { name: "Calculate key" },
    node3: { name: "Find cadence locations" },
    node4: { name: "Are there any more cadences?" },
    node5: { name: "Choose cadence chords" },//
    node6: { name: "Are there any more harmonic beats left?" },
    node7: { name: "Select next chord" },//
    node8: { name: "Are there any more harmonic beats left?" },
    node9: { name: "Select next bass note" },//
    node10: { name: "Select alto and tenor notes" },//
    hiddenNode1: { color:"white"},
    hiddenNode2: { color:"white"},
    hiddenNode3: { color:"white"}

  }

  const edges = {
    edge1: { source: "node1", target: "node2" },
    edge2: { source: "node2", target: "node3" },
    edge3: { source: "node3", target: "node4" },
    edge4: { source: "node4", target: "node5" },
    hiddenEdge1: { source: "node5", target: "hiddenNode1"},
    hiddenEdge2: { source: "hiddenNode1", target: "node4"},
    edge5: { source: "node4", target: "node6" },
    edge6: { source: "node6", target: "node7" },
    edge7: { source: "node6", target: "node8" },
    hiddenEdge3: { source: "node7", target: "hiddenNode2"},
    hiddenEdge4: { source: "hiddenNode2", target: "node6"},
    edge8: { source: "node8", target: "node9" },
    hiddenEdge5: { source: "node9", target: "hiddenNode3"},
    hiddenEdge6: { source: "hiddenNode3", target: "node8"},
    edge9: { source: "node8", target: "node10"},
  }

  const layouts = {
  nodes: {
    node1: { x: 0, y: 0 },
    node2: { x: 0, y: 100 },
    node3: { x: 0, y: 200 },
    node4: { x: 0, y: 300 },
    node5: { x: 200, y: 300 },//
    node6: { x: 0, y: 400 },
    node7: { x: 200, y: 400 },//
    node8: { x: 0, y: 500 },
    node9: { x: 200, y: 500 },//
    node10: { x: 0, y: 600 },
    hiddenNode1: {x: 100, y: 250},
    hiddenNode2: {x: 100, y: 350},
    hiddenNode3: {x: 100, y: 450},
  },
}

export default {nodes, edges, layouts}