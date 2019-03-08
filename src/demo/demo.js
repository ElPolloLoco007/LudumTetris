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
    var playerArr;
    playerArr = [
      new Box(302, 2, 100, 100),
      new HorizontalWall(0, 1024, -1, 640),
      new HorizontalWall(0, 0, 1, 640),
      new VerticalWall(640, 0, 1024, -1),
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
      playerArr: playerArr.slice(),
      backgroundColor: "rgb(200,200,200)",
      now: 0,
      then: Date.now(),
      interval: 1000 / 60,
      delta: 0,
      activeBrick: 0,
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
      let player = this.state.playerArr[this.state.activeBrick];

      // only checking if player has collided with walls
      for (let index = 0; index < this.state.playerArr.length; index++) {
        if (index === this.state.activeBrick) {
          continue;
        }

        if (this.state.activeBrick === 0 && player.entity.body.top === 2) {
          console.log("sadffdsfdsfdsfds");
          let hey = new AudioManager(
            ResourceMangaer.getAudioPath("backgroundnoise.mp3")
          );
          hey.play(0);
          continue;
        }

        let hasPlayerCollided = player
          .getCollisionDetection()
          .checkForCollision(this.state.playerArr[index].getEntity());

        // if a collision is detected, checkForCollision() returns true
        if (hasPlayerCollided === true) {
          let backgroundIndex = Math.floor(0 + Math.random() * 5);
          let name = this.state.backgroundArr[backgroundIndex];
          let placeholder = this.state.playerArr;

          this.setState({ background: name });
          placeholder[this.state.activeBrick].getPhysics().setTop(0);
          // if (
          //   this.state.playerArr[index].getEntity().name === "horizontal wall"
          // ) {
          //   this.setState({ background: name });
          //   placeholder[this.state.activeBrick].getPhysics().setTop(0);
          // }

          let newBrick = new Box(2 + 100 * backgroundIndex, 3, 100, 100);
          let idx =
            this.state.activeBrick === 0 ? 5 : this.state.activeBrick + 1;

          this.setState(prevState => ({
            playerArr: [...prevState.playerArr, newBrick],
            activeBrick: idx
          }));
          index = this.state.playerArr.length + 3;
        }
      }
      // updating every player
      this.state.playerArr.forEach(element => {
        element.update();
      });
    }
    requestAnimationFrame(this.gameLoop);
  };

  // returning all the objects of the playerArr
  getObjects = () => {
    return this.state.playerArr.map(object => {
      return object.render();
    });
  };

  render() {
    var scalability = {
      backgroundImage: `url(${this.state.background})`,
      position: "absolute",
      width: 640,
      height: 1024,
      overflow: "hidden"
    };
    return (
      <div style={scalability}>
        <HUD score={"Vælkomin til TETRIS"} position={"tlc"} />
        {this.getObjects()}
      </div>
    );
  }
}

export default Demo;
