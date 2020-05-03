export default class ImageController {
    constructor(ctx, width, height, gridWidth, gridHeight) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.helper = document.createElement("CANVAS");
        this.initHelper(width, height)
    }

    initHelper = (width, height) => {
        this.helper.width = width
        this.helper.height = height
        this.helperctx = this.helper.getContext('2d')
    }


    drawToGrid = (src, gridPositions) => {
        this.drawImageHelper(src, this.width, this.height, () => {
            const imageData = this.getImageDataFromHelper()
            for (let i = 0; i < gridPositions.length; i++)
                this.ctx.putImageData(
                    imageData,
                    0, 0,
                    gridPositions[i].x,
                    gridPositions[i].y,
                    this.gridWidth,
                    this.gridHeight
                )
        })
    }


    drawImage = (src, callback) => {
        let img = new Image()
        img.src = src
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0)
            if (callback) callback()
        }
    }

    drawImageHelper = (src, width, height, callback) => {
        let img = new Image()
        img.src = src
        img.onload = () => {
            this.helperctx.drawImage(img, 0, 0)
            this.helperImageData = this.helperctx.getImageData(0, 0, width, height)
            if (callback) callback()
        }
    }

    getImageDataFromHelper = () => {
        return this.helperImageData
    }

    handleHorizontalFlip = (callback) => {
        const imgSrc = this.ctx.canvas.toDataURL('image/jpeg', 1)
        this.ctx.scale(-1, 1)
        this.ctx.translate(-this.width, 0);
        this.drawImage(imgSrc, () => {
            this.ctx.scale(-1, 1)
            this.ctx.translate(-this.width, 0);
            if (callback) callback()
        })
    }

    handleVerticalFlip = (callback) => {
        const imgSrc = this.ctx.canvas.toDataURL('image/jpeg', 1)
        this.ctx.scale(1, -1)
        this.ctx.translate(0, -this.height);
        this.drawImage(imgSrc, () => {
            this.ctx.scale(1, -1)
            this.ctx.translate(0, -this.height);
            if (callback) callback()
        })
    }

    handleSelectedHorizontalFlip = (dimension) => {
        const { left, top, width, height } = dimension
        this.initHelper(width, height)

        const imageData = this.ctx.getImageData(left, top, width, height)
        this.helperctx.putImageData(imageData, 0, 0)

        const imgSrc = this.helperctx.canvas.toDataURL('image/jpeg', 1)
        this.helperctx.scale(-1, 1)
        this.helperctx.translate(-width, 0)
        this.drawImageHelper(imgSrc, width, height, () => {
            this.helperctx.scale(-1, 1)
            this.helperctx.translate(-width, 0)
            this.ctx.putImageData(this.helperImageData, left, top)
        })
    }

    handleSelectedVerticalFlip = (dimension) => {
        const { left, top, width, height } = dimension
        this.initHelper(width, height)

        const imageData = this.ctx.getImageData(left, top, width, height)
        this.helperctx.putImageData(imageData, 0, 0)

        const imgSrc = this.helperctx.canvas.toDataURL('image/jpeg', 1)
        this.helperctx.scale(1, -1)
        this.helperctx.translate(0, -height)
        this.drawImageHelper(imgSrc, width, height, () => {
            this.helperctx.scale(1, -1)
            this.helperctx.translate(0, -height)
            this.ctx.putImageData(this.helperImageData, left, top)
        })
    }

    GetDataFromGrids = (grids) => {
        for (let i = 0; i < grids.length; i++) {
            const { x, y } = grids[i]
            const imgData = this.ctx.getImageData(x, y, this.gridWidth, this.gridHeight)
            grids[i].imgData = imgData
        }
        return grids

    }
}


export const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}