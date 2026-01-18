from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/services")
def services():
    return render_template("services.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    message = data.get("message", "").lower()

    return jsonify({
        "reply": f"You said: {message}"
    })

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/projects")
def projects():
    return render_template("projects.html")
