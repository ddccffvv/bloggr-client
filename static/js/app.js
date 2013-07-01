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
    url: "http://stmu.co"
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

App.WufooView = Ember.View.extend({
	didInsertElement: function(){
	var z7x4m1;(function(d, t) {
		var s = d.createElement(t), options = {
		'userName':'stmu',
		'formHash':'z7x4m1',
		'autoResize':true,
		'height':'672',
		'async':true,
		'header':'show'};
		s.src = ('https:' == d.location.protocol ? 'https://' : 'http://') + 'wufoo.com/scripts/embed/form.js';
		s.onload = s.onreadystatechange = function() {
		var rs = this.readyState; if (rs) if (rs != 'complete') if (rs != 'loaded') return;
		try { z7x4m1 = new WufooForm();z7x4m1.initialize(options);z7x4m1.display(); } catch (e) {}};
		console.log(t);
		var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; console.log(scr); par.insertBefore(s, scr);
		})(document, 'script');
	}
});

App.DisqusView = Ember.View.extend({
	didInsertElement: function(){
		var content = this.get("content");
		console.log("technical_" + content.get("id"));
		var disqus_shortname = 'stmu'; // required: replace example with your forum shortname
		var disqus_identifier = 'technical_' + content.get("id");
		var disqus_url = 'http://stmu.co/#/technicals/' + content.get('id');
			/* * * DON'T EDIT BELOW THIS LINE * * */
		(function() {
			var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
			dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
	}
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

