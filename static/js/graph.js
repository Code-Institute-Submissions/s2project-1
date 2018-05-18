queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);


function makeGraphs(error, foodData) {
    
    let ndx = crossfilter(foodData);
    
    foodData.forEach(function(d) {
        d.total_fat = parseInt(d['Total Fat']);
        d.Calories = parseInt(d['Calories']);

    });

    let category_dim1 = ndx.dimension(dc.pluck('Category'));
    let category_group = category_dim1.group();
    console.log(category_group.all())
    
    dc.selectMenu("#select-category")
        .dimension(category_dim1)
        .group(category_group);

    
            /////////////////
    
    let categoryColors = d3.scale.ordinal()
                .domain(["Beef & Pork", "Beverages", "Breakfast", "Chicken & Fish", "Coffee & Tea", "Desserts", "Salads", "Smoothies & Shakes", "Snacks & Sides"])
                .range(["Yellow", "Yellow", "Red", "Yellow", "Red", "Yellow", "Red", "Yellow", "Red"]);
    
    
    let group_by_category = ndx.dimension(dc.pluck('Category'));
    let count_by_category = group_by_category.group();
            dc.barChart("#category-count-bar")
                .width(900)
                .height(300)
                .margins({top: 10, right: 50, bottom: 100, left: 60})
                .dimension(group_by_category)
                .group(count_by_category)
                .colors(categoryColors)
                .transitionDuration(750)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Category")
                .yAxis().ticks(20);
    
                //////////////////////

    let category_dim = ndx.dimension(dc.pluck('Category'));
    
    let fat_by_category = category_dim.group().reduce(
        function (p, v) {
            p.count++;
            p.total += v.total_fat;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            p.count--;
            if (p.count > 0){
                p.total -= v.total_fat;
                p.average = p.total / p.count;
            } else {
                p.total = 0;
                p.average = 0;
            }
            return p;
        },
        function () {
            return {count: 0, total: 0, average: 0};
        });
        
    console.log(fat_by_category.all())
    dc.barChart("#average-fat")
        .width(600)
        .height(400)
        .margins({top: 10, right: 50, bottom: 100, left: 100})
        .dimension(category_dim)
        .group(fat_by_category)
        .valueAccessor(function(d) {
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Category")
        .yAxis().ticks(20);
        
        /////////////////
        
    let category_cal_dim = ndx.dimension(dc.pluck('Category'));
    
    let cal_by_category = category_cal_dim.group().reduce(
        function (p, v) {
            p.count++;
            p.total += v.Calories;
      
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            p.count--;
            if (p.count > 0){
                p.total -= v.Calories;
                p.average = p.total / p.count;
            } else {
                p.total = 0;
                p.average = 0;
            }
            return p;
        },
        function () {
            return {count: 0, total: 0, average: 0};
        });
        
    console.log(cal_by_category.all());
    dc.barChart("#average-calories")
        .width(600)
        .height(400)
        .margins({top: 10, right: 50, bottom: 100, left: 100})
        .dimension(category_cal_dim)
        .group(cal_by_category)
        .valueAccessor(function(d) {
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Category")
        .yAxis().ticks(20);

    dc.scatterPlot("#calories-in-item")
                    .width(768)
                    .height(480)
                    .x(d3.time.scale().domain([min_date, max_date]))
                    .brushOn(false)
                    .symbolSize(8)
                    .clipPadding(10)
                    .yAxisLabel("Calories")
                    .colorAccessor(function(d){
                      return d.key[2];
                    })
                    .colors(buyerColors)
                    .title(function(d) {
                        return d.key[2] + " spent " + d.key[1] + " in " + d.key[3];
                    })
                    .dimension(spend_dim)
                    .group(spend_group);
    
        
        dc.renderAll();
}