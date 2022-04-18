$('document').ready(() => {
    $.ajax({
        url: "/data/operations",
        dataType: 'json',
        type: 'POST',
    })
    .done((result) => {
        
        let currentBalance = 0;
        
        let data = [];
        let point = 0;
        let counter = 0;

        for (const i of result) {
            counter += 1;
            (i.I_VALUE)?point -= i.I_VALUE:point += i.E_VALUE;
            if(window.innerWidth > 750) {
                if(result.length - counter < 10) {
                    data.push({ x: i.CREATED_AT, y: point});
                }
            } else if(window.innerWidth > 450) {
                if(result.length - counter < 8) {
                    data.push({ x: i.CREATED_AT, y: point});
                }
            } else {
                if(result.length - counter < 6) {
                    data.push({ x: i.CREATED_AT, y: point});
                }
            }
            if(result.length - counter === 0) {
                currentBalance = point;
            }
        }

        const totalDuration = data.length * 100;
        const delayBetweenPoints = totalDuration / data.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
        const animation = {
            x: {
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: previousY,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            }
        };        

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Balance',
                    data: data,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                animation,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                  legend: false
                },
                scales: {
                    x: {
                        type: 'time',
                    }
                }
              }
        });
    });
});
