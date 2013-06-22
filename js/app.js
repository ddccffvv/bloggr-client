App = Ember.Application.create({});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: DS.RESTAdapter.extend({
    url: "http://localhost:5000"
  })
});

App.Router.map(function() {
  this.resource('about');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' });
  });
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return App.Post.find();
  }
});

var attr = DS.attr;

App.Post = DS.Model.extend({
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
  return moment(date).fromNow();
});


App.Post.FIXTURES = [
{
    id: 1,
    title: "bliep",
    author: "ddccffvv",
    extended: "blablabla",
    publishedAt: "2013-06-21"
},
{
    id: 2,
    title: "Vim and binary files",
    author: "ddccffvv",
    extended: "    :%!xxd\n    :%!xxd -r",
    publishedAt: "2013-06-21"
},
{
    id: 3,
    title: "Flask and apache",
    author: "ddccffvv",
    extended: "wsgi config put the webapp in a subfolder\nTo put in the sites enabled config:\n    WSGIDaemonProcess test user=usr group=usr home=\"/var/www/site/directory\"\n    WSGIScriptAlias /path/on/site \"/path/to/wsgi/file/test.wsgi\"    <Directory /var/www/site/directory/>    WSGIProcessGroup test\n    WSGIApplicationGroup %{GLOBAL}\n    WSGIScriptReloading On # Automatic reload if the plugin files are changed\n    WSGIPassAuthorization On # pass on http authorization to the application\n    Order allow,deny\n    Allow from all\n    </Directory>",
    publishedAt: "2013-06-21"
},
];
