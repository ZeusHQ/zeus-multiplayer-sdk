import React, { useContext, useEffect, useReducer } from 'react';
import * as Types from "../types";
import ReconnectingWebSocket from 'reconnecting-websocket';

export const MultiplayerStateContext = React.createContext({});

export type IMultiplayerUserPresenceState = {
    user: Types.IMultiplayerUser;
}
export type IMultiplayerDocumentPresenceState = { [user_id: string]: IMultiplayerUserPresenceState };
export type IMultiplayerPresenceState = { [document_id: string]: IMultiplayerDocumentPresenceState };
export type IMultiplayerDocumentState = { [document_id: string]: Types.IMultiplayerDocument };
export type IMultiplayerNodeState = { [node_id: string]: Types.IMultiplayerNode };

const initialState = {
    connected: false,
    presence: {} as IMultiplayerPresenceState,
    documents: {} as IMultiplayerDocumentState,
    nodes: {} as IMultiplayerNodeState,
};

export type IMultiplayerState = typeof initialState;

export enum MultiplayerActionType {
    SetConnectionStatus = 'setConnectionStatus',
    SetDocument = 'setDocument',
    UpdateDocument = 'updateDcoument',
    SetDocumentAttrs = 'setDocumentAttrs',
    SetNode = 'setNode',
    DeleteNode = 'deleteNode',
    SetNodeProperties = 'setNodeProperties',
    SetUserPresenceProperties = 'setUserPresenceProperties',
    SetDocumentPresence = 'setDocumentPresence',
    SetUserPresence = 'setUserPresence',
    RemoveUserPresence = 'removeUserPresence',
    CreateNode = 'createNode',
    UpdateNode = 'updateNode',
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
    nodes: { [key: string]: Types.IMultiplayerNode };
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

type Actions = IMultiplayerSetConnectionStatusAction |
    IMultiplayerCreateNodeAction |
    IMultiplayerUpdateNodeAction |
    IMultiplayerDeleteNodeAction |
    IMultiplayerSetDocumentAction |
    IMultiplayerUpdateDocumentAction |
    IMultiplayerSetNodeAction |
    IMultiplayerSetNodePropertiesAction |
    IMultiplayerSetDocumentPresenceAction |
    IMultiplayerSetUserPresenceAction |
    IMultiplayerRemoveUserPresenceAction |
    IMultiplayerSetUserPresencePropertiesAction;

const reducer: React.Reducer<IMultiplayerState, Actions> = (state, action) => {
    switch (action.type) {

        case MultiplayerActionType.SetConnectionStatus: {
            return { ...state, connected: action.payload };
        }

        case MultiplayerActionType.SetDocument: {
            let documents = { ...state.documents };
            let nodes = { ...state.nodes };
            documents[action.document.id] = action.document;
            const keys = Object.keys(action.nodes || {});
            keys.forEach((key) => nodes[key] = action.nodes[key]);
            return { ...state, documents, nodes };
        }

        case MultiplayerActionType.UpdateDocument: {
            let documents = { ...state.documents };

            documents[action.document.id].name = action.document.name;
            documents[action.document.id].updated_at = action.document.updated_at;

            return { ...state, documents };
        }

        case MultiplayerActionType.CreateNode:
        case MultiplayerActionType.SetNode: {
            let nodes = { ...state.nodes };
            nodes[action.node.id] = action.node;
            return { ...state, nodes };
        }

        case MultiplayerActionType.UpdateNode: {
            let nodes = { ...state.nodes };

            nodes[action.node.id].name = action.node.name;
            nodes[action.node.id].type = action.node.type;
            nodes[action.node.id].parent_id = action.node.parent_id;
            nodes[action.node.id].children = action.node.children;

            return { ...state };
        }

        case MultiplayerActionType.DeleteNode: {
            let nodes = { ...state.nodes };
            let node = nodes[action.node_id];

            if (node && node.parent_id) {
                const parentNode = nodes[node.parent_id];
                if (parentNode) {
                    parentNode.children = parentNode.children.filter((id) => id !== node.parent_id);
                }
            }

            delete nodes[action.node_id];

            return { ...state, nodes };
        }

        case MultiplayerActionType.SetNodeProperties: {
            let nodes = { ...state.nodes };

            let existingNode = nodes[action.node_id];
            if (existingNode !== undefined) {
                existingNode.properties = mergeProperties(existingNode.properties, action.properties);
                nodes[action.node_id] = existingNode;
            }

            return { ...state, nodes };
        }

        case MultiplayerActionType.SetDocumentPresence: {
            let presence = { ...state.presence };
            presence[action.document_id] = action.presence;
            return { ...state, presence };
        }

        case MultiplayerActionType.SetUserPresence: {
            let presence = { ...state.presence };
            let docPresence = presence[action.document_id];
            if (!docPresence) docPresence = {};
            docPresence[action.user_id] = action.presence;
            presence[action.document_id] = docPresence;
            return { ...state, presence };
        }

        case MultiplayerActionType.SetUserPresenceProperties: {
            let presence = { ...state.presence };
            let docPresence = presence[action.document_id] || {};

            let existingUserPresence = docPresence[action.user_id] || {
                user: { id: "", first_name: "", last_name: "", name: "", email: "", properties: {} },
            };

            const existingProps = existingUserPresence.user.properties;
            existingUserPresence.user.properties = mergeProperties(existingProps, action.properties);
            docPresence[action.user_id] = existingUserPresence;
            presence[action.document_id] = docPresence;

            return { ...state, presence };
        }

        case MultiplayerActionType.RemoveUserPresence: {
            let presence = { ...state.presence };
            let docPresence = presence[action.document_id] || {};
            delete docPresence[action.user_id];
            return { ...state, presence };
        }



        default:
            console.log(`Unhandled action type: ${(action as Actions).type}`, action);
    }
};

const mergeProperties = (existingProperties: Types.IMultiplayerNodeProperties & Types.IMultiplayerUserProperties, newProperties: Types.IMultiplayerNodeProperties & Types.IMultiplayerUserProperties) => {
    const keys = Object.keys(newProperties);

    var i = 0;
    for (i; i < keys.length; i++) {
        const key = keys[i];
        const newProp = newProperties[key];
        const existingProp = existingProperties[key];

        if (typeof newProp === 'object' && typeof existingProp === 'object') {
            existingProperties[key] = mergeProperties(existingProp, newProp);
        } else {
            existingProperties[key] = newProp;
        }
    }

    return existingProperties;
}

export const ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY = 'zeus.multiplayer.storage';

export const clearMultiplayerStorage = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY)) {
        localStorage.removeItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY);
    }
}

