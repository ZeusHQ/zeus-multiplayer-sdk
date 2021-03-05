export type IMultiplayerNodeProperties = { [key: string]: any };

export interface IMultiplayerNode {
    id: string;
    document_id: string;
    parent_id: string;
    name: string;
    type: string;
    properties: IMultiplayerNodeProperties;
    children: string[],
    createdAt: string;
    updatedAt: string;
}

export interface IMultiplayerNodeCreate {
    name: string;
    type: string;
    properties: IMultiplayerNodeProperties;
}

export interface IMultiplayerNodeUpdate {
    name: string;
    type: string;
    properties: IMultiplayerNodeProperties;
}