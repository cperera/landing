from flask import Flask, render_template, send_file, request
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
    name = "Chris"
    return render_template('hello.html', name=name)

@app.route('/voronoi')
def voronoi():
    return render_template('voronoi.html')

@app.route('/cv')
def resume():
    return send_file('static/pdfs/chrisantha.pdf')

@app.route('/data')
def data():
    data_obj = {
        "Chris": 26,
        "suitcase": ["sweater","gloves","socks"],
        "scrabble": "dictionary"
    }
    return json.dumps(data_obj)

@app.route('/graph')
def g1():
    return render_template('graph.html')

@app.route('/name')
def name():
    uname = request.args.get('name')
    print uname
    return "Sir " + uname

@app.route('/game0')
def game():
    return render_template('game0.html')

@app.route('/newsfeed')
def feed_news():
    names = [
        "chris",
        "matt",
        "jamie",
        "max"
    ]
    return render_template('newsfeed.html', names=names)


if __name__ == '__main__':
    app.run(debug=True)
