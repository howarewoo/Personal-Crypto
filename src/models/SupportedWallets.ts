import { IAccountOption, SupportedAccountTypes } from "./SupportedAccountTypes";

export enum SupportedWallets {
    NONE = ""
}

export interface IWalletInfo {
    name: SupportedWallets;
    type: SupportedAccountTypes;
    options: IAccountOption[];
}

export const SupportedWalletInfo: IWalletInfo[] = []
