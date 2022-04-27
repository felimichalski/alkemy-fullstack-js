if($('.dashboard-box').outerHeight() < $(window).height()) {
    $('.dashboard-box').css('justify-content', 'center');
} else {
    $('.dashboard-box').css('justify-content', 'start');
}

$(window).resize(() => {
    if($('.dashboard-box').outerHeight() < $(window).height()) {
        $('.dashboard-box').css('justify-content', 'center');
    } else {
        $('.dashboard-box').css('justify-content', 'start');
    }    
});

$('document').ready(() => {
    $.ajax({
        url: "/data/operations",
        dataType: 'json',
        type: 'POST',
    })
    .done((result) => {

        // Chart fill system
        let currentBalance = 0;
        
        let data = [];
        let point = 0;
        let counter = 0;

        for (const i of result) {
            counter += 1;
            (i.I_VALUE)?point += i.I_VALUE:point -= i.E_VALUE;
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

        let currentValue = document.querySelector('.current-value');
        let currentIcon = document.querySelector('.current-icon');
        let currentBox = document.querySelector('.current-box');
        
        
        if(currentBalance > 0) {
            currentValue.innerHTML = "$" + currentBalance;
            currentBox.classList.add('positive');
            currentIcon.setAttribute('name', 'caret-up');
        } else if(currentBalance < 0) {
            currentValue.innerHTML = "-$" + currentBalance.toString().substring(1);
            currentIcon.setAttribute('name', 'caret-down');
            currentBox.classList.add('negative');
        } else {
            currentValue.innerHTML = currentBalance;
            currentIcon.setAttribute('name', 'remove');
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
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                    },
                    y: {
                        ticks: {
                          callback: function(value, index, values) {
                              if (value < 0) {
                                return "- $" + value.toString().substring(1);    
                              } else {
                                return "$" + value;    
                              }
                          }
                        }
                    }
                }
              }
        });

        // Showing last 10 operations
        if(result.length > 0) {
            $('.operations-table').css('display', '');
            $('.register-link').css('display', 'none');
            let reversedResult = result;
            let counter = 0;
            for(r of reversedResult.reverse()) {
                if(counter > 9) {
                    break;
                }
                let date = r.CREATED_AT;
                date = new Date(date).toString().substring(4, 15).split(' ');
                date = date[0] + " " + date[1] + ", " + date[2];
                let category = '';
                (r.CATEGORY)?category = r.CATEGORY:category = '-';
                if(r.E_VALUE) {
                    $('.operations-table tbody').append(`
                        <tr class="row">
                            <td class="field negative">
                                - ${r.E_VALUE}
                            </td>
                            <td class="field">
                                ${date}
                            </td>
                            <td class="field">
                                <span>${category}</span>
                            </td>
                        </tr>
                    `)
                } else {
                    $('.operations-table tbody').append(`
                        <tr class="row">
                            <td class="field positive">
                                + ${r.I_VALUE}
                            </td>
                            <td class="field">
                                ${date}
                            </td>
                            <td class="field">
                                <span>${category}</span>
                            </td>
                        </tr>
                    `)
                }
                counter += 1;
            }
        } else {
            $('.register-link').css('display', 'flex');
            $('.operations-table').css('display', 'none');
        }
    });
});
