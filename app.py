from flask import Flask, render_views, request

app = Flask(__name__)

@app.route("/")
def index():
    return render_views("index.html")

@app.route("/cadastro", methods=["POST"])
def cadastro():
    nome = request.form.get("nome")
    email = request.form.get("email")
    senha = request.form.get("senha")
    nascimento = request.form.get("nascimento")

    
    print("=== Novo cadastro ===")
    print("Nome:", nome)
    print("Email:", email)
    print("Senha:", senha)
    print("Nascimento:", nascimento)
    print("===================")


    if not nome or not email or not senha or not nascimento:
        erro = "Por favor, preencha todos os campos!"
        return render_views("index.html", erro=erro)

    return render_views("sucesso.html", nome=nome)

if __name__ == "__main__":
    app.run(debug=True)
