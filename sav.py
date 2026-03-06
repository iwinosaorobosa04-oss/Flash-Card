from flask import Flask, render_template, request, redirect, session

app = Flask(__name__)
app.secret_key = "secret123"

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["name"]
        session["user_name"] = name
        return redirect("/dashboard")
    return render_template("signup.html")

    @app.route("/dashboard")
def dashboard():
    name = session.get("user_name")
    return render_template("dashboard.html", name=name)