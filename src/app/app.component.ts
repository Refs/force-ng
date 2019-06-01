import { Component, OnInit, ViewEncapsulation, AfterContentInit } from '@angular/core';

import * as d3 from 'd3';

import { ForceService } from './services/force.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements  AfterContentInit {

  // some colour variables
  public tcBlack = '#130C0E';

  // rest of publics
  public w = 960;
  public h = 800;
  public maxNodeSize = 50;
  public x_browser = 20;
  public y_browser = 25;
  public root;

  public vis;

  public force;


  constructor(
    private _forceService: ForceService
  ) { }

  ngAfterContentInit() {
    this.force = d3.forceSimulation();
    this.vis = d3.select('#vis').append('svg').attr('width', this.w).attr('height', this.h);

    this._forceService.fetchForceData().subscribe((data) => {
      // console.log(data);
      // HTMLDListElement
      this.root = data;
      this.root.fixed = true;
      this.root.x = this.w / 2;
      this.root.y = this.h / 4;

      const defs = this.vis.insert('defs')
        .data(['end']);

      defs.enter().append('path')
        .attr('d', 'M0,-5L10,0L0,5')

      // 更新图形
      this.update();
    })
  }

  public update() {
    // console.log(this.root);
    const nodes = flatten(this.root);
    // console.log(nodes)

    // const hierarchy = d3.hierarchy(this.root);
    // console.log(hierarchy);
    // const tree = d3.tree();
    // const links = tree(hierarchy).links();
    console.log(Links(nodes))
    // const linksPath = links.map((cur, i, arr) => {
    //   if (i === 0){
    //     console.log(cur.source.data);
    //   }
    // })

    // this.force.nodes(nodes)
    //   .force("charge", d3.forceManyBody().strength(-1500))
    //   .force('links', d3.forceLink(links).id(function(d){
    //     // console.log(d);

    //     return (d as any).id;
    //   }))
    //   .force("x", d3.forceX(this.w / 2))
    //   .force("y", d3.forceY(this.h / 2))


  }

  public tick() {


    // this.path.attr("d", function (d) {

    //   var dx = d.target.x - d.source.x,
    //     dy = d.target.y - d.source.y,
    //     dr = Math.sqrt(dx * dx + dy * dy);
    //   return "M" + d.source.x + ","
    //     + d.source.y
    //     + "A" + dr + ","
    //     + dr + " 0 0,1 "
    //     + d.target.x + ","
    //     + d.target.y;
    // });+
    // node.attr("transform", nodeTransform);
  }
}




function flatten(root) {
  let nodes = [];
  let i = 0;

  function recurse(node) {
    if (node.children)
      node.children.forEach(recurse);
    if (!node.id)
      node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

function Links(nodes) {
  return merge(nodes.map(function(parent) {
    return (parent.children || []).map(function(child) {
      return {source: parent, target: child};
    });
  }));
}

function merge(arrays:any) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
}
