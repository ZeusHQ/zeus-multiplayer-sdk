import CamelCase from 'camelcase-keys';

import * as ZeusMultiplayerTypes from "../types";

const handleAPIResponseObject = (result: any, resolve: any): Promise<ZeusMultiplayerTypes.IMultiplayerAPIResponse> => {
    return resolve(CamelCase(result, { deep: true }) as ZeusMultiplayerTypes.IMultiplayerAPIResponse);
}

const decamelize = (params: any, separator?: string | undefined) => {
    separator = typeof separator === 'undefined' ? '_' : separator;

    const keys = Object.keys(params);

    return keys.reduce((output: any, key: string) => {
        const newKey = key
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .toLowerCase();
        if (typeof (params[key]) === "object") {
            output[newKey] = decamelize(params[key], separator);
        } else {
            output[newKey] = params[key];
        }
        return output;
    }, {});
}

class ZeusMultiplayerService {
    private static instance: ZeusMultiplayerService;

    publicKey: string;
    baseUrl: string;
    onTokenExpired: any;

    constructor(publicKey: string, onTokenExpired: any, local: boolean) {
        this.publicKey = publicKey;
        this.baseUrl = local ? "http://localhost:3003" : "https://multiplayer.zeusdev.io";
        this.onTokenExpired = onTokenExpired;
    }

    static init(publicKey: string, onTokenExpired: any, local = false): ZeusMultiplayerService {
        if (!ZeusMultiplayerService.instance) {
            ZeusMultiplayerService.instance = new ZeusMultiplayerService(publicKey, onTokenExpired, local);
        }

        return ZeusMultiplayerService.instance;
    }

    public fetch(url: string, data: object, type: string): Promise<any> {
        return fetch(`${url}`, {
            body: JSON.stringify(decamelize(data)),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: type
        })
            .then((response: Response) => {
                return response.json()
            })
            .then(this.handleErrors as any)
            .catch(error => {
                throw error;
            });
    }

    optionsToRequestParams = (options: { [key: string]: any }) => {
        return Object.keys(options).map(key => key + '=' + options[key]).join('&');
    }

    public handleErrors(response: string): string {
        if (response === 'TypeError: Failed to fetch') {
            throw Error('Server error.');
        }
        return response;
    }
}

export default ZeusMultiplayerService;