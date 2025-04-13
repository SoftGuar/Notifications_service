export class WebsocketService {
    private socket: WebSocket | null = null;
    private messageCallback: ((data: any) => void) | null = null;

    constructor() {
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket("ws://localhost:8080/ws");

        this.socket.onopen = () => {
            console.log("WebSocket connection established.");
        };

        this.socket.onmessage = (event) => {
            if (this.messageCallback) {
                const data = JSON.parse(event.data);
                console.log("Received from server:", data);
                this.messageCallback(data);
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed. Reconnecting...");
            setTimeout(() => this.connect(), 1000);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    public sendMessage(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error("WebSocket is not open. Unable to send message.");
        }
    }

    public onMessage(callback: (data: any) => void) {
        this.messageCallback = callback;
    }
}