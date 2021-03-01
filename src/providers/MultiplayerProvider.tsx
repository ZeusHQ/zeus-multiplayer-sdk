import React, { useContext, useEffect, useReducer } from 'react';
import * as Types from '../types';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ICursor } from '../types';

export const MultiplayerStateContext = React.createContext({});

export type IMultiplayerUserPresenceState = {
    cursor: Types.ICursor;
    user: Types.IMultiplayerUser;
}
export type IMultiplayerDocumentPresenceState = { [user_id: string]: IMultiplayerUserPresenceState };
export type IMultiplayerPresenceState = { [document_id: string]: IMultiplayerDocumentPresenceState };
export type IMultiplayerDocumentState = { [document_id: string]: Types.IDocument };
export type IMultiplayerNodeState = { [node_id: string]: Types.INode };
export type IMultiplayerSetNodePropertiesPayload = {
    node_id: string;
    properties: Types.INodeProperties;
};

const initialState = {
    connected: false,
    presence: {} as IMultiplayerPresenceState,
    documents: {} as IMultiplayerDocumentState,
    nodes: {} as IMultiplayerNodeState,
    lastPresenceUpdateAt: new Date(),
};

export type IMultiplayerState = typeof initialState;

export enum MultiplayerActionType {
    SetConnectionStatus = 'setConnectionStatus',
    SetDocument = 'setDocument',
    SetNode = 'setNode',
    SetNodeProperties = 'setNodeProperties',
    SetDocumentPresence = 'setDocumentPresence',
    SetUserPresence = 'setUserPresence',
    RemoveUserPresence = 'removeUserPresence',
    SetCursor = 'setCursor',
    CreateNode = 'createNode',
    UpdateNode = 'updateNode',
    SetLastPresenceUpdateAt = 'setLastPresenceUpdateAt',
}

export interface IMultiplayerSetLastPresenceUpdateAtAction {
    type: MultiplayerActionType.SetLastPresenceUpdateAt;
    date: Date;
}

export interface IMultiplayerSetConnectionStatusAction {
    type: MultiplayerActionType.SetConnectionStatus;
    payload: boolean;
}

export interface IMultiplayerSetDocumentAction {
    type: MultiplayerActionType.SetDocument;
    payload: Types.IDocument;
}

export interface IMultiplayerSetNodeAction {
    type: MultiplayerActionType.SetNode;
    payload: Types.INode;
}

export interface IMultiplayerCreateNodeAction {
    type: MultiplayerActionType.CreateNode;
    node: Types.INode;
}

export interface IMultiplayerUpdateNodeAction {
    type: MultiplayerActionType.UpdateNode;
    node: Types.INode;
}

