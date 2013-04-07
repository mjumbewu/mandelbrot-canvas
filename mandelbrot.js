var Mandelbrot = {};

/*
 * Patch ImageData to be able to set pixel colors by coordinate
 */
ImageData.prototype.setPixel = function(x, y, color) {
  var pixel = (x + y * this.width) * 4;
  this.data[pixel + 0] = color[0];
  this.data[pixel + 1] = color[1];
  this.data[pixel + 2] = color[2];
  this.data[pixel + 3] = color[3];
  return this;
};

(function(M) {
  var colorCache = {};

  /*
   * Get the number of iterations that the function goes through
   * before repeating. Will be between 1 and 256.
   */
  M.getIterationCount = function(c) {
    var z = new Complex(0), zStr,
        history = {0: true},
        iterations;

    for (iterations = 0; iterations < 256; ++iterations) {
      z = z.times(z).plus(c);
      zStr = z.toString();
      if (history[zStr]) break;
      history[zStr] = true;
    }

    return iterations;
  };

  /*
   * Get the color that corresponds to a particular iteration count
   */
  M.getColor = function(iterations) {
    var value = iterations - 1;
    return [value, value, value, 255];  // Grayscale

//    var value = iterations - 1,
//        color = colorCache[value];
//    if (color === undefined) {
//      var hue = (value) / 255.0,
//          rgb = hsvToRgb(hue, 1.0, 1.0);
//      color = colorCache[iterations] = [rgb[0], rgb[1], rgb[2], 255];
//    }
//    return color;
  };

  /*
   * Draw the Mandelbrot set between the given complex numbers, where the
   * real values are mapped onto the x axis, and the imaginary values are
   * mapped on to y.
   */
  M.drawMandelbrot = function(im, min, max) {
    var r_span = max.real - min.real, r_factor = r_span/im.width,
        i_span = max.imag - min.imag, i_factor = i_span/im.height,
        x, y, c, i;

    for (x = 0; x < im.width; ++x) {
      for (y = 0; y < im.height; ++y) {
        c = new Complex(x*r_factor + min.real, y*i_factor + min.imag);
        i = M.getIterationCount(c);
        im.setPixel(x, y, M.getColor(i));
      }
    }
  };

}(Mandelbrot));
