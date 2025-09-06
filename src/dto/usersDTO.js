// dto/userDto.js
class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}

module.exports = UserDTO;
