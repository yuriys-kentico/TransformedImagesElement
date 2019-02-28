import * as React from "react";
import * as ReactDOM from "react-dom";

import { IElement } from "./types/kentico/IElement";
import { IContext } from "./types/kentico/IContext";

import { TransformedImagesElement } from "./components/TransformedImagesElement";

// Expose access to Kentico custom element API
declare const CustomElement: any;

CustomElement.init((element: IElement, _context: IContext) =>
    ReactDOM.render(<TransformedImagesElement element={element} context={_context} />, document.getElementById('root')
    ));