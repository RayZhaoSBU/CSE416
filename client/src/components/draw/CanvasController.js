import drawTransaction from "./drawTransaction"

class CanvasController {
    constructor(view) {
        this.tool = null
        this.fillStyle = ''
        this.drawing = false
        this.view = view
        this.ctx = view.ctx
    }

    setDimension = (width, height) => {
        this.width = width
        this.height = height
    }


    initDraw = (tool, lineWidth, fillStyle, strokeStyle) => {
        this.tool = tool
        this.ctx.lineWidth = lineWidth
        this.ctx.fillStyle = `rgba(${fillStyle.r}, ${fillStyle.g}, ${fillStyle.b}, ${fillStyle.a})`
        this.ctx.strokeStyle = `rgba(${strokeStyle.r}, ${strokeStyle.g}, ${strokeStyle.b}, ${strokeStyle.a})`
    }

    startDraw = (x, y) => {
        if (this[this.tool] === undefined) return
        this.drawing = true
        this.oldImg = this.view.refs.canvas.toDataURL('image/jpeg', 1)
        this[this.tool].startDraw(x, y)
    }

    onDraw = (x, y) => {
        if (this[this.tool] === undefined) return
        if (!this.drawing) return
        this[this.tool].onDraw(x, y)
    }

    endDraw = (x, y) => {
        if (this[this.tool] === undefined) return
        if (!this.drawing) return
        this[this.tool].endDraw(x, y)
        this.drawing = false

        this.newImg = this.view.refs.canvas.toDataURL('image/jpeg', 1)
        this.view.props.socket.emit('draw', { data: this.newImg, type: 'new' })
        this.view.props.transactions.addTransaction(new drawTransaction(this.oldImg, this.newImg, this.view.drawImage))
    }

    PENCIL = {
        startDraw: (x, y) => {
            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
        },

        onDraw: (x, y) => {
            this.ctx.lineTo(x, y)
            this.ctx.lineWidth = this.lineWidth
            this.ctx.lineCap = 'round'
            this.ctx.stroke()
        },

        endDraw: (x, y) => {
            this.onDraw(x, y)
        },
    }

    LINE = {
        startDraw: (x, y) => {
            this.startX = x
            this.startY = y
            this.startData = this.ctx.getImageData(0, 0, this.width, this.height);
        },
        onDraw: (x, y) => {
            if (!this.startX || !this.startY) return
            this.ctx.putImageData(this.startData, 0, 0);
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
            this.ctx.lineTo(x, y)
            this.ctx.lineCap = 'round'
            this.ctx.stroke()
        },
        endDraw: (x, y) => {
            this.onDraw(x, y)
            this.startX = null
            this.startY = null
        },
    }

    SQUARE = {
        startDraw: (x, y) => {
            this.startX = x
            this.startY = y
            this.startData = this.ctx.getImageData(0, 0, this.width, this.height);
        },
        onDraw: (x, y) => {
            if (!this.startX || !this.startY) return
            this.ctx.putImageData(this.startData, 0, 0);
            this.ctx.beginPath();
            this.ctx.rect(this.startX, this.startY, x - this.startX, y - this.startY);
            this.ctx.fill()
            this.ctx.stroke();
        },
        endDraw: (x, y) => {
            this.onDraw(x, y)
            this.startX = null
            this.startY = null
        }
    }

    CIRCLE = {
        startDraw: (x, y) => {
            this.startX = x
            this.startY = y
            this.startData = this.ctx.getImageData(0, 0, this.width, this.height);
        },
        onDraw: (x, y) => {
            if (!this.startX || !this.startY) return
            this.ctx.putImageData(this.startData, 0, 0);
            const centerX = (x + this.startX) / 2
            const centerY = (y + this.startY) / 2
            const radiusX = Math.abs(x - this.startX) / 2
            const radiusY = Math.abs(y - this.startY) / 2
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke();
        },
        endDraw: (x, y) => {
            this.onDraw(x, y)
            this.startX = null
            this.startY = null
        }
    }

    CROP = {
        startDraw: (x, y) => {
            this.ctx.lineWidth = 1
            this.ctx.fillStyle = `rgba(0,0,0,0)`
            this.ctx.strokeStyle = `rgba({0,0,0,1}})`
            this.ctx.setLineDash([6]);

            this.startX = x
            this.startY = y
            this.CROP.endCrop();
            this.startData = this.ctx.getImageData(0, 0, this.width, this.height);
        },
        onDraw: (x, y) => {
            if (!this.startX || !this.startY) return
            this.ctx.putImageData(this.startData, 0, 0);
            this.ctx.beginPath();
            this.ctx.setLineDash([6]);
            this.ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
            this.ctx.fill()
            this.ctx.stroke();
        },
        endDraw: (x, y) => {

            if (!this.startX || !this.startY) return

            this.ctx.putImageData(this.startData, 0, 0)

            this.left = this.startX < x ? this.startX : x
            this.top = this.startY < y ? this.startY : y
            this.cropWidth = Math.abs(this.startX - x)
            this.cropHeight = Math.abs(this.startY - y)
            this.croppedArea = this.ctx.getImageData(this.left, this.top, this.cropWidth, this.cropHeight)
            this.startX = null
            this.startY = null
        },
        getCroppedData: () => {
            return {
                imgData: this.croppedArea,
                left: this.left,
                top: this.top,
                width: this.cropWidth,
                height: this.cropHeight,
            }
        },
        endCrop: () => {
            this.croppedArea = null
            this.cropWidth = null
            this.cropHeight = null
            this.left = null
            this.top = null
        },

        reCrop: (data) => {
            const { left, top, width, height } = data
            return this.ctx.getImageData(left, top, width, height)

        }
    }
}
export default CanvasController
