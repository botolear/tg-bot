import { TgClient } from '@botol/tg-client';
import { ContextTG, DefaultEvents, DipoTG } from '@botol/tg-dipo';

export type BotolTgParams = {};

export class BotolTg {
    private client: TgClient;
    private dipo: DipoTG;

    constructor(private token: string, private params?: BotolTgParams) {
        this.dipo = new DipoTG(DefaultEvents);
        this.client = new TgClient(token, (update) => {
            return this.dipo.handle(new ContextTG(update, this.client));
        });
    }

    middleware: Pick<DipoTG, 'middleware'>['middleware'] = (handler) =>
        this.dipo.middleware(handler);

    on: Pick<DipoTG, 'on'>['on'] = (event, handler) =>
        this.dipo.on(event, handler);

    use: Pick<DipoTG, 'use'>['use'] = (handler) => this.dipo.use(handler);

    handle: Pick<DipoTG, 'handle'>['handle'] = (context) =>
        this.dipo.handle(context);

    startPolling() {
        this.client.start();
    }
}
