import * as React from "react";

export class InvalidUsage extends React.Component {
    render() {
        return (
            <div className="invalidUsage">
                <span>
                    If you are seeing this, do not be alarmed, for it is only a message telling you to read this: <a href="https://developer.kenticocloud.com/docs/integrating-content-editing-features#section-3-displaying-a-custom-element-in-kentico-cloud">
                        What to do with the URL to this page
                    </a>.
                </span>
            </div>
        );
    }
}