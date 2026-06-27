import { _decorator, Component, director, game, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BootMain')
export class BootMain extends Component {
    protected onLoad() {
        // Set the frame rate to 120 FPS
        // This is important for smooth gameplay and animations
        game.frameRate = 120;

        director.loadScene('gameplay');
    }
}
