import * as React from "react";

import { ICropTransform, CropType } from "../../../types/transformedImage/Transforms";
import { OPTIONAL_CONFIG } from "../../../types/customElement/IElementConfig";

import { BaseControls, IBaseControlsProps } from "./BaseControls";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { NumberUtils } from "../../../types/NumberUtils";

export interface ICropControlsProps extends IBaseControlsProps<ICropTransform> {
    imageWidth: number;
    imageHeight: number;
}

export interface ICropControlsState {
}

export interface RectProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

enum MouseEditMode {
    none,
    selecting,
    grabTop,
    grabBottom,
    grabLeft,
    grabRight
}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransform, ICropControlsState> {
    private defaultNumberType = OPTIONAL_CONFIG.inputsDefaultToPercent
        ? NumberInputType.percent
        : NumberInputType.pixel;

    private allowedNumberTypes = [NumberInputType.pixel, NumberInputType.percent];

    private mouseEditMode: MouseEditMode = MouseEditMode.none;

    private startXFloat = 0;
    private startYFloat = 0;
    private endXFloat = 0;
    private endYFloat = 0;

    onClickSidebar(): void {
    }

    onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const mouseXY = this.getMouseXY(event);

        this.startXFloat = mouseXY.x;
        this.endXFloat = mouseXY.x;
        this.startYFloat = mouseXY.y;
        this.endYFloat = mouseXY.y;

        this.mouseEditMode = MouseEditMode.selecting;

        if (event.target instanceof SVGCircleElement) {
            if (event.target.id === "top") {
                this.mouseEditMode = MouseEditMode.grabTop;
            } else if (event.target.id === "bottom") {
                this.mouseEditMode = MouseEditMode.grabBottom;
            } else if (event.target.id === "left") {
                this.mouseEditMode = MouseEditMode.grabLeft;
            } else if (event.target.id === "right") {
                this.mouseEditMode = MouseEditMode.grabRight;
            }
        }

        return true;
    };

    onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (this.mouseEditMode !== MouseEditMode.none) {
            const mouseXY = this.getMouseXY(event);

            this.endXFloat = mouseXY.x;
            this.endYFloat = mouseXY.y;

            return true;
        }

        return false;
    };

    onMouseUp = () => {
        if (this.mouseEditMode !== MouseEditMode.none) {
            const { type, scale, fit, frame, box, zoom } = this.props.transform;

            let XFloat = 0;
            let YFloat = 0;
            let WFloat = 0;
            let HFloat = 0;

            switch (type) {
                case CropType.scale:
                    switch (this.mouseEditMode) {
                        case MouseEditMode.grabTop:
                        case MouseEditMode.grabBottom:
                            const scaleMouseYTranslation = Math.abs(this.endYFloat - .5);

                            WFloat = scale.xFloat !== 0 ? scale.xFloat : 1;
                            HFloat = NumberUtils.toRounded(2 * scaleMouseYTranslation, 4);
                            break;
                        case MouseEditMode.grabLeft:
                        case MouseEditMode.grabRight:
                            const scaleMouseXTranslation = Math.abs(this.endXFloat - .5);

                            WFloat = NumberUtils.toRounded(2 * scaleMouseXTranslation, 4);
                            HFloat = scale.yFloat !== 0 ? scale.yFloat : 1;
                            break;
                    }

                    scale.xFloat = WFloat;
                    scale.yFloat = HFloat;

                    this.setTransform({ scale: scale });
                    break;
                case CropType.fit:
                    switch (this.mouseEditMode) {
                        case MouseEditMode.grabTop:
                        case MouseEditMode.grabBottom:
                            const fitMouseYTranslation = Math.abs(this.endYFloat - .5);

                            WFloat = fit.xFloat !== 0 ? fit.xFloat : 1;
                            HFloat = NumberUtils.toRounded(2 * fitMouseYTranslation, 4);
                            break;
                        case MouseEditMode.grabLeft:
                        case MouseEditMode.grabRight:
                            const fitMouseXTranslation = Math.abs(this.endXFloat - .5);

                            WFloat = NumberUtils.toRounded(2 * fitMouseXTranslation, 4);
                            HFloat = fit.yFloat !== 0 ? fit.yFloat : 1;
                            break;
                    }

                    fit.xFloat = WFloat;
                    fit.yFloat = HFloat;

                    this.setTransform({ fit: fit });
                    break;
                case CropType.frame:
                    const frameMouseXTranslation = Math.abs(this.endXFloat - .5);
                    const frameMouseYTranslation = Math.abs(this.endYFloat - .5);

                    if (this.endXFloat - this.startXFloat !== 0) {
                        WFloat = NumberUtils.toRounded(2 * frameMouseXTranslation, 4);
                        HFloat = NumberUtils.toRounded(2 * frameMouseYTranslation, 4);

                        XFloat = NumberUtils.toRounded(.5 - WFloat / 2, 4);
                        YFloat = NumberUtils.toRounded(.5 - HFloat / 2, 4);
                    }

                    frame.wFloat = WFloat;
                    frame.hFloat = HFloat;

                    this.setTransform({ frame: frame });
                    break;
                case CropType.box:
                    WFloat = NumberUtils.toRounded(Math.abs(this.endXFloat - this.startXFloat), 4);
                    HFloat = NumberUtils.toRounded(Math.abs(this.endYFloat - this.startYFloat), 4);

                    if (WFloat !== 0 && HFloat !== 0) {
                        XFloat = this.startXFloat > this.endXFloat
                            ? this.endXFloat
                            : this.startXFloat;

                        YFloat = this.startYFloat > this.endYFloat
                            ? this.endYFloat
                            : this.startYFloat;
                    }

                    box.xFloat = XFloat;
                    box.yFloat = YFloat;
                    box.wFloat = WFloat;
                    box.hFloat = HFloat;

                    this.setTransform({ box: box });
                    break;
                case CropType.zoom:
                    const mouseXTranslation = this.endXFloat - this.startXFloat;
                    const mouseYTranslation = this.endYFloat - this.startYFloat;

                    const sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

                    let ZFloat = 0;

                    if (sideFloat !== 0) {
                        XFloat = NumberUtils.toRounded(this.startXFloat, 4);
                        YFloat = NumberUtils.toRounded(this.startYFloat, 4);
                        ZFloat = NumberUtils.toRounded(1 / sideFloat, 4);
                    }

                    zoom.xFloat = XFloat;
                    zoom.yFloat = YFloat;
                    zoom.zFloat = ZFloat;

                    this.setTransform({ box: box });
                    break;
            }
        }

        this.mouseEditMode = MouseEditMode.none;

        return true;
    };

    getImageOverlay() {
        const { type, scale, fit, frame, box, zoom } = this.props.transform;

        let rectProps: RectProps = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        let XFloat = 0;
        let YFloat = 0;
        let WFloat = 0;
        let HFloat = 0;

        if (this.mouseEditMode !== MouseEditMode.none && (Math.abs(this.endXFloat - this.startXFloat) > 0 || Math.abs(this.endYFloat - this.startYFloat) > 0)) {
            switch (type) {
                case CropType.scale:
                    switch (this.mouseEditMode) {
                        case MouseEditMode.grabTop:
                        case MouseEditMode.grabBottom:
                            const scaleMouseYTranslation = Math.abs(this.endYFloat - .5);

                            WFloat = scale.xFloat !== 0 ? scale.xFloat : 1;
                            HFloat = NumberUtils.toRounded(2 * scaleMouseYTranslation, 4);
                            break;
                        case MouseEditMode.grabLeft:
                        case MouseEditMode.grabRight:
                            const scaleMouseXTranslation = Math.abs(this.endXFloat - .5);

                            WFloat = NumberUtils.toRounded(2 * scaleMouseXTranslation, 4);
                            HFloat = scale.yFloat !== 0 ? scale.yFloat : 1;
                            break;
                    }

                    XFloat = NumberUtils.toRounded(.5 - WFloat / 2, 4);
                    YFloat = NumberUtils.toRounded(.5 - HFloat / 2, 4);

                    rectProps = {
                        x: XFloat * 100,
                        y: YFloat * 100,
                        width: WFloat * 100,
                        height: HFloat * 100
                    };
                    break;
                case CropType.fit:
                    switch (this.mouseEditMode) {
                        case MouseEditMode.grabTop:
                        case MouseEditMode.grabBottom:
                            const fitMouseYTranslation = Math.abs(this.endYFloat - .5);

                            WFloat = fit.xFloat !== 0 ? fit.xFloat : 1;
                            HFloat = NumberUtils.toRounded(2 * fitMouseYTranslation, 4);
                            break;
                        case MouseEditMode.grabLeft:
                        case MouseEditMode.grabRight:
                            const fitMouseXTranslation = Math.abs(this.endXFloat - .5);

                            WFloat = NumberUtils.toRounded(2 * fitMouseXTranslation, 4);
                            HFloat = fit.yFloat !== 0 ? fit.yFloat : 1;
                            break;
                    }

                    XFloat = NumberUtils.toRounded(.5 - WFloat / 2, 4);
                    YFloat = NumberUtils.toRounded(.5 - HFloat / 2, 4);

                    rectProps = {
                        x: XFloat * 100,
                        y: YFloat * 100,
                        width: WFloat * 100,
                        height: HFloat * 100
                    };
                    break;
                case CropType.frame:
                    const frameMouseXTranslation = Math.abs(this.endXFloat - .5);
                    const frameMouseYTranslation = Math.abs(this.endYFloat - .5);

                    WFloat = NumberUtils.toRounded(2 * frameMouseXTranslation, 4);
                    HFloat = NumberUtils.toRounded(2 * frameMouseYTranslation, 4);

                    XFloat = NumberUtils.toRounded(.5 - WFloat / 2, 4);
                    YFloat = NumberUtils.toRounded(.5 - HFloat / 2, 4);

                    rectProps = {
                        x: XFloat * 100,
                        y: YFloat * 100,
                        width: WFloat * 100,
                        height: HFloat * 100
                    };
                    break;
                case CropType.box:
                    XFloat = this.startXFloat > this.endXFloat
                        ? this.endXFloat
                        : this.startXFloat;

                    YFloat = this.startYFloat > this.endYFloat
                        ? this.endYFloat
                        : this.startYFloat;

                    WFloat = NumberUtils.toRounded(Math.abs(this.endXFloat - this.startXFloat), 4);
                    HFloat = NumberUtils.toRounded(Math.abs(this.endYFloat - this.startYFloat), 4);

                    rectProps = {
                        x: XFloat * 100,
                        y: YFloat * 100,
                        width: WFloat * 100,
                        height: HFloat * 100
                    };
                    break;
                case CropType.zoom:
                    const mouseXTranslation = this.endXFloat - this.startXFloat;
                    const mouseYTranslation = this.endYFloat - this.startYFloat;

                    const sideFloat = Math.sqrt(2 * (mouseXTranslation * mouseXTranslation + mouseYTranslation * mouseYTranslation));

                    WFloat = NumberUtils.toRounded(sideFloat, 4);
                    HFloat = NumberUtils.toRounded(sideFloat, 4);

                    XFloat = NumberUtils.toRounded(this.startXFloat - sideFloat / 2, 4);
                    YFloat = NumberUtils.toRounded(this.startYFloat - sideFloat / 2, 4);

                    rectProps = {
                        x: XFloat * 100,
                        y: YFloat * 100,
                        width: WFloat * 100,
                        height: HFloat * 100
                    };
            }
        } else {
            switch (type) {
                case CropType.scale:
                    if (scale.yFloat > 0 && scale.xFloat > 0) {
                        rectProps = {
                            x: (.5 - scale.xFloat / 2) * 100,
                            y: (.5 - scale.yFloat / 2) * 100,
                            width: scale.xFloat * 100,
                            height: scale.yFloat * 100
                        };
                    } else {
                        rectProps = {
                            x: 0,
                            y: 0,
                            width: 100,
                            height: 100
                        };
                    }
                    break;
                case CropType.fit:
                    if (fit.yFloat > 0 && fit.xFloat > 0) {
                        rectProps = {
                            x: (.5 - fit.xFloat / 2) * 100,
                            y: (.5 - fit.yFloat / 2) * 100,
                            width: fit.xFloat * 100,
                            height: fit.yFloat * 100
                        };
                    } else {
                        rectProps = {
                            x: 0,
                            y: 0,
                            width: 100,
                            height: 100
                        };
                    }
                    break;
                case CropType.frame:
                    rectProps = {
                        x: (.5 - frame.wFloat / 2) * 100,
                        y: (.5 - frame.hFloat / 2) * 100,
                        width: frame.wFloat * 100,
                        height: frame.hFloat * 100
                    };
                    break;
                case CropType.box:
                    rectProps = {
                        x: box.xFloat * 100,
                        y: box.yFloat * 100,
                        width: box.wFloat * 100,
                        height: box.hFloat * 100
                    };
                    break;
                case CropType.zoom:
                    if (zoom.zFloat > 0) {
                        rectProps = {
                            x: (zoom.xFloat - 1 / (2 * zoom.zFloat)) * 100,
                            y: (zoom.yFloat - 1 / (2 * zoom.zFloat)) * 100,
                            width: 1 / zoom.zFloat * 100,
                            height: 1 / zoom.zFloat * 100
                        };
                    }
                    break;
            }
        }

        const rectPropsPercent = {
            x: `${rectProps.x}%`,
            y: `${rectProps.y}%`,
            width: `${rectProps.width}%`,
            height: `${rectProps.height}%`
        }

        let grabGroup: JSX.Element = <g />;

        if (this.mouseEditMode !== MouseEditMode.selecting && rectProps.width > 0 && rectProps.height > 0
            && (type === CropType.scale || type === CropType.fit)
        ) {
            const circle = (id: string, radius: number, cx: string, cy: string) => {
                return <circle
                    onMouseOut={e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    id={id}
                    className="grabCircle"
                />
            }

            grabGroup = (
                <g>
                    {circle("top", 15, `${rectProps.x + rectProps.width / 2}%`, rectPropsPercent.y)}
                    {circle("bottom", 15, `${rectProps.x + rectProps.width / 2}%`, `${rectProps.y + rectProps.height}%`)}
                    {circle("left", 15, rectPropsPercent.x, `${rectProps.y + rectProps.height / 2}%`)}
                    {circle("right", 15, `${rectProps.x + rectProps.width}%`, `${rectProps.y + rectProps.height / 2}%`)}
                </g>
            );
        }

        return (
            <svg>
                <defs>
                    <mask id="boxMask">
                        <rect
                            width="100%"
                            height="100%"
                            fill="white"
                        />
                        <rect
                            {...rectPropsPercent}
                            className="maskRect"
                        />
                    </mask>
                </defs>
                <rect
                    {...rectPropsPercent}
                    className="selectRect"
                />
                <rect
                    width="100%"
                    height="100%"
                    mask="url(#boxMask)"
                    className="outsideRect"
                />
                {grabGroup}
            </svg>
        );
    }

    renderInputs(crop: ICropTransform): React.ReactNode {
        const { type, scale, fit, frame, box, zoom } = crop;

        switch (type) {
            case CropType.scale:
                return (
                    <div className="fields" key={CropType.scale}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={scale.xFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                crop.scale.xFloat = value;
                                this.setTransform({ scale: crop.scale });
                                this.forceUpdate();
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={scale.yFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                crop.scale.yFloat = value;
                                this.setTransform({ scale: crop.scale })
                            }}
                        />
                    </div>
                );
            case CropType.fit:
                return (
                    <div className="fields" key={CropType.fit}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={fit.xFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                crop.fit.xFloat = value;
                                this.setTransform({ fit: crop.fit })
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={fit.yFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                crop.fit.yFloat = value;
                                this.setTransform({ fit: crop.fit })
                            }}
                        />
                    </div>
                );
            case CropType.frame:
                return (
                    <div className="fields" key={CropType.frame}>
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={frame.wFloat || null}
                            max={this.props.imageWidth}
                            tooltip="Width"
                            setValue={value => {
                                crop.frame.wFloat = value;
                                this.setTransform({ frame: crop.frame })
                            }}
                        />
                        <NumberInput
                            type={this.defaultNumberType}
                            allowedTypes={this.allowedNumberTypes}
                            value={frame.hFloat || null}
                            max={this.props.imageHeight}
                            tooltip="Height"
                            setValue={value => {
                                crop.frame.hFloat = value;
                                this.setTransform({ frame: crop.frame })
                            }}
                        />
                    </div>
                );
            case CropType.box:
                return (
                    <div className="fields vertical" key={CropType.box}>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={box.xFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Start X"
                                setValue={value => {
                                    crop.box.xFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={box.yFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Start Y"
                                setValue={value => {
                                    crop.box.yFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                        </div>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={box.wFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Width"
                                setValue={value => {
                                    crop.box.wFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={box.hFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Height"
                                setValue={value => {
                                    crop.box.hFloat = value;
                                    this.setTransform({ box: crop.box })
                                }}
                            />
                        </div>
                    </div>
                );
            case CropType.zoom:
                return (
                    <div className="fields vertical" key={CropType.zoom}>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={zoom.xFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Center X"
                                setValue={value => {
                                    crop.zoom.xFloat = value;
                                    this.setTransform({ zoom: crop.zoom })
                                }}
                            />
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={zoom.yFloat || null}
                                max={this.props.imageWidth}
                                tooltip="Center Y"
                                setValue={value => {
                                    crop.zoom.yFloat = value;
                                    this.setTransform({ zoom: crop.zoom })
                                }}
                            />
                        </div>
                        <div className="fieldsBlock">
                            <NumberInput
                                type={NumberInputType.float}
                                allowedTypes={[NumberInputType.float]}
                                value={zoom.zFloat || null}
                                max={100}
                                min={1}
                                tooltip="Zoom"
                                setValue={value => {
                                    crop.zoom.zFloat = value;
                                    this.setTransform({ zoom: crop.zoom })
                                }}
                            />
                        </div>
                    </div >
                );
        }
    }

    renderControls() {
        const crop = this.props.transform;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.box)}`}
                        onClick={() => this.setTransform({ type: CropType.box })}
                    >
                        Box
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.frame)}`}
                        onClick={() => this.setTransform({ type: CropType.frame })}
                    >
                        Frame
                    </button>

                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.zoom)}`}
                        onClick={() => this.setTransform({ type: CropType.zoom })}
                    >
                        Zoom
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.fit)}`}
                        onClick={() => this.setTransform({ type: CropType.fit })}
                    >
                        Fit
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.scale)}`}
                        onClick={() => this.setTransform({ type: CropType.scale })}
                    >
                        Scale
                    </button>
                </div>
                {this.renderInputs(crop)}
            </div>
        );
    }
}