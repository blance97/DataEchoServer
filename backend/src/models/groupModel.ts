class GroupModel {
    id?: number;
    name: string;
    description: string;

    constructor(name: string, description: string,id?: number,) {
        this.id = id;
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
  