// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.
const temp = require('temp');
const fs = require('fs');
const convert = require('xml-js');

class Vsg {
  constructor() {
  }

  async lint_from_file(file,options){
    let temp_file_junit = await this._create_temp_file_of_code("");
    let output_junit = await this._svg_exec(file, temp_file_junit);
    let errors = this._parse_junit(output_junit);
    return errors;
  }

  async lint_from_code(code,options){
    let temp_file_code = await this._create_temp_file_of_code(code);
    let temp_file_junit = await this._create_temp_file_of_code("");
    let output_junit = await this._svg_exec(temp_file_code, temp_file_junit);
    let errors = await this._parse_junit(output_junit);
    return errors;
  }

  async _parse_junit(junit_content){
    const json_str = await convert.xml2json(junit_content, {compact: true, spaces: 2});
    const json = await JSON.parse(json_str);
    let errors_str = "";
    try{
      if (json.testsuite.testcase.failure[0] === undefined){
        errors_str = json.testsuite.testcase.failure._text;
      }
      else{
        errors_str = json.testsuite.testcase.failure[0]._text;
      }
    }
    catch(e){
      // eslint-disable-next-line no-console
      console.log(e);
      return ([]);
    }

    let split_errors = errors_str.split('\n');
    let errors = [];
    for (let i=0; i<split_errors.length; ++i){
      let line = split_errors[i];
      let split_line = line.split(':');
      if (split_line.length === 3){
        let error = {
          'severity' : 'warning',
          'code' : split_line[0].trim(),
          'description' : "[" + split_line[0].trim() + "] " + split_line[2].trim(),
          'location' : {
            'file': "file",
            'position': [parseInt(split_line[1].trim())-1, 0]
          }
        };
        errors.push(error);
      }
      else if(split_line.length > 3){
        let message = "[" + split_line[0].trim() + "] " + split_line[2].trim() + ":";
        for (let x=3;x<split_line.length-1;++x){
          message += split_line[x].trim() + ":";
        }
        message += split_line[split_line.length-1].trim();
        let error = {
          'severity' : 'warning',
          'code' : split_line[0].trim(),
          'description' : message,
          'location' : {
            'file': "file",
            'position': [parseInt(split_line[1].trim())-1, 0]
          }
        };
        errors.push(error);
      }
    }
    return errors;
  }

  async _svg_exec(code_file, junit_file) {  
    let code_file_normalized = code_file.replace(' ','\\ ');
    let junit_file_file_normalized = junit_file.replace(' ','\\ ');
    let command = `vsg -f ${code_file_normalized} --junit ${junit_file_file_normalized}`;  
    const exec = require('child_process').exec;
      return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
          // eslint-disable-next-line no-unused-vars
          let result = {'stdout':stdout,'stderr':stderr};
          let output_junit = fs.readFileSync(junit_file_file_normalized, 'utf8');
          resolve(output_junit);
      });
    });
  }

  async _create_temp_file_of_code(content) {
    const temp_file = await temp.openSync();
    if (temp_file === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "Unable to create temporary file";
    }
    fs.writeSync(temp_file.fd, content);
    fs.closeSync(temp_file.fd);
    return temp_file.path;
  }
}

module.exports = {
  Vsg: Vsg
};
