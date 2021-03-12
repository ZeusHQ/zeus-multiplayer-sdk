export interface IMultiplayerDocument {
    id: string;
    name: string;
    root_id: string;
    created_at: string;
    updated_at: string;
}
export interface IMultiplayerDocumentCreate {
    name: string;
}
export interface IMultiplayerDocumentUpdate {
    name: string;
}
