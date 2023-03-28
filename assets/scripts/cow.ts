import { _decorator, Component, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cows')
export class Cows {
    @property([SpriteFrame])
    public cows: [SpriteFrame];
}


@ccclass('CowsSet')
export class CowsSet extends Component {
    @property([Cows])
    public cow_sets: [Cows];

    public intervalTime: number;
    public randomType: number;

    onLoad () {
        this.intervalTime = 0; 
        this.randomType = Math.floor(Math.random()*3); 
    }

    start () {
    }

    update (dt: any) {
        this.intervalTime += dt; 
        let index = Math.floor(this.intervalTime / 0.2); 
        index = index%3; 
        let cowSet = this.cow_sets[this.randomType]; 
        let sprite = this.node.getComponent(Sprite); 
        sprite.spriteFrame = cowSet.cows[index]; 
    }

    runCallback () {
        this.randomType = Math.floor(Math.random()*3); 
    }

}
