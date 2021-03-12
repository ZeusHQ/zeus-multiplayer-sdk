export declare type IMultiplayerUserProperties = {
    [key: string]: any;
};
export interface IMultiplayerUser {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    properties: IMultiplayerUserProperties;
}
export interface IMultiplayerUserUpdate {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    properties: IMultiplayerUserProperties;
}