export interface IMultiplayerSetNodePropertiesAction {
    type: MultiplayerActionType.SetNodeProperties;
    payload: IMultiplayerSetNodePropertiesPayload;
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

export interface IMultiplayerSetUserCursorAction {
    type: MultiplayerActionType.SetCursor;
    document_id: string;
    user_id: string;
    cursor: ICursor;
}

export interface IMultiplayerRemoveUserPresenceAction {
    type: MultiplayerActionType.RemoveUserPresence;
    document_id: string;
    user_id: string;
}

type Actions = IMultiplayerSetConnectionStatusAction |
    IMultiplayerCreateNodeAction |
    IMultiplayerUpdateNodeAction |
    IMultiplayerSetDocumentAction |
    IMultiplayerSetNodeAction |
    IMultiplayerSetNodePropertiesAction |
    IMultiplayerSetDocumentPresenceAction |
    IMultiplayerSetUserPresenceAction |
    IMultiplayerRemoveUserPresenceAction |
    IMultiplayerSetUserCursorAction |
    IMultiplayerSetLastPresenceUpdateAtAction;

const reducer: React.Reducer<IMultiplayerState, Actions> = (state, action) => {
    switch (action.type) {
        case MultiplayerActionType.SetConnectionStatus: {
            return { ...state, connected: action.payload };
        }

        case MultiplayerActionType.SetDocument: {
            let documents = { ...state.documents };
            documents[action.payload.id] = action.payload;
            return { ...state, documents };
        }

        case MultiplayerActionType.SetNode: {
            let nodes = { ...state.nodes };
            nodes[action.payload.id] = action.payload;
            return { ...state, nodes };
        }

        case MultiplayerActionType.SetNodeProperties: {
            let nodes = { ...state.nodes };

            let existingNode = nodes[action.payload.node_id];
            existingNode.properties = mergeNodeProperties(existingNode.properties, action.payload.properties);
            nodes[action.payload.node_id] = existingNode;

            return { ...state, nodes };
        }

        case MultiplayerActionType.SetDocumentPresence: {
            let presence = { ...state.presence };
            presence[action.document_id] = action.presence;
            return { ...state, presence };
        }

        case MultiplayerActionType.SetUserPresence: {
            let presence = { ...state.presence };
            let docPresence = presence[action.document_id] || {};
            docPresence[action.user_id] = action.presence;
            presence[action.document_id] = docPresence;
            return { ...state, presence };
        }

        case MultiplayerActionType.RemoveUserPresence: {
            let presence = { ...state.presence };
            let docPresence = presence[action.document_id] || {};
            delete docPresence[action.user_id];
            return { ...state, presence };
        }

        case MultiplayerActionType.SetCursor: {
            let presence = { ...state.presence };
            let docPresence = presence[action.document_id] || {};
            if (action.user_id in docPresence) {
                docPresence[action.user_id].cursor = action.cursor;
                presence[action.document_id] = docPresence;
            }
            return { ...state, presence };
        }

        case MultiplayerActionType.SetLastPresenceUpdateAt: {
            let newState = { ...state };
            newState.lastPresenceUpdateAt = action.date;
            return newState;
        }

        default:
            console.log(`Unhandled action type: ${(action as Actions).type}`, action);
    }
};

const mergeNodeProperties = (existingProperties: Types.INodeProperties, newProperties: Types.INodeProperties) => {
    const keys = Object.keys(newProperties);

    var i = 0;
    for (i; i < keys.length; i++) {
        const key = keys[i];
        const newProp = newProperties[key];
        const existingProp = existingProperties[key];

        if (typeof newProp === 'object' && typeof existingProp === 'object') {
            existingProperties[key] = mergeNodeProperties(existingProp, newProp);
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

export const MultiplayerProvider = ({ children }: any) => {
    let localState = null;
    if (typeof localStorage !== 'undefined' && localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY)) {
        localState = JSON.parse(localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY) || '');
    }
    const [state, dispatch] = useReducer(reducer, localState || initialState);

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

// enum MultiplayerActionType {
//     FullPresence = 'FullPresence',
//     CreateNode = 'CreateNode',
//     UpdateNode = 'UpdateNode',
//     SetCursor = 'SetCursor',
// }

const createNode = (action: IMultiplayerCreateNodeAction, rws: ReconnectingWebSocket) => {
    if (rws.readyState === 1) rws.send(JSON.stringify(action));
}

const updateNode = (action: IMultiplayerUpdateNodeAction, rws: ReconnectingWebSocket) => {
    if (rws.readyState === 1) rws.send(JSON.stringify(action));
}

const setCursor = (action: IMultiplayerSetUserCursorAction, rws: ReconnectingWebSocket) => {
    if (rws.readyState === 1) rws.send(JSON.stringify(action));
}

export const useZeusMultiplayer: any = () => useContext(MultiplayerStateContext);

// useContext hook - export here to keep code for global Multiplayer state
// together in this file, allowing user info to be accessed and updated
// in any functional component using the hook
export const useZeusMultiplayerClient: any = (state, dispatch, accessToken: string, documentId: string, isLocal = true, localBaseUrl = 'ws://localhost:8080', prodBaseUrl = 'wss://multiplayer.zeusdev.io') => {

    const url = (isLocal ? localBaseUrl : prodBaseUrl) + `/ws/${documentId}/${accessToken}`;
    const rws = new ReconnectingWebSocket(url);

    rws.addEventListener('open', () => {
        dispatch({
            type: MultiplayerActionType.SetConnectionStatus,
            payload: true
        });
    });

    rws.addEventListener('close', () => {
        dispatch({
            type: MultiplayerActionType.SetConnectionStatus,
            payload: false
        });
    });

    rws.addEventListener('message', (msg) => {
        const msgJson = JSON.parse(msg.data);
        console.log(`[${msgJson.type}//${msgJson.document_id}]`, msgJson);
        dispatch(msgJson);
    });

    rws.addEventListener('error', (error) => {
        console.log('error', error);
    });

    const zeus = {
        rws: rws,
        createNode: (action: IMultiplayerCreateNodeAction) => createNode(action, rws),
        updateNode: (action: IMultiplayerUpdateNodeAction) => updateNode(action, rws),
        setCursor: (action: IMultiplayerSetUserCursorAction) => {
            const now = new Date();

            if (state.lastPresenceUpdateAt) {
                const diff = Math.abs(state.lastPresenceUpdateAt.getDate() - now.getDate());
                console.log("diff", diff);
            }

            dispatch({
                action: MultiplayerActionType.SetLastPresenceUpdateAt,
                date: now,
            });

            setCursor(action, rws);

        },
    }

    return zeus;
}
