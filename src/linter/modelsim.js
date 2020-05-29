// The MIT License (MIT)

// Copyright (c) 2016 Masahiro H

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const Base_linter = require('./base_linter');

class Modelsim extends Base_linter {
  constructor(path) {
    super(path);
    this.PARAMETERS = {
      'SYNT': "vcom -2008",
      // From https://github.com/dave2pi/SublimeLinter-contrib-vlog/blob/master/linter.py
      'ERROR': /"^\\*\\* (((Error)|(Warning))( \\(suppressible\\))?: )(\\([a-z]+-[0-9]+\\) )?([^\\(]*)\\(([0-9]+)\\): (\\([a-z]+-[0-9]+\\) )?((((near|Unknown identifier|Undefined variable):? )?[\"\']([\\w:;\\.]+)[\"\'][ :.]*)?.*)";/ig,
      'TYPEPOSITION': 1,
      'ROWPOSITION': 3,
      'COLUMNPOSITION': 6,
      'DESCRIPTIONPOSITION': 4,
      'OUTPUT': this.OUTPUT.OUT,
    };
  }


  // options = {custom_bin:"", custom_arguments:""}
  async lint_from_file(file,options){
    let errors = await this._lint(file, options);
    return errors;
  }

  async lint_from_code(file,code,options){
    let temp_file = await this._create_temp_file_of_code(code);
    let errors = await this._lint(temp_file,options);
    return errors;
  }

  // async _lint(file,synt,synt_windows,options){
  //   // let result = await this._exec_linter(file,this.PARAMETERS.SYNT,
  //   //                       this.PARAMETERS.SYNT_WINDOWS,options);
  //   // let errors_str = result.stderr;
  //   // let errors_str_lines = errors_str.split(/\r?\n/g);
  //   // let errors = [];
  // }



}

module.exports = {
  Modelsim: Modelsim
};
