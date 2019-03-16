export class Color {
    argb: {
        a: number,
        r: number,
        g: number,
        b: number
    }

    constructor(rgba: { r: number, g: number, b: number, a?: number }) {
        this.argb = {
            a: this.toRounded(rgba.a) || 255,
            r: this.toRounded(rgba.r) || 0,
            g: this.toRounded(rgba.g) || 0,
            b: this.toRounded(rgba.b) || 0
        };
    }

    private toHex = (value: number) => value.toString(16).padStart(2, "0");

    private isOneLetterHex = (value: number) => (value || 0) % 17 === 0;

    protected toRounded = (value: number, decimals: number = 0) => Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);

    isEmpty(): boolean {
        const { a, r, g, b } = this.argb;
        return (a === 0 || a === 255)
            && r === 0
            && g === 0
            && b === 0;
    }

    toHexArray(): string[] {
        if (this.isEmpty()) {
            return ["", "", "", ""];
        }

        const { a, r, g, b } = this.argb;

        let aHex = this.toHex(a);
        const rHex = this.toHex(r);
        const gHex = this.toHex(g);
        const bHex = this.toHex(b);

        if (a === 0 || a === 255) {
            aHex = "";
        }

        return [aHex, rHex, gHex, bHex];
    }

    toHexString(): string {
        return this.toHexArray().join("");
    }

    toShortHexArray(): string[] {
        if (this.isEmpty()) {
            return ["", "", "", ""];
        }

        const { a, r, g, b } = this.argb;

        if (this.isOneLetterHex(a)
            && this.isOneLetterHex(r)
            && this.isOneLetterHex(g)
            && this.isOneLetterHex(b)
        ) {
            let aHex = this.toHex(a / 17);
            const rHex = this.toHex(r / 17);
            const gHex = this.toHex(g / 17);
            const bHex = this.toHex(b / 17);

            if (a === 0 || a === 255) {
                aHex = "";
            }

            return [aHex, rHex, gHex, bHex];
        }

        return this.toHexArray();
    }

    toShortHexString(): string {
        return this.toShortHexArray().join("");
    }

    toCssRgba(): string {
        const { a, r, g, b } = this.argb;

        return `rgba(${r},${g},${b},${a === 0 ? 1 : this.toRounded(a / 255, 4)})`;
    }

    toRgb() {
        return {
            r: this.argb.r,
            g: this.argb.g,
            b: this.argb.b
        }
    }

    toPickerFormat() {
        return {
            a: this.toRounded(this.argb.a / 255, 4),
            r: this.argb.r,
            g: this.argb.g,
            b: this.argb.b
        }
    }

    static fromHex(value: string): Color {
        const doubleCharacter = (c: string) => c + c;

        if (value.length === 3) {
            value = `0${value}`;
        }

        if (value.length === 4) {
            value = [...value].map(doubleCharacter).join("");
        }

        if (value.length === 6) {
            value = `00${value}`;
        }

        let a = Number(`0x${value.slice(0, 2)}`) || 0;
        const r = Number(`0x${value.slice(2, 4)}`) || 0;
        const g = Number(`0x${value.slice(4, 6)}`) || 0;
        const b = Number(`0x${value.slice(6, 8)}`) || 0;

        return new Color({ r, g, b, a });
    };
}