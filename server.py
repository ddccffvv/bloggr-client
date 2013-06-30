from flask import Flask, Response
from datetime import datetime
import json
app = Flask(__name__)

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/technicals')
def technicals():
    return Response(json.dumps({"technicals": get_technicals()}), mimetype='application/json')

@app.route('/technicals/<technicalid>')
def technical(technicalid):
    technicals = get_technicals()
    try:
        return Response(json.dumps({"technical": technicals[ len(technicals)- int(technicalid)]}), mimetype='application/json')
    except Exception:
        print "something went wrong " + technicalid
        return Response(json.dumps({"technical": []}), mimetype='application/json')

@app.route('/posts')
def posts():
    return Response(json.dumps({"posts": []}), mimetype='application/json')

@app.route('/posts/<postid>')
def post(postid):
    return Response(json.dumps({"post": []}), mimetype='application/json')



def get_technicals(override_timecheck=False):
    import os
    now = datetime.now()
    if override_timecheck or (now - last_load).seconds > 300:
        technicals = []
        for files in sorted(os.listdir("technicals"), reverse=True):
            if files.endswith(".technical"):
                technical = {}
                technical["id"] = files.split(".")[0]
                lines = open("technicals/" + files, "r").readlines()
                technical["title"] = lines[0].rstrip()
                technical["author"] = lines[1].rstrip()
                technical["publishedAt"] = lines[2].rstrip()
                technical["extended"] = ''.join(lines[3:])
                technicals.append(technical)
        return technicals
    else:
        return last_technicals

last_load = datetime.now()
last_technicals = []
last_technicals = get_technicals(True)

if __name__ == '__main__':
    app.run(debug=True)
