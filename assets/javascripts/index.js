cc.Class({
    extends: cc.Component,

    properties: {
        bubbleBox: {
            default: null,
            type: cc.Node
        },

        missile: {
            default: null,
            type: cc.Node
        },

        particle:{
            default: null,
            type: cc.Prefab  
        }

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        //console.log(this.bubbleBox);
        this.init();
    },

    init(){
        this.bubbleX = null;
        this.bubbleY = null;
        this.launchState = true;
        this.seq = null;
        this.cooArray = null;

        let tailNode = this.tailNode = this.missile.getChildByName('tail');
        this.tail = tailNode.getComponent(cc.MotionStreak);

        this.bubblePosArray = {};
        let cooArray = this.cooArray = ['11','12','13','21','22','23','31','32','33'];

        this.bubbleBox.children.forEach(function(value,index) {
            this.bubblePosArray[cooArray[index]] = cc.v2(value.x,value.y);
        }.bind(this));

        console.log(this.bubblePosArray);
    },

    start() {
        // TOUCH_START
        this.missile.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('TOUCH_START');
            let seq = this.bubbleX + '' + this.bubbleY;
            if(!this.bubblePosArray[seq]) return;
            if(!this.launchState) return;
            this.seq = seq;
            this._launchMissile(this.bubblePosArray[seq]);
            
        }, this);
        
    },

    // 发射导弹
    _launchMissile(bubblePos){

        this.launchState = false;
        // 导弹原始坐标
        let missilePos = this.missilePos = this.missile.getPosition();

        let topPos = cc.v2(missilePos.x, 240);
        let vector1 = topPos.sub(missilePos);
        let vector2 = topPos.sub(bubblePos);

        let action1 = cc.moveTo(1, topPos);
        action1.easing(cc.easeOut(1.0));

        let rad = vector1.angle(vector2);
        let deg = rad*180 / 3.1415;
        console.log(rad);
        console.log(deg);

        let action2 = cc.rotateTo(1, 180 - deg);

        let action3 = cc.moveTo(2, bubblePos);
        action3.easing(cc.easeIn(2.0));

        let action4 = cc.fadeOut(.3);

        let action5 = cc.callFunc(this._bigExplosion,this);

        let seq = cc.sequence(action1, action2,action3,action4,action5);

        this.missile.runAction(seq);
    },

    // 大爆炸
    _bigExplosion(){
        let bubbleSeq = null;

        this.cooArray.forEach(function(value,index){
            if(Object.is(value,this.seq))  bubbleSeq = index;
        }.bind(this));

        let curBubble = this.bubbleBox.children[bubbleSeq];

        let particle = cc.instantiate(this.particle);
        particle.parent = curBubble;

        let sprite = curBubble.getComponent(cc.Sprite);

        sprite.scheduleOnce(function() {
            // 这里的 this 指向 component
            console.log(this);
            this.enabled = false;
        }, 3);

        // 
        this.tail.fadeTime = 0;
        this.missile.setPosition(cc.v2(520,this.missilePos.y));
        this.missile.angle = 90;

        let action1 = cc.fadeIn();

        let action2 = cc.moveTo(3, this.missilePos);
        action2.easing(cc.easeIn(3.0));

        let action3 = cc.rotateTo(1.0, 0);

        let action4 = cc.callFunc(function(){
            this.tail.fadeTime = 0.2;
            this.launchState = true;
        }.bind(this),this);

        let seq = cc.sequence(action1, action2,action3,action4);
        this.missile.runAction(seq);
    },

    // 设置目标气球x坐标
    setBubbleX(text,event){
        this.bubbleX = text;
    },

    // 设置目标气球y坐标
    setBubbleY(text,event){
        this.bubbleY = text;
    },

    // update (dt) {},
});
