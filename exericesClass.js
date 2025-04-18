// Exercise: Create a Square class that inherits from the 
// Rectangle class we created before. Do not modify the existing 
// Rectangle class

class Rectangle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
    getArea() {
      return this.width * this.height;
    }
    getPerimeter() {
      return 2 * (this.width + this.height);
    }
  }
  
  class Square extends Rectangle {
    constructor(side) {
      super(side, side);
    }
  }
  
  
  const smallSquare = new Square(2)
  const smallRectangle = new Rectangle(2, 7);
  const bigRectangle = new Rectangle(15, 20);
  
  console.log(smallRectangle.getArea()); // 14
  console.log(bigRectangle.getArea()); // 300
  console.log(smallSquare.getPerimeter()); // 8
  