export class ZeusMultiplayer {
    private static instance: ZeusMultiplayer;

    state: typeof initialState;
    dispatch: any;
    client: any;

    constructor(state: any, dispatch: any) {
        this.state = state;
        this.dispatch = dispatch;
    }

    static state = () => ZeusMultiplayer.instance.state;
    static dispatch = () => ZeusMultiplayer.instance.dispatch;
    static node = (id) => ZeusMultiplayer.instance.state.nodes[id];
    static nodes = () => ZeusMultiplayer.instance.state.nodes;
    static document = (id) => ZeusMultiplayer.instance.state.documents[id];
    static documents = () => ZeusMultiplayer.instance.state.documents;
    static presence = (id) => ZeusMultiplayer.instance.state.presence[id];
    static presences = () => ZeusMultiplayer.instance.state.presence;
    static connected = () => ZeusMultiplayer.instance.state.connected;

    static client = () => ZeusMultiplayer.instance.client;

    static init(state: any, dispatch: any): ZeusMultiplayer {
        if (!ZeusMultiplayer.instance) {
            ZeusMultiplayer.instance = new ZeusMultiplayer(state, dispatch);
        }

        return ZeusMultiplayer.instance;
    }

    static setClient(client: any): ZeusMultiplayer {
        ZeusMultiplayer.instance.client = client;

        return ZeusMultiplayer.instance;
    }
}

export const MultiplayerProvider = ({ children }: any) => {
    let localState = null;
    if (typeof localStorage !== 'undefined' && localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY)) {
        try {
            localState = JSON.parse(localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY) || '');
        } catch {
            localState = '';
        }
    }
    const [state, dispatch] = useReducer(reducer, localState || initialState);
    ZeusMultiplayer.init(state, dispatch);

    if (typeof localStorage !== 'undefined') {
        useEffect(() => {
            localStorage.setItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY, JSON.stringify(state));
        }, [state]);
    }

    return (
        <MultiplayerStateContext.Provider value={[state, dispatch]}>
            {children}
        </MultiplayerStateContext.Provider>
    );
};


