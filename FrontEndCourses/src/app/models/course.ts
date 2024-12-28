
export class Course {
  idCourse: number;
  courseName: string;
  price: number;
  imageUrl?: string;

  constructor(id: number, courseName: string, price: number, imageUrl: string) {
    this.idCourse = id;
    this.courseName = courseName;
    this.price = price;
    this.imageUrl = imageUrl;
  }
}
