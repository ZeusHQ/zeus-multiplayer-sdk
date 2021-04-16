import React from 'react';
import * as Types from "../types";
export declare const MultiplayerStateContext: React.Context<{}>;
export declare type IMultiplayerUserPresenceState = {
    user: Types.IMultiplayerUser;
};
export declare type IMultiplayerDocumentPresenceState = {
    [user_id: string]: IMultiplayerUserPresenceState;
};
export declare type IMultiplayerPresenceState = {
    [document_id: string]: IMultiplayerDocumentPresenceState;
};
export declare type IMultiplayerDocumentState = {
    [document_id: string]: Types.IMultiplayerDocument;
};
export declare type IMultiplayerNodeState = {
    [node_id: string]: Types.IMultiplayerNode;
};
declare const initialState: {
    connected: boolean;
    presence: IMultiplayerPresenceState;
    documents: IMultiplayerDocumentState;
    nodes: IMultiplayerNodeState;
};
export declare type IMultiplayerState = typeof initialState;
export declare enum MultiplayerActionType {
    SetConnectionStatus = "setConnectionStatus",
    SetDocument = "setDocument",
    UpdateDocument = "updateDcoument",
    SetDocumentAttrs = "setDocumentAttrs",
    SetNode = "setNode",
    DeleteNode = "deleteNode",
    SetNodeProperties = "setNodeProperties",
    SetUserPresenceProperties = "setUserPresenceProperties",
    SetDocumentPresence = "setDocumentPresence",
    SetUserPresence = "setUserPresence",
    RemoveUserPresence = "removeUserPresence",
    CreateNode = "createNode",
    UpdateNode = "updateNode"
}
export interface IMultiplayerSetConnectionStatusAction {
    type: MultiplayerActionType.SetConnectionStatus;
    payload: boolean;
}
export interface IMultiplayerUpdateDocumentAction {
    type: MultiplayerActionType.UpdateDocument;
    document: Types.IMultiplayerDocument;
}
export interface IMultiplayerSetDocumentAction {
    type: MultiplayerActionType.SetDocument;
    document: Types.IMultiplayerDocument;
    nodes: {
        [key: string]: Types.IMultiplayerNode;
    };
}
export interface IMultiplayerSetNodeAction {
    type: MultiplayerActionType.SetNode;
    node: Types.IMultiplayerNode;
}
export interface IMultiplayerCreateNodeAction {
    type: MultiplayerActionType.CreateNode;
    node: Types.IMultiplayerNode;
}
export interface IMultiplayerUpdateNodeAction {
    type: MultiplayerActionType.UpdateNode;
    node: Types.IMultiplayerNode;
}
export interface IMultiplayerDeleteNodeAction {
    type: MultiplayerActionType.DeleteNode;
    node_id: string;
}
export interface IMultiplayerSetNodePropertiesAction {
    type: MultiplayerActionType.SetNodeProperties;
    node_id: string;
    properties: Types.IMultiplayerNodeProperties;
}
export interface IMultiplayerSetUserPresencePropertiesAction {
    type: MultiplayerActionType.SetUserPresenceProperties;
    user_id: string;
    document_id: string;
    properties: Types.IMultiplayerUserProperties;
}
export interface IMultiplayerSetDocumentPresenceAction {
    type: MultiplayerActionType.SetDocumentPresence;
    document_id: string;
    presence: IMultiplayerDocumentPresenceState;
}
export interface IMultiplayerSetUserPresenceAction {
    type: MultiplayerActionType.SetUserPresence;
    document_id: string;
    user_id: string;
    presence: IMultiplayerUserPresenceState;
}
export interface IMultiplayerRemoveUserPresenceAction {
    type: MultiplayerActionType.RemoveUserPresence;
    document_id: string;
    user_id: string;
}
export declare const ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY = "zeus.multiplayer.storage";
export declare const clearMultiplayerStorage: () => void;
export declare class ZeusMultiplayer {
    private static instance;
    state: typeof initialState;
    dispatch: any;
    client: any;
    constructor(state: any, dispatch: any);
    static state: () => {
        connected: boolean;
        presence: IMultiplayerPresenceState;
        documents: IMultiplayerDocumentState;
        nodes: IMultiplayerNodeState;
    };
    static dispatch: () => any;
    static node: (id: any) => Types.IMultiplayerNode;
    static nodes: () => IMultiplayerNodeState;
    static document: (id: any) => Types.IMultiplayerDocument;
    static documents: () => IMultiplayerDocumentState;
    static presence: (id: any) => IMultiplayerDocumentPresenceState;
    static presences: () => IMultiplayerPresenceState;
    static connected: () => boolean;
    static client: () => any;
    static init(state: any, dispatch: any): ZeusMultiplayer;
    static setClient(client: any): ZeusMultiplayer;
}
export declare const MultiplayerProvider: ({ children }: any) => JSX.Element;
export declare const useZeusMultiplayer: any;
export declare const useZeusMultiplayerClient: any;
export {};