export const useZeusMultiplayer: any = () => useContext(MultiplayerStateContext);


const DEFAULT_PROD_URL = "wss://multiplayer-server.zeusdev.io";
const DEFAULT_LOCAL_URL = "ws://localhost:8080";

// useContext hook - export here to keep code for global Multiplayer state
// together in this file, allowing user info to be accessed and updated
// in any functional component using the hook
export const useZeusMultiplayerClient: any = (accessToken: string, documentId: string, onDocumentLoaded: any, onSetNode: any, onDeleteNode: any, onSetNodeProperties: any, isLocal = false, localBaseUrl = undefined, prodBaseUrl = undefined) => {
    const dispatch = ZeusMultiplayer.dispatch();

    let baseUrl = "";

    if (isLocal) {
        baseUrl = localBaseUrl || DEFAULT_LOCAL_URL;
    } else {
        baseUrl = prodBaseUrl || DEFAULT_PROD_URL;
    }

    const rws = new ReconnectingWebSocket(baseUrl + `/ws/${documentId}/${accessToken}`);

    rws.addEventListener('open', () => {
        console.log('connected');
        (rws as any).heartbeat = setTimeout(() => {
            rws.send(JSON.stringify({ type: "heartbeat" }));
        }, 5000);
        dispatch({
            type: MultiplayerActionType.SetConnectionStatus,
            payload: true
        });
    });

    rws.addEventListener('close', () => {
        console.log('disconnected');
        if ((rws as any).heartbeat) clearTimeout((rws as any).heartbeat);
        dispatch({
            type: MultiplayerActionType.SetConnectionStatus,
            payload: false
        });
    });

    rws.addEventListener('message', (msg) => {
        const msgJson = JSON.parse(msg.data);
        dispatch(msgJson);
        switch (msgJson.type) {
            case MultiplayerActionType.SetNode:
                if (onSetNode) onSetNode(msgJson);
                break;
            case MultiplayerActionType.SetNodeProperties:
                if (onSetNodeProperties) onSetNodeProperties(msgJson);
                break;
            case MultiplayerActionType.DeleteNode:
                if (onDeleteNode) onDeleteNode(msgJson);
                break;
            case MultiplayerActionType.SetDocument:
                if (onDocumentLoaded) onDocumentLoaded(msgJson);
                break;
        }
    });

    rws.addEventListener('error', (error) => {
        console.log('error', error);
    });

    const updateDocument = (document: Types.IMultiplayerDocumentUpdate) => {
        const action = {
            type: MultiplayerActionType.UpdateDocument,
            document: document,
        }

        rws.send(JSON.stringify(action));
    }

    const createNode = (node: Types.IMultiplayerNodeCreate) => {
        const action = {
            type: MultiplayerActionType.CreateNode,
            node: node,
        }

        rws.send(JSON.stringify(action));
    }

    const updateNode = (node: Types.IMultiplayerNode) => {
        const action = {
            type: MultiplayerActionType.UpdateNode,
            node: node,
        }

        rws.send(JSON.stringify(action));
    }

    const deleteNode = (node_id: string) => {
        const action = {
            type: MultiplayerActionType.DeleteNode,
            node_id: node_id,
        }

        rws.send(JSON.stringify(action));
    }

    const setNodeProperties = (node_id: string, properties: { [key: string]: any }) => {
        const action = {
            type: MultiplayerActionType.SetNodeProperties,
            node_id,
            properties,
        };
        dispatch(action);
        rws.send(JSON.stringify(action));
    }

    const setUserPresenceProperties = (properties: any) => {
        const action = {
            type: MultiplayerActionType.SetUserPresenceProperties,
            properties,
        }
        dispatch(action);
        rws.send(JSON.stringify(action));
    }

    const zeus = {
        rws: rws,
        createNode: createNode,
        updateNode: updateNode,
        deleteNode: deleteNode,
        updateDocument: updateDocument,
        setUserPresenceProperties: setUserPresenceProperties,
        setNodeProperties: setNodeProperties,
    }

    ZeusMultiplayer.setClient(zeus);

    return zeus;
}
