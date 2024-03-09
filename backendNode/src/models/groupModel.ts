class GroupModel {
    name: string;
    description: string;

    constructor(name: string, description: string) {
      this.name = name;
      this.description = description;
    }
    
    // You can add methods to the model if needed
    // For example, a method to validate the group data
    isValid(): boolean {
      return !(!this.name || !this.description);
    }
  }

  export default GroupModel;
  