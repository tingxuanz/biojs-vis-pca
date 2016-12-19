/*
 * biojs-vis-pca
 * https://github.com/tingxuanz/biojs-vis-pca
 *
 * Copyright (c) 2016 tingxuanz
 * Licensed under the Apache-2.0 license.
 */

/**
@class biojsvispca
 */


var  biojsvispca;
module.exports = biojsvispca = function(opts){
  this.el = opts.el;
  this.el.textContent = biojsvispca.hello(opts.text);
};

/**
 * Private Methods
 */

/*
 * Public Methods
 */

/**
 * Method responsible to say Hello
 *
 * @example
 *
 *     biojsvispca.hello('biojs');
 *
 * @method hello
 * @param {String} name Name of a person
 * @return {String} Returns hello name
 */


biojsvispca.hello = function (name) {

  return 'hello ' + name;
};

