function update(source, inset) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * tr_width*1.2; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d){
                        updateInset(d);
                    });

  nodeEnter.append("rect")
      .attr("width", tr_width)
      .attr("height", tr_height)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#bbb"; });

  nodeEnter.append("text")
      .attr("x", 1)
      .attr("y", 10) // .attr("dy", ".35em")
      .attr("text-anchor", "start" )
      .text(function(d) { return shortStr(d.name); })
      .style("fill-opacity", 1e-6);

  nodeEnter.append("text")
      .attr("x", tr_width-90)
      .attr("y", tr_height-22)
      .attr("class", "smalltext")
      .attr("text-anchor", "end")
      .text(function(d){return "Sign-Ups: " + commaFormat(d.data['Users'])})  
  nodeEnter.append("text")
      .attr("x", tr_width-90)
      .attr("y", tr_height-12)
      .attr("class", "smalltext")
      .attr("text-anchor", "end")
      .text(function(d){return "Retention: " + commaFormat(d.data['Retained'])})
  nodeEnter.append("text")
      .attr("x", tr_width-1)
      .attr("y", tr_height-22)
      .attr("class", "faketext")
      .attr("text-anchor", "end")
      .text(function(d){return "Purchases: " + commaFormat(d.data['Purchases'])})
  nodeEnter.append("text")
      .attr("x", tr_width-1)
      .attr("y", tr_height-12)
      .attr("class", "faketext")
      .attr("text-anchor", "end")
      .text(function(d){return "Value: $" + cents(d.data['Spend'])})
  nodeEnter.append("text")
      .attr("x", tr_width-1)
      .attr("y", tr_height-2)
      .attr("class", "faketext")
      .attr("text-anchor", "end")
      .text(function(d){return "Acq Cost: $" + cents(d.data['Acquisition Cost'])})
  nodeEnter.append("text")
      .attr("x", 60)
      .attr("y", tr_height-2)
      .attr("class", "faketext")
      .attr("text-anchor", "end")
      .style({"font-size":"16px"})
      .text(function(d){
        if (d.data['traffic_cost']==0){
            return 'NA';
        } else {
            return commaFormat(Math.floor(100 *d.data['Spend']/d.data['Acquisition Cost']))+'%'
        }})      
      
  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("rect")
      .attr("width", tr_width)
      .attr("height", tr_height)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#bbb"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("rect")
      .attr("width", tr_width)
      .attr("height", tr_height)

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
        ex = true;
    } else {
        d.children = d._children;
        d._children = null;
        ex = false;
    }
    update(d, ex);
    return d;
}



function updateInset(d){
    click(d);
    inset.selectAll('#inset-title').remove();
    console.log(d);
    inset.append('text')
        .attr('id','inset-title')
        .attr("x", 5)
        .attr("y", 20) // .attr("dy", ".35em")
        .attr("text-anchor", "start" )
        .style({"font-size":"16px","font-family":"sans-serif"})
        .text(d.name);

    child_sum = sumChildNodes(d, 5);
    acq_data = [];
    spend = [];
    users = []
    for (var key in child_sum){
        acq_data.push(child_sum[key]["Acquisition Cost"]);
        spend.push(child_sum[key]["Spend"]);
        users.push(child_sum[key]["Users"]);
    };

    acq_cost = inset.append('g')
                  .attr('id', 'acq-cost');

    spend_div = inset.append('g')
                  .attr('id', 'spend');
    users_div = inset.append('g')
                  .attr('id', 'users');

    acq_cost.select('rect').remove();
    spend_div.select('rect').remove();
    users_div.select('rect').remove();

    acq_cost.append('rect')
              .attr("x", 5)
              .attr("y", 30)
              .attr("height", 40)
              .attr("width",90)
              .style("fill", '#fff');

    spend_div.append('rect')
              .attr("x", 5)
              .attr("y", 90)
              .attr("height", 40)
              .attr("width",90)
              .style("fill", '#fff');
        users_div.append('rect')
              .attr("x", 5)
              .attr("y", 150)
              .attr("height", 40)
              .attr("width",90)
              .style("fill", '#fff');

    acq_cost.selectAll('#bar').remove();
    spend_div.selectAll('#bar').remove();
    users_div.selectAll('#bar').remove();

    for (i =0; i < acq_data.length; i++){

      acq_cost.append('rect')
          .attr('class','bar')
          .attr('x', 5+4*i)
          .attr('y', 70 - Math.min(40,(acq_data[i]/5)))
          .attr('width',4)
          .attr('height', Math.min(40,(acq_data[i]/5)))
          .style('fill', '#00f');

      spend_div.append('rect')
          .attr('class','bar')
          .attr('x', 5+4*i)
          .attr('y', 130 - Math.min(40,(spend[i]/5)))
          .attr('width',4)
          .attr('height', Math.min(40,(spend[i]/5)))
          .style('fill', '#0f0');

      users_div.append('rect')
          .attr('class','bar')
          .attr('x', 5+4*i)
          .attr('y', 190 - Math.min(40,(users[i]/2)))
          .attr('width',4)
          .attr('height', Math.min(40,(users[i]/2)))
          .style('fill', '#f00');


    }
        inset.append('text')
        .attr("x", 100)
        .attr("y", 70) // .attr("dy", ".35em")
        .attr("text-anchor", "start" )
        .style({"font-size":"10px","font-family":"sans-serif"})
        .text('Acquistion Cost');
      inset.append('text')
        .attr("x", 100)
        .attr("y", 130) // .attr("dy", ".35em")
        .attr("text-anchor", "start" )
        .style({"font-size":"10px","font-family":"sans-serif"})
        .text('Spend');
      inset.append('text')
        .attr("x", 100)
        .attr("y", 190) // .attr("dy", ".35em")
        .attr("text-anchor", "start" )
        .style({"font-size":"10px","font-family":"sans-serif"})
        .text('Users');
}



