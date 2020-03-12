import { Component, ComponentLifecycle } from "react";
declare module "react" {
  export interface Component<P = {}, S = {}, SS = any>
    extends ComponentLifecycle<P, S, SS> {
    nextUniqueId(): string;
    lastUniqueId(): string;
    getUniqueId(identifier: string): string;
  }
}
