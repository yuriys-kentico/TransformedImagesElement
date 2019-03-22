import * as React from "react";

export interface IIFProps {
    shouldRender: boolean;
    children: React.ReactNode;
}

export const If: React.StatelessComponent<IIFProps> = (props: IIFProps) => {
    if (props.shouldRender) {
        return props.children;
    }
    return null as any;
}