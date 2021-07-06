# Botol Telegram Bot

## Simple Examples
```typescript
import { BotolTg } from '@botol/tg-bot';

let bot = new BotolTg('<token>');
bot.on('text', (ctx, next) => {
    ctx.reply('Hello ' + ctx.text);
});
bot.use((ctx, next) => {
    ctx.reply('Enter name');
});
bot.startPolling();
```

## Middlewares
| Name | Description |
|---|---|
| [Session](https://www.npmjs.com/package/@botol/tg-session) | Adding ```session``` to Context |
| [Threads](https://www.npmjs.com/package/@botol/tg-threads) | Make bot multithreaded |


## Events
### Pass as first param in ```on```
| Name | Description |
|---|---|
| 'message' | Call when update has param ```message``` |
| 'callback_query' | Call when update has param ```callback_query``` |
| 'text' | Call when update has param ```message.text``` |
| 'callback_data' | Call when update has param ```callback_query.data``` |

## Context
| Property | Description |
|---|---|
| telegram | [TgClient](https://www.npmjs.com/package/@botol/tg-client) instance with [methods](https://www.npmjs.com/package/@botol/tg-methods) |
| update | Received [update](https://core.telegram.org/bots/api#update) |
| message | (Optional) [Message](https://core.telegram.org/bots/api#message) from update |
| callback_query | (Optional) [CallbackQuery](https://core.telegram.org/bots/api#callbackquery) from update |
| chat | (Optional) [Chat](https://core.telegram.org/bots/api#chat) from update |
| text | (Optional) Extracted from message |
| callbackData | (Optional) Extracted from callback_query |
| chat | (Optional) Extracted from one of several params |
| from | (Optional) Extracted from one of several params |


| Method | Arguments | Type | Description |
|---|---|---|---|
| reply ||| Throw error if the ```chat``` property don't exists |
|| text | ```string``` | Text to send |
|| markup | ```Markup``` or ```ExtraMarkup``` | (Optional) Extra markup like keyboard or disable preview |
| answerCbQuery ||| Throw error if the ```callback_query``` property don't exists |
|| text | ```string``` | (Optional) Text to send |
|| showAlert | ```boolean``` | (Optional) Show alert |

## Markup
- keyboard
    ```typescript
        Markup.keyboard(['Option 1', 'Option 2'])
    ```
- inline keyboard
    ```typescript
        Markup.inlineKeyboard([
            { text: 'Option 1', callback_data: 'Option1' },
            { text: 'Option 2', callback_data: 'Option2' }
        ])
    ```

## Examples

### Create Middleware
```typescript
type ContextSystem = {
    getPoints: () => number;
    addPoint: (sum: number) => void;
};
function BotSystem(): Handler<Partial<ContextSystem> & ContextTG> {
    let points = 0;
    return (ctx, next) => {
        ctx.addPoint = (sum) => {
            points += sum;
        };
        ctx.getPoints = () => points;

        return next();
    };
}
```

### Use Middleware
```typescript
let bot = new BotolTg('<token>');
let botSystem = bot.middleware(BotSystem());

botSystem.on('callback_data', (ctx, next) => {
    switch (ctx.callbackData) {
        case 'show':
            ctx.answerCbQuery(ctx.getPoints().toString());
            return;
        case 'add':
            ctx.addPoint(1);
            ctx.answerCbQuery();
            return;
        case 'sub':
            ctx.addPoint(-1);
            ctx.answerCbQuery();
            return;
    }
    ctx.answerCbQuery();
    return next();
});
botSystem.use((ctx) => {
    ctx.reply(
        `current points: ${ctx.getPoints()}`,
        Markup.inlineKeyboard([
            [
                { text: 'add', callback_data: 'add' },
                { text: 'sub', callback_data: 'sub' },
            ],
            [{ text: 'show', callback_data: 'show' }],
        ]),
    );
});
bot.startPolling();
```