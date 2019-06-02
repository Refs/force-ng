import { Component, OnInit, ViewEncapsulation, AfterContentInit } from '@angular/core';

import * as d3 from 'd3';

import { ForceService } from './services/force.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterContentInit {

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
    const links = linkNodes(nodes);

    this.force.nodes(nodes)
      .force("charge", d3.forceManyBody().strength(-1500).distanceMin(100).distanceMax(1000))
      .force('links', d3.forceLink(links).id(function (d) {
        return (d as any).name;
      }).distance(100))
      .force('center', d3.forceCenter(this.w / 2, this.h / 2))
      .force('y', d3.forceY(0.01))
      .force('x', d3.forceX(0.01))
      .on('tick', tick)

    var path = this.vis.selectAll("path.link").data(links);

    path.enter().insert("path")
      .attr("class", "link")
      .style("stroke", "#eee");

    // console.log(d3.selectAll('path.link'));
    // 退出所有旧节点
    path.exit().remove();

    var node = this.vis.selectAll("g.node")
      .data(this.force.nodes());
    // console.log(this.force.nodes());


    var nodeEnter = node.enter().append('g')
      .attr("class", "node")
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    // .on("click", click)
    // .call(force.drag);

    nodeEnter.append("svg:circle")
      .attr("r", function (d) { return Math.sqrt(d.size) / 10 || 4.5; })
      .style("fill", "#eee");

    var images = nodeEnter.append("svg:image")
      .attr("xlink:href", function (d) { return d.img; })
      .attr("x", function (d) { return -25; })
      .attr("y", function (d) { return -25; })
      .attr("height", 50)
      .attr("width", 50);

    node.exit().remove();

    path = this.vis.selectAll("path.link");
    node = this.vis.selectAll("g.node");

    function tick() {
      path.attr("d", function (d) {
        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + ","
          + d.source.y
          + "A" + dr + ","
          + dr + " 0 0,1 "
          + d.target.x + ","
          + d.target.y;
      });
      // node.attr("transform", nodeTransform);
    }

    // function nodeTransform(d) {
    //   d.x = Math.max(this.maxNodeSize, Math.min(this.w - (d.imgwidth / 2 || 16), d.x));
    //   d.y = Math.max(this.maxNodeSize, Math.min(this.h - (d.imgheight / 2 || 16), d.y));
    //   return "translate(" + d.x + "," + d.y + ")";
    // }

  }

  // public tick() {
  // console.log(this);

  // console.log(this.w);

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
  // }
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

function linkNodes(nodes) {
  return merge(nodes.map(function (parent) {
    return (parent.children || []).map(function (child) {
      // 在此处控制，返回的 source 与 target
      return { source: parent.name, target: child.name };
    });
  }));
}

function merge(arrays) {
  let n = arrays.length,
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
