from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello_world():
    name = "Chris"
    return render_template('hello.html', name=name)

@app.route('/voronoi')
def voronoi():
	return render_template('voronoi.html')

if __name__ == '__main__':
    app.run(debug=True)
