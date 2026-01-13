const express = require("express");
const app = express();

app.use(express.json());

let signals = [];

app.post("/webhook", (req, res) => {
    const text = req.body.alert_message || req.body.message || "UNKNOWN";

    const parts = text.split("|").map(p => p.trim());

    if (parts.length >= 4) {
        signals.unshift({
            type: parts[0],
            symbol: parts[1],
            timeframe: parts[2],
            details: parts.slice(3).join(" | "),
            time: new Date().toLocaleString()
        });

        signals = signals.slice(0, 50);
    }

    res.send("OK");
});

app.get("/", (req, res) => {
    let rows = signals.map(s => `
        <tr>
            <td class="${s.type}">${s.type}</td>
            <td>${s.symbol}</td>
            <td>${s.timeframe}</td>
            <td>${s.details}</td>
            <td>${s.time}</td>
        </tr>
    `).join("");

    res.send(`
        <html>
        <head>
            <title>DIV ALERT SYSTEM</title>
            <style>
                body { font-family: Arial; background:#111; color:#fff }
                table { width:100%; border-collapse:collapse }
                th, td { padding:8px; border:1px solid #333; text-align:center }
                th { background:#222 }
                .BUY { color:#00ff99 }
                .SELL { color:#ff5555 }
            </style>
        </head>
        <body>
            <h2>DIV ALERT SYSTEM</h2>
            <table>
                <tr>
                    <th>TYPE</th>
                    <th>SYMBOL</th>
                    <th>TF</th>
                    <th>CONFIRMATIONS</th>
                    <th>TIME</th>
                </tr>
                ${rows}
            </table>
        </body>
        </html>
    `);
});

app.listen(3000, () => console.log("Server running on port 3000"));
