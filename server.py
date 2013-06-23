from flask import Flask, Response
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
    print postid
    posts = get_posts()
    try:
        return Response(json.dumps({"post": posts[int(postid)-1]}), mimetype='application/json')
    except Exception:
        print "something went wrong"
        return Response(json.dumps({"post": []}), mimetype='application/json')



def get_posts():
    import os
    posts = [] 
    for files in sorted(os.listdir("posts"), reverse=True):
        if files.endswith(".post"):
            print files
            post = {}
            post["id"] = files.split(".")[0]
            lines = open("posts/" + files, "r").readlines()
            post["title"] = lines[0].rstrip()
            post["author"] = lines[1].rstrip()
            post["publishedAt"] = lines[2].rstrip()
            post["extended"] = ''.join(lines[3:])
            posts.append(post)
    return posts


if __name__ == '__main__':
    app.run(debug=True)
