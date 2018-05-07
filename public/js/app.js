/*
 * Reference URLs:
 * https://www.themoviedb.org/documentation/api?language=en - docs
 * https://developers.themoviedb.org/3/getting-started/introduction - docs in depth
 * https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc?api_key=${apiKey} - example discover url
 * https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher - example search url
 */

$(function () {
    let discoverContainer = $(".discover-container"),
        searchContainer = $(".search-container");
    let discoverOpts = $('.input-discover-options'),
        searchFields = $('.input-search-field');
    let out = $("#resultsSection");
    let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&`;
    discoverOpts.hide();
    let movieData = [] || JSON.parse(storage.movieProp),
        genresArr = [] || JSON.parse(storage.genreList);
    const slider = $('.owl-carousel');

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
    discoverOpts.on('click', '.discover-option', function () {
        param = $(this).attr('value');
        if (param == "primary_release_date.gte=") {
            param = `${param}${dateStamp}`
        } else if (param == "primary_release_year=") {
            param = `${param}${year}`
        }
        getResults(param);
    });

    //Initializing search and waiting for it to return a response
    async function getResults(param) {
        movieData = [], genresArr = [];
        const Movies = await fetchResults(param);
        const Genres = await fetchGenres();

        for (genre of Genres.genres) {
            genresArr.push({
                'genre_id': genre.id,
                'genre_name': genre.name
            });
        }

        for (movie of Movies.results) {
            let movieGenres = await filterGenres(movie.genre_ids);
            let poster = `${baseImgUrl}${movie.poster_path}`;
            let overview = movie.overview;

            if (overview.length > 140) {overview = overview.substring(0, 140);}
            overview += '...';
            if (!movieGenres) {movieGenres = `Not Listed`;}
            if (!movie.poster_path) {poster = "https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png";}
            movieData.push({
                'id': movie.id,
                'genres': movieGenres,
                'title': movie.original_title,
                'img': poster,
                'release': movie.release_date,
                'overview': overview
            });
        }

        storage.movieProp = JSON.stringify(movieData);

        displayContent();
    }

    //Grabbing results based on search
    async function fetchResults(param) {
        let result;
        try {
            result = await $.ajax({
                url: `${discoverUrl}${param}&region=US`,
                type: 'GET'
            });

            return result;
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchGenres() {
        let result, genresArr = [];
        try {
            result = await $.ajax({
                url: genresUrl,
                type: 'GET'
            });
            return result;
        } catch (error) {
            console.error(error);
        }
        storage.genreList = JSON.stringify(genresArr);
    }

    async function filterGenres(ids) {
        if (ids.length == 0) return;

        let genreNames = "";
        for (id of ids) {
            for (genre of genresArr) {
                if (id == genre.genre_id) {
                    genreNames += `${genre.genre_name} `;
                }
            }
        }
        return genreNames;
    }

    function displayContent(savedArr) {
        out.empty();
        let content;

        if (savedArr) {
            for (movie of savedArr) {
                content = $(`
            <div class="movie-result-content clearfix">
                    <h3>${movie.title}</h3>
                    <div class="movie-content">
                        <div class="inner-content col-xs-6 col-sm-12">
                            <img src="${movie.img}" alt="${movie.title}">
                        </div>
                    
                        <div class="inner-content col-xs-6 col-sm-12">
                            <p class="release-date">Release Date: <br> ${movie.release}</p>
                            <p class="genre-list">Genres: <br> ${movie.genres}</p>
                            <p class="genre-overview">Overview: <br> ${movie.overview}</p>
                        </div>
                    </div>
                </div>
            `);
                out.append(content);
            }
            putItInaSlider();
        } else {
            slider.owlCarousel('destroy');
            for (movie of movieData) {
                content = $(`
            <div class="movie-result-content clearfix">
            <h3>${movie.title}</h3>
                <div class="movie-content">
                    <div class="inner-content col-xs-6 col-sm-12">
                        <img src="${movie.img}" alt="${movie.title}">
                    </div>
                
                    <div class="inner-content col-xs-6 col-sm-12">
                        <p class="release-date">Release Date: <br> ${movie.release}</p>
                        <p class="genre-list">Genres: <br> ${movie.genres}</p>
                        <p class="genre-overview">Overview: <br> ${movie.overview}</p>
                    </div>
                </div>
            </div>
        `);
                out.append(content);
            }
            putItInaSlider();
        }
    } //Displaying the retrieved content

    function putItInaSlider() {
        slider.owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            dots: false,
            mouseDrag: true,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                1030: {
                    items: 3
                },
                1240: {
                    items: 4
                }
            }
        });
    } //Setting up the slider

    if (storage.movieProp) {
        let arr = JSON.parse(storage.movieProp);
        displayContent(arr);
    } //checking if local has the saved results, then displaying said results


    //Setting this section dynamically - even though it will change once per year...
    $('#best-movies-thisYear').html(`Best movies in ${year}`);

}); //Main function fires when document loads