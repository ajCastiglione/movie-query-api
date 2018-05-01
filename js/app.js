/*
 * Reference URLs:
 * https://www.themoviedb.org/documentation/api?language=en - docs
 * https://developers.themoviedb.org/3/getting-started/introduction - docs in depth
 * https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc?api_key=${apiKey} - example discover url
 * https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher - example search url
 */

$(function () {
    let discover = $(".discover-container"), search = $(".search-container");
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;

    //showing search fields
    discover.on('click', e => {
        $('.input-search-field').hide();
        $(".input-discover-options").fadeToggle(500);
    });
    search.on('click', e => {
        $('.input-search-field').fadeToggle(500);
        $(".input-discover-options").hide();
    });

    //Grabbing results based on search
    async function fetchResults() {
        let result;
        try {
            result = await $.ajax({
                url: apiUrl,
                type: 'GET'
            });

            return result;
        }
        catch (error) {
            console.error(error);
        }
    }

    //Initializing search and waiting for it to return a response
    async function getResults() {
        const Response = await fetchResults();
        console.log(Response);
    }


}); //Main function fires when document loads