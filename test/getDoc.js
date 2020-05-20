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

const ln = require('../src/documenter/documenter');
const fs = require('fs');

var structure = fs.readFileSync('./documenter/examples/vhdl/structure.vhd','utf8');

var D = new ln.BaseStructure(structure,"vhdl","!");
var md = D.getMdDoc();
// D.getPdfDoc('./');
D.getHtmlDoc();
var html = D.html;
// console.log(md)
// console.log(html)
var svg = D.getDiagram();
// fs.writeFileSync("svg.svg",svg)
fs.writeFileSync("html.html",html)
fs.writeFileSync("md.md",md)
