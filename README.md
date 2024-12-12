# ITiKB
Программа включает клиент-серверную архитектуру для мониторинга и управления уровнем жидкости в резервуаре. Все компоненты взаимодействуют через WebSocket-соединение для синхронизации данных между клиентом и сервером. Ниже приведено описание каждого файла и его функциональности.

1. server.js (Серверная логика)
Скрипт отвечает за обработку клиентских запросов, управление состоянием системы и отправку данных о текущем уровне жидкости, состоянии задвижек и сигнализаторов.

Основные функции:
Поддержка WebSocket-соединения:

Сервер принимает подключение от клиентов (мониторинг и управление) и передает им обновленные данные в реальном времени.
javascript
Копировать код
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
Логика работы резервуара:

Управляет уровнями жидкости, состоянием задвижек и сигнализаторов в зависимости от условий (описанных ранее).
javascript
Копировать код
if (waterLevel >= 90) {
    fillingValve = false;
    drainingValve = true;
}
if (waterLevel <= 20 && drainingValve) {
    drainingValve = false;
}
Рассылка данных:

Сервер периодически отправляет клиентам текущий уровень жидкости, состояние задвижек и сигнализаторов.
javascript
Копировать код
const data = JSON.stringify({
    waterLevel,
    fillingValve,
    drainingValve,
    upperIndicator: waterLevel >= 90,
    lowerIndicator: waterLevel <= 20
});
2. index.html (Титульная страница)
Титульная страница служит для общей информации о проекте и ссылки на страницы мониторинга и управления.

Основной функционал:
Описание проекта:
Отображает название проекта, иллюстрацию, краткое описание, информацию о разработчиках, город и год.
Навигация:
Содержит ссылки для перехода на страницы мониторинга и управления:
html
Копировать код
<a href="object.html">Страница мониторинга и управления</a>
3. object.html (Главная страница мониторинга и управления)
Эта страница делится на три фрейма для визуализации:

Мнемосхема резервуара (monitoring.html)
Состояние задвижек (valves.html)
Управление задвижками (setting.html)
Использование:
html
Копировать код
<frameset cols="33%, 33%, 33%">
    <frame src="monitoring.html">
    <frame src="valves.html">
    <frame src="setting.html">
</frameset>
4. monitoring.html (Мнемосхема резервуара)
Визуализирует текущий уровень жидкости в резервуаре и состояние сигнализаторов.

Основной функционал:
Отображение уровня жидкости:

Плавное изменение уровня жидкости в резервуаре с использованием div и CSS.
javascript
Копировать код
waterDiv.style.height = height + 'px';
Сигнализаторы уровня:

Динамическое изменение цвета (зеленый или красный) в зависимости от уровня жидкости.
javascript
Копировать код
lowerIndicator.className = `indicator lower ${data.lowerIndicator ? 'active' : 'inactive'}`;
upperIndicator.className = `indicator upper ${data.upperIndicator ? 'active' : 'inactive'}`;
Дизайн:

Светло-фиолетовый фон и голубая вода для улучшенной визуализации.
5. valves.html (Состояние задвижек)
Показывает текущее состояние задвижек: открыты или закрыты.

Основной функционал:
Динамическое отображение:

Статус каждой задвижки меняется в зависимости от данных, полученных с сервера.
javascript
Копировать код
fillingValveSpan.textContent = data.fillingValve ? 'открыта' : 'закрыта';
drainingValveSpan.textContent = data.drainingValve ? 'открыта' : 'закрыта';
Обновление данных через WebSocket:

Сервер сообщает клиенту текущее состояние задвижек.
javascript
Копировать код
ws.onmessage = (message) => { ... }
6. setting.html (Управление задвижками)
Содержит кнопки START и STOP, запускающие и останавливающие процесс.

Основной функционал:
Кнопки управления:

START отправляет команду на сервер для запуска наполнения резервуара.
STOP останавливает процесс и фиксирует уровень жидкости.
javascript
Копировать код
startButton.addEventListener('click', () => {
    ws.send(JSON.stringify({ action: 'start' }));
});
stopButton.addEventListener('click', () => {
    ws.send(JSON.stringify({ action: 'stop' }));
});
Дизайн:

Кнопки стилизованы под современный объемный стиль.
