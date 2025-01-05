import { HubConnectionState } from "@microsoft/signalr";

class MockHubConnection {
    handlers: { [methodName: string]: ((...args: any[]) => void)[] };
    connectionState: HubConnectionState;

    constructor() {
      this.handlers = {};
      this.connectionState = HubConnectionState.Disconnected;
    }

    start() {
         this.connectionState = HubConnectionState.Connected;
         return Promise.resolve();
    }

    stop() {
        this.connectionState = HubConnectionState.Disconnected;
        return Promise.resolve();
    }

    on(methodName: string, callback: (...args: any[]) => void) {
      this.handlers[methodName] = this.handlers[methodName] || [];
      this.handlers[methodName].push(callback);
    }

    off(methodName: string, callback: (...args: any[]) => void) {
         if (this.handlers[methodName]) {
             this.handlers[methodName] = this.handlers[methodName].filter(handler => handler !== callback);
         }
    }

    send() {
        return new Promise((resolve, reject) => {
            if (this.connectionState === HubConnectionState.Connected) {
                resolve(void 0);
            } else {
                reject("Connection is not active.");
            }
        });
    }

    invoke() {
         return new Promise((resolve, reject) => {
             if (this.connectionState === HubConnectionState.Connected) {
                 resolve(void 0);
             } else {
                 reject("Connection is not active.");
             }
         });
    }
      
    simulateMessage(methodName: string, ...args: any[]) {
        if (this.handlers[methodName]) {
            this.handlers[methodName].forEach(handler => handler(...args));
        }
    }
}

export default MockHubConnection;