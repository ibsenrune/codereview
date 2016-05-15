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
                        type: result["type"],
                        references : result["references"]
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

        var result = '<h2>' + datum.name + '</h2>' + 
            '<section>' + datum.summary + '</section>';
            
        if(datum.references.length > 0){
            var references =
                '<h3>References</h3>' +
                '<section>' +
                    '<a target="_blank" href="' + datum.references[0] + '">'
                        + datum.references[0] +
                    '</a>'
                '</section>';
                
            result = result + references 
        }
        
        $('#results').html(result);
        setOverlay();
    });
},
focus = function(){
    $('#search').focus();
},
getBackgroundImageUrl = function(){
    var numBgImages = 31;
    var today = new Date();
    var date = today.getDate();
    var index = date % numBgImages;
    var imageName = index < 10 ? '0' + index : index;
    var file = imageName + '.jpg';
    var url = 'url(images/' + file + ')';
    return url; 
},
removeOverlay = function(){
    $('body').css(
        'background', 
        getBackgroundImageUrl());
    $('body').css('background-size', '100% 100%');
},
setBackground = function(){
    removeOverlay();
},
setOverlay = function(){
    var bgImageUrl = getBackgroundImageUrl();
    var bg = 'linear-gradient(rgba(0, 0, 0, 0.80), rgba(0, 0, 0, 0.80)), ' + bgImageUrl;
    
    $('body').css('background', bg);
    $('body').css('background-size', '100% 100%');
},
clearSearch = function(){
    $('#search').val('');
    $('#results').html('');
    removeOverlay();
},
wireUpShortcuts = function(){
    var esc = 27;
        
    $(document).keyup(function(e) {
        console.log(e.keyCode);
        if (e.keyCode === esc) { clearSearch(); return true; }
    });
};

$(function(){
    setBackground();
    setAuthenticationHeaders();
    configureBloodhound();
    wireUpShortcuts();
    focus();
});