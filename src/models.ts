export interface Field { 
    fieldName: string, 
    fieldType: string, 
    fieldIsList: boolean
    attributes: string[]
}

export interface DbModel {
    modelName: string
    modelType: string
    fields: Field[]
}