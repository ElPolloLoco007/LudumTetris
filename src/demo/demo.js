import React, { Component } from "react";
import "../style/App.css";
import Box from "./objects/Box";
import HorizontalWall from "./objects/HorizontalWall";
import VerticalWall from "./objects/VerticalWall";
import ResourceMangaer from "../utils/ResourceManager";
import HUD from "../utils/Hud";
import AudioManager from "../gameEngine/components/AudioManager";

class Demo extends Component {
  constructor(props) {
    super(props);
    var entityArr;
    entityArr = [
      new Box(302, 2, 100, 100),
      new HorizontalWall(0, 1024, -1, 603),
      new HorizontalWall(0, 0, 1, 603),
      new VerticalWall(603, 0, 1024, -1),
      new VerticalWall(0, 0, 1024, 1)
    ];
    let backgroundArr = [
      ResourceMangaer.getImagePath("p1.jpg"),
      ResourceMangaer.getImagePath("p2.jpg"),
      ResourceMangaer.getImagePath("p3.jpg"),
      ResourceMangaer.getImagePath("p4.jpg"),
      ResourceMangaer.getImagePath("p5.jpg"),
      ResourceMangaer.getImagePath("p6.jpg")
    ];

    this.state = {
      entityArr: entityArr.slice(),
      now: 0,
      then: Date.now(),
      interval: 1000 / 60,
      delta: 0,
      activeBrick: 0,
      input: "default",
      keyPressed: false,
      backgroundArr: backgroundArr,
      background: ResourceMangaer.getImagePath("p6.jpg")
    };
    requestAnimationFrame(this.gameLoop);
  }

  gameLoop = () => {
    let now = Date.now();
    let then = this.state.then;
    let interval = this.state.interval;
    let delta = this.state.delta;

    delta = now - then;

    // restricting fps
    if (delta > interval) {
      then = now - (delta % interval);
      this.setState({ then: then });

      // checking for collision
      let player = this.state.entityArr[this.state.activeBrick];

      // only checking if player has collided with objects
      for (let index = 0; index < this.state.entityArr.length; index++) {
        // skippa fyrstu itteration
        if (index === this.state.activeBrick) {
          continue;
        }

        // spæla ljóð
        if (this.state.activeBrick === 0 && player.entity.body.top === 2) {
          let hey = new AudioManager(
            ResourceMangaer.getAudioPath("backgroundnoise.mp3")
          );
          hey.play(0);
          continue;
        }

        let hasPlayerCollided = player
          .getCollisionDetection()
          .checkForCollision(this.state.entityArr[index].getEntity());

        // if a collision is detected, checkForCollision() returns true
        if (hasPlayerCollided === true) {
          let backgroundIndex = Math.floor(0 + Math.random() * 5);
          let brickIndex = Math.floor(0 + Math.random() * 6);
          let name = this.state.backgroundArr[backgroundIndex];
          let placeholder = this.state.entityArr;

          // broyt bakgrund, og steðga klossan
          this.setState({ background: name });
          placeholder[this.state.activeBrick].getPhysics().setTop(0);

          // legg nýggjan klossa avtrat
          let newBrick = new Box(2 + 100 * brickIndex, 3, 100, 100);
          let idx =
            this.state.activeBrick === 0 ? 5 : this.state.activeBrick + 1;

          this.setState(prevState => ({
            entityArr: [...prevState.entityArr, newBrick],
            activeBrick: idx
          }));
          index = this.state.entityArr.length + 3;
        }
      }

      // updatera brúkara input
      if (this.state.keyPressed === true) {
        if (
          player.getBody().getLeft() < 504 &&
          player.getBody().getLeft() > 0
        ) {
          player.update(this.state.input);
          this.setState({ keyPressed: false });
        }
      }
      // updating every entity
      this.state.entityArr.forEach(element => {
        element.update();
      });
    }
    requestAnimationFrame(this.gameLoop);
  };

  // returning all the objects of the entityArr
  getObjects = () => {
    return this.state.entityArr.map(object => {
      return object.render();
    });
  };
  getInput = e => {
    this.setState({ input: e.key, keyPressed: true });
  };
  render() {
    var scalability = {
      backgroundImage: `url(${this.state.background})`,
      position: "absolute",
      width: 603,
      height: 1024,
      overflow: "hidden"
    };
    return (
      <div style={scalability}>
        <div onKeyDown={e => this.getInput(e)} tabIndex="0">
          <HUD score={"Vælkomin til TETRIS"} position={"tlc"} />
          {this.getObjects()}
        </div>
      </div>
    );
  }
}

export default Demo;
