export interface IDocument {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface IDocumentCreate {
    name: string;
}

export interface IDocumentUpdate {
    name: string;
}