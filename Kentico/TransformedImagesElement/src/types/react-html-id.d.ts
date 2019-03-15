// Move this file to /node_modules for it to work

import { Component, ComponentLifecycle } from "react";

export declare function enableUniqueIds(component: Component): void;
export declare function resetUniqueIds(): void;

declare module "react" {
    export interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {
        nextUniqueId(): string;
        lastUniqueId(): string;
        getUniqueId(identifier: string): string;
    }
} 