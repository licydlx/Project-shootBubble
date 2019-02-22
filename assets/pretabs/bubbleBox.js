cc.Class({
    extends: cc.Component,

    properties: {
        axisOrigin: {
            default: new cc.Vec2(0, 0),
            displayName: '坐标轴原点'
        },

        axisUnitValue: {
            default: new cc.Vec2(0, 0),
            displayName: '坐标轴单位值'
        },

        axisWidth: {
            default: 3,
            type: cc.Integer,
            displayName: '坐标轴宽'
        },

        axisHeight: {
            default: 3,
            type: cc.Integer,
            displayName: '坐标轴高'
        },

        bubbleWidth: {
            default: 70,
            type: cc.Integer,
            displayName: '气球宽'
        },

        bubbleHight: {
            default: 70,
            type: cc.Integer,
            displayName: '气球高'
        },

        bubbles: {
            default: [],
            type: [cc.SpriteFrame],
            displayName: '气球图集'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        let bubbleSub = 0;
        for (let m = 0; m < this.axisWidth; m++) {
            for (let n = 0; n < this.axisHeight; n++) {
                let bubbleCoordinateX = this.axisOrigin.x + this.axisUnitValue.x * (m + 1);
                let bubbleCoordinateY = this.axisOrigin.y + this.axisUnitValue.y * (n + 1);
                let coordinateOrigin = cc.v2(bubbleCoordinateX, bubbleCoordinateY);

                let widthAndheight = cc.v2(this.bubbleWidth, this.bubbleHight);
                let bubbleSpriteFrame = this.bubbles[bubbleSub];

                this._createNode(coordinateOrigin, widthAndheight, bubbleSpriteFrame);
                bubbleSub++;
            }
        }

        // this.node.emit('bubbles-pars', JSON.stringify({ 'axisOrigin': this.axisOrigin, 'axisUnitValue': this.axisUnitValue }));

        let cee = new cc.Event.EventCustom('bubbles-pars', true);
        cee.setUserData({ 'axisOrigin': this.axisOrigin, 'axisUnitValue': this.axisUnitValue });
        this.node.dispatchEvent(cee);
    },

    _createNode(coordinateOrigin, widthAndheight, bubbleSpriteFrame) {
        let node = new cc.Node();
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = bubbleSpriteFrame;
        node.parent = this.node;

        node.setPosition(coordinateOrigin);
        node.width = widthAndheight.x;
        node.height = widthAndheight.y;

    }

    // update (dt) {},
});
