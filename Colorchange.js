// Färg constructor function
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

// adderar metoder till Color prototype
Color.prototype.rgb = function() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
}

Color.prototype.hex = function() {
    let r = this.r.toString(16);
    let g = this.g.toString(16);
    let b = this.b.toString(16);

    if (r.length === 1) r = '0' + r;
    if (g.length === 1) g = '0' + g;
    if (b.length === 1) b = '0' + b;

    return `#${r}${g}${b}`;
}

Color.prototype.rgba = function(a) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
}

// Skapar ny Color object
let myColor = new Color(0, 255, 0);
console.log(myColor.rgb());
console.log(myColor.hex());
console.log(myColor.rgba(0.5)); 

// väljer element with the ID "color-div"
let element = document.getElementById("color-div");

// Kollar om elementet existerar
if(element){
    // sätter färg på bakgrunden
    element.style.backgroundColor = myColor.rgb();
}
