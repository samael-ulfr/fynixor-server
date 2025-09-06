class NoteDTO {
  constructor(note) {
  
    this.id = note._id;
    this.title = note.title;
    this.content = note.content;
    this.createdAt = note.createdAt;
    this.updatedAt = note.updatedAt;
  }
}

module.exports = NoteDTO;