//sumChildNodes takes nodes of certain depth and sums data
function sumChildNodes(parent_node, depth){
    
    output = {};
    cur_depth = parent_node.depth;

    if (parent_node.children !== null && typeof parent_node.children != "undefined") {
        parent_node.children.forEach(function(d){
            if (typeof d.depth == "undefined") {
                d.depth = cur_depth +1;
            };

            if (+d.depth == +depth) {
                if (typeof output[d.name] == "undefined") {
                    // console.log('create', d.name);
                    output[d.name] = d.data;
                } else {
                    // console.log('add to', d.name);
                    addObjects(d.data, output[d.name]);
                };
            } else {
                // console.log('deeper', d.depth, d);
                sumChildNodes(d, depth);
            }});
    };

    cur_depth = parent_node.depth;

    if (parent_node._children !== null && typeof parent_node._children != "undefined") {
        parent_node._children.forEach(function(d){
            if (typeof d.depth == "undefined") {
                d.depth = cur_depth +1;
            };
            if (+d.depth == +depth) {
                if (typeof output[d.name] == "undefined") {
                   // console.log('create', d.name);
                   output[d.name] = d.data;
                } else {
                    // console.log('add to', d.name);
                    addObjects(d.data, output[d.name])
                };
            } else {
                // console.log('deeper', d.depth, d);
                sumChildNodes(d, depth);
            }});
    };
    return output;
};

function sumIf(object, sum_field, criteria_field, criteria){
    return object.reduce(function(tot, line){ 
            if (line[criteria_field] === criteria) {
                return tot + +line[sum_field];
            } else {
                return tot;
            }},0);
};



function commaFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};



function listChildren(obj){
    input = obj.children;
    out = [];
    input.forEach(function(d){out.push(d.name);});
    return out;
};



function addObjects(obj, existing){
    //console.log('adding', obj, existing);
    newObjKeys = Object.keys(obj);
    newObjKeys.forEach(function(d){
        if(typeof existing[d] == 'undefined'){
            existing[d] = +obj[d];
        } else {
            existing[d] = existing[d] + +obj[d];
        };
    });
};



// function adds paths to tree, adds leaves to each step of path
function addTreePath(obj, hierarchy_array, leaves){
    // assumes root is first node & skips
    // leaves get added cumulatively to tree
    acc_str = 'obj';
    for (i=1; i < hierarchy_array.length; i++){

        this_path = hierarchy_array.slice(0,i+1);
        c = listChildren(eval(acc_str));

        if (c.indexOf(this_path[i-1]) < 0) {
            eval(acc_str+'.children.push({"name":"'+this_path[i-1]+'","children":[]})');
            
            // added to prevent overwriting of data
            if (typeof eval(acc_str+'.data') == "undefined") {eval(acc_str+'.data={}')};
            c = listChildren(eval(acc_str));
        };
        
        // now add leaves in 'data'
        eval('addObjects(leaves,'+acc_str+'.data)');
        acc_str = acc_str+'.children['+c.indexOf(this_path[i-1])+']';
        //console.log(acc_str);
    };
};



// replace undefined values with 0's
function nvl(value, replacement){
    if (typeof value == "undefined") {return replacement} else {return value};
};



//primary function for turning a table into a tree
function tableToTree(table, hierarchy_array, leaf_list, rootname){
    // add root to array
    hierarchy_array.unshift('root');

    // Initialize object
    var obj = {};
    obj['name'] = rootname;
    obj['children'] = [];
    
    // Walk through table: 
    table.forEach(function(d){
        
        // get the path down the tree
        // skipping 'root' in 0th position
        this_row = [];
        for (i=1; i<hierarchy_array.length; i++){
            this_row.push(d[hierarchy_array[i]]);
        };
        
        // get the data 'leaves'
        leaves = {};
        for (i=0; i<leaf_list.length; i++){
            leaves[leaf_list[i]] = nvl(d[leaf_list[i]],0);
        };
        // if (this_row.length > 3) {
        //     console.log('hierarchy tree:', this_row, 'leaves:',leaves);
        // };
        addTreePath(obj, this_row, leaves);
    });
    return obj;
}
