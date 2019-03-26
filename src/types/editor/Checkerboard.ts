export class Checkerboard {
    static checkboardCache: { [id: string]: any; } = {};

    protected static renderCheckerboard(whiteColor: string, greyColor: string, squareSize: number): string {
        const canvas = document.createElement("canvas");
        canvas.width = squareSize * 2;
        canvas.height = squareSize * 2;

        const twoDContext = canvas.getContext("2d");

        // If no context can be found, return early
        if (!twoDContext) {
            return "";
        }

        // Draw white everywhere
        twoDContext.fillStyle = whiteColor;
        twoDContext.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grey in top-left
        twoDContext.fillStyle = greyColor;
        twoDContext.fillRect(0, 0, squareSize, squareSize);

        // Draw grey in bottom right
        twoDContext.translate(squareSize, squareSize);
        twoDContext.fillRect(0, 0, squareSize, squareSize);

        return canvas.toDataURL();
    };

    static generate(whiteColor: string, greyColor: string, size: number): string {
        const key = `${whiteColor}-${greyColor}-${size}`;

        if (Checkerboard.checkboardCache[key]) {
            return Checkerboard.checkboardCache[key];
        }

        const checkerboard = Checkerboard.renderCheckerboard(whiteColor, greyColor, size);

        Checkerboard.checkboardCache[key] = checkerboard;

        return checkerboard;
    }
};