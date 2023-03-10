import React from "react"
import { useForm, FieldValues } from "react-hook-form"
import { DbModel, Field } from "./models"


const fieldTypes = ['Int', 'DateTime', 'String', 'Boolean', 'User', 'Profile', 'Post', 'Category']

const entityType = ['model', 'datasource', 'generator']

// forms
const ModelForm = (props: {onSubmit: (model: DbModel) => void}) => {
    const {register, handleSubmit, resetField} = useForm()
    
    const toModel = (formData: FieldValues) => {
        const m: DbModel = {
            modelName: formData['modelName'],
            modelType: formData['modelType'],
            fields: []
        }

        props.onSubmit(m)
        resetField('modelName')
    }


    return <form onSubmit={handleSubmit(toModel)}>
        <input {...register("modelName")} placeholder='node name' />
        <select {...register('modelType')} >
            {entityType.map(et => <option key={et} value={et}>{et}</option>)}
        </select>
        <input type="submit" value='add node' />
    </form>
}

const FieldForm = (props: {model: DbModel, onSubmit: (field: Field) => void}) => {
    const {register, handleSubmit, resetField} = useForm()

    const resetFields = () => {
        resetField('fieldName')
        resetField('fieldIsList')
        resetField('attributes')
    }

    const toModel = (formData: FieldValues) => {
        const attrs: string = formData['attributes']

        const field: Field = {
            fieldName: formData['fieldName'], 
            fieldType: formData['fieldType'], 
            fieldIsList: formData['fieldIsList'] || false,
            attributes: attrs && attrs.length > 1 ? attrs.split(',') : []
        }

        props.onSubmit(field)
        resetFields()
    }

    return <form onSubmit={handleSubmit(toModel)} style={{display: 'flex', flexDirection: 'column'}}>
        <span style={{marginBottom: '6px'}}>editing {props.model.modelName}</span>
        <input {...register('fieldName')} placeholder='field name' style={{marginBottom: '6px'}} />

        <select {...register('fieldType')} style={{marginBottom: '6px'}}>
            {fieldTypes.map(ft => <option key={ft} value={ft}> {ft} </option>)}
        </select>
        <div style={{marginBottom: '6px'}}>
            <label htmlFor='islist' >List</label>
            <input type='checkbox' id='islist' {...register('fieldIsList')} />
        </div>
        <input {...register('attributes')} placeholder='attributes' style={{marginBottom: '6px'}} />

        <input type='submit' value='add field' style={{marginBottom: '6px'}} />
    </form>
}


export {ModelForm, FieldForm}