import BaseModel from "./BaseModel.js"
import PostModel from "./PostModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static get relationMappings() {
    return {
      post: {
        modelClass: PostModel,
        relation: BaseModel.HasManyRelation,
        join: {
          from: "users.id",
          to: "posts.userId",
        },
      },
    }
  }
}

export default UserModel
