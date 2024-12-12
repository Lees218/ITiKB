const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
console.log("Сервер запущен на ws://localhost:8080");

let waterLevel = 0; // Уровень воды (в процентах)
let filling = false; // Статус наполнения
let draining = false; // Статус откачки

// Рассылка состояния всем клиентам
function broadcastState() {
    const state = {
        waterLevel,
        filling,
        draining,
        lowerIndicator: waterLevel >= 20,
        upperIndicator: waterLevel >= 90,
    };
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(state));
        }
    });
}

// Основной цикл управления уровнем воды
setInterval(() => {
    if (filling && waterLevel < 90) {
        waterLevel += 1; // Наполнение
    } else if (filling && waterLevel >= 90) {
        filling = false; // Остановить наполнение
        draining = true; // Начать слив
    } else if (draining && waterLevel > 20) {
        waterLevel -= 1; // Слив
    } else if (draining && waterLevel <= 20) {
        draining = false; // Остановить слив
    }

    broadcastState(); // Отправка обновлений
}, 500); // Обновление каждые 500 мс

// Обработка подключений клиентов
server.on('connection', (socket) => {
    console.log("Клиент подключен.");

    // Отправить начальное состояние
    socket.send(JSON.stringify({
        waterLevel,
        filling,
        draining,
        lowerIndicator: waterLevel >= 20,
        upperIndicator: waterLevel >= 90,
    }));

    // Обработка сообщений от клиента
    socket.on('message', (message) => {
        const command = message.toString();
        if (command === 'start') {
            filling = true; // Начать наполнение
        } else if (command === 'stop') {
            filling = false; // Остановить процесс
            draining = false;
        }
    });
});
