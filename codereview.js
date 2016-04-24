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
                url : 'https://codereview.search.windows.net/indexes/articles/docs/suggest?suggesterName=sg&fuzzy=true&api-version=2015-02-28&search=%QUERY',
                wildcard : '%QUERY',
                transform: function(response){
                    return $.map(response.value, function(result) {
                        return {
                          value: result["@search.text"]
                        };
                    });
                }
            }
        });

        articles.initialize();

        $('#remote .typeahead').typeahead(null, {
            display: 'value',
            source: articles
        }).on('typeahead:selected', function(obj, datum){
            console.log(obj);
            console.log(datum);

            $('#results').html('<h2>Result</h2>'+ datum.value);
        });
    },
  focus = function(){
    $('#search').focus();
  };



$(function(){
    setAuthenticationHeaders();
    configureBloodhound();
    focus();
});