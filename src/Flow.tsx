import React, { useRef, useState } from 'react'
import { ReactFlow, useNodesState, useEdgesState, Node, MiniMap, Controls, NodeProps, Handle, Position, addEdge, Connection } from 'reactflow'
import { DbModel, Field } from './models' 

import 'reactflow/dist/style.css';
import { FieldForm, ModelForm } from './Forms';




// custom node
const ModelNode = (props: NodeProps<DbModel>) => {
    const model: DbModel = props.data


    return <div style={{objectFit: 'contain', border: '1px solid #666666', backgroundColor: 'beige', padding: '5px', textAlign: 'center', borderRadius: 10}} >
        <h5>{`${model.modelType} ${model.modelName}`}</h5>

        <div>
            <Handle type='target' position={Position.Top} />
            <Handle type='source' position={Position.Bottom} />
            {model.fields.map(field => <div style={{fontSize: 14, borderBottom: '1px solid #7f7f7f', marginBottom: '5px'}} key={field.fieldName}>
                    {`${field.fieldName}: ${field.fieldType + (field.fieldIsList ? '[]' : '')}`}
                    
                    {field.attributes.length > 0 && field.attributes.map((attr, i) => <div style={{fontSize: 12}} key={attr + i}>
                        {'@' + attr}
                    </div>)}
            </div>)}
        </div>
    </div>
}


const nodeTypes = {model: ModelNode}

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<DbModel>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<DbModel>([])
    const currentNode = useRef<Node<DbModel>>()

    const [mode, setMode] = useState<'add' | 'edit'>('add')
    const [errorLine, setErrorLine] = useState<string>()

    const setTempError = (line: string, seconds: number = 3) => {
        setErrorLine(line)
        setTimeout(() => {
            setErrorLine(undefined)
        }, 1000 * seconds)
    }

    const onNodeSelected = (node: Node<DbModel>) =>  {
        if (node.data.modelType !== 'model') {
            setTempError(`model ${node.data.modelName} exists`)
        }

        currentNode.current = node
        setMode('edit')
    }

    const addNode = (model: DbModel) => {

        if (!model.modelName) {
            setTempError('please enter a name')
            return
        }

        if (nodes.map(n => n.data.modelName).includes(model.modelName)) {
            setTempError(`did not add model ${model.modelName} , model exists`)
            return
        }

        const node: Node<DbModel> = {
            id: model.modelName, 
            position: {x: 0, y: 0},
            type: 'model',
            data: model
        }

        setNodes(prev => [...prev, node])
    }

    const addField = (model: DbModel, field: Field) => {

        if (!field.fieldName) {
            setTempError('please enter field name')
            return
        }

        if (model.fields.map(f => f.fieldName).includes(field.fieldName)) {
            setTempError(`field ${field.fieldName} already exists in ${model.modelName}`)
            return
        }

        const index = nodes.findIndex(n => n.data.modelName === currentNode.current!.data.modelName)!
        const prior = nodes[index]

        prior.data.fields = [...model.fields, field]

        const nodesAfter = [...nodes.slice(0, index), prior, ...nodes.slice(index + 1)]

        setNodes(nodesAfter)
    }

    return <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '40px'}}>
        {mode === 'add' && <ModelForm onSubmit={addNode} />}
        {mode === 'edit' && <div style={{display: 'flex', flexDirection: 'column'}}>
            <FieldForm model={currentNode.current!.data!} onSubmit={field => addField(currentNode.current!.data!, field)} /> 
            <button onClick={() => {
                currentNode.current = undefined
                setMode('add')
            }}>
                {'<< back'}
            </button>
        
        </div>}

        <div>
            {<span style={{backgroundColor: '#eeeeee', color: 'orange', borderRadius: 2, padding: '3px', margin: '5px', opacity: errorLine ? 100 : 0, transition: 'all 0.2s linear'}} >
                {errorLine && errorLine}
            </span>}

            <div style={{height: '500px', width: '500px', marginTop: '15px', marginLeft: '20px'}}>
                <ReactFlow 
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    style={{backgroundColor: '#606060'}}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeDoubleClick={(arg, node) => onNodeSelected(node)}
                    onConnect={connection => setEdges(addEdge(connection, edges))}
                >
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    </div>
}

export default Flow