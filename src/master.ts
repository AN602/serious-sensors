class MasterApp {
    private socket: WebSocket = new WebSocket(`ws://${window.location.hostname}:3000`);
    constructor() {
        console.log('init master app');
        console.log(window.location.hostname);
        this.init();
    }

    init(): void {
        this.socket.onopen = (event: Event) => {
            console.log(event, 'socket opened');
        }

        this.socket.onmessage = (event: MessageEvent) => {
            alert(event.data);
        }
    }
}

new MasterApp();