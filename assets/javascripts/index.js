cc.Class({
    extends: cc.Component,

    // 属性
    properties: {

        missile: {
            default: null,
            type: cc.Node,
            displayName: '导弹'
        },

        bubbleBox: {
            default: null,
            type: cc.Node,
            displayName: '气球盒'
        },

        winGame:{
            default: null,
            type: cc.Node,
            displayName: '胜利'
        },

        combustion: {
            default: null,
            type: cc.Prefab,
            displayName: '燃烧'
        }

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        // axisOrigin：坐标轴原点；axisUnitValue：坐标轴单位值；
        this.node.on('bubbles-pars', function (event) {
            this.axisOrigin = event.detail.axisOrigin;
            this.axisUnitValue = event.detail.axisUnitValue;
        }.bind(this));

        // 导弹小尾巴
        this.tail = this.missile.getChildByName('tail').getComponent(cc.MotionStreak);

        // 导弹发射程式装载
        this.missile.on(cc.Node.EventType.TOUCH_START, this._launchMissile, this);

        this.init();
    },

    init() {
        // 所选气球坐标轴
        this.bubbleX = null;
        this.bubbleY = null;

        // 导弹是否已发射
        this.launchState = false;

        // 导弹原始坐标
        this.missilePos = cc.v2(360, -60);

        // 设置标语位置
        this.winGame.setPosition(0,500);

        // 显示所有气球
        this._showAllBubble();
    },

    _showAllBubble(){
        let bubbles = this.bubbleBox.children;
        for (let m = 0; m < bubbles.length; m++) {
            let curBubble = bubbles[m];
            let sprite = curBubble.getComponent(cc.Sprite);
            if(!sprite.enabled){
                sprite.enabled = true;
            }
        }
    },

    // 发射导弹
    _launchMissile(event) {
        if (this.launchState) return;
        if (!this.bubbleX || !this.bubbleY) return;
        this.launchState = true;

        // 被追踪气球坐标
        let bubblePosX = this.axisOrigin.x + this.axisUnitValue.x * this.bubbleX;
        let bubblePosY = this.axisOrigin.y + this.axisUnitValue.y * this.bubbleY;
        let bubblePos = cc.v2(bubblePosX, bubblePosY);

        // 导弹最高点坐标
        let topPos = cc.v2(this.missilePos.x, 240);

        let pos1 = topPos.sub(this.missilePos);
        let pos2 = topPos.sub(bubblePos);

        // 导弹旋转角度
        let deg = pos1.angle(pos2) * 180 / 3.1415;

        // 轨迹动画
        let action1 = cc.moveTo(.6, topPos);
        action1.easing(cc.easeOut(.6));

        let action2 = cc.rotateTo(.6, 180 - deg);

        let action3 = cc.moveTo(1.2, bubblePos);
        action3.easing(cc.easeIn(1.2));

        let action4 = cc.fadeOut(.3);

        let action5 = cc.callFunc(this._bigExplosion, this, this._getBubble());

        let All = cc.sequence(action1, action2, action3, action4, action5);

        this.missile.runAction(All);
    },

    _getBubble() {
        let bubbles = this.bubbleBox.children;
        let sub = (this.bubbleX - 1) * 3 + (this.bubbleY - 1) * 1;
        return bubbles[sub];
    },

    // 大爆炸
    _bigExplosion(event, curBubble) {
        let combustion = cc.instantiate(this.combustion);
        combustion.parent = curBubble;

        let sprite = curBubble.getComponent(cc.Sprite);
        sprite.scheduleOnce(function () {
            sprite.enabled = false;

            let bubbles = this.bubbleBox.children;
            let result = bubbles.some(function (item,index) {
                let sprite = item.getComponent(cc.Sprite);
                return sprite.enabled == true;
            });

            if(!result) this._winGame();
        }.bind(this), 3);

        this._fillingMissile();
    },

    // 游戏胜利
    _winGame(){
        console.log('太厉害了！！');
        this.winGame.setPosition(0,0);
    },

    // 装填导弹
    _fillingMissile() {
        this.tail.fadeTime = 0;
        let action1 = cc.moveTo(.1, cc.v2(520, this.missilePos.y));
        let action2 = cc.rotateTo(.1, 90);
        let action3 = cc.fadeIn();
        let action4 = cc.moveTo(3, this.missilePos);
        action4.easing(cc.easeIn(3.0));
        let action5 = cc.rotateTo(1.0, 0);

        let action6 = cc.callFunc(function () {
            this.tail.fadeTime = 0.2;
            // 导弹装填完成，待发射
            this.launchState = false;
        }.bind(this), this);

        let All = cc.sequence(action1, action2, action3, action4, action5, action6);
        this.missile.runAction(All);
    },

    // 设置目标气球x坐标
    setBubbleX(text, event) {
        if(text > 3 || text < 1) return;
        this.bubbleX = text;
    },

    // 设置目标气球y坐标
    setBubbleY(text, event) {
        if(text > 3 || text < 1) return;
        this.bubbleY = text;
    },

    // update (dt) {},
});
