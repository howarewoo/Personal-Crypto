import { ExchangesModel } from "../../models/ExchangesModel";

export class ExchangeListViewModel {
    constructor() {
        this.store = new ExchangesModel();
        this.store.load();
    }

    store: ExchangesModel;
}