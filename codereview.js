var setAuthenticationHeaders = function(){
    $(document).ajaxSend(function(event, jqXHR, ajaxOptions) {
        jqXHR.setRequestHeader('api-key', 'D3A49D7AF72254C48F8615806416EA27');
    });
},

configureBloodhound = function(){
    var articles = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 8,
        remote: { 
            url : 'https://codereview.search.windows.net/indexes/articles/docs/suggest?suggesterName=sg&fuzzy=true&api-version=2015-02-28&$select=*&search=%QUERY',
            wildcard : '%QUERY',
            transform: function(response){
                return $.map(response.value, function(result) {
                    console.log(result);
                    return {
                        name: result["name"],
                        summary: result["summary"],
                        type: result["type"]
                    };
                });
            }
        }
    });

    articles.initialize();

    $('#remote .typeahead').typeahead(null, {
        source: articles,
        display: function(data){ return data.name; },
        templates: {
            empty: '<div>Unable to find anything based on your search criteria.</div>',
            suggestion: Handlebars.compile(
                '<div class="suggestion">' +
                    '<div>' +
                        '<div class="name">{{name}}</div>' + 
                        '<div class="stats">{{type}}</div>' +
                        '<div class="clearB"></div>' +
                    '</div>' +
                    '<div class="summary">{{summary}}</div>' +
                '</div>')
        },
    }).on('typeahead:selected', function(obj, datum){
        console.log(obj);
        console.log(datum);

        $('#results').html('<h2>' + datum.name + '</h2>' + '<section>' + datum.summary + '</section>');
    });
},
focus = function(){
    $('#search').focus();
},
calculateBackgroundImageName = function(){
    var numBgImages = 31;
    var today = new Date();
    var date = today.getDate();
    var index = date % numBgImages;
    var imageName = index < 10 ? '0' + index : index;
    return imageName + '.jpg';
},
setBackground = function(){
    $('body').css(
        'background-image', 
        'url(images/' + calculateBackgroundImageName() + ')');
};



$(function(){
    setBackground();
    setAuthenticationHeaders();
    configureBloodhound();
    focus();
});