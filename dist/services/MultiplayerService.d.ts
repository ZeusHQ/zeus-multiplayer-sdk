declare class ZeusMultiplayerService {
    private static instance;
    publicKey: string;
    baseUrl: string;
    onTokenExpired: any;
    constructor(publicKey: string, onTokenExpired: any, local: boolean);
    static init(publicKey: string, onTokenExpired: any, local?: boolean): ZeusMultiplayerService;
    fetch(url: string, data: object, type: string): Promise<any>;
    optionsToRequestParams: (options: {
        [key: string]: any;
    }) => string;
    handleErrors(response: string): string;
}
export default ZeusMultiplayerService;
