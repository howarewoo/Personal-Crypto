import { PersonalCryptoHolding } from '../../models/PersonalCryptoHolding'
import { AbstractClient } from '../AbstractClient'

export abstract class AbstractWallet extends AbstractClient {
    constructor() {
        super()
    }

    abstract getHoldings(): Promise<PersonalCryptoHolding[]>
}