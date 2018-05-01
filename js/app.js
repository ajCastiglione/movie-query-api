/*
 * Reference URLs:
 * https://www.themoviedb.org/documentation/api?language=en - docs
 * https://developers.themoviedb.org/3/getting-started/introduction - docs in depth
 * https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc?api_key=${apiKey} - example discover url
 * https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher - example search url
 */

$(function () {
    let discoverContainer = $(".discover-container"), searchContainer = $(".search-container");
    let discoverOpts = $('.input-discover-options'), searchFields = $('.input-search-field'), selectedOption;
    let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&`;
    discoverOpts.hide();
    let movieData = [];
    

    //showing search fields
    discoverContainer.on('click', e => {
        searchFields.hide();
        discoverOpts.fadeToggle(500);
    });
    searchContainer.on('click', e => {
        searchFields.fadeToggle(500);
        discoverOpts.hide();
    });

    //Grabbing the id of clicked btn
    discoverOpts.on('click', '.discover-option', function() {
        param = $(this).attr('value');
        if (param == "primary_release_date.gte=") {param = `${param}${dateStamp}`}
        else if(param == "primary_release_year=") {param = `${param}${year}`}
        getResults(param);
    });

    //Initializing search and waiting for it to return a response
    async function getResults(param) {
        const Response = await fetchResults(param);
        const Genres = await fetchGenres();

        for(movie of Response.results) {
            movieData.push({
                'id': movie.id,
                'genres': movie.genre_ids,
                'title': movie.original_title,
                'img': `${baseImgUrl}${movie.poster_path}`,
                'release': movie.release_date
            });
        }

        storage = JSON.stringify(movieData);
        console.log(movieData);
    }

    //Grabbing results based on search
    async function fetchResults(param) {
        let result;
        try {
            result = await $.ajax({
                url: `${discoverUrl}${param}`,
                type: 'GET'
            });

            return result;
        }
        catch (error) {
            console.error(error);
        }
    }

    async function fetchGenres() {
        let result;
        try {
            result = await $.ajax({
                url: genresUrl,
                type: 'GET'
            });
            return result;
        }
        catch(error) {
            console.error(error);
        }
    }


    //Setting this section dynamically - even though it will change once per year...
    $('#best-movies-thisYear').html(`Best movies in ${year}`);

}); //Main function fires when document loads