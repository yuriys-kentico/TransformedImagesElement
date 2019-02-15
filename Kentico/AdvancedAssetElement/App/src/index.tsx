import * as React from "react";
import * as ReactDOM from "react-dom";
import { IElement } from "./components/kentico/IElement";
import { IContext } from "./components/kentico/IContext";

import { AdvancedAssetElement } from "./components/AdvancedAssetElement";

declare var CustomElement: any;

CustomElement.init((element: IElement, _context: IContext) =>
    ReactDOM.render(<AdvancedAssetElement element={element} context={_context} />, document.getElementById('root')
    ));