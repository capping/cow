/**
*  捕获按钮点击事件
* @param event
* @param customEventDate
*/
import { _decorator, Component, Node, tween, Vec3, SpriteFrame, Sprite, instantiate, Prefab, find, Label, log, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node)
    public rope_node;

    @property(Node)
    public cow_ins;

    @property([SpriteFrame])
    public rope_imgs;

    @property(Prefab)
    public cow_prefab;

    public scoreNum: number;
    public time: number;

    onLoad () {
        this.scoreNum = 0; 
        this.time = 30;
    }

    start () {
            console.log("Start method called for node:", this.node.name);
            const countDownLabel = find("Canvas/bg_sprite/count_down").getComponent(Label); 
            countDownLabel.string = this.time + "s"; 
            // 每秒调度一次
            this.schedule(() => {
                this.time--;
                countDownLabel.string = this.time + "s";
                if (this.time <= 0) {
                    log("游戏结束");
                    log("Current timestamp:", Date.now());
                    const resultNode = find("Canvas/result");
                    // 分数显示
                    const titleNode = resultNode.getChildByName("title");
                    titleNode.getComponent(Label).string = "最终得分: " + this.scoreNum;
                    // 根据分数评级
                    const contentNode = resultNode.getChildByName("content");
                    const contentLabel = contentNode.getComponent(Label);
                    switch (true) {
                        case this.scoreNum <= 2:
                            contentLabel.string = "套牛青铜";
                            break;
                        case this.scoreNum < 6:
                            contentLabel.string = "套牛高手";
                            break;
                        case this.scoreNum >= 6:
                            contentLabel.string = "套牛王者";
                            break;
                    }
                    resultNode.active = true;
                    director.pause();
                }
            }, 1.0);
    }

    clickCapture (event: any, customEventDate: any) {
            this.rope_node.active = true;
            // 当前绳子在父节点的顺序
            this.rope_node.setSiblingIndex(100);

            const moveAction = tween(this.rope_node).to(0.5, {position: new Vec3(0, 70, 0)}).call(() => {
                const cow_position = this.cow_ins.getPosition();
                const cow_x = cow_position.x;
                const cow_y = cow_position.y;
                if (cow_x >= -100 && cow_x <= 100) {
                    console.log("捕捉成功");
                    // 移除
                    const bg_node = this.node.getChildByName("bg_sprite");
                    bg_node.removeChild(this.cow_ins);
                    // 更换绳子
                    const ropeType = this.cow_ins.getComponent("CowsSet").randomType + 1;
                    this.rope_node.getComponent(Sprite).spriteFrame = this.rope_imgs[ropeType];

                    // 生成新的牛节点
                    this.cow_ins = instantiate(this.cow_prefab);
                    bg_node.addChild(this.cow_ins);

                    this.scoreNum++;
                    console.log("score:" + this.scoreNum);
                } else {
                    console.log("捕捉失败");
                }
            }).to(0.5, {position: new Vec3(0, -540, 0)}).call(() => {
                console.log("收回绳子");
                this.rope_node.getComponent(Sprite).spriteFrame = this.rope_imgs[0];
                const scoreLabel = find("Canvas/bg_sprite/score").getComponent(Label);
                scoreLabel.string = "Score:" + this.scoreNum;
            });
            
            moveAction.start();
    }

    closeBtn () {
        log("继续游戏"); 
        director.resume(); 
        director.loadScene("scene"); 
    }
}
