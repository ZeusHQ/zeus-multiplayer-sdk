'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class QuickLRU {
	constructor(options = {}) {
		if (!(options.maxSize && options.maxSize > 0)) {
			throw new TypeError('`maxSize` must be a number greater than 0');
		}

		this.maxSize = options.maxSize;
		this.cache = new Map();
		this.oldCache = new Map();
		this._size = 0;
	}

	_set(key, value) {
		this.cache.set(key, value);
		this._size++;

		if (this._size >= this.maxSize) {
			this._size = 0;
			this.oldCache = this.cache;
			this.cache = new Map();
		}
	}

	get(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			const value = this.oldCache.get(key);
			this.oldCache.delete(key);
			this._set(key, value);
			return value;
		}
	}

	set(key, value) {
		if (this.cache.has(key)) {
			this.cache.set(key, value);
		} else {
			this._set(key, value);
		}

		return this;
	}

	has(key) {
		return this.cache.has(key) || this.oldCache.has(key);
	}

	peek(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			return this.oldCache.get(key);
		}
	}

	delete(key) {
		const deleted = this.cache.delete(key);
		if (deleted) {
			this._size--;
		}

		return this.oldCache.delete(key) || deleted;
	}

	clear() {
		this.cache.clear();
		this.oldCache.clear();
		this._size = 0;
	}

	* keys() {
		for (const [key] of this) {
			yield key;
		}
	}

	* values() {
		for (const [, value] of this) {
			yield value;
		}
	}

	* [Symbol.iterator]() {
		for (const item of this.cache) {
			yield item;
		}

		for (const item of this.oldCache) {
			const [key] = item;
			if (!this.cache.has(key)) {
				yield item;
			}
		}
	}

	get size() {
		let oldCacheSize = 0;
		for (const key of this.oldCache.keys()) {
			if (!this.cache.has(key)) {
				oldCacheSize++;
			}
		}

		return this._size + oldCacheSize;
	}
}

var quickLru = QuickLRU;

new quickLru({maxSize: 100000});

