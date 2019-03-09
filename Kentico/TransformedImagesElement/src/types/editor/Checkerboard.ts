export class Checkerboard {
    static checkboardCache: { [id: string]: any; } = {};

    protected static renderCheckerboard(c1: string, c2: string, size: number): string {
        const canvas = document.createElement('canvas')
        canvas.width = size * 2
        canvas.height = size * 2

        const ctx = canvas.getContext('2d');

        // If no context can be found, return early.
        if (!ctx) {
            return null
        }
        ctx.fillStyle = c1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = c2;
        ctx.fillRect(0, 0, size, size);
        ctx.translate(size, size);
        ctx.fillRect(0, 0, size, size);

        return canvas.toDataURL();
    };

    static getCheckerBoard(c1: string, c2: string, size: number): string {
        const key = `${c1}-${c2}-${size}`;

        const checkerboard = Checkerboard.renderCheckerboard(c1, c2, size);

        if (Checkerboard.checkboardCache[key]) {
            return Checkerboard.checkboardCache[key];
        }

        Checkerboard.checkboardCache[key] = checkerboard;

        return checkerboard;
    }
};