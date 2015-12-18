var refreshButton = document.querySelector('.refresh');
var closeButton1 = document.querySelector('.close1');
var closeButton2 = document.querySelector('.close2');
var closeButton3 = document.querySelector('.close3');

var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
var close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
var close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
var close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

var requestStream = refreshClickStream.startWith('startup click')
    .map(function () {
        var randomOffset = Math.floor(Math.random() * 500);
        return 'https://api.github.com/users?access_token=409c7100085f90751c41d42d7feda9e59df0efde&since=' + randomOffset;
    });

var responseStream = requestStream
    .flatMap(function (requestUrl) {
        return Rx.Observable.fromPromise($.getJSON(requestUrl));
    });

function createSuggestionStream(closeClickStream) {
    return closeClickStream.startWith('startup click')
        .combineLatest(responseStream,
            function (click, listUsers) {
                return listUsers[Math.floor(Math.random() * listUsers.length)];
            }
        );
        //.startWith(null);
}

var suggestion1Stream = createSuggestionStream(close1ClickStream);
var suggestion2Stream = createSuggestionStream(close2ClickStream);
var suggestion3Stream = createSuggestionStream(close3ClickStream);


var repos1Stream = suggestion1Stream
    .flatMap(function (user) {
        var requestUrl = 'https://api.github.com/users/' + user.login + '/repos?access_token=409c7100085f90751c41d42d7feda9e59df0efde';
        return Rx.Observable.fromPromise($.getJSON(requestUrl));
    });

var repos2Stream = suggestion2Stream
    .flatMap(function (user) {
        var requestUrl = 'https://api.github.com/users/' + user.login + '/repos?access_token=409c7100085f90751c41d42d7feda9e59df0efde';
        return Rx.Observable.fromPromise($.getJSON(requestUrl));
    });

var repos3Stream = suggestion3Stream
    .flatMap(function (user) {
        var requestUrl = 'https://api.github.com/users/' + user.login + '/repos?access_token=409c7100085f90751c41d42d7feda9e59df0efde';
        return Rx.Observable.fromPromise($.getJSON(requestUrl));
    });

// Rendering ---------------------------------------------------
function renderSuggestion(repos, selector) {
    var suggestionEl = document.querySelector(selector);
    if (repos === null || repos.length==0) {
        suggestionEl.style.visibility = 'hidden';
    } else {
        suggestionEl.style.visibility = 'visible';
        var usernameEl = suggestionEl.querySelector('.username');
        usernameEl.href = repos[0].owner.html_url;
        usernameEl.textContent = repos[0].owner.login;
        var imgEl = suggestionEl.querySelector('img');
        imgEl.src = "";
        imgEl.src = repos[0].owner.avatar_url;
        var reposEl = suggestionEl.querySelector('.repos');
        var repoList= "Repos: [ ";
        for(var i=0; i < repos.length; i++){
            repoList = repoList  + repos[i].name + ",";
        }
        reposEl.textContent = repoList.substring(0, repoList.length - 1) + "]";
    }
}

repos1Stream.subscribe(function (repos) {
    renderSuggestion(repos, '.suggestion1');
});

repos2Stream.subscribe(function (repos) {
    renderSuggestion(repos, '.suggestion2');
});

repos3Stream.subscribe(function (repos) {
    renderSuggestion(repos, '.suggestion3');
});