var decamelize = function (params, separator) {
    separator = typeof separator === 'undefined' ? '_' : separator;
    var keys = Object.keys(params);
    return keys.reduce(function (output, key) {
        var newKey = key
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .toLowerCase();
        if (typeof (params[key]) === "object") {
            output[newKey] = decamelize(params[key], separator);
        }
        else {
            output[newKey] = params[key];
        }
        return output;
    }, {});
};
var ZeusMultiplayerService = /** @class */ (function () {
    function ZeusMultiplayerService(publicKey, onTokenExpired, local) {
        this.optionsToRequestParams = function (options) {
            return Object.keys(options).map(function (key) { return key + '=' + options[key]; }).join('&');
        };
        this.publicKey = publicKey;
        this.baseUrl = local ? "http://localhost:3003" : "https://multiplayer.zeusdev.io";
        this.onTokenExpired = onTokenExpired;
    }
    ZeusMultiplayerService.init = function (publicKey, onTokenExpired, local) {
        if (local === void 0) { local = false; }
        if (!ZeusMultiplayerService.instance) {
            ZeusMultiplayerService.instance = new ZeusMultiplayerService(publicKey, onTokenExpired, local);
        }
        return ZeusMultiplayerService.instance;
    };
    ZeusMultiplayerService.prototype.fetch = function (url, data, type) {
        return fetch("" + url, {
            body: JSON.stringify(decamelize(data)),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: type
        })
            .then(function (response) {
            return response.json();
        })
            .then(this.handleErrors)
            .catch(function (error) {
            throw error;
        });
    };
    ZeusMultiplayerService.prototype.handleErrors = function (response) {
        if (response === 'TypeError: Failed to fetch') {
            throw Error('Server error.');
        }
        return response;
    };
    return ZeusMultiplayerService;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var Event = /** @class */ (function () {
    function Event(type, target) {
        this.target = target;
        this.type = type;
    }
    return Event;
}());
var ErrorEvent = /** @class */ (function (_super) {
    __extends(ErrorEvent, _super);
    function ErrorEvent(error, target) {
        var _this = _super.call(this, 'error', target) || this;
        _this.message = error.message;
        _this.error = error;
        return _this;
    }
    return ErrorEvent;
}(Event));
var CloseEvent = /** @class */ (function (_super) {
    __extends(CloseEvent, _super);
    function CloseEvent(code, reason, target) {
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ''; }
        var _this = _super.call(this, 'close', target) || this;
        _this.wasClean = true;
        _this.code = code;
        _this.reason = reason;
        return _this;
    }
    return CloseEvent;
}(Event));

/*!
 * Reconnecting WebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */
var getGlobalWebSocket = function () {
    if (typeof WebSocket !== 'undefined') {
        // @ts-ignore
        return WebSocket;
    }
};
/**
 * Returns true if given argument looks like a WebSocket class
 */
var isWebSocket = function (w) { return typeof w !== 'undefined' && !!w && w.CLOSING === 2; };
var DEFAULT = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000 + Math.random() * 4000,
    minUptime: 5000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
    maxEnqueuedMessages: Infinity,
    startClosed: false,
    debug: false,
};
var ReconnectingWebSocket = /** @class */ (function () {
    function ReconnectingWebSocket(url, protocols, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._listeners = {
            error: [],
            message: [],
            open: [],
            close: [],
        };
        this._retryCount = -1;
        this._shouldReconnect = true;
        this._connectLock = false;
        this._binaryType = 'blob';
        this._closeCalled = false;
        this._messageQueue = [];
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
         */
        this.onclose = null;
        /**
         * An event listener to be called when an error occurs
         */
        this.onerror = null;
        /**
         * An event listener to be called when a message is received from the server
         */
        this.onmessage = null;
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
         * this indicates that the connection is ready to send and receive data
         */
        this.onopen = null;
        this._handleOpen = function (event) {
            _this._debug('open event');
            var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
            clearTimeout(_this._connectTimeout);
            _this._uptimeTimeout = setTimeout(function () { return _this._acceptOpen(); }, minUptime);
            _this._ws.binaryType = _this._binaryType;
            // send enqueued messages (messages sent before websocket open event)
            _this._messageQueue.forEach(function (message) { return _this._ws.send(message); });
            _this._messageQueue = [];
            if (_this.onopen) {
                _this.onopen(event);
            }
            _this._listeners.open.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleMessage = function (event) {
            _this._debug('message event');
            if (_this.onmessage) {
                _this.onmessage(event);
            }
            _this._listeners.message.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleError = function (event) {
            _this._debug('error event', event.message);
            _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
            if (_this.onerror) {
                _this.onerror(event);
            }
            _this._debug('exec error listeners');
            _this._listeners.error.forEach(function (listener) { return _this._callEventListener(event, listener); });
            _this._connect();
        };
        this._handleClose = function (event) {
            _this._debug('close event');
            _this._clearTimeouts();
            if (_this._shouldReconnect) {
                _this._connect();
            }
            if (_this.onclose) {
                _this.onclose(event);
            }
            _this._listeners.close.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._url = url;
        this._protocols = protocols;
        this._options = options;
        if (this._options.startClosed) {
            this._shouldReconnect = false;
        }
        this._connect();
    }
    Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "OPEN", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
        get: function () {
            return ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
        get: function () {
            return ReconnectingWebSocket.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
        get: function () {
            return ReconnectingWebSocket.CLOSING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
        get: function () {
            return ReconnectingWebSocket.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
        get: function () {
            return this._ws ? this._ws.binaryType : this._binaryType;
        },
        set: function (value) {
            this._binaryType = value;
            if (this._ws) {
                this._ws.binaryType = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
        /**
         * Returns the number or connection retries
         */
        get: function () {
            return Math.max(this._retryCount, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
        /**
         * The number of bytes of data that have been queued using calls to send() but not yet
         * transmitted to the network. This value resets to zero once all queued data has been sent.
         * This value does not reset to zero when the connection is closed; if you keep calling send(),
         * this will continue to climb. Read only
         */
        get: function () {
            var bytes = this._messageQueue.reduce(function (acc, message) {
                if (typeof message === 'string') {
                    acc += message.length; // not byte size
                }
                else if (message instanceof Blob) {
                    acc += message.size;
                }
                else {
                    acc += message.byteLength;
                }
                return acc;
            }, 0);
            return bytes + (this._ws ? this._ws.bufferedAmount : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
        /**
         * The extensions selected by the server. This is currently only the empty string or a list of
         * extensions as negotiated by the connection
         */
        get: function () {
            return this._ws ? this._ws.extensions : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
        /**
         * A string indicating the name of the sub-protocol the server selected;
         * this will be one of the strings specified in the protocols parameter when creating the
         * WebSocket object
         */
        get: function () {
            return this._ws ? this._ws.protocol : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
        /**
         * The current state of the connection; this is one of the Ready state constants
         */
        get: function () {
            if (this._ws) {
                return this._ws.readyState;
            }
            return this._options.startClosed
                ? ReconnectingWebSocket.CLOSED
                : ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
        /**
         * The URL as resolved by the constructor
         */
        get: function () {
            return this._ws ? this._ws.url : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
     * CLOSED, this method does nothing
     */
    ReconnectingWebSocket.prototype.close = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._closeCalled = true;
        this._shouldReconnect = false;
        this._clearTimeouts();
        if (!this._ws) {
            this._debug('close enqueued: no ws instance');
            return;
        }
        if (this._ws.readyState === this.CLOSED) {
            this._debug('close: already closed');
            return;
        }
        this._ws.close(code, reason);
    };
    /**
     * Closes the WebSocket connection or connection attempt and connects again.
     * Resets retry counter;
     */
    ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
        this._shouldReconnect = true;
        this._closeCalled = false;
        this._retryCount = -1;
        if (!this._ws || this._ws.readyState === this.CLOSED) {
            this._connect();
        }
        else {
            this._disconnect(code, reason);
            this._connect();
        }
    };
    /**
     * Enqueue specified data to be transmitted to the server over the WebSocket connection
     */
    ReconnectingWebSocket.prototype.send = function (data) {
        if (this._ws && this._ws.readyState === this.OPEN) {
            this._debug('send', data);
            this._ws.send(data);
        }
        else {
            var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
            if (this._messageQueue.length < maxEnqueuedMessages) {
                this._debug('enqueue', data);
                this._messageQueue.push(data);
            }
        }
    };
    /**
     * Register an event handler of a specific event type
     */
    ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type].push(listener);
        }
    };
    ReconnectingWebSocket.prototype.dispatchEvent = function (event) {
        var e_1, _a;
        var listeners = this._listeners[event.type];
        if (listeners) {
            try {
                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
                    var listener = listeners_1_1.value;
                    this._callEventListener(event, listener);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return true;
    };
    /**
     * Removes an event listener
     */
    ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
        }
    };
    ReconnectingWebSocket.prototype._debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._options.debug) {
            // not using spread because compiled version uses Symbols
            // tslint:disable-next-line
            console.log.apply(console, __spread(['RWS>'], args));
        }
    };
    ReconnectingWebSocket.prototype._getNextDelay = function () {
        var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
        var delay = 0;
        if (this._retryCount > 0) {
            delay =
                minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
            if (delay > maxReconnectionDelay) {
                delay = maxReconnectionDelay;
            }
        }
        this._debug('next delay', delay);
        return delay;
    };
    ReconnectingWebSocket.prototype._wait = function () {
        var _this = this;
        return new Promise(function (resolve) {
            setTimeout(resolve, _this._getNextDelay());
        });
    };
    ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
        if (typeof urlProvider === 'string') {
            return Promise.resolve(urlProvider);
        }
        if (typeof urlProvider === 'function') {
            var url = urlProvider();
            if (typeof url === 'string') {
                return Promise.resolve(url);
            }
            if (!!url.then) {
                return url;
            }
        }
        throw Error('Invalid URL');
    };
    ReconnectingWebSocket.prototype._connect = function () {
        var _this = this;
        if (this._connectLock || !this._shouldReconnect) {
            return;
        }
        this._connectLock = true;
        var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;
        if (this._retryCount >= maxRetries) {
            this._debug('max retries reached', this._retryCount, '>=', maxRetries);
            return;
        }
        this._retryCount++;
        this._debug('connect', this._retryCount);
        this._removeListeners();
        if (!isWebSocket(WebSocket)) {
            throw Error('No valid WebSocket class provided');
        }
        this._wait()
            .then(function () { return _this._getNextUrl(_this._url); })
            .then(function (url) {
            // close could be called before creating the ws
            if (_this._closeCalled) {
                return;
            }
            _this._debug('connect', { url: url, protocols: _this._protocols });
            _this._ws = _this._protocols
                ? new WebSocket(url, _this._protocols)
                : new WebSocket(url);
            _this._ws.binaryType = _this._binaryType;
            _this._connectLock = false;
            _this._addListeners();
            _this._connectTimeout = setTimeout(function () { return _this._handleTimeout(); }, connectionTimeout);
        });
    };
    ReconnectingWebSocket.prototype._handleTimeout = function () {
        this._debug('timeout event');
        this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
    };
    ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._clearTimeouts();
        if (!this._ws) {
            return;
        }
        this._removeListeners();
        try {
            this._ws.close(code, reason);
            this._handleClose(new CloseEvent(code, reason, this));
        }
        catch (error) {
            // ignore
        }
    };
    ReconnectingWebSocket.prototype._acceptOpen = function () {
        this._debug('accept open');
        this._retryCount = 0;
    };
    ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
        if ('handleEvent' in listener) {
            // @ts-ignore
            listener.handleEvent(event);
        }
        else {
            // @ts-ignore
            listener(event);
        }
    };
    ReconnectingWebSocket.prototype._removeListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('removeListeners');
        this._ws.removeEventListener('open', this._handleOpen);
        this._ws.removeEventListener('close', this._handleClose);
        this._ws.removeEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.removeEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._addListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('addListeners');
        this._ws.addEventListener('open', this._handleOpen);
        this._ws.addEventListener('close', this._handleClose);
        this._ws.addEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.addEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._clearTimeouts = function () {
        clearTimeout(this._connectTimeout);
        clearTimeout(this._uptimeTimeout);
    };
    return ReconnectingWebSocket;
}());

var MultiplayerStateContext = React__default['default'].createContext({});
var initialState = {
    connected: false,
    presence: {},
    documents: {},
    nodes: {},
};
exports.MultiplayerActionType = void 0;
(function (MultiplayerActionType) {
    MultiplayerActionType["SetConnectionStatus"] = "setConnectionStatus";
    MultiplayerActionType["SetDocument"] = "setDocument";
    MultiplayerActionType["UpdateDocument"] = "updateDcoument";
    MultiplayerActionType["SetDocumentAttrs"] = "setDocumentAttrs";
    MultiplayerActionType["SetNode"] = "setNode";
    MultiplayerActionType["DeleteNode"] = "deleteNode";
    MultiplayerActionType["SetNodeProperties"] = "setNodeProperties";
    MultiplayerActionType["SetUserPresenceProperties"] = "setUserPresenceProperties";
    MultiplayerActionType["SetDocumentPresence"] = "setDocumentPresence";
    MultiplayerActionType["SetUserPresence"] = "setUserPresence";
    MultiplayerActionType["RemoveUserPresence"] = "removeUserPresence";
    MultiplayerActionType["CreateNode"] = "createNode";
    MultiplayerActionType["UpdateNode"] = "updateNode";
})(exports.MultiplayerActionType || (exports.MultiplayerActionType = {}));
var reducer = function (state, action) {
    switch (action.type) {
        case exports.MultiplayerActionType.SetConnectionStatus: {
            return __assign(__assign({}, state), { connected: action.payload });
        }
        case exports.MultiplayerActionType.SetDocument: {
            var documents = __assign({}, state.documents);
            var nodes_1 = __assign({}, state.nodes);
            documents[action.document.id] = action.document;
            var keys = Object.keys(action.nodes || {});
            keys.forEach(function (key) { return nodes_1[key] = action.nodes[key]; });
            return __assign(__assign({}, state), { documents: documents, nodes: nodes_1 });
        }
        case exports.MultiplayerActionType.UpdateDocument: {
            var documents = __assign({}, state.documents);
            documents[action.document.id].name = action.document.name;
            documents[action.document.id].updated_at = action.document.updated_at;
            return __assign(__assign({}, state), { documents: documents });
        }
        case exports.MultiplayerActionType.CreateNode:
        case exports.MultiplayerActionType.SetNode: {
            var nodes = __assign({}, state.nodes);
            nodes[action.node.id] = action.node;
            return __assign(__assign({}, state), { nodes: nodes });
        }
        case exports.MultiplayerActionType.UpdateNode: {
            var nodes = __assign({}, state.nodes);
            nodes[action.node.id].name = action.node.name;
            nodes[action.node.id].type = action.node.type;
            nodes[action.node.id].parent_id = action.node.parent_id;
            nodes[action.node.id].children = action.node.children;
            return __assign({}, state);
        }
        case exports.MultiplayerActionType.DeleteNode: {
            var nodes = __assign({}, state.nodes);
            var node_1 = nodes[action.node_id];
            if (node_1 && node_1.parent_id) {
                var parentNode = nodes[node_1.parent_id];
                if (parentNode) {
                    parentNode.children = parentNode.children.filter(function (id) { return id !== node_1.parent_id; });
                }
            }
            delete nodes[action.node_id];
            return __assign(__assign({}, state), { nodes: nodes });
        }
        case exports.MultiplayerActionType.SetNodeProperties: {
            var nodes = __assign({}, state.nodes);
            var existingNode = nodes[action.node_id];
            if (existingNode !== undefined) {
                existingNode.properties = mergeProperties(existingNode.properties, action.properties);
                nodes[action.node_id] = existingNode;
            }
            return __assign(__assign({}, state), { nodes: nodes });
        }
        case exports.MultiplayerActionType.SetDocumentPresence: {
            var presence = __assign({}, state.presence);
            presence[action.document_id] = action.presence;
            return __assign(__assign({}, state), { presence: presence });
        }
        case exports.MultiplayerActionType.SetUserPresence: {
            var presence = __assign({}, state.presence);
            var docPresence = presence[action.document_id];
            if (!docPresence)
                docPresence = {};
            docPresence[action.user_id] = action.presence;
            presence[action.document_id] = docPresence;
            return __assign(__assign({}, state), { presence: presence });
        }
        case exports.MultiplayerActionType.SetUserPresenceProperties: {
            var presence = __assign({}, state.presence);
            var docPresence = presence[action.document_id] || {};
            var existingUserPresence = docPresence[action.user_id] || {
                user: { id: "", first_name: "", last_name: "", name: "", email: "", properties: {} },
            };
            var existingProps = existingUserPresence.user.properties;
            existingUserPresence.user.properties = mergeProperties(existingProps, action.properties);
            docPresence[action.user_id] = existingUserPresence;
            presence[action.document_id] = docPresence;
            return __assign(__assign({}, state), { presence: presence });
        }
        case exports.MultiplayerActionType.RemoveUserPresence: {
            var presence = __assign({}, state.presence);
            var docPresence = presence[action.document_id] || {};
            delete docPresence[action.user_id];
            return __assign(__assign({}, state), { presence: presence });
        }
        default:
            console.log("Unhandled action type: " + action.type, action);
    }
};
var mergeProperties = function (existingProperties, newProperties) {
    var keys = Object.keys(newProperties);
    var i = 0;
    for (i; i < keys.length; i++) {
        var key = keys[i];
        var newProp = newProperties[key];
        var existingProp = existingProperties[key];
        if (typeof newProp === 'object' && typeof existingProp === 'object') {
            existingProperties[key] = mergeProperties(existingProp, newProp);
        }
        else {
            existingProperties[key] = newProp;
        }
    }
    return existingProperties;
};
var ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY = 'zeus.multiplayer.storage';
var clearMultiplayerStorage = function () {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY)) {
        localStorage.removeItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY);
    }
};
var MultiplayerProvider = function (_a) {
    var children = _a.children;
    var localState = null;
    if (typeof localStorage !== 'undefined' && localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY)) {
        try {
            localState = JSON.parse(localStorage.getItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY) || '');
        }
        catch (_b) {
            localState = '';
        }
    }
    var _c = React.useReducer(reducer, localState || initialState), state = _c[0], dispatch = _c[1];
    if (typeof localStorage !== 'undefined') {
        React.useEffect(function () {
            localStorage.setItem(ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY, JSON.stringify(state));
        }, [state]);
    }
    return (React__default['default'].createElement(MultiplayerStateContext.Provider, { value: [state, dispatch] }, children));
};
var useZeusMultiplayer = function () { return React.useContext(MultiplayerStateContext); };
var DEFAULT_PROD_URL = "wss://multiplayer-server.zeusdev.io";
var DEFAULT_LOCAL_URL = "ws://localhost:8080";
// useContext hook - export here to keep code for global Multiplayer state
// together in this file, allowing user info to be accessed and updated
// in any functional component using the hook
var useZeusMultiplayerClient = function (dispatch, accessToken, documentId, onDocumentLoaded, onSetNode, onDeleteNode, onSetNodeProperties, isLocal, localBaseUrl, prodBaseUrl) {
    if (isLocal === void 0) { isLocal = false; }
    if (localBaseUrl === void 0) { localBaseUrl = undefined; }
    if (prodBaseUrl === void 0) { prodBaseUrl = undefined; }
    var baseUrl = "";
    if (isLocal) {
        baseUrl = localBaseUrl || DEFAULT_LOCAL_URL;
    }
    else {
        baseUrl = prodBaseUrl || DEFAULT_PROD_URL;
    }
    console.log("Connecting to #{baseUrl}");
    var rws = new ReconnectingWebSocket(baseUrl + ("/ws/" + documentId + "/" + accessToken));
    rws.addEventListener('open', function () {
        console.log('connected');
        dispatch({
            type: exports.MultiplayerActionType.SetConnectionStatus,
            payload: true
        });
    });
    rws.addEventListener('close', function () {
        console.log('disconnected');
        dispatch({
            type: exports.MultiplayerActionType.SetConnectionStatus,
            payload: false
        });
    });
    rws.addEventListener('message', function (msg) {
        var msgJson = JSON.parse(msg.data);
        dispatch(msgJson);
        switch (msgJson.type) {
            case exports.MultiplayerActionType.SetNode:
                onSetNode(msgJson);
                break;
            case exports.MultiplayerActionType.SetNodeProperties:
                onSetNodeProperties(msgJson);
                break;
            case exports.MultiplayerActionType.DeleteNode:
                onDeleteNode(msgJson);
                break;
            case exports.MultiplayerActionType.SetDocument:
                onDocumentLoaded(msgJson);
                break;
        }
    });
    rws.addEventListener('error', function (error) {
        console.log('error', error);
    });
    var updateDocument = function (document) {
        var action = {
            type: exports.MultiplayerActionType.UpdateDocument,
            document: document,
        };
        rws.send(JSON.stringify(action));
    };
    var createNode = function (node) {
        var action = {
            type: exports.MultiplayerActionType.CreateNode,
            node: node,
        };
        rws.send(JSON.stringify(action));
    };
    var updateNode = function (node) {
        var action = {
            type: exports.MultiplayerActionType.UpdateNode,
            node: node,
        };
        rws.send(JSON.stringify(action));
    };
    var deleteNode = function (node_id) {
        var action = {
            type: exports.MultiplayerActionType.DeleteNode,
            node_id: node_id,
        };
        rws.send(JSON.stringify(action));
    };
    var setNodeProperties = function (node_id, properties) {
        var action = {
            type: exports.MultiplayerActionType.SetNodeProperties,
            node_id: node_id,
            properties: properties,
        };
        dispatch(action);
        rws.send(JSON.stringify(action));
    };
    var setUserPresenceProperties = function (properties) {
        var action = {
            type: exports.MultiplayerActionType.SetUserPresenceProperties,
            properties: properties,
        };
        dispatch(action);
        rws.send(JSON.stringify(action));
    };
    var zeus = {
        rws: rws,
        createNode: createNode,
        updateNode: updateNode,
        deleteNode: deleteNode,
        updateDocument: updateDocument,
        setUserPresenceProperties: setUserPresenceProperties,
        setNodeProperties: setNodeProperties,
    };
    return zeus;
};

exports.MultiplayerProvider = MultiplayerProvider;
exports.MultiplayerService = ZeusMultiplayerService;
exports.MultiplayerStateContext = MultiplayerStateContext;
exports.ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY = ZEUS_MULTIPLAYER_LOCAL_STORAGE_KEY;
exports.clearMultiplayerStorage = clearMultiplayerStorage;
exports.useZeusMultiplayer = useZeusMultiplayer;
exports.useZeusMultiplayerClient = useZeusMultiplayerClient;
//# sourceMappingURL=index.js.map
