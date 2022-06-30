import { showMessage } from "../constants/web3/getWeb3";
import { COINBASE, BRAVE } from "./constants";

/**
 * Description: 
 * if u find that the wallet to be added follows the standard ethereum API
 * u can append wallets conf to this configuration directly, standard wallet loader
 * will watch this config and generate the connect, disconnect ...etc methods for it
 * 
 * config props u can set:
 * 
 * - 【 walletType: required 】, new wallet type
 * - 【 icon: optional 】, wallet icon, this property will not be used now, it's primarily to take over UI layer config in the feature
 * - 【 walletIsInstalledInvestigator: required 】, in the wallet init phase, this method will be called to make sure the corresponding wallet extension is installed in the user's browser
 * - 【 initDispatcher: optional 】, by default, wallet loader has its own init process, if u want take over the process
 * u can write this prop, it must be a function, loader will pass the base init processor to ur own initDispatcher, u can invoke it or not according to ur own ideas
 * - 【 disconnectDispatcher: optional 】, the effect is equals with initDispatcher, but it's used for disconnection phase
 * - 【chainIdTransfer: optional】, in some wallets, chainIds can take different forms, like hex or binary? when that happens,  u must config this property in a function
 * to convert them to base 10
 */
export default [
    {
        walletType: COINBASE,
        icon: COINBASE,
        walletIsInstalledInvestigator: provider => provider.isCoinbaseWallet
    },
    {
        walletType: BRAVE,
        icon: BRAVE,
        walletIsInstalledInvestigator: provider => provider.isBraveWallet,
        chainIdTransfer: chainId => parseInt(chainId, 16),
        walletNotInstallReducer: () => {
            // because brave is special, his provider maybe overridden by metamask
            // so even if the user is in the brave browser, he may still not have 
            // access the provider of brave wallet
            
            // maybe we can popup a window to prompt the user to disable the metamask wallet
            // extension? (to avoid user confusion);

            showMessage("The Brave Wallet is only available in the brave browser, so make sure u r in the brave browser, and the brave wallet will conflict with the metamask wallet, so u must disable the metamask wallet extension in your browser if u want to access the brave wallet", "warning");
        }
    }
]