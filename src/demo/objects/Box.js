import Entity from "../../gameEngine/Entity";
import Body from "../../gameEngine/components/Body";
import Physics from "../../gameEngine/components/Physics";
import CollisionDetection from "../../gameEngine/components/CollisionDetection";
import React from "react";
import "../../style/Frame.css";
import ImageRender from "../../gameEngine/components/ImageRender";
import ResourceManager from "../../utils/ResourceManager";
import { isNullOrUndefined } from "util";
class Box {
  constructor(x, y, height, width) {
    this.entity = new Entity(
      "Ludum",
      new Body(this, x, y, height, width),
      new Physics(this, 0, 6),
      new CollisionDetection(this),
      null,
      null,
      new ImageRender(this, ResourceManager.getImagePath("merkid.png"))
    );
  }

  // entity method
  getCollisionDetection() {
    return this.entity.getCollisionDetection();
  }

  // entity method
  getEntity() {
    return this.entity;
  }

  // entity method
  getBody() {
    return this.entity.getBody();
  }

  // entity method
  getPhysics() {
    return this.entity.getPhysics();
  }

  // entity method
  getAudioManager() {
    return this.entity.getAudioManager();
  }

  // entity method
  getSprite() {
    return this.entity.getSprite();
  }

  // entity method
  update(value) {
    //if value is something else than null or undefined, it will be put into a switch
    if (!isNullOrUndefined(value)) {
      switch (value) {
        case "a":
          console.log("a");
          this.entity.body.left -= 100;
          break;
        case "d":
          console.log("d");
          this.entity.body.left += 100;
          break;
        default:
          break;
      }
    }
    // updating this.entity
    this.entity.update();
  }

  // entity method
  getEntityProps() {
    return this.entity.getEntityProps();
  }

  getImage() {
    return this.entity.getImage();
  }
  // rendering this class
  render() {
    return <span className="frame">{this.getImage().render()}</span>;
  }
}

export default Box;
