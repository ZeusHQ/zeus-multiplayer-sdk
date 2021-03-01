export type INodeProperties = { [key: string]: any };

export interface INode {
    id: string;
    documentId: string;
    name: string;
    type: string;
    properties: INodeProperties;
    createdAt: string;
    updatedAt: string;
}

export interface INodeCreate {
    name: string;
    type: string;
    properties: INodeProperties;
}

export interface INodeUpdate {
    name: string;
    type: string;
    properties: INodeProperties;
}