import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class PostModel extends BaseModel {
  static tableName = "posts"

  static get relationMappings() {
    return {
      user: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "posts.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default PostModel
