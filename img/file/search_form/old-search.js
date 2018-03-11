(function() {
    'use strict';

    var nothingFoundTemplate = [
        "<hr>",
            "<div class='alert alert-info'>Nothing found.</div>",
        "<hr>"
    ].join(''),
    searchTemplate = [
        "{% for (var x=0; x < o.length; x++) { %}",
            "<div class='page-header'>",
                "<h4>",
                    "<a href='{%=o[x][1]%}' class='text-muted'>",
                        "{%=o[x][0]%}",
                    "</a>",
                "</h4>",
            "</div>",
        "{% } %}"
    ].join(''),
    entries = [
            //  title     url
            ['Lorem', 'http://ex0.com'],
            ['Little Joe', 'http://ex1.com'],
            ['ipsum', 'http://ex2.com'],
            ['next', 'http://ex3.com'],
            ['generation', 'http://ex4.com'],
            ['old', 'http://ex5.com'],
            ['school', 'http://ex6.com']
    ];

    var innerData = function(partialTemplate, data, id) {
        var template = document.createElement('div'),
            container = document.querySelector('#' + id);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        template.innerHTML = tmpl(partialTemplate, data);
        container.appendChild(template);
    };
    var invokeSearch = function() {
        var x,
            arr = [],
            foundPosts = false,
            uzerQuery = document.getElementById('uzer-infut').value.toLowerCase();

        if (uzerQuery === '') {
            innerData(nothingFoundTemplate, arr, 'queryMe');
            return false;
        }

        entries.forEach(function(entry) {
            if (entry[0].toLowerCase().match(uzerQuery)) {
                arr.push(entry);
                foundPosts = true;
            }
        });
        innerData(foundPosts ? searchTemplate :
                nothingFoundTemplate, arr, 'queryMe');
    };
    document.getElementById('uzer-infut').addEventListener('input', invokeSearch, false);
}());
