$('document').ready(() => {
    const urlParams = new URLSearchParams(window.location.search)
    let filters = undefined;
    let page = undefined;

    for(p of urlParams.entries()) {
        if(p[0] == 'filters') {
            filters = p[1];
        }
        if(p[0] == 'page') {
            page = p[1]
        }
    }

    data = {
        filters,
        page
    }

    if(filters) {
        $('.active-filters').val(filters)
        filters = filters.split(','); // If filters exists, transform it into an array of them
        for(f of filters) {
            $('.selected-filters').append(`
            <li><button class="selected-category" value="${f}">${f}&nbsp;<ion-icon name="close"></ion-icon></button></li>
            `)
        }
    } else {
        $('.selected-filters').hide();
    }
    
    $.ajax({
        url: "/data/operations/filters",
        dataType: 'json',
        type: 'POST',
        data: data
    })
    .done((result) => {    
        const { rows, active, first, last, totalPages} = result; // Saving ajax request info into constants

        // Starting table filling system
        if(rows.length > 0 || (filters && filters.length > 0)) { // Prevent showing the 'no operations registered' view if user manually enters a non-existent filter
            $('.hide-info').hide();
            $('.register-link').hide();
            if(rows.length > 0) {
                for(r of rows) {
                    let date = r.CREATED_AT;
                    date = new Date(date).toString().substring(4, 15).split(' ');
                    date = date[0] + " " + date[1] + ", " + date[2];
                    let category = '';
                    (r.CATEGORY)?category = r.CATEGORY:category = '-';
                    if(r.E_VALUE) {
                        $('.operations-table tbody').append(`
                            <tr class="row">
                                <td class="field">
                                    ${r.CONCEPT}
                                </td>
                                <td class="field negative">
                                    - ${r.E_VALUE}
                                </td>
                                <td class="field">
                                    ${date}
                                </td>
                                <td class="field">
                                    ${category}
                                </td>
                                <td class="field text-center">
                                    <form action="/dashboard/list/modify/e${r.E_ID_OPERATION}" method="get">
                                        <button class="modify">
                                            <ion-icon name="pencil-sharp"></ion-icon>
                                        </button>
                                    </form>
                                </td>
                                <td class="field text-center">
                                    <form action="/dashboard/list/delete/e${r.E_ID_OPERATION}" method="post">
                                        <button class="delete">
                                            <ion-icon name="trash"></ion-icon>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        `)
                    } else {
                        $('.operations-table tbody').append(`
                            <tr class="row">
                                <td class="field">
                                    ${r.CONCEPT}
                                </td>
                                <td class="field positive">
                                    + ${r.I_VALUE}
                                </td>
                                <td class="field">
                                    ${date}
                                </td>
                                <td class="field">
                                    ${category}
                                </td>
                                <td class="field text-center">
                                    <form action="/dashboard/list/modify/i${r.I_ID_OPERATION}" method="get">
                                        <button class="modify">
                                            <ion-icon name="pencil-sharp"></ion-icon>
                                        </button>
                                    </form>
                                </td>
                                <td class="field text-center">
                                    <form action="/dashboard/list/delete/i${r.I_ID_OPERATION}" method="post">
                                        <button class="delete">
                                            <ion-icon name="trash"></ion-icon>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        `)
                    }
                }
            } else {
                $('.table-footer').hide();
            }
        } else {
            $('.show-info').hide();
            $('.filter-box').hide();
            $('.operations-table').hide();
            $('.table-footer').hide();
        }

        // Starting pagination system
        if(first) {
            $('.list-info').text(`Showing operations ${first}-${last}.`)
        } else {
            $('.list-info').text(`Showing operation ${last}.`)
        }

        
        for(page of totalPages) {
            if(page == 'prev') {
                $('.pagination').append(`
                    <button class="pagination-item" name="page" value="${active - 2}"><ion-icon name="play-back"></ion-icon></button>
                `)
            } else if(page == 'next') {
                $('.pagination').append(`
                    <button class="pagination-item" name="page" value="${active + 2}"><ion-icon name="play-forward"></ion-icon></button>
                `)
            } else if(page == active) {
                $('.pagination').append(`
                    <button class="pagination-item active" name="page" value="${page}">${page}</button>
                `)
            } else {
                $('.pagination').append(`
                    <button class="pagination-item" name="page" value="${page}">${page}</button>
                `)
            }
        }

        // Starting categories system
        $.ajax({
            url: "/data/categories",
            dataType: 'json',
            type: 'POST',
        })
        .done((categories) => {
            if(!categories.length > 0) {
                $('.filter-box').hide();
            } else {
                categories.sort(); // Sorting categories alphabetically
                for(cat of categories) {
                    if(filters && filters.includes(cat)) {
                        $('.filter-dropdown').append(`
                        <li><button class="category" value="${cat}" disabled>${cat}</button></li>
                        `)
                    } else {
                        $('.filter-dropdown').append(`
                        <li><button class="category" value="${cat}">${cat}</button></li>
                        `)
                    }
                }
            }
            $('.category').click((e) => {
                if ($('.active-filters').val()) {
                    $('.active-filters').val($('.active-filters').val() + `,${e.target.value}`); // If there are already filters set, add the new one
                } else {
                    $('.active-filters').val(e.target.value); // Set a new filter
                }
                
                $('#categoryForm').submit(); // Submit the form with the new filter
            });
            
            $('.selected-category').click((e) => {
            
                if(e.target.value == undefined) {
                    e.target = e.target.parentNode
                }
            
                let filters = $('.active-filters').val().split(','); // Turning categories into an array
            
                filters = filters.filter(f => f != e.target.value).toString(); // Removing the clicked category and converting array back to string 
            
                $('.active-filters').val(filters); // Set filters without the clicked filter
                
                $('#categoryForm').submit(); // Submit the form
            
            });
        });
    })
})

if($('.list-box').outerHeight() < $(window).height()) {
    $('.list-box').css('justify-content', 'center');
} else {
    $('.list-box').css('justify-content', 'start');
}

$(window).resize(() => {
    if($('.list-box').outerHeight() < $(window).height()) {
        $('.list-box').css('justify-content', 'center');
    } else {
        $('.list-box').css('justify-content', 'start');
    }    
});

// Show/hide filters dropdown menu

$('.filter-menu').mouseenter((e) => {
    $('.filter-dropdown').css('display', 'initial');
});

$('.filter-menu').on('mouseleave', () => {
    $('.filter-dropdown').css('display', 'none');
});

$('body').click(() => {
    $('.filter-menu').blur();
});