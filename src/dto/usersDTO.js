// dto/userDTO.js
class UserDTO {
  constructor({ _id, name, email, createdAt, updatedAt }) {
    this.id = _id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    // Exclude password
  }
}

module.exports = UserDTO;
