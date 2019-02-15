import * as React from "react";
import * as ReactDOM from "react-dom";

import { IElement } from "./components/kentico/IElement";
import { IContext } from "./components/kentico/IContext";

import { AdvancedAssetElement } from "./components/AdvancedAssetElement";

// Expose access to Kentico custom element API
declare const CustomElement: any;

CustomElement.init((element: IElement, _context: IContext) =>
    ReactDOM.render(<AdvancedAssetElement element={element} context={_context} />, document.getElementById('root')
    ));