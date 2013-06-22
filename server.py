from flask import Flask, Response
import json
app = Flask(__name__)

@app.route('/posts')
def index():
    return Response(json.dumps({"posts": get_posts()}), mimetype='application/json')


def get_posts():
    import os
    posts = [] 
    for files in os.listdir("posts"):
        post = {}
        post["id"] = files
        lines = open("posts/" + files, "r").readlines()
        post["title"] = lines[0].rstrip()
        post["author"] = lines[1].rstrip()
        post["publishedAt"] = lines[2].rstrip()
        post["extended"] = ''.join(lines[3:])
        posts.append(post)
    return posts


if __name__ == '__main__':
    app.run()
