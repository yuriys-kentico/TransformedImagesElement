import { ICustomElement } from "./types/customElement/ICustomElement";
import { initElementFromDelivery, initInvalidUsage } from "./components/Initialize";

require('./styles/style.scss');

// Expose access to Kentico custom element API
declare const CustomElement: ICustomElement;

if (window.self === window.top) {
    initInvalidUsage();
} else {
    CustomElement.init(initElementFromDelivery);
}