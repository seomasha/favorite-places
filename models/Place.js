class Place{
    constructor(title, imageURL, address, location) {
        this.title = title;
        this.imageURL = imageURL;
        this.address = address;
        this.location = location;
        this.id = new Date().toString() + Math.random().toString() ;
    }
}