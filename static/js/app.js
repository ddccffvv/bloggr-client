App = Ember.Application.create({});

App.initializer({
    name: 'google-analytics',

    initialize: function(container, app) {
        var router = container.lookup('router:main');

        router.addObserver('url', function() {
            var lastUrl = undefined;
            return function() {
                Ember.run.next(function() {
                    var url = router.get('url');
                    if (url === ""){
                        url = "/";
                    }
                    if (url !== lastUrl) {
                        lastUrl = url;
                        ga('send', 'pageview', {'page' : url});
                        console.log("Google Analytics: " + url);
                    }
                });
            };
        }());
    }
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: DS.RESTAdapter.extend({
    url: "http://localhost:5000"
  })
});

App.Router.map(function() {
  this.resource('about');
  this.resource('contact');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' });
  });
  this.resource('technicals', function() {
    this.resource('technical', { path: ':technical_id' });
  });
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return App.Post.find();
  }
});
App.TechnicalsRoute = Ember.Route.extend({
  model: function() {
    return App.Technical.find();
  }
});

App.IndexRoute = Ember.Route.extend({
});

App.ContactRoute = Ember.Route.extend({
});

var attr = DS.attr;

App.Post = DS.Model.extend({
  title: attr('string'),
  author: attr('string'),
  extended: attr('string'),
  publishedAt: attr('date')
});
App.Technical = DS.Model.extend({
  title: attr('string'),
  author: attr('string'),
  extended: attr('string'),
  publishedAt: attr('date')
});

var showdown = new Showdown.converter();

Ember.Handlebars.registerBoundHelper('markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.registerBoundHelper('date', function(date) {
  console.log(date)
  return moment(new Date(date)).fromNow();
});

