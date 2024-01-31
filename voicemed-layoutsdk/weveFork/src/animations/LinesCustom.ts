import {ILineOptions, IAnimation, FillOption, Glow} from "../types";
import {Shapes} from "../util/Shapes";
import {AudioData} from "../util/AudioData";


/**
 * @source
 */
export interface ILinesCustomOptions extends ILineOptions {
    count?: number;
    frequencyBand?: "base" | "lows" | "mids" | "highs";
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    center?: boolean;
    mirroredX?: boolean;
    mirroredY?: boolean;
}

/**
 * These are the options for the Lines animation [[ILinesOptions]]
 */
export class LinesCustom implements IAnimation {
    private _options: ILinesCustomOptions;

    constructor(options?: ILinesCustomOptions) {
        this._options = options ?? {};
    }

    public draw(audioBufferData: Uint8Array, canvas: CanvasRenderingContext2D): void {
        const {height, width} = canvas.canvas;
        const shapes = new Shapes(canvas);
        const audioData = new AudioData(audioBufferData);
        this._options = {
            count: 64,
            frequencyBand: "mids",
            ...this._options
        };

        if (this._options.frequencyBand) audioData.setFrequencyBand(this._options.frequencyBand);
        audioData.scaleData(Math.min(width, height));

        if (this._options?.mirroredX) {
            let n = 1;
            for (let i = Math.ceil(audioData.data.length / 2); i < audioData.data.length; i++) {
                audioData.data[i] = audioData.data[Math.ceil(audioData.data.length / 2) - n];
                n++;
            }
        }

        if (this._options?.top) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];

                let fromX = (width / this._options.count) * i;
                let fromY = 0;
                let toX = fromX;
                let toY = dataValue;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.right) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];

                let fromX = width;
                let fromY = (height / this._options.count) * i;
                let toX = width - dataValue;
                let toY = fromY;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.bottom || (!this._options?.top && !this._options?.right && !this._options?.left && !this._options?.center)) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];

                let fromX = (width / this._options.count) * i;
                let fromY = height;
                let toX = fromX;
                let toY = fromY - dataValue;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.left) {
            for (let i = 1; i <= this._options.count; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];

                let fromX = 0;
                let fromY = (height / this._options.count) * i;
                let toX = dataValue;
                let toY = fromY;

                shapes.line(fromX, fromY, toX, toY, this._options);
            }
        }

        if (this._options?.center) {
            let circleOptions = {
                fillColor: this._options.lineColor,
                lineColor: this._options.lineColor,
                lineWidth: 1
            };

            //Specchia i dati
            let halfWidth = (width / 2);
            let halfOptions = Math.ceil(this._options.count / 2) +1 ;
            let reverseCounter = halfOptions;

            let _upOptions = {
                lineColor:  this._options.lineColor,
                lineWidth: this._options.lineWidth,
                rounded: this._options.rounded
            }
            let _downOptions = {
                lineColor:  this._options.lineColor,
                lineWidth: this._options.lineWidth,
                rounded: this._options.rounded
            }
            let _upOptions2 = {
                lineColor:  this._options.lineColor,
                lineWidth: this._options.lineWidth,
                rounded: this._options.rounded
            }
            let _downOptions2 = {
                lineColor:  this._options.lineColor,
                lineWidth: this._options.lineWidth,
                rounded: this._options.rounded
            }
            /*
            _upOptions.lineColor = '#FF0000';
            _upOptions2.lineColor = '#FFFF00';
            _downOptions.lineColor = '#00FF00';
            _downOptions2.lineColor = '#FFA500';
             */
            const circleD = (this._options.lineWidth / 2) - 1;
            const singlePosition = halfWidth / halfOptions;


            for (let i = 1; i < halfOptions; i++) {
                let dataIndex = Math.floor(audioData.data.length / this._options.count) * i;
                let dataValue = audioData.data[dataIndex];
                //Primo blocco (nella metà a sinistra
                let fromX = singlePosition * (reverseCounter - i);
                let fromY = height / 2;
                let toX = fromX;
                let toY = fromY - dataValue;
                shapes.roundLine(fromX, fromY, toX, toY, _upOptions);
                shapes.circle(toX, toY, circleD, circleOptions);

                if (this._options?.mirroredY) {
                    fromX = singlePosition * (reverseCounter - i);
                    fromY = height / 2;
                    toX = fromX;
                    toY = fromY + dataValue;

                    shapes.roundLine(fromX, fromY, toX, toY, _downOptions);
                    shapes.circle(toX, toY, circleD, circleOptions);
                }
                //Secondo blocco:
                if (i === 1) {
                    fromX = halfWidth;
                } else {
                    fromX = halfWidth + (singlePosition * (i - 1));
                }

                //console.log('draw x', fromX,i)
                //console.log('ori draw x', _fromX)
                fromY = height / 2;
                toX = fromX;
                toY = fromY - dataValue;

                shapes.roundLine(fromX, fromY, toX, toY, _upOptions2);
                shapes.circle(toX, toY, circleD, circleOptions);

                if (this._options?.mirroredY) {
                    if (i == 1) {
                        fromX = halfWidth;
                    } else {
                        fromX = halfWidth + (singlePosition * (i - 1));
                    }
                    fromY = height / 2;
                    toX = fromX;
                    toY = fromY + dataValue;
                    shapes.roundLine(fromX, fromY, toX, toY, _downOptions2);
                    shapes.circle(toX, toY, circleD, circleOptions);
                }

            }
        }
    }
}

