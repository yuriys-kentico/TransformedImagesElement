declare module "react-html-id" {
  import { Component } from "react";

  export function enableUniqueIds(component: Component): void;
  export function resetUniqueIds(): void;
}
