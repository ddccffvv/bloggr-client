from flask import Flask, Response
from datetime import datetime
import json
app = Flask(__name__)

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/posts')
def posts():
    return Response(json.dumps({"posts": get_posts()}), mimetype='application/json')

@app.route('/posts/<postid>')
def postsid(postid):
    posts = get_posts()
    try:
        return Response(json.dumps({"post": posts[ len(posts)- int(postid)]}), mimetype='application/json')
    except Exception:
        print "something went wrong " + postid
        return Response(json.dumps({"post": []}), mimetype='application/json')



def get_posts(override_timecheck=False):
    import os
    now = datetime.now()
    if override_timecheck or (now - last_load).seconds > 300:
        posts = []
        for files in sorted(os.listdir("posts"), reverse=True):
            if files.endswith(".post"):
                post = {}
                post["id"] = files.split(".")[0]
                lines = open("posts/" + files, "r").readlines()
                post["title"] = lines[0].rstrip()
                post["author"] = lines[1].rstrip()
                post["publishedAt"] = lines[2].rstrip()
                post["extended"] = ''.join(lines[3:])
                posts.append(post)
        return posts
    else:
        return last_posts

last_load = datetime.now()
last_posts = []
last_posts = get_posts(True)

if __name__ == '__main__':
    app.run(debug=True